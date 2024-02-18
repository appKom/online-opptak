import mip
import itertools

from fixed_test import TimeIntervals

from fixed_test import komiteer_og_tidsslots, komiteer, komite_kapasiteter
from fixed_test import komiteer_per_person, personer, personer_og_tidsslots

model = mip.Model(sense=mip.MAXIMIZE)

m = {}

# Lager alle maksimeringsvariabler
for person in personer:

    for komite in komiteer_per_person[person]:
        for person_intervall, komite_intervall in itertools.product(personer_og_tidsslots[person],
                                                                    komiteer_og_tidsslots[komite]):
            # Går gjennom alle kombinasjoner av intervaller for person og for komité

            if person_intervall.contains(komite_intervall):
                # Legger til alle intervaller for komitéen som passer for personen

                m[(person, komite, komite_intervall)
                  ] = model.add_var(var_type=mip.BINARY, name=f"({person}, {komite}, {komite_intervall})")

print(m)

# Legger inn begrensninger for at en komité kun kan ha antall møter i et slot lik kapasiteten.
for komite in komiteer:
    for slot in komiteer_og_tidsslots[komite]:
        model += mip.xsum(m[(person, komite, slot)]
                          for person in personer if (person, komite, slot) in m) <= komite_kapasiteter[komite][slot]


# Legger inn begrensninger for at en person kun har ett intervju med hver komité
for person in personer:
    for komite in komiteer:
        # if person == "Jørgen":
        #     print(person, komite)
        #     print(personer_og_tidsslots[person])
        #     print(komiteer_og_tidsslots[komite])
        #     print(personer_og_tidsslots[person].intersection(
        #     komiteer_og_tidsslots[komite]))

        person_tider: TimeIntervals = TimeIntervals(personer_og_tidsslots[person])
        komite_tider: TimeIntervals = TimeIntervals(komiteer_og_tidsslots[komite])
        
        model += mip.xsum(m[(person, komite, slot)] for slot in person_tider.recursive_intersection(komite_tider) if komite in komiteer_per_person[person]) <= 1

model.objective = mip.maximize(mip.xsum(m.values()))

solver_status = model.optimize()


# Møtetider:
antall_matchede_møter: int = 0
for name, variable in m.items():
    if variable.x:
        antall_matchede_møter += 1
        print(f"{name}: {variable.x}")

antall_ønskede_møter = sum(
    len(komiteer_per_person[person]) for person in personer)

print(
    f"Klarte å matche {antall_matchede_møter} av {antall_ønskede_møter} ({antall_matchede_møter/antall_ønskede_møter:2f})")


print(solver_status)
