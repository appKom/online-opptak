"""
TODO:
- [Gjort] Lage funksjon som deler opp fra en komités slot 
- Sette opp begrensningene fra modelleringen
- Flikke litt på modelleringen.
- Finn ut hvordan man kan preprosessere dataen for å få ned kjøretiden (f. eks ved å lage lister av personer for hver komité.)
"""

from __future__ import annotations
from dataclasses import dataclass

import itertools

from Committee import Committee
from Applicant import Applicant


@dataclass(frozen=True)
class TimeInterval:
    start: int
    end: int

    def overlaps(self, other: TimeInterval) -> bool:
        """Returnerer true om to timeslots er helt eller delvis overlappende."""
        return other.start < self.start < other.end or self.start < other.start < self.end

    def contains(self, other: TimeInterval) -> bool:
        """Returnerer true om other inngår helt i self."""
        return self.start <= other.start and other.end <= self.end

    def intersection(self, other: TimeInterval) -> TimeInterval:
        """Returnerer et snitt av to timeslots."""
        if not self.overlaps(other):
            # Snittet er tomt grunnet ingen overlapp
            return None

        start = max(self.start, other.start)
        end = min(self.end, other.end)
        return TimeInterval(start, end)

    def get_contained_slots(self, slots: list[TimeInterval]):
        """Returnerer en delmengde av de slots i listen av timeslots
          "slots", som inngår helt i dette timeslottet."""
        return set(slot for slot in slots if self.contains(slot))

    @staticmethod
    def divide_interval(interval: TimeInterval, length: int) -> list[TimeInterval]:
        """

        Deler opp et intervall i mindre intervaller av lengde *length*.

        Note:
        - Det antas at intervallet kan deles opp i hele deler av lengde *length*.
        Overskytende tid vil bli ignorert.
        """
        result = []
        global_start = interval.start
        local_start = global_start
        local_end = local_start + length
        while local_end < interval.end:
            result.append(TimeInterval(local_start, local_end))

        return result

"""
Dette er gammel kode som nå er flyttet til de passende komité-/søker-klassene.
Foreløpig beholdt for referanse.
"""
# class TimeIntervals:
#     def __init__(self, initial_list: list[TimeInterval] = None):
#         self.list: list[TimeInterval] = initial_list if initial_list else []

#     def add(self, interval: TimeInterval):
#         self.list.append(interval)

#     def recursive_intersection(self, other: TimeIntervals):
#         """
#         Returnerer alle tidsintervallene i *other* som er inneholdt i et av *self* sine intervaller"""
#         result = TimeIntervals()

#         for self_interval, other_interval in itertools.product(self.list, other.list):
#             if self_interval.contains(other_interval):
#                 result.add(other_interval)

#         return result

#     def __iter__(self):
#         return self.list.__iter__()


committees: set[Committee]

appkom = Committee()
appkom.add_intervals_with_capacities({TimeInterval(1, 2): 1,
                                      TimeInterval(2, 3): 1,
                                      TimeInterval(3, 4): 1,
                                      TimeInterval(4, 5): 1})

oil = Committee()
oil.add_intervals_with_capacities({TimeInterval(4, 5): 1,
                                   TimeInterval(5, 6): 1})

prokom = Committee()
prokom.add_intervals_with_capacities({TimeInterval(1, 3): 1,
                                      TimeInterval(4, 6): 1})

committees = {appkom, oil, prokom}

jørgen: Applicant = Applicant()
jørgen.add_committees({appkom, prokom})
jørgen.add_intervals({TimeInterval(1, 4)})

sindre: Applicant = Applicant()
sindre.add_committees({appkom, oil})
sindre.add_intervals({TimeInterval(2, 3), TimeInterval(4, 6)})

julian: Applicant = Applicant()
julian.add_committees({appkom, prokom, oil})
julian.add_intervals({TimeInterval(3, 4), TimeInterval(1, 2), TimeInterval(5, 6)})

fritz: Applicant = Applicant()
fritz.add_committees({oil})
fritz.add_intervals({TimeInterval(1, 2), TimeInterval(4, 5)})

applicants: set[Applicant] = {jørgen, sindre, julian, fritz}


# personer_og_tidsslots = {"Jørgen": {TimeInterval(1, 4)},
#                          "Sindre": {TimeInterval(2, 3), TimeInterval(4, 6)},
#                          "Julian": {TimeInterval(3, 4), TimeInterval(1, 2), TimeInterval(5, 6)},
#                          "Fritz": {TimeInterval(1, 2), TimeInterval(4, 5)}}
# komiteer_og_tidsslots = {"Appkom": {TimeInterval(1, 2), TimeInterval(2, 3), TimeInterval(3, 4), TimeInterval(4, 5)},
#                          "OIL": {TimeInterval(4, 5), TimeInterval(5, 6)},
#                          "Prokom": {TimeInterval(1, 3), TimeInterval(4, 6)}}

# komite_kapasiteter = {"Appkom": {TimeInterval(1, 2): 1,
#                                  TimeInterval(2, 3): 1,
#                                  TimeInterval(3, 4): 1,
#                                  TimeInterval(4, 5): 1},
#                       "OIL": {TimeInterval(4, 5): 1,
#                               TimeInterval(5, 6): 1},
#                       "Prokom": {TimeInterval(1, 3): 1,
#                                  TimeInterval(4, 6): 1}}


# personer = personer_og_tidsslots.keys()
# komiteer = komiteer_og_tidsslots.keys()

# intervjulengder = {"Appkom": 1,
#                    "Prokom": 2,
#                    "OIL": 1}

# komiteer_per_person = {"Jørgen": {"Appkom", "Prokom"},
#                        "Sindre": {"Appkom", "OIL"},
#                        "Julian": {"Appkom", "Prokom", "OIL"},
#                        "Fritz": {"OIL"}}


"""
Tror det følgende er gammel kode som ble brukt for CSP.
"""

# # Variables
# variables = set()
# for person in komiteer_per_person:
#     for komite in komiteer_per_person[person]:
#         variables.add((person, komite))
# # Domains
# domains = {var: personer_og_tidsslots[var[0]].intersection(
#     komiteer_og_tidsslots[var[1]]) for var in variables}

# constraints = {var: set() for var in variables}
# for var, annen in itertools.permutations(variables, 2):
#     if annen[0] == var[0]:
#         constraints[var].add(annen)
#     if annen[1] == var[1]:
#         constraints[var].add(annen)
