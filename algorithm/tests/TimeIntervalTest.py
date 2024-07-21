from __future__ import annotations
import unittest
from mip_matching.TimeInterval import TimeInterval
from datetime import datetime
from datetime import timedelta
# from mip_matching.Applicant import Applicant
# from mip_matching.Committee import Committee


class TimeIntervalTest(unittest.TestCase):
    def setUp(self):
        self.interval = TimeInterval(datetime(2024, 8, 24, 8, 0),
                                     datetime(2024, 8, 24, 9, 30))
        self.t1: TimeInterval = TimeInterval(
            datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 8, 45))
        self.t2: TimeInterval = TimeInterval(
            datetime(2024, 8, 24, 8, 45), datetime(2024, 8, 24, 9, 0))
        self.t3: TimeInterval = TimeInterval(
            datetime(2024, 8, 24, 8, 30), datetime(2024, 8, 24, 9, 0))
        self.t4: TimeInterval = TimeInterval(
            datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 8, 30))

    def test_overlapping(self):

        interval1: TimeInterval = TimeInterval(datetime(2024, 8, 24, 8, 0),
                                               datetime(2024, 8, 24, 8, 30))
        interval2: TimeInterval = TimeInterval(
            datetime(2024, 8, 24, 8, 15),
            datetime(2024, 8, 24, 8, 45))

        self.assertTrue(interval1.intersects(interval2))

    def test_overlapping_edge(self):
        interval1: TimeInterval = TimeInterval(datetime(2024, 8, 24, 8, 0),
                                               datetime(2024, 8, 24, 8, 15))
        interval2: TimeInterval = TimeInterval(datetime(2024, 8, 24, 8, 15),
                                               datetime(2024, 8, 24, 8, 30))

        self.assertFalse(interval1.intersects(interval2))

        interval3: TimeInterval = TimeInterval(datetime(2024, 8, 24, 8, 0),
                                               datetime(2024, 8, 24, 8, 30))

        self.assertTrue(interval1.intersects(interval3))

    def test_division(self):
        actual_division = self.interval.divide(timedelta(minutes=30))
        expected_division = [TimeInterval(datetime(2024, 8, 24, 8, 0),
                                          datetime(2024, 8, 24, 8, 30)),
                             TimeInterval(datetime(2024, 8, 24, 8, 30),
                                          datetime(2024, 8, 24, 9, 0)),
                             TimeInterval(datetime(2024, 8, 24, 9, 0),
                                          datetime(2024, 8, 24, 9, 30))]

        self.assertEqual(expected_division, actual_division)

    def test_contains(self):
        self.assertTrue(self.interval.contains(TimeInterval(datetime(2024, 8, 24, 8, 0),
                                               datetime(2024, 8, 24, 9, 0))))
        self.assertTrue(self.interval.contains(TimeInterval(datetime(2024, 8, 24, 8, 0),
                                               datetime(2024, 8, 24, 9, 30))))
        self.assertTrue(self.interval.contains(TimeInterval(datetime(2024, 8, 24, 9, 0),
                                               datetime(2024, 8, 24, 9, 30))))
        self.assertTrue(self.interval.contains(TimeInterval(datetime(2024, 8, 24, 8, 30),
                                               datetime(2024, 8, 24, 9, 0))))

        self.assertFalse(self.interval.contains(TimeInterval(datetime(2024, 8, 24, 7, 45),
                                                             datetime(2024, 8, 24, 8, 30))))
        self.assertFalse(self.interval.contains(TimeInterval(datetime(2024, 8, 24, 7, 45),
                                                             datetime(2024, 8, 24, 9, 31))))
        self.assertFalse(self.interval.contains(TimeInterval(datetime(2024, 8, 24, 8, 30),
                                                             datetime(2024, 8, 24, 9, 31))))

    def test_intersection(self):
        self.assertEqual(TimeInterval(
            datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 30)),
            self.interval.intersection(TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 45))))
        self.assertEqual(TimeInterval(
            datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 30)),
            self.interval.intersection(TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 30))))
        self.assertEqual(TimeInterval(
            datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 15)),
            self.interval.intersection(TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 15))))
        self.assertEqual(TimeInterval(
            datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 9, 15)),
            self.interval.intersection(TimeInterval(datetime(2024, 8, 24, 6, 45), datetime(2024, 8, 24, 9, 15))))

    def test_tangent(self):
        self.assertTrue(self.t1.is_tangent_to(self.t2))
        self.assertFalse(self.t1.is_tangent_to(self.t3))
        self.assertFalse(self.t4.is_tangent_to(self.t2))

    def test_union(self):
        with self.assertRaises(ValueError):
            self.t4.union(self.t2)

        self.assertEqual(self.t1.union(self.t2), TimeInterval(datetime(2024, 8, 24, 8, 0),
                                                              datetime(2024, 8, 24, 9, 0)))

        self.assertEqual(self.t3.union(self.t4), TimeInterval(datetime(2024, 8, 24, 8, 0),
                                                              datetime(2024, 8, 24, 9, 0)))

    def test_get_contained_slots(self):
        test_case_slots = [TimeInterval(datetime(2024, 8, 24, 7, 45),
                                        datetime(2024, 8, 24, 8, 30)),
                           TimeInterval(datetime(2024, 8, 24, 8, 0),
                                        datetime(2024, 8, 24, 8, 30)),
                           TimeInterval(datetime(2024, 8, 24, 8, 15),
                                        datetime(2024, 8, 24, 9, 0)),
                           TimeInterval(datetime(2024, 8, 24, 9, 0),
                                        datetime(2024, 8, 24, 10, 0)),
                           TimeInterval(datetime(2024, 8, 24, 8, 45),
                                        datetime(2024, 8, 24, 9, 30))]
        actual_contained = self.interval.get_contained_slots(test_case_slots)
        expected_contained = [TimeInterval(datetime(2024, 8, 24, 8, 0),
                                           datetime(2024, 8, 24, 8, 30)),
                              TimeInterval(datetime(2024, 8, 24, 8, 15),
                                           datetime(2024, 8, 24, 9, 0)),
                              TimeInterval(datetime(2024, 8, 24, 8, 45),
                                           datetime(2024, 8, 24, 9, 30))]

        self.assertTrue(len(expected_contained), len(actual_contained))
        self.assertEqual(set(expected_contained), set(actual_contained))
