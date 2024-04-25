from __future__ import annotations
from datetime import datetime, timedelta
import unittest
from mip_matching.TimeInterval import TimeInterval
from mip_matching.Applicant import Applicant
from mip_matching.Committee import Committee


class ApplicantTest(unittest.TestCase):
    def setUp(self) -> None:
        self.committee = Committee(
            "TestKom", interview_length=timedelta(minutes=30))
        self.committee.add_intervals_with_capacities({
            TimeInterval(datetime(2024, 8, 24, 8, 0), datetime(2024, 8, 24, 9, 30)): 1,
            TimeInterval(datetime(2024, 8, 24, 9, 0), datetime(2024, 8, 24, 9, 30)): 1
        })

        self.test_applicant = Applicant("Test Testesen")

        self.test_applicant.add_interval(TimeInterval(datetime(2024, 8, 24, 7, 30),
                                                      datetime(2024, 8, 24, 10, 0)))

    def test_get_fitting_committee_slots(self) -> None:

        self.test_applicant.get_fitting_committee_slots(self.committee)

        self.assertEqual(set([TimeInterval(datetime(2024, 8, 24, 8, 0),
                                           datetime(2024, 8, 24, 8, 30)),
                              TimeInterval(datetime(2024, 8, 24, 8, 30),
                                           datetime(2024, 8, 24, 9, 0)),
                              TimeInterval(datetime(2024, 8, 24, 9, 0),
                                           datetime(2024, 8, 24, 9, 30))]),
                         self.test_applicant.get_fitting_committee_slots(self.committee))

    def test_add_interval_sanitizes(self) -> None:

        self.test_applicant.add_intervals({
            TimeInterval(datetime(2024, 8, 24, 9, 30),
                         datetime(2024, 8, 24, 10, 30)),
            TimeInterval(datetime(2024, 8, 24, 4, 30),
                         datetime(2024, 8, 24, 6, 0)),
            TimeInterval(datetime(2024, 8, 24, 10, 30),
                         datetime(2024, 8, 24, 11, 30))
        })

        self.assertEqual(self.test_applicant.get_intervals(), {
            TimeInterval(datetime(2024, 8, 24, 4, 30),
                         datetime(2024, 8, 24, 6, 0)),
            TimeInterval(datetime(2024, 8, 24, 7, 30),
                         datetime(2024, 8, 24, 11, 30)),
        })
