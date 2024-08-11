from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from datetime import timedelta
from typing import Any


@dataclass(frozen=True)
class TimeInterval:
    """
    Definerer et tidsintervall fra og med start til og uten end.
    """
    start: datetime
    end: datetime

    def __post_init__(self) -> None:
        """Metode som sikrer at start og end er av type datetime og at de er i kronologisk rekkefølge."""
        if not (isinstance(self.start, datetime) and isinstance(self.end, datetime)):
            raise TypeError("Start and end must be of type datetime.")

        if not (self.start <= self.end):
            raise ValueError("Start must be before end")

    def intersects(self, other: TimeInterval) -> bool:
        """Returnerer true om to tidsintervaller er helt eller delvis overlappende."""
        return other.start <= self.start < other.end or self.start <= other.start < self.end

    def is_tangent_to(self, other: TimeInterval) -> bool:
        """Returnerer true om self tangerer other (er helt inntil, men ikke overlappende)."""
        return not self.intersects(other) and (other.start == self.end or self.start == other.end)

    def union(self, other: TimeInterval) -> TimeInterval:
        """Returnerer union av tidsintervall dersom de to intervallene har overlapp eller er inntil hverandre"""

        if not self.is_mergable(other):
            raise ValueError("Cannot have union with gaps between")

        start = min(self.start, other.start)
        end = max(self.end, other.end)
        return TimeInterval(start, end)

    def contains(self, other: TimeInterval) -> bool:
        """Returnerer true om other inngår helt i self."""
        return self.start <= other.start and other.end <= self.end

    def is_mergable(self, other: TimeInterval) -> bool:
        return self.intersects(other) or self.is_tangent_to(other)

    def intersection(self, other: TimeInterval) -> TimeInterval | None:
        """Returnerer et snitt av to tidsintervaller."""
        if not self.intersects(other):
            # Snittet er tomt grunnet ingen overlapp
            return None

        start = max(self.start, other.start)
        end = min(self.end, other.end)
        return TimeInterval(start, end)

    def get_contained_slots(self, slots: list[TimeInterval]):
        """Returnerer en delmengde av de intervaller i listen
          "slots", som inngår helt i dette tidsintervallet."""
        return set(slot for slot in slots if self.contains(slot))

    def divide(self, length: timedelta) -> list[TimeInterval]:
        return TimeInterval.divide_interval(self, length)

    @staticmethod
    def divide_interval(interval: TimeInterval, length: timedelta) -> list[TimeInterval]:
        """

        Deler opp et intervall i mindre intervaller av lengde *length*.

        Note:
        - Det antas at intervallet kan deles opp i hele deler av lengde *length*.
        Overskytende tid vil bli ignorert.
        """
        result = []
        global_start = interval.start
        local_start = global_start
        local_end = local_start + length

        while local_end <= interval.end:
            result.append(TimeInterval(local_start, local_end))
            local_start = local_end
            local_end += length

        return result


"""
Dette er gammel kode som nå er flyttet til de passende komité-/søker-klassene.
Foreløpig beholdt for referanse.
"""
# class TimeIntervals:
#     def __init__(self, initial_list: list[TimeInterval] = None):
#         self.list: list[TimeInterval] = initial_list if initial_list else []

#     def add(self, interval: TimeInterval):
#         self.list.append(interval)

#     def recursive_intersection(self, other: TimeIntervals):
#         """
#         Returnerer alle tidsintervallene i *other* som er inneholdt i et av *self* sine intervaller"""
#         result = TimeIntervals()

#         for self_interval, other_interval in itertools.product(self.list, other.list):
#             if self_interval.contains(other_interval):
#                 result.add(other_interval)

#         return result

#     def __iter__(self):
#         return self.list.__iter__()