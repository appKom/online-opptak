from __future__ import annotations
from datetime import timedelta

from mip_matching.Applicant import Applicant

from typing import Iterator
# from typing import TYPE_CHECKING
# if TYPE_CHECKING:
#     # Unngår cyclic import
from mip_matching.TimeInterval import TimeInterval


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
        self.capacities: dict[TimeInterval, int] = dict()
        self.interview_length: timedelta = interview_length
        self.applicants: set[Applicant] = set()
        self.name = name

    def add_interval(self, interval: TimeInterval, capacity: int = 1) -> None:
        """Legger til et nytt intervall med gitt kapasitet hvis intervallet 
        ikke allerede har en kapasitet for denne komitéen.
        Når intervaller legges til deles det automatisk opp i 
        intervaller med lik lengde som intervjulengder."""
        minimal_intervals = TimeInterval.divide_interval(
            interval=interval, length=self.interview_length)
        for interval in minimal_intervals:
            if interval not in self.capacities:
                self.capacities[interval] = capacity
            else:
                self.capacities[interval] += capacity

    def add_intervals_with_capacities(self, intervals_with_capacities: dict[TimeInterval, int]):
        """Legger til flere tidsintervaller samtidig."""
        for interval, capacity in intervals_with_capacities.items():
            self.add_interval(interval, capacity)

    def get_intervals_and_capacities(self) -> Iterator[tuple[TimeInterval, int]]:
        """Generator som returnerer interval-kapasitet-par."""
        for interval, capacity in self.capacities.items():
            yield interval, capacity

    def get_intervals(self) -> Iterator[TimeInterval]:
        """Generator som returnerer kun intervallene"""
        for interval in self.capacities.keys():
            yield interval

    def _add_applicant(self, applicant: Applicant):
        """Metode brukt for å holde toveis-assosiasjonen."""
        self.applicants.add(applicant)

    def get_applicants(self) -> Iterator[Applicant]:
        for applicant in self.applicants:
            yield applicant

    def get_capacity(self, interval: TimeInterval) -> int:
        """Returnerer komitéens kapasitet ved et gitt interval (ferdiginndelt etter lengde)"""
        return self.capacities[interval]

    def get_applicant_count(self) -> int:
        return len(self.applicants)

    def __str__(self):
        return f"{self.name}"

    def __repr__(self):
        return str(self)
