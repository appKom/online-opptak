from __future__ import annotations
from datetime import timedelta

from mip_matching.Applicant import Applicant
from mip_matching.TimeInterval import TimeInterval

from typing import Iterator

from mip_matching.types import Room


class Committee:
    """
    En klasse som representerer en komité 
    og holder oversikt over når komitéene kan ha
    møte og hvor lange intervjuene er.

    NOTE:
    - Kan foreløpig kun aksessere ved hjelp av det faktiske 
    intervallet slik det er inndelt basert på intervju-lengde, 
    men er usikker på om vi kanskje burde fått med annen måte å 
    aksessere på.
    """

    def __init__(self, name: str, interview_length: timedelta = timedelta(minutes=15)):
        self.interview_slots: dict[TimeInterval, set[Room]] = dict()
        self.interview_length: timedelta = interview_length
        self.applicants: set[Applicant] = set()
        self.name = name

    def add_interview_slot(self, interval: TimeInterval, room: Room) -> None:
        """Legger til et nytt intervall med gitt rom.
        Når intervaller legges til deles det automatisk opp i 
        intervaller med lik lengde som intervjulengder."""
        minimal_intervals = TimeInterval.divide_interval(
            interval=interval, length=self.interview_length)
        for interval in minimal_intervals:
            if interval not in self.interview_slots:
                self.interview_slots[interval] = set()
            self.interview_slots[interval].add(room)

    def get_intervals_and_capacities(self) -> Iterator[tuple[TimeInterval, int]]:
        """Generator som returnerer interval-kapasitet-par."""
        for interval, rooms in self.interview_slots.items():
            yield interval, len(rooms)

    def get_capacity(self, interval: TimeInterval) -> int:
        """Returnerer komitéens kapasitet ved et gitt interval (ferdiginndelt etter lengde)"""
        return len(self.interview_slots[interval])

    def get_intervals(self) -> Iterator[TimeInterval]:
        """Generator som returnerer kun intervallene"""
        for interval in self.interview_slots.keys():
            yield interval

    def get_rooms(self, interval: TimeInterval) -> Iterator[Room]:
        for room in self.interview_slots[interval]:
            yield room

    def _add_applicant(self, applicant: Applicant):
        """Metode brukt for å holde toveis-assosiasjonen."""
        self.applicants.add(applicant)

    def get_applicants(self) -> Iterator[Applicant]:
        for applicant in self.applicants:
            yield applicant

    def get_applicant_count(self) -> int:
        return len(self.applicants)

    def __str__(self):
        return f"{self.name}"

    def __repr__(self):
        return str(self)


if __name__ == "__main__":
    print("running")
