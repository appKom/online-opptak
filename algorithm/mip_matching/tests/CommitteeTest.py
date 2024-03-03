from __future__ import annotations
import unittest
from mip_matching.TimeInterval import TimeInterval
from mip_matching.Committee import Committee


class ApplicantTest(unittest.TestCase):
    def setUp(self) -> None:
        self.committee = Committee("TestKom", interview_length=2)
        self.committee.add_intervals_with_capacities({
            TimeInterval(0, 6): 1,
            TimeInterval(2, 6): 1
        })

    def test_capacity_stacking(self) -> None:
        self.assertEqual(1, self.committee.get_capacity(TimeInterval(0, 2)))
        self.assertEqual(2, self.committee.get_capacity(TimeInterval(2, 4)))
