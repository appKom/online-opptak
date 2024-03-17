from __future__ import annotations

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    # Unngår cyclic import
    from mip_matching.Committee import Committee
    from mip_matching.TimeInterval import TimeInterval

import itertools


class Applicant:
    """
    Klasse som holder styr over en søker, med data om hvilke 
    komitéer hen har søkt på, og når søkeren kan ha intervjuer.
    """

    def __init__(self, name: str):
        self.committees: list[Committee] = []
        self.slots: set[TimeInterval] = set()
        self.name = name

    def add_committee(self, committee: Committee) -> None:
        self.committees.append(committee)
        committee._add_applicant(self)

    def add_committees(self, committees: set[Committee]) -> None:
        for committee in committees:
            self.add_committee(committee)

    def add_interval(self, interval: TimeInterval) -> None:
        # TODO: Vurder å gjøre "sanitizing" ved å slå sammen overlappende intervaller.
        self.slots.add(interval)

    def add_intervals(self, intervals: set[TimeInterval]) -> None:
        for interval in intervals:
            self.add_interval(interval)

    def get_intervals(self) -> set[TimeInterval]:
        return self.slots.copy()

    def get_fitting_committee_slots(self, committee: Committee) -> set[TimeInterval]:
        """
        Returnerer alle tidsintervallene i *komiteen* 
        som er inneholdt i et av *self* sine intervaller.
        """

        result: set[TimeInterval] = set()

        for applicant_interval, committee_interval in itertools.product(self.slots, committee.get_intervals()):
            if applicant_interval.contains(committee_interval):
                result.add(committee_interval)

        return result

    def get_committees(self) -> set[Committee]:
        """Returnerer en grunn kopi av komitéene."""
        return set(self.committees)

    def __str__(self) -> str:
        return self.name

    def __repr__(self) -> str:
        return str(self)
