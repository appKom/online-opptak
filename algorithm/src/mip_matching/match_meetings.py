from typing import TypedDict

from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee
from mip_matching.Applicant import Applicant
import mip

from datetime import timedelta, time
from itertools import combinations

from mip_matching.types import Matching, MeetingMatch
from mip_matching.utils import subtract_time


# Hvor stort buffer man ønsker å ha mellom intervjuene
APPLICANT_BUFFER_LENGTH = timedelta(minutes=15)

# Et mål på hvor viktig det er at intervjuer er i nærheten av hverandre
CLUSTERING_WEIGHT = 0.001

# Når på dagen man helst vil ha intervjuene rundt
CLUSTERING_TIME_BASELINE = time(12, 00)
MAX_SCALE_CLUSTERING_TIME = timedelta(seconds=43200)  # TODO: Rename variable


def match_meetings(applicants: set[Applicant], committees: set[Committee]) -> MeetingMatch:
    """Matches meetings and returns a MeetingMatch-object"""
    model = mip.Model(sense=mip.MAXIMIZE)

    m: dict[Matching, mip.Var] = {}

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

    # Legger inn begrensninger for at en søker ikke kan ha overlappende intervjutider
    # og minst har et buffer mellom hvert intervju som angitt
    for applicant in applicants:
        potential_interviews: set[tuple[Committee, TimeInterval]] = set()
        for applicant_candidate, committee, interval in m:
            if applicant == applicant_candidate:
                potential_interviews.add((committee, interval))

        for interview_a, interview_b in combinations(potential_interviews, r=2):
            if interview_a[1].intersects(interview_b[1]) or interview_a[1].is_within_distance(interview_b[1], APPLICANT_BUFFER_LENGTH):
                model += m[(applicant, *interview_a)] + \
                    m[(applicant, *interview_b)] <= 1  # type: ignore

    # Legger til sekundærmål om at man ønsker å sentrere intervjuer rundt CLUSTERING_TIME_BASELINE
    clustering_objectives = []

    for name, variable in m.items():
        applicant, committee, interval = name
        if interval.start.time() < CLUSTERING_TIME_BASELINE:
            relative_distance_from_baseline = subtract_time(CLUSTERING_TIME_BASELINE,
                                                            interval.end.time()) / MAX_SCALE_CLUSTERING_TIME
        else:
            relative_distance_from_baseline = subtract_time(interval.start.time(),
                                                            CLUSTERING_TIME_BASELINE) / MAX_SCALE_CLUSTERING_TIME

        clustering_objectives.append(
            CLUSTERING_WEIGHT * relative_distance_from_baseline * variable)  # type: ignore

        # Setter mål til å være maksimering av antall møter
        # med sekundærmål om å samle intervjuene rundt CLUSTERING_TIME_BASELINE
    model.objective = mip.maximize(
        mip.xsum(m.values()) + mip.xsum(clustering_objectives))

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
