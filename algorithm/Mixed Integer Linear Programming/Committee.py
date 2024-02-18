from fixed_test import TimeInterval


class Committee:
    """
    En klasse som representerer en komité 
    og holder oversikt over når komitéene kan ha
    møte og hvor lange intervjuene er.
    """

    def __init__(self, interview_length: int = 1):
        self.capacities: dict[TimeInterval, int] = dict()
        self.interview_length: int = interview_length

    def add_interval(self, interval: TimeInterval, capacity: int = 1) -> None:
        """Legger til et nytt intervall med gitt kapasitet hvis intervallet 
        ikke allerede har en kapasitet for denne komitéen.
        Når intervaller legges til deles det automatisk opp i 
        intervaller med lik lengde som intervjulengder."""
        minimal_intervals = TimeInterval.divide_interval(interval=interval, length=self.interview_length)
        for interval in minimal_intervals:
            if interval not in self.capacities:
                self.capacities[interval] = capacity

    def add_intervals_with_capacities(self, intervals_with_capacities: dict[TimeInterval, int]):
        """Legger til flere tidsintervaller samtidig."""
        for interval, capacity in intervals_with_capacities.items():
            self.add_interval(interval, capacity)
