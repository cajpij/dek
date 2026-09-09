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
    # druhý příklad v lekci Co je automatizace — podklady, ze kterých vznikl
    'prepis-ukazka.txt': KOREN / 'cviceni/akcni-regal/prepis-ukazka.txt',
    'user-flow.md': KOREN / 'cviceni/akcni-regal/user-flow.md',
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
    r'ulož je tam|uloží do vstup|si do vstup/ sama uloží': 'do vstup/ Claude nezapisuje, hook mu to zakazuje',
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


def velikost_zipu():
    """Odkaz na stažení nese velikost v kB — po přebalení zipu zastará."""
    zip_ = KOREN / 'public/faktury-kontrola.zip'
    if not zip_.exists():
        chyby.append('public/faktury-kontrola.zip chybí')
        return
    skutecne = zip_.stat().st_size // 1024
    for m in re.finditer(r"faktury-kontrola\.zip \((\d+) kB\)", AC):
        if abs(int(m.group(1)) - skutecne) > 2:
            chyby.append(f'odkaz slibuje {m.group(1)} kB, zip má {skutecne} kB')


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


def bloky_programu():
    """Bloky agendy v pořadí — název a lekce, na které blok odkazuje."""
    zac = CFG.index('  agenda: [\n')
    kon = CFG.index('\n  ],\n', zac)
    radky = CFG[zac:kon].split('\n')
    hranice, hloubka, start = [], 0, None
    for i, r in enumerate(radky):
        if r == '    {':
            if hloubka == 0:
                start = i
            hloubka += 1
        elif r in ('    },', '    }'):
            hloubka -= 1
            if hloubka == 0:
                hranice.append((start, i))
    out = []
    for a, b in hranice:
        blok = '\n'.join(radky[a:b + 1])
        nazev = re.search(r"title: '([^']+)'", blok).group(1)
        out.append((nazev, re.findall(r"'([a-z-]+/[a-z0-9-]+)'", blok)))
    return out


def program_vs_lekce():
    """Program dne musí projít lekce druhého kurzu ve stejném pořadí jako akademie.

    Rozešlo se to už dvakrát: pořadí lekcí se změnilo a program zůstal, jak byl.
    První kurz se nekontroluje — nastavení je v sále schválně hned na začátku,
    i když v akademii leží až za orientací.
    """
    poradi, i = {}, 0
    for kurz in re.finditer(r"    slug: '([a-z-]+)',[\s\S]*?lessons: \[([^\]]*)\]", AC):
        for v in re.findall(r'\b(L\w+|LESSON_\w+)\b', kurz.group(2)):
            poradi[v] = (kurz.group(1), i)
            i += 1
    lekce = {}
    for m in re.finditer(r"const (\w+): Lesson = \{\n  slug: '([^']+)',[\s\S]{0,1200}?track: '([^']+)'", AC):
        if m.group(1) in poradi:
            kurz, poz = poradi[m.group(1)]
            lekce[f'{kurz}/{m.group(2)}'] = (poz, m.group(3), kurz)

    bloky = bloky_programu()
    odkazane = {s for _, ss in bloky for s in ss}
    for s, (_, stopa, _) in lekce.items():
        if stopa == 'v sále' and s not in odkazane:
            chyby.append(f'lekce {s} je „v sále", ale žádný blok programu na ni neodkazuje')

    # pořadí kontroluju jen u druhého kurzu — tam jde o ten oblouk
    videno = []
    for nazev, odkazy in bloky:
        for s in odkazy:
            if s in lekce and lekce[s][2] == 'od-mapy-k-automatu':
                if s not in [x[0] for x in videno]:
                    videno.append((s, lekce[s][0], nazev))
    for a, b in zip(videno, videno[1:]):
        if a[1] > b[1]:
            chyby.append(f'program má „{b[2]}" ({b[0]}) až po „{a[2]}" ({a[0]}), v lekcích je to obráceně')

# Věty, které o zastaralé podobě mluví proto, aby ji vyvrátily. Bez toho
# by kontrola hlásila právě ta místa, která jsou napsaná správně.
POPIRA = ('ekontroluje', 'neporovnává', 'v nové podobě není')


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


for f in (kopie_souboru, odkazy_na_lekce, velikost_zipu, prazdne_moduly, program_vs_lekce, zastarale_fraze):
    f()

if chyby:
    print(f'Nesedí {len(chyby)} věcí:\n')
    for ch in chyby:
        print(f'  ✗ {ch}')
    sys.exit(1)
print('Akademie souhlasí se cvičným projektem.')
