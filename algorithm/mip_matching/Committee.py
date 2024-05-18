from __future__ import annotations
from datetime import timedelta

from mip_matching.Applicant import Applicant

from typing import Iterator
# from typing import TYPE_CHECKING
# if TYPE_CHECKING:
#     # Unngår cyclic import
from mip_matching.TimeInterval import TimeInterval
from typing import TypedDict, List, Dict, Any, Set


class Committee:
    def __init__(self, name: str, interview_length: timedelta = timedelta(minutes=15)):
        self.capacities: Dict[TimeInterval, int] = {}
        self.interview_length: timedelta = interview_length
        self.applicants: Set[Applicant] = set()
        self.name = name

    def add_interval(self, interval: TimeInterval, capacity: int = 1) -> None:
        minimal_intervals = TimeInterval.divide_interval(interval=interval, length=self.interview_length)
        for interval in minimal_intervals:
            if interval not in self.capacities:
                self.capacities[interval] = capacity
            else:
                self.capacities[interval] += capacity

    def add_intervals_with_capacities(self, intervals_with_capacities: Dict[TimeInterval, int]):
        for interval, capacity in intervals_with_capacities.items():
            self.add_interval(interval, capacity)

    def get_intervals_and_capacities(self) -> List[tuple[TimeInterval, int]]:
        return list(self.capacities.items())

    def get_intervals(self) -> List[TimeInterval]:
        return list(self.capacities.keys())

    def _add_applicant(self, applicant: Applicant):
        self.applicants.add(applicant)

    def get_applicants(self) -> List[Applicant]:
        return list(self.applicants)

    def get_capacity(self, interval: TimeInterval) -> int:
        return self.capacities[interval]

    def get_applicant_count(self) -> int:
        return len(self.applicants)

    def __str__(self):
        return f"{self.name}"

    def __repr__(self):
        return str(self)