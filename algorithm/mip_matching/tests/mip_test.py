from __future__ import annotations
from datetime import datetime, timedelta, date, time

from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee
from mip_matching.Applicant import Applicant
import mip

from mip_matching.match_meetings import match_meetings

from typing import TypedDict

from faker import Faker

import unittest
import random


def print_matchings(committees: list[Committee],
                    intervals: list[TimeInterval],
                    matchings: list[tuple[Applicant, Committee, TimeInterval]]):

    print("Tid".ljust(15), end="|")
    print("|".join(str(com).ljust(8) for com in committees))

    for interval in intervals:
        print(interval.start.strftime("%d.%m %H:%M").ljust(15), end="|")
        for committee in committees:
            name = ""
            cands = [a.name for a, c,
                     i in matchings if interval == i and c == committee]
            name = cands[0] if len(cands) > 0 else ""

            print(name.rjust(8), end="|")

        print()


class MipTest(unittest.TestCase):

    def check_constraints(self, matchings: list[tuple[Applicant, Committee, TimeInterval]]):
        """Checks if the constraints are satisfied in the provided matchings.
        TODO: Add more constraint tests."""

        # print("Matchings:")
        # for matching in matchings:
        #     print(matching)

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

    def get_default_slots(self):
        """
        Returnerer slots"""

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

    def test_randomized_with_different_interview_sizes(self):
        """
        Plan:
        Lager flere komitéer med ulike intervjulengder
        """
        pass

    def test_realistic(self):
        """
        En realistisk test (grovt) basert på historisk data.
        """

        fake = Faker()

        ANTALL_PERSONER = 200

        INTERVALLENGDE_PER_PERSON_MIN = timedelta(minutes=30)
        INTERVALLENGDE_PER_PERSON_MAKS = timedelta(hours=4)
        ANTALL_INTERVALL_FORSØK = 4

        START_DATE = date(2024, 8, 26)
        END_DATE = date(2024, 8, 30)
        START_TIME_PER_DAY = time(hour=8, minute=0)
        END_TIME_PER_DAY = time(hour=18, minute=0)
        DAY_LENGTH = datetime.combine(date.today(
        ), END_TIME_PER_DAY) - datetime.combine(date.today(), START_TIME_PER_DAY)

        def get_random_interval(interval_date: date, interval_length_min: timedelta, interval_length_max: timedelta) -> TimeInterval:
            interval_start = datetime.combine(interval_date, START_TIME_PER_DAY) + \
                fake.time_delta(DAY_LENGTH)

            interval_end = interval_start + interval_length_min + \
                fake.time_delta(interval_length_max - interval_length_min)

            if interval_end > datetime.combine(interval_date, END_TIME_PER_DAY):
                interval_end = datetime.combine(
                    interval_date, END_TIME_PER_DAY)

            return TimeInterval(interval_start, interval_end)

        # Gir tider til hver søker
        applicants: set[Applicant] = set()
        for person in range(ANTALL_PERSONER):
            applicant = Applicant(name=str(person))

            for _ in range(ANTALL_INTERVALL_FORSØK):
                interval_date = fake.date_between_dates(START_DATE, END_DATE)

                applicant.add_interval(
                    get_random_interval(interval_date=interval_date, interval_length_min=INTERVALLENGDE_PER_PERSON_MIN, interval_length_max=INTERVALLENGDE_PER_PERSON_MAKS))

            applicants.add(applicant)

        KAPASITET_PER_INTERVALL_MIN = 1
        KAPASITET_PER_INTERVALL_MAKS = 1
        INTERVALLENGDE_PER_KOMTIE_MIN = timedelta(hours=2)
        INTERVALLENGDE_PER_KOMTIE_MAKS = timedelta(hours=8)
        ANTALL_INTERVALL_FORSØK_KOMITE = 8

        ANTALL_KOMITEER_PER_PERSON_MIN = 2
        ANTALL_KOMITEER_PER_PERSON_MAKS = 3

        # Gir intervaller til hver komité.
        committees: set[Committee] = {
            Committee(name="Appkom", interview_length=timedelta(minutes=20)),
            Committee(name="Prokom", interview_length=timedelta(minutes=20)),
            Committee(name="Arrkom", interview_length=timedelta(minutes=20)),
            Committee(name="Dotkom", interview_length=timedelta(minutes=30)),
            Committee(name="OIL", interview_length=timedelta(minutes=20)),
            Committee(name="Fagkom", interview_length=timedelta(minutes=20)),
            Committee(name="Bedkom", interview_length=timedelta(minutes=30)),
            Committee(name="FemInIT", interview_length=timedelta(minutes=30)),
            Committee(name="Backlog", interview_length=timedelta(minutes=20)),
            Committee(name="Trikom", interview_length=timedelta(minutes=35)),
        }

        for committee in committees:

            for _ in range(ANTALL_INTERVALL_FORSØK_KOMITE):
                interval_date = fake.date_between_dates(START_DATE, END_DATE)

                committee.add_intervals_with_capacities({get_random_interval(interval_date, INTERVALLENGDE_PER_KOMTIE_MIN, INTERVALLENGDE_PER_KOMTIE_MAKS): random.randint(
                    KAPASITET_PER_INTERVALL_MIN, KAPASITET_PER_INTERVALL_MAKS)})

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

    def test_randomized_with_continuous_intervals(self):
        """
        Gjør en randomisert test hvor hver person kan i sammenhengende
        tidsperioder i stedet for tilfeldige slots.

        Hver komité har fremdeles like lange intervjutider.
        """
        fake = Faker()

        ANTALL_PERSONER = 400

        DEFAULT_INTERVIEW_TIME = timedelta(minutes=20)

        # ANTALL_INTERVALL_PER_PERSON_MIN = 5
        # ANTALL_INTERVALL_PER_PERSON_MAKS = 8
        # INTERVALLENGDE_PER_PERSON_MIN = timedelta(minutes=30)
        INTERVALLENGDE_PER_PERSON_MAKS = timedelta(hours=10)
        ANTALL_INTERVALL_FORSØK = 4

        START_DATE = date(2024, 8, 26)
        END_DATE = date(2024, 8, 30)
        START_TIME_PER_DAY = time(hour=8, minute=0)
        END_TIME_PER_DAY = time(hour=18, minute=0)

        def get_random_interval(interval_date: date) -> TimeInterval:
            interval_start = datetime.combine(interval_date, START_TIME_PER_DAY) + \
                fake.time_delta(INTERVALLENGDE_PER_PERSON_MAKS)

            interval_end = interval_start + \
                fake.time_delta(INTERVALLENGDE_PER_PERSON_MAKS)

            if interval_end > datetime.combine(interval_date, END_TIME_PER_DAY):
                interval_end = datetime.combine(
                    interval_date, END_TIME_PER_DAY)

            return TimeInterval(interval_start, interval_end)

        # Gir tider til hver søker
        applicants: set[Applicant] = set()
        for person in range(ANTALL_PERSONER):
            applicant = Applicant(name=str(person))

            for _ in range(ANTALL_INTERVALL_FORSØK):
                interval_date = fake.date_between_dates(START_DATE, END_DATE)

                applicant.add_interval(
                    get_random_interval(interval_date=interval_date))

            applicants.add(applicant)

        KAPASITET_PER_INTERVALL_MIN = 1
        KAPASITET_PER_INTERVALL_MAKS = 3
        # INTERVALLENGDE_PER_KOMTIE_MAKS = timedelta(hours=10)
        ANTALL_INTERVALL_FORSØK_KOMITE = 10

        ANTALL_KOMITEER_PER_PERSON_MIN = 2
        ANTALL_KOMITEER_PER_PERSON_MAKS = 3

        # print([applicant.get_intervals() for applicant in applicants])

        # Gir intervaller til hver komité.
        committees: set[Committee] = {
            Committee(name=navn, interview_length=DEFAULT_INTERVIEW_TIME) for navn in {"Appkom", "Prokom", "Arrkom", "Dotkom", "Bankkom",
                                                                                       "OIL", "Fagkom", "Bedkom", "FemInIT", "Backlog", "Trikom"}}
        for committee in committees:

            for _ in range(ANTALL_INTERVALL_FORSØK_KOMITE):
                interval_date = fake.date_between_dates(START_DATE, END_DATE)

                committee.add_intervals_with_capacities({get_random_interval(interval_date): random.randint(
                    KAPASITET_PER_INTERVALL_MIN, KAPASITET_PER_INTERVALL_MAKS)})

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

        DEFAULT_INTERVIEW_TIME = timedelta(minutes=20)

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
            Committee(name=navn, interview_length=DEFAULT_INTERVIEW_TIME) for navn in komite_navn}

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
