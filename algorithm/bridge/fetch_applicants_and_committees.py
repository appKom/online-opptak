from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import os
import certifi
import itertools
from typing import TypedDict, List
import mip

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

        if  (application_end > now and period["hasSentInterviewTimes"] == False and interview_end < now) or period["name"] == "Juli Opptak":
            applicants = fetch_applicants(periodId)
            committee_times = fetch_committee_times(periodId)
            
            
            committee_objects = create_committee_objects(committee_times)
            
            all_committees = {committee.name: committee for committee in committee_objects}
            
            applicant_objects = create_applicant_objects(applicants, all_committees)
            committee_objects = create_committee_objects(committee_times)
            
            print(applicant_objects)
            print(committee_objects)
            
            match_result = match_meetings(applicant_objects, committee_objects)
            
            send_to_db(match_result)
            return match_result
        
        
def send_to_db(match_result: MeetingMatch):
    print("Sending to db")
    print(match_result)
        

def connect_to_db(collection_name):
    load_dotenv()
    
    mongo_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME")

    client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
    
    db = client[db_name] # type: ignore
    
    collection = db[collection_name]
    
    return collection, client

def fetch_periods():
    collection, client = connect_to_db("period")
    
    periods = collection.find()
    
    periods = list(periods)
    
    client.close()
    
    return periods

def fetch_applicants(periodId):
    collection, client = connect_to_db("applicant")
    
    applicants = collection.find({"periodId": periodId})
    
    applicants = list(applicants)
    
    client.close()
    
    return applicants

def fetch_committee_times(periodId):
    collection, client = connect_to_db("committee")
    
    committee_times = collection.find({"periodId": periodId})
    
    committee_times = list(committee_times)
    
    client.close()
    
    return committee_times

from typing import List
from datetime import datetime

def create_applicant_objects(applicants_data: List[dict], all_committees: dict[str, Committee]) -> set[Applicant]:
    applicants = set()
    for data in applicants_data:
        applicant = Applicant(name=data['name'])
        
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