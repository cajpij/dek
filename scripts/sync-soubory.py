#!/usr/bin/env python3
"""Přepíše vložené kopie souborů v lekcích podle cviceni/faktury-kontrola.

    python3 scripts/sync-soubory.py

Protějšek ke kontrola-lekci.py: ta ohlásí, že se kopie rozešla, tahle ji
srovná. Mění jen obsah bloků `kind: 'soubor'` — popisky ani text lekcí ne.
"""
import re, sys, pathlib

KOREN = pathlib.Path(__file__).resolve().parent.parent
CESTA = KOREN / 'src/academy.ts'
Z = KOREN / 'cviceni/faktury-kontrola'

SOUBORY = {
    'zadani.md': Z / 'zadani.md',
    'CLAUDE.md': Z / 'CLAUDE.md',
    'SKILL.md': Z / '.claude/skills/kontrola-faktur/SKILL.md',
    'chran-vstup.sh': Z / '.claude/hooks/chran-vstup.sh',
    'rutina.md': Z / 'rutina.md',
    'runbook.md': Z / 'runbook.md',
    'prepis-ukazka.txt': KOREN / 'cviceni/akcni-regal/prepis-ukazka.txt',
    'user-flow.md': KOREN / 'cviceni/akcni-regal/user-flow.md',
}


def zaescapuj(s):
    """Do template literálu v TS: zpětné lomítko, backtick a ${ chtějí escape."""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def konec_literalu(text, i):
    """Index uzavíracího backticku od pozice i, s přeskočením escapovaných."""
    j = i
    while True:
        j = text.index('`', j)
        if text[j - 1] != '\\':
            return j
        j += 1


ac = CESTA.read_text()
zmeneno = []
posun = 0
for m in list(re.finditer(r"kind: 'soubor',", ac)):
    usek = ac[m.start() + posun:]
    jm = re.search(r"nazev: '([^']+)'", usek).group(1)
    cesta = SOUBORY.get(jm)
    if not cesta:
        print(f'{jm}: nevím, ze kterého souboru brát', file=sys.stderr)
        continue
    i = usek.index('obsah: `') + len('obsah: `')
    j = konec_literalu(usek, i)
    nove = zaescapuj(cesta.read_text().rstrip('\n'))
    if usek[i:j] == nove:
        continue
    zac = m.start() + posun
    ac = ac[:zac + i] + nove + ac[zac + j:]
    posun += len(nove) - (j - i)
    zmeneno.append(jm)

if zmeneno:
    CESTA.write_text(ac)
    print('srovnáno:', ', '.join(zmeneno))
else:
    print('kopie sedí, nebylo co měnit')
