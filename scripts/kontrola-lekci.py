#!/usr/bin/env python3
"""Hlídá, že akademie souhlasí se cvičným projektem.

    python3 scripts/kontrola-lekci.py

Nekontroluje pravopis ani styl. Kontroluje čtyři věci, které tiše zastarají:
vložené kopie souborů, odkazy na lekce, prázdné moduly a fráze, které
popisují starší podobu projektu. Vrací nenulový kód, když něco nesedí.
"""
import re, sys, pathlib, difflib

KOREN = pathlib.Path(__file__).resolve().parent.parent
AC = (KOREN / 'src/academy.ts').read_text()
CFG = (KOREN / 'src/config.ts').read_text()
Z = KOREN / 'cviceni/faktury-kontrola'

SOUBORY = {
    'zadani.md': Z / 'zadani.md',
    'CLAUDE.md': Z / 'CLAUDE.md',
    'SKILL.md': Z / '.claude/skills/kontrola-faktur/SKILL.md',
    'chran-vstup.sh': Z / '.claude/hooks/chran-vstup.sh',
    'rutina.md': Z / 'rutina.md',
    'runbook.md': Z / 'runbook.md',
}

# Fráze popisující podobu projektu, která už neplatí. Klíč je vzor, hodnota
# důvod — ať je z výpisu poznat, proč to vadí, ne jen že to tam je.
ZASTARALE = {
    r'schválen[ýéoa]\w* objednávk': 'projekt se proti schváleným objednávkám neporovnává',
    r'porovn\w+ (?:je )?se? seznamem objednávek': 'totéž — jen se eviduje, co přišlo',
    r'sloupc[ei] CHYBÍ': 'evidence má sloupce Kompletní a Žádost odeslána',
    r'\bmailto\b': 'automatizace posílá poštu doopravdy, mailto už není náhradní plán',
    r'chran-data\.sh': 'hook ve cvičném projektu se jmenuje chran-vstup.sh',
    r'\bvystupy\b': 'cvičný projekt má dvojici vstup/ a vystup/, bez ypsilonu',
    r'\b[Úú]loh\w*\b': 'tomu, co běží samo, se říká automatizace; kus práce je úkol',
}

chyby = []


def odescapuj(s):
    return s.replace('\\`', '`').replace('\\${', '${').replace('\\\\', '\\')


def kopie_souboru():
    for m in re.finditer(r"kind: 'soubor',", AC):
        usek = AC[m.start():]
        jm = re.search(r"nazev: '([^']+)'", usek).group(1)
        i = usek.index('obsah: `') + len('obsah: `')
        j = i
        while True:
            j = usek.index('`', j)
            if usek[j - 1] != '\\':
                break
            j += 1
        vlozeno = odescapuj(usek[i:j]).rstrip('\n')
        cesta = SOUBORY.get(jm)
        if not cesta:
            chyby.append(f'kopie {jm}: nevím, se kterým souborem ji porovnat')
            continue
        skutecny = cesta.read_text().rstrip('\n')
        if vlozeno != skutecny:
            d = [x for x in difflib.unified_diff(skutecny.splitlines(), vlozeno.splitlines(), lineterm='', n=0)
                 if x[:1] in '+-' and x[:3] not in ('+++', '---')]
            chyby.append(f'kopie {jm} v lekci se rozešla se souborem ({len(d)} řádků rozdílu)')


def odkazy_na_lekce():
    zive = set(re.findall(r"const \w+: Lesson = \{\n  slug: '([^']+)',", AC))
    for kurz, slug in set(re.findall(r"'(claude-a-firemni-data|od-mapy-k-automatu)/([a-z0-9-]+)'", AC + CFG)):
        if slug not in zive:
            chyby.append(f'odkaz na lekci {kurz}/{slug}, která neexistuje')


def prazdne_moduly():
    lekce = {m.group(1): m.group(2) for m in
             re.finditer(r"const (\w+): Lesson = \{\n  slug: '[^']+',\n  module: '(\w+)'", AC)}
    kurzy = list(re.finditer(r"    slug: '([a-z-]+)',\n    title: '([^']*)',", AC))
    for i, m in enumerate(kurzy):
        konec = kurzy[i + 1].start() if i + 1 < len(kurzy) else len(AC)
        usek = AC[m.start():konec]
        mods = re.findall(r"key: '(\w+)',\n        title: '([^']*)'", usek)
        pole = re.search(r"    lessons: \[([^\]]*)\]", usek)
        konsty = [x.strip() for x in pole.group(1).replace('\n', ' ').split(',') if x.strip()] if pole else []
        pouzite = {lekce[k] for k in konsty if k in lekce}
        for key, nazev in mods:
            if key not in pouzite:
                chyby.append(f'modul „{nazev}" v kurzu {m.group(2)} nemá žádnou lekci')
        for chybi in pouzite - {k for k, _ in mods}:
            chyby.append(f'lekce v kurzu {m.group(2)} leží v nedeklarovaném modulu „{chybi}"')


# Věty, které o zastaralé podobě mluví proto, aby ji vyvrátily. Bez toho
# by kontrola hlásila právě ta místa, která jsou napsaná správně.
POPIRA = ('Nekontroluje se proti', 'neporovnává', 'v nové podobě není')


def zastarale_fraze():
    for vzor, duvod in ZASTARALE.items():
        for zdroj, jmeno in ((AC, 'academy.ts'), (CFG, 'config.ts')):
            for m in re.finditer(vzor, zdroj):
                zac = zdroj.rfind('\n', 0, m.start()) + 1
                konec = zdroj.find('\n', m.end())
                radka = zdroj[zac:konec if konec > 0 else len(zdroj)]
                if any(x in radka for x in POPIRA):
                    continue
                cislo = zdroj[:m.start()].count('\n') + 1
                chyby.append(f'{jmeno}:{cislo} „{m.group(0)}" — {duvod}')


for f in (kopie_souboru, odkazy_na_lekce, prazdne_moduly, zastarale_fraze):
    f()

if chyby:
    print(f'Nesedí {len(chyby)} věcí:\n')
    for ch in chyby:
        print(f'  ✗ {ch}')
    sys.exit(1)
print('Akademie souhlasí se cvičným projektem.')
