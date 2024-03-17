from __future__ import annotations

from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee
from mip_matching.tests.fixed_test import applicants, committees
from mip_matching.Applicant import Applicant
import mip

from typing import TypedDict

import unittest


class MeetingMatch(TypedDict):
    """Type definition of a meeting match object"""
    solver_status: mip.OptimizationStatus
    matched_meetings: int
    total_wanted_meetings: int
    matchings: list[tuple[Applicant, Committee, TimeInterval]]


def match_meetings(applicants: set[Applicant], committees: set[Committee]) -> MeetingMatch:
    """Matches meetings and returns a MeetingMatch-object"""
    model = mip.Model(sense=mip.MAXIMIZE)

    m = {}

    # Lager alle maksimeringsvariabler
    for applicant in applicants:
        for committee in applicant.get_committees():
            for interval in applicant.get_fitting_committee_slots(committee):
                m[(applicant, committee, interval)] = model.add_var(
                    var_type=mip.BINARY, name=f"({applicant}, {committee}, {interval})")

    # Legger inn begrensninger for at en komité kun kan ha antall møter i et slot lik kapasiteten.
    for committee in committees:
        for interval, capacity in committee.get_intervals_and_capacities():
            model += mip.xsum(m[(applicant, committee, interval)]
                              for applicant in committee.get_applicants()
                              if (applicant, committee, interval) in m) <= capacity  # type: ignore

    # Legger inn begrensninger for at en person kun har ett intervju med hver komité
    for applicant in applicants:
        for committee in applicant.get_committees():
            model += mip.xsum(m[(applicant, committee, interval)]
                              for interval in applicant.get_fitting_committee_slots(committee)) <= 1  # type: ignore

    # Legger inn begrensninger for at en person kun kan ha ett intervju på hvert tidspunkt
    for applicant in applicants:
        for interval in applicant.get_intervals():
            model += mip.xsum(m[(applicant, committee, interval)]
                              for committee in applicant.get_committees()
                              if (applicant, committee, interval) in m) <= 1  # type: ignore

    # Setter mål til å være maksimering av antall møter
    model.objective = mip.maximize(mip.xsum(m.values()))

    # Kjør optimeringen
    solver_status = model.optimize()

    # Få de faktiske møtetidene
    antall_matchede_møter: int = 0
    matchings: list = []
    for name, variable in m.items():
        if variable.x:
            antall_matchede_møter += 1
            matchings.append(name)
            print(f"{name}")

    antall_ønskede_møter = sum(
        len(applicant.get_committees()) for applicant in applicants)

    match_object: MeetingMatch = {
        "solver_status": solver_status,
        "matched_meetings": antall_matchede_møter,
        "total_wanted_meetings": antall_ønskede_møter,
        "matchings": matchings,
    }

    return match_object


class MipTest(unittest.TestCase):
    def test_fixed_small(self):
        """Small, fixed test with all capacities set to one"""

        appkom = Committee(name="Appkom")
        appkom.add_intervals_with_capacities({TimeInterval(1, 5): 1})

        oil = Committee(name="OIL")
        oil.add_intervals_with_capacities({TimeInterval(4, 6): 1})

        prokom = Committee(name="Prokom")
        prokom.add_intervals_with_capacities({TimeInterval(1, 3): 1,
                                              TimeInterval(4, 6): 1})

        committees: set[Committee] = {appkom, oil, prokom}

        jørgen: Applicant = Applicant(name="Jørgen")
        jørgen.add_committees({appkom, prokom})
        jørgen.add_intervals({TimeInterval(1, 4)})

        sindre: Applicant = Applicant(name="Sindre")
        sindre.add_committees({appkom, oil})
        sindre.add_intervals({TimeInterval(2, 3), TimeInterval(4, 6)})

        julian: Applicant = Applicant(name="Julian")
        julian.add_committees({appkom, prokom, oil})
        julian.add_intervals(
            {TimeInterval(3, 4), TimeInterval(1, 2), TimeInterval(5, 6)})

        fritz: Applicant = Applicant(name="Fritz")
        fritz.add_committees({oil})
        fritz.add_intervals({TimeInterval(1, 2), TimeInterval(4, 5)})

        applicants: set[Applicant] = {jørgen, sindre, julian, fritz}

        match = match_meetings(applicants=applicants, committees=committees)

        # Expectations
        expected_number_of_matched_meetings = 7

        print(
            f"Klarte å matche {match['matched_meetings']} av {match['total_wanted_meetings']} ({match['matched_meetings']/match['total_wanted_meetings']:2f})")

        self.assertEqual(expected_number_of_matched_meetings,
                         match["matched_meetings"])

    def test_randomized_large(self):
        