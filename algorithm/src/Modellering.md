# Modellering av problem gjennom Mixed Integer Linear Programming

## Nyttige ressurser

- https://python-mip.readthedocs.io/en/latest/quickstart.html
- https://towardsdatascience.com/mixed-integer-linear-programming-1-bc0ef201ee87
- https://towardsdatascience.com/mixed-integer-linear-programming-formal-definition-and-solution-space-6b3286d54892
- https://www.gurobi.com/resources/mixed-integer-programming-mip-a-primer-on-the-basics/

## Variabler

`p`
- Person

`k`
- Komité

`t`
- Timeslot (Må gjøres til intervaller etter hvert)

`m(p, k, t)`
- Binær variabel
- Person `p` har møte med komité `k` i timeslot `t`

## Hjelpevariabler

`c(p, t)`
- Binære variabler
- Tidspunkt `t` passer for person `p`

`c(k, t)`
- Heltallsvariabel
- Kapasitet for komité `k` på tidspunkt `t` (hvor mange intervju de kan ha på det gitte tidspunktet)

## Begrensninger

For alle `p`:
    <!-- `m(p, k_1, t_1) + m(p, k_2, t_2) < 2` for alle par `k`, hvor t_1 og t_2 overlapper - Dette blir først aktuelt etter at timeslots har ulike tidsintervaller -->
- `m(p, k, t) <= 1` dersom 
    - `p` har søkt på komité `k`
    - `c(p, t) => 1`
    - `c(k, t) => 1`
- `m(p, k, t) <= 0` ellers

For alle `k`:
- `sum(m(p, k, t)) <= c(k, t)` for alle personer `p` og tidspunkt `t`



## Mål

Maksimere `sum(m(p, k, t))` for alle `p`, `k` og `t`

### Sekundærmål

- La det være et gitt mellomrom mellom hvert intervju for samme person.

- [Ikke enda implementert] La det være færrest mulig og minst mulig mellomrom mellom intervjuene for komitéene.



