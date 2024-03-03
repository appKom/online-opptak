from __future__ import annotations
import unittest
from mip_matching.TimeInterval import TimeInterval
# from mip_matching.Applicant import Applicant
# from mip_matching.Committee import Committee


class TimeIntervalTest(unittest.TestCase):
    def setUp(self):
        self.interval = TimeInterval(0, 6)

    def test_overlapping(self):
        interval1: TimeInterval = TimeInterval(0, 2)
        interval2: TimeInterval = TimeInterval(1, 3)

        self.assertTrue(interval1.overlaps(interval2))

    def test_overlapping_edge(self):
        interval1: TimeInterval = TimeInterval(0, 1)
        interval2: TimeInterval = TimeInterval(1, 2)

        self.assertFalse(interval1.overlaps(interval2))

        interval3: TimeInterval = TimeInterval(0, 2)

        self.assertTrue(interval1.overlaps(interval3))

    def test_division(self):
        actual_division = self.interval.divide(2)
        expected_division = [TimeInterval(
            0, 2), TimeInterval(2, 4), TimeInterval(4, 6)]

        self.assertEqual(expected_division, actual_division)

    def test_contains(self):
        self.assertTrue(self.interval.contains(TimeInterval(0, 4)))
        self.assertTrue(self.interval.contains(TimeInterval(0, 6)))
        self.assertTrue(self.interval.contains(TimeInterval(4, 6)))
        self.assertTrue(self.interval.contains(TimeInterval(2, 4)))

        self.assertFalse(self.interval.contains(TimeInterval(-1, 2)))
        self.assertFalse(self.interval.contains(TimeInterval(-1, 7)))
        self.assertFalse(self.interval.contains(TimeInterval(2, 7)))

    def test_intersection(self):
        self.assertEqual(TimeInterval(
            4, 6), self.interval.intersection(TimeInterval(4, 7)))
        self.assertEqual(TimeInterval(
            4, 6), self.interval.intersection(TimeInterval(4, 6)))
        self.assertEqual(TimeInterval(
            4, 5), self.interval.intersection(TimeInterval(4, 5)))
        self.assertEqual(TimeInterval(
            0, 5), self.interval.intersection(TimeInterval(-5, 5)))

    def test_get_contained_slots(self):
        test_case_slots = [TimeInterval(-1, 2), TimeInterval(0, 2),
                           TimeInterval(1, 4), TimeInterval(4, 8), TimeInterval(3, 6)]
        actual_contained = self.interval.get_contained_slots(test_case_slots)
        expected_contained = [TimeInterval(
            0, 2), TimeInterval(1, 4), TimeInterval(3, 6)]

        self.assertTrue(len(expected_contained), len(actual_contained))
        self.assertEqual(set(expected_contained), set(actual_contained))
