from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import os
import certifi

def main():
    periods = fetch_periods()
    
    #Sjekker om perioden er før intervjutiden og etter søknadstiden, og returnerer søkere og komitétider dersom det er tilfelle
    for period in periods:
        periodId = str(period["_id"])
        interview_start = datetime.fromisoformat(period["interviewPeriod"]["start"].replace("Z", "+00:00"))
        application_end = datetime.fromisoformat(period["applicationPeriod"]["end"].replace("Z", "+00:00"))
        
        now = datetime.now(timezone.utc)

        if interview_start < now and application_end > now:
            applicants = fetch_applicants(periodId)
            committee_times = fetch_committee_times(periodId)
            # print(applicants)
            # print(committee_times)
            
            return applicants, committee_times
        

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

if __name__ == "__main__":
    main()