from __future__ import annotations

from mip_matching.tests.fixed_test import applicants, committees
import mip

import unittest


model = mip.Model(sense=mip.MAXIMIZE)

m = {}

# Lager alle maksimeringsvariabler
for applicant in applicants:
    print(applicant)
    for committee in applicant.get_committees():
        for interval in applicant.get_fitting_committee_slots(committee):
            m[(applicant, committee, interval)] = model.add_var(
                var_type=mip.BINARY, name=f"({applicant}, {committee}, {interval})")

print(m)

# Legger inn begrensninger for at en komité kun kan ha antall møter i et slot lik kapasiteten.
for committee in committees:
    for interval, capacity in committee.get_intervals_and_capacities():
        model += mip.xsum(m[(applicant, committee, interval)]
                          for applicant in committee.get_applicants()
                          if (applicant, committee, interval) in m) <= capacity


# Legger inn begrensninger for at en person kun har ett intervju med hver komité
for applicant in applicants:
    for committee in applicant.get_committees():
        model += mip.xsum(m[(applicant, committee, interval)]
                          for interval in applicant.get_fitting_committee_slots(committee)) <= 1

model.objective = mip.maximize(mip.xsum(m.values()))

# Kjør optimeringen
solver_status = model.optimize()


# Få de faktiske møtetidene
antall_matchede_møter: int = 0
for name, variable in m.items():
    if variable.x:
        antall_matchede_møter += 1
        print(f"{name}")

antall_ønskede_møter = sum(
    len(applicant.get_committees()) for applicant in applicants)

print(
    f"Klarte å matche {antall_matchede_møter} av {antall_ønskede_møter} ({antall_matchede_møter/antall_ønskede_møter:2f})")


print(solver_status)


class TestTest(unittest.TestCase):
    def test_test(self):
        self.assertTrue(True)
