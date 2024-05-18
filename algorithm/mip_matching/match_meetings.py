from urllib import request
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee
from mip_matching.Applicant import Applicant
import mip
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import mip
from typing import TypedDict, List, Dict, Any




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
        potential_intervals = set()
        for applicant_candidate, committee, interval in m:
            if applicant == applicant_candidate:
                potential_intervals.add(interval)

        for interval in potential_intervals:

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

app = Flask(__name__)

@app.route('/api/interview', methods=['POST'])
def match():
    data = request.json
    if data is None:
        return jsonify({'error': 'Invalid JSON data'})

    applicants_data = data['applicants']
    committees_data = data['committees']
    duration = timedelta(minutes=data['duration'])

    committees = [Committee(comm['name'], timedelta(minutes=comm['interview_length'])) for comm in committees_data]
    for comm, comm_data in zip(committees, committees_data):
        for slot in comm_data['slots']:
            comm.add_interval(TimeInterval(datetime.fromisoformat(slot['start']), datetime.fromisoformat(slot['end'])), comm_data['capacity'])

    committees_dict = {comm.name: comm for comm in committees}

    applicants = [Applicant(app['name']) for app in applicants_data]
    for app, app_data in zip(applicants, applicants_data):
        for slot in app_data['slots']:
            app.add_interval(TimeInterval(datetime.fromisoformat(slot['start']), datetime.fromisoformat(slot['end'])))
        for committee_name in app_data['committees']:
            if committee_name in committees_dict:
                app.add_committee(committees_dict[committee_name])

    match_result = match_meetings(set(applicants), set(committees))
    return jsonify(match_result)


if __name__ == '__main__':
    app.run(debug=True)
