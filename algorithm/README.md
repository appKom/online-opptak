# Algoritme

Prøvde først med CSP-algoritme, men har nå gått over til MIP-programmering (Mixd Integer Linear Programming).

## Setup Python Venv

```bash
cd algorithm
python -m venv ".venv"
```

Lag så en fil i `.\.venv\Lib\site-packages` som slutter på `.pth` og inneholder den absolutte filstien til `mip_matching`-mappen.

```
.\.venv\Scripts\activate
python -m pip install -r requirements.txt
```

## TODOs

- [x] Lage funksjon som deler opp fra en komités slot
- [x] Sette opp begrensningene fra modelleringen
- [ ] Flikke litt på modelleringen.
- [ ] Finn ut hvordan man kan preprosessere dataen for å få ned kjøretiden (f. eks ved å lage lister av personer for hver komité.)
