from __future__ import annotations
from datetime import datetime, timedelta
import unittest
from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee


class ApplicantTest(unittest.TestCase):
    def setUp(self) -> None:
        self.committee = Committee(
            "TestKom", interview_length=timedelta(minutes=30))
        self.committee.add_intervals_with_capacities({
            TimeInterval(datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 9, 30)): 1,
            TimeInterval(datetime(2024, 8, 24, 8, 30), datetime(2024, 8, 24, 9, 30)): 1
        })

    def test_capacity_stacking(self) -> None:
        self.assertEqual(1, self.committee.get_capacity(
            TimeInterval(datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 8, 30))))
        self.assertEqual(2, self.committee.get_capacity(
            TimeInterval(datetime(2024, 8, 24, 8, 30), datetime(2024, 8, 24, 9, 0))))
