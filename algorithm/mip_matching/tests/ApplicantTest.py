from __future__ import annotations
import unittest
from mip_matching.TimeInterval import TimeInterval
from mip_matching.Applicant import Applicant
from mip_matching.Committee import Committee


class ApplicantTest(unittest.TestCase):
    def setUp(self) -> None:
        self.committee = Committee("TestKom", interview_length=2)
        self.committee.add_intervals_with_capacities({
            TimeInterval(0, 6): 1,
            TimeInterval(4, 6): 1
        })

    def test_get_fitting_committee_slots(self) -> None:
        test_applicant = Applicant("Test Testesen")

        test_applicant.add_interval(TimeInterval(-2, 8))

        test_applicant.get_fitting_committee_slots(self.committee)

        self.assertEqual(set([TimeInterval(0, 2), TimeInterval(2, 4), TimeInterval(
            4, 6)]), test_applicant.get_fitting_committee_slots(self.committee))
