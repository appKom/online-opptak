from CSP_test import CSP
import random

START_TID = 0
SLUTT_TID = 10*5*2 - 1
ANTALL_PERSONER = 210

ANTALL_SLOTS_PER_PERSON_MIN = 10
ANTALL_SLOTS_PER_PERSON_MAKS = 20

ANTALL_SLOTS_PER_KOMITE_MIN = 5*5*2
ANTALL_SLOTS_PER_KOMITE_MAKS = 8*5*2

ANTALL_KOMITEER_PER_PERSON_MIN = 1
ANTALL_KOMITEER_PER_PERSON_MAKS = 3

komiteer = {"Appkom", "Prokom", "Arrkom", "Dotkom", "Bankkom", "OIL", "Fagkom", "Bedkom", "FemInIT", "Backlog", "Trikom"}

personer_og_tidsslots = {}

for person in range(ANTALL_PERSONER):
    personer_og_tidsslots[person] = set((random.sample(range(START_TID, SLUTT_TID+1), random.randint(ANTALL_SLOTS_PER_PERSON_MIN, ANTALL_SLOTS_PER_PERSON_MAKS))))

komiteer_og_tidsslots = {}

for komite in komiteer:
    komiteer_og_tidsslots[komite] = set((random.sample(range(START_TID, SLUTT_TID+1), random.randint(ANTALL_SLOTS_PER_KOMITE_MIN, ANTALL_SLOTS_PER_KOMITE_MAKS))))


personer = personer_og_tidsslots.keys()
komiteer = list(komiteer_og_tidsslots.keys())

komiteer_per_person = {person: random.sample(sorted(komiteer), random.randint(ANTALL_KOMITEER_PER_PERSON_MIN, ANTALL_KOMITEER_PER_PERSON_MAKS)) for person in personer}

print(personer_og_tidsslots)
print(komiteer_og_tidsslots)

variables = set()
for person in komiteer_per_person:
	for komite in komiteer_per_person[person]:
		variables.add((person, komite))
# Domains 
domains = {var: personer_og_tidsslots[var[0]].intersection(komiteer_og_tidsslots[var[1]]) for var in variables} 
		 
import itertools
constraints = {var: set() for var in variables} 		
for var, annen in itertools.permutations(variables, 2):
	if annen[0] == var[0]:
		constraints[var].add(annen)
	if annen[1] == var[1]:
		constraints[var].add(annen)

csp = CSP(variables, domains, constraints) 
sol = csp.solve()
if sol is None:
	print("Ingen løsning")
	exit()
print(sol)


solution = {komite: [-1 for _ in range(START_TID, SLUTT_TID+1)] for komite in komiteer} 
solution2 = {slot: {komite: "Tom" if slot in komiteer_og_tidsslots[komite] else "-" for komite in komiteer} for slot in range(START_TID, SLUTT_TID+1)} 
for person, komite in sol: 
	solution[komite][sol[person, komite]] = person
	solution2[sol[person, komite]][komite] = person 
	
for komite in solution:
	print(komite.ljust(8), end="|")
	print("|".join([str(slot).rjust(2) for slot in solution[komite]]))
	
print("|".join(["Slot"] + [komite.rjust(8) for komite in komiteer]))
for slot in solution2:
	print(str(slot).ljust(4), end="|")
	print("|".join([str(solution2[slot][komite]).rjust(8) for komite in solution2[slot]]))