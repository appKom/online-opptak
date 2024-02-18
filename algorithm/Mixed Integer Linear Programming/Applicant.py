from Committee import Committee
from fixed_test import TimeInterval

import itertools

class Applicant:
    """
    Klasse som holder styr over en søker, med data om hvilke 
    komitéer hen har søkt på, og når søkeren kan ha intervjuer."""
    def __init__(self):
        self.committee: list[Committee] = []
        self.slots: set[TimeInterval] = []

    def add_committee(self, committee: Committee) -> None:
        self.committee.append(committee)

    def add_committees(self, committees: set[Committee]) -> None:
        for committee in committees:
            self.add_committee(committee)

    def add_interval(self, interval: TimeInterval) -> None:
        # TODO: Vurder å gjøre "sanitizing" ved å slå sammen overlappende intervaller.
        self.slots.add(interval)

    def add_intervals(self, intervals: set[TimeInterval]) -> None:
        for interval in intervals:
            self.add_interval(interval)

    def get_fitting_committee_slots(self, committee: Committee) -> set[TimeInterval]:
        """
        Returnerer alle tidsintervallene i *komiteen* 
        som er inneholdt i et av *self* sine intervaller.
        """

        result: set[TimeInterval] = set()

        for applicant_interval, committee_interval in itertools.product(self.slots, committee.slots):
            if applicant_interval.contains(committee_interval):
                result.add(committee_interval)

        return result
