from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import os
import certifi
from typing import List, Dict

from mip_matching.Committee import Committee
from mip_matching.TimeInterval import TimeInterval
from mip_matching.Applicant import Applicant
from mip_matching.match_meetings import match_meetings, MeetingMatch

def main():
    periods = fetch_periods()
    
    for period in periods:
        periodId = str(period["_id"])
        interview_end = datetime.fromisoformat(period["interviewPeriod"]["end"].replace("Z", "+00:00"))
        application_end = datetime.fromisoformat(period["applicationPeriod"]["end"].replace("Z", "+00:00"))
        
        now = datetime.now(timezone.utc)
        

        #or period["name"] == "Juli Opptak"
        if  (application_end > now and period["hasSentInterviewTimes"] == False and interview_end < now) or period["name"] == "FAKE TEST OPPTAK!":
            applicants = fetch_applicants(periodId)
            committee_times = fetch_committee_times(periodId)
            
            
            committee_objects = create_committee_objects(committee_times)
            
            all_committees = {committee.name: committee for committee in committee_objects}
            
            applicant_objects = create_applicant_objects(applicants, all_committees)
            
            print(applicant_objects)
            print(committee_objects)
            
            match_result = match_meetings(applicant_objects, committee_objects)
            
            send_to_db(match_result, applicants, periodId)
            return match_result
        
        
def send_to_db(match_result: MeetingMatch, applicants: List[dict], periodId):
    load_dotenv()
    formatted_results = format_match_results(match_result, applicants, periodId)
    print("Sending to db")
    print(formatted_results)
    
    mongo_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME")
    client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
    
    db = client[db_name] # type: ignore
    
    collection = db["interviews"]
    
    collection.insert_many(formatted_results)
    
    client.close()

        

def connect_to_db(collection_name):
    load_dotenv()
    
    mongo_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME")

    client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
    
    db = client[db_name] # type: ignore
    
    collection = db[collection_name]
    
    return collection, client

def fetch_periods():
    collection, client = connect_to_db("periods")
    
    periods = collection.find()
    
    periods = list(periods)
    
    client.close()
    
    return periods

def fetch_applicants(periodId):
    collection, client = connect_to_db("applications")
    
    applicants = collection.find({"periodId": periodId})
    
    applicants = list(applicants)
    
    client.close()
    
    return applicants

def fetch_committee_times(periodId):
    collection, client = connect_to_db("committees")
    
    committee_times = collection.find({"periodId": periodId})
    
    committee_times = list(committee_times)
    
    client.close()
    
    return committee_times

def format_match_results(match_results: MeetingMatch, applicants: List[dict], periodId) -> List[Dict]:
    transformed_results = {}
    # applicant_dict = {str(applicant['_id']): {'name': applicant['name'], 'email': applicant['email'], 'phone': applicant['phone']} for applicant in applicants}
    
    for result in match_results['matchings']:
        applicant_id = str(result[0])
        
        
        if applicant_id not in transformed_results:
            transformed_results[applicant_id] = {
                "periodId": periodId,
                "applicantId": applicant_id,
                "interviews": []
            }
        
        committee = result[1]
        time_interval = result[2]
        start = time_interval.start.isoformat()
        end = time_interval.end.isoformat()
        
        transformed_results[applicant_id]["interviews"].append({
            "start": start,
            "end": end,
            "committeeName": committee.name
        })

    return list(transformed_results.values())


def create_applicant_objects(applicants_data: List[dict], all_committees: dict[str, Committee]) -> set[Applicant]:
    applicants = set()
    for data in applicants_data:
        applicant = Applicant(name=str(data['_id']))
        
        optional_committee_names = data.get('optionalCommittees', [])
        optional_committees = {all_committees[name] for name in optional_committee_names if name in all_committees}
        applicant.add_committees(optional_committees)
        
        preferences = data.get('preferences', {})
        preference_committees = {all_committees[committee_name] for committee_name in preferences.values() if committee_name in all_committees}
        applicant.add_committees(preference_committees)

        for interval_data in data['selectedTimes']:
            interval = TimeInterval(
                start=datetime.fromisoformat(interval_data['start'].replace("Z", "+00:00")),
                end=datetime.fromisoformat(interval_data['end'].replace("Z", "+00:00"))
            )
            applicant.add_interval(interval)
            
        applicants.add(applicant)
    return applicants

def create_committee_objects(committee_data: List[dict]) -> set[Committee]:
    committees = set()
    for data in committee_data:
        committee = Committee(name=data['committee'])
        for interval_data in data['availabletimes']:
            interval = TimeInterval(
                start=datetime.fromisoformat(interval_data['start'].replace("Z", "+00:00")),
                end=datetime.fromisoformat(interval_data['end'].replace("Z", "+00:00"))
            )
            capacity = interval_data.get('capacity', 1)  
            committee.add_interval(interval, capacity)
        committees.add(committee)
    return committees


if __name__ == "__main__":
    main()
