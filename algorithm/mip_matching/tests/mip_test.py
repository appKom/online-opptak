from __future__ import annotations
from datetime import datetime, timedelta

from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee
from mip_matching.Applicant import Applicant
import mip

from mip_matching.match_meetings import match_meetings

from typing import TypedDict

import unittest


def print_matchings(committees: list[Committee], intervals: list[TimeInterval], matchings: list[tuple[Applicant, Committee, TimeInterval]]):

    print("Tid".ljust(15), end="|")
    print("|".join(str(com).ljust(8) for com in committees))

    for interval in intervals:
        print(interval.start.strftime("%d.%m %H:%M").ljust(15), end="|")
        print()

    # for komite in solution:
    #     print(komite.ljust(8), end="|")
    #     print("|".join([str(slot).rjust(2) for slot in solution[komite]]))

    # print("|".join(["Slot"] + [komite.rjust(8) for komite in komiteer]))
    # for slot in solution2:
    #     print(str(slot).ljust(4), end="|")
    #     print("|".join([str(solution2[slot][komite]).rjust(8)
    #           for komite in solution2[slot]]))


class MipTest(unittest.TestCase):

    def check_constraints(self, matchings: list[tuple[Applicant, Committee, TimeInterval]]):
        """Checks if the constraints are satisfied in the provided matchings.
        TODO: Add more constraint tests."""

        print("Matchings:")
        for matching in matchings:
            print(matching)

        self.assertEqual(len(matchings), len(set((applicant, interval)
                         for applicant, _, interval in matchings)),
                         "Constraint \"Applicant can only have one meeting during each TimeInterval\" failed.")

        load_per_committee_per_slot: dict[Committee, dict[TimeInterval, int]] = {
        }
        for _, committee, interval in matchings:
            if committee not in load_per_committee_per_slot:
                load_per_committee_per_slot[committee] = {}

            # Øker antall med 1, eller setter inn 1
            load_per_committee_per_slot[committee][interval] = load_per_committee_per_slot[committee].get(
                interval, 0) + 1

        for committee, load_per_interval in load_per_committee_per_slot.items():
            for interval, load in load_per_interval.items():
                self.assertGreaterEqual(committee.get_capacity(interval), load,
                                        f"Constraint \"Number of interviews per slot per committee cannot exceed capacity\" failed for Committee {committee} and interval {interval}")

    def test_fixed_small(self):
        """Small, fixed test with all capacities set to one"""

        appkom = Committee(name="Appkom")
        appkom.add_intervals_with_capacities(
            {TimeInterval(datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 9, 15)): 1})

        oil = Committee(name="OIL")
        oil.add_intervals_with_capacities(
            {TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 30)): 1})

        prokom = Committee(name="Prokom")
        prokom.add_intervals_with_capacities({TimeInterval(datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 8, 45)): 1,
                                              TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 30)): 1})

        committees: set[Committee] = {appkom, oil, prokom}

        jørgen: Applicant = Applicant(name="Jørgen")
        jørgen.add_committees({appkom, prokom})
        jørgen.add_intervals(
            {TimeInterval(datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 9, 0))})

        sindre: Applicant = Applicant(name="Sindre")
        sindre.add_committees({appkom, oil})
        sindre.add_intervals({TimeInterval(datetime(2024, 8, 24, 8, 30), datetime(
            2024, 8, 24, 8, 45)),
            TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 30))})

        julian: Applicant = Applicant(name="Julian")
        julian.add_committees({appkom, prokom, oil})
        julian.add_intervals(
            {TimeInterval(datetime(2024, 8, 24, 8, 45), datetime(2024, 8, 24, 9, 0)),
             TimeInterval(datetime(2024, 8, 24, 8, 0),
                          datetime(2024, 8, 24, 8, 30)),
             TimeInterval(datetime(2024, 8, 24, 9, 15), datetime(2024, 8, 24, 9, 30))})

        fritz: Applicant = Applicant(name="Fritz")
        fritz.add_committees({oil})
        fritz.add_intervals(
            {TimeInterval(datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 8, 30)),
             TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 15))})

        applicants: set[Applicant] = {jørgen, sindre, julian, fritz}

        match = match_meetings(applicants=applicants, committees=committees)

        # Expectations
        expected_number_of_matched_meetings = 7

        print(
            f"Klarte å matche {match['matched_meetings']} av {match['total_wanted_meetings']} ({match['matched_meetings']/match['total_wanted_meetings']:2f})")

        self.assertEqual(expected_number_of_matched_meetings,
                         match["matched_meetings"])

        self.check_constraints(matchings=match["matchings"])

    def test_randomized_large(self):
        self.randomized_test(200, (10, 20), (5*5*2, 8*5*2), (1, 3))
        self.randomized_test(200, (10, 20), (5*5*2, 8*5*2), (3, 3))
        self.randomized_test(350, (15, 25), (5*5*2, 8*5*2), (3, 3))

    def randomized_test(self,
                        antall_personer: int,
                        antall_slots_per_person_interval: tuple[int, int],
                        antall_slots_per_komite_interval: tuple[int, int],
                        antall_komiteer_per_person_interval: tuple[int, int]):
        """
        Tester tilfeldige utvalg av søkere, komitéer og tidsintervaller.
        Alle komitéer har en kapasitet lik 1.

        Tester først og fremst performance.
        TODO: Legg til flere asserts.
        """

        import random

        DEFAULT_INTERVIEW_TIME = timedelta(minutes=15)

        SLOTS: list[TimeInterval] = []
        for dag in range(0, 5):
            """Lager slots for fra 0800 til 1800 hver dag"""
            dagsintervall = TimeInterval(
                datetime(2024, 8, 19+dag, 8, 0), datetime(2024, 8, 19+dag, 18, 0))
            [SLOTS.append(interval) for interval in dagsintervall.divide(
                DEFAULT_INTERVIEW_TIME)]

        ANTALL_PERSONER = antall_personer

        ANTALL_SLOTS_PER_PERSON_MIN = antall_slots_per_person_interval[0]
        ANTALL_SLOTS_PER_PERSON_MAKS = antall_slots_per_person_interval[1]

        ANTALL_SLOTS_PER_KOMITE_MIN = antall_slots_per_komite_interval[0]
        ANTALL_SLOTS_PER_KOMITE_MAKS = antall_slots_per_komite_interval[1]

        ANTALL_KOMITEER_PER_PERSON_MIN = antall_komiteer_per_person_interval[0]
        ANTALL_KOMITEER_PER_PERSON_MAKS = antall_komiteer_per_person_interval[1]

        komite_navn = {"Appkom", "Prokom", "Arrkom", "Dotkom", "Bankkom",
                       "OIL", "Fagkom", "Bedkom", "FemInIT", "Backlog", "Trikom"}
        committees: set[Committee] = {
            Committee(name=navn) for navn in komite_navn}

        # Gir tider til hver søker
        applicants: set[Applicant] = set()
        for person in range(ANTALL_PERSONER):
            applicant = Applicant(name=str(person))
            # Velger ut et tilfeldig antall slots (alle av lengde 1) innenfor boundsene.
            applicant.add_intervals(set(random.sample(SLOTS, random.randint(
                ANTALL_SLOTS_PER_PERSON_MIN, ANTALL_SLOTS_PER_PERSON_MAKS))))

            applicants.add(applicant)

        # Gir intervaller til hver komité.
        for committee in committees:
            committee.add_intervals_with_capacities({slot: 1 for slot in random.sample(
                SLOTS, random.randint(ANTALL_SLOTS_PER_KOMITE_MIN, ANTALL_SLOTS_PER_KOMITE_MAKS))})

        # Lar hver søker søke på tilfeldige komiteer
        committees_list = list(committees)
        # Må ha liste for at random.sample skal kunne velge ut riktig
        for applicant in applicants:
            applicant.add_committees(set(random.sample(committees_list, random.randint(
                ANTALL_KOMITEER_PER_PERSON_MIN, ANTALL_KOMITEER_PER_PERSON_MAKS))))

        match = match_meetings(applicants=applicants, committees=committees)
        self.check_constraints(matchings=match["matchings"])

        print(
            f"Klarte å matche {match['matched_meetings']} av {match['total_wanted_meetings']} ({match['matched_meetings']/match['total_wanted_meetings']:2f})")
        print(f"Solver status: {match['solver_status']}")

        print_matchings(committees_list, SLOTS, match["matchings"])
