from typing import TypedDict

from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee
from mip_matching.Applicant import Applicant
import mip

from datetime import timedelta
from itertools import combinations


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
                              # type: ignore
                              if (applicant, committee, interval) in m) <= capacity

    # Legger inn begrensninger for at en person kun har ett intervju med hver komité
    for applicant in applicants:
        for committee in applicant.get_committees():
            model += mip.xsum(m[(applicant, committee, interval)]
                              # type: ignore
                              for interval in applicant.get_fitting_committee_slots(committee)) <= 1

    # Legger inn begrensninger for at en person kun kan ha ett intervju på hvert tidspunkt
    for applicant in applicants:
        potential_intervals = set()
        for applicant_candidate, committee, interval in m:
            if applicant == applicant_candidate:
                potential_intervals.add(interval)

        for interval in potential_intervals:

            model += mip.xsum(m[(applicant, committee, interval)]
                              for committee in applicant.get_committees()
                              # type: ignore
                              if (applicant, committee, interval) in m) <= 1

    # Legger til målsetning om at man skal ha mellomrom mellom perioder
    distance_variables = set()

    APPLICANT_BUFFER_MODEL_WEIGHT = 0.001
    APPLICANT_BUFFER_LENGTH = timedelta(minutes=15)
    
    for applicant in applicants:
        potential_committees_with_intervals: set[tuple[Committee, TimeInterval]] = set()
        for applicant_candidate, committee, interval in m:
            if applicant == applicant_candidate:
                potential_committees_with_intervals.add((committee, interval))

        distance_variables.add(
            mip.xsum(
                APPLICANT_BUFFER_MODEL_WEIGHT * m[(applicant, *a)] * m[(applicant, *b)]
                for a, b in combinations(potential_committees_with_intervals)  # type: ignore
                if a[0] != b[0]
                and a[1].is_within_distance(b[1], APPLICANT_BUFFER_LENGTH)
            )
        )

    # Setter mål til å være maksimering av antall møter
    model.objective = mip.maximize(mip.xsum(m.values()) + mip.xsum(distance_variables))

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
