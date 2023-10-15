class CSP: 
	def __init__(self, variables, Domains,constraints): 
		self.variables = variables 
		self.domains = Domains 
		self.constraints = constraints 
		self.solution = None

	def solve(self):
		print("Test")
		assignment = {} 
		self.solution = self.backtrack(assignment) 
		return self.solution 

	def backtrack(self, assignment): 
		print(f"{len(assignment)=}\r", end="")
		if len(assignment) == len(self.variables): 
			return assignment 

		var = self.select_unassigned_variable(assignment) 
		for value in self.order_domain_values(var, assignment): 
			if self.is_consistent(var, value, assignment): 
				assignment[var] = value 
				result = self.backtrack(assignment) 
				if result is not None: 
					return result 
				del assignment[var] 
		return None

	def select_unassigned_variable(self, assignment): 
		unassigned_vars = [var for var in self.variables if var not in assignment] 
		return min(unassigned_vars, key=lambda var: len(self.domains[var])) 

	def order_domain_values(self, var, assignment): 
		return self.domains[var] 

	def is_consistent(self, var, value, assignment): 
		for constraint_var in self.constraints[var]: 
			if constraint_var in assignment and assignment[constraint_var] == value: 
				return False
		return True
	



personer_og_tidsslots = {"Jørgen": {1, 2, 3, 4}, "Sindre": {2, 4, 5, 6}, "Julian": {3, 1, 6}, "Fritz": {1, 4}}
komiteer_og_tidsslots = {"Appkom": {1, 2, 3, 4, 5}, "OIL": {4, 5, 6}, "Prokom": {1, 2, 3, 5}}

timeslots = range(1, 9)
personer = personer_og_tidsslots.keys()
komiteer = komiteer_og_tidsslots.keys()

komiteer_per_person = {"Jørgen": {"Appkom", "Prokom"}, "Sindre": {"Appkom", "OIL"}, "Julian": {"Appkom", "Prokom", "OIL"}, "Fritz": {"OIL"}}

# Variables 
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

# # Solution 
csp = CSP(variables, domains, constraints) 
sol = csp.solve()
print(sol)


solution = {komite: [None for _ in timeslots] for komite in komiteer} 
for person, komite in sol: 
	solution[komite][sol[person, komite]] = person 
	
print("---------")
print(solution)
# print_sudoku(solution)

for komite in solution:
	print(komite.ljust(15), end="|")
	print("|".join([str(slot).rjust(15) for slot in solution[komite]]))
