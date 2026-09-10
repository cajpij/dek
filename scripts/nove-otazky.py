#!/usr/bin/env python3
"""Vypíše otázky z nástěnky, které ještě nemají odpověď.

Bere jen kořeny vláken (ne odpovědi) od někoho jiného než lektora a
vynechá ty, které už jsou v src/odpovedi.ts. Výstup je JSON na stdout,
ať s ním umí pracovat naplánovaná automatizace bez dalšího parsování.

    python3 scripts/nove-otazky.py

Když nic nového není, vypíše prázdné pole a skončí nulou — to je běžný
stav, ne chyba.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

KOREN = Path(__file__).resolve().parent.parent

# Lektor si odpovídá sám — jeho příspěvky se nezpracovávají.
LEKTOR = "Martin"

SLOUPCE = "id,vlakno,jmeno,text,lekce,cas"


def z_nastenky() -> tuple[str, str]:
    """Adresa a klíč se čtou ze zdrojáku, ať nejsou na dvou místech."""
    zdroj = (KOREN / "src" / "lib" / "nastenka.ts").read_text(encoding="utf-8")
    adresa = re.search(r"ADRESA\s*=\s*'([^']+)'", zdroj)
    klic = re.search(r"KLIC\s*=\s*'([^']+)'", zdroj)
    if not adresa or not klic:
        sys.exit("nenašel jsem ADRESA/KLIC v src/lib/nastenka.ts")
    return adresa.group(1), klic.group(1)


def zodpovezene() -> set[str]:
    zdroj = (KOREN / "src" / "odpovedi.ts").read_text(encoding="utf-8")
    return set(re.findall(r"^\s*id:\s*'([^']+)'", zdroj, re.MULTILINE))


def preskocene() -> set[str]:
    """Otázky, u kterých automatizace usoudila, že se nezodpovídají."""
    soubor = KOREN / "scripts" / "preskocene.txt"
    if not soubor.exists():
        return set()
    ids = set()
    for radek in soubor.read_text(encoding="utf-8").splitlines():
        radek = radek.strip()
        if radek and not radek.startswith("#"):
            ids.add(radek.split()[0])
    return ids


def main() -> None:
    adresa, klic = z_nastenky()
    url = f"{adresa}/rest/v1/zpravy?select={SLOUPCE}&order=cas.asc"
    zadost = urllib.request.Request(url, headers={"apikey": klic})
    try:
        with urllib.request.urlopen(zadost, timeout=20) as r:
            zpravy = json.load(r)
    except urllib.error.URLError as e:
        sys.exit(f"nástěnka nedostupná: {e}")

    hotove = zodpovezene() | preskocene()
    nove = [
        z
        for z in zpravy
        if not z.get("vlakno") and z.get("jmeno") != LEKTOR and z["id"] not in hotove
    ]

    json.dump(nove, sys.stdout, ensure_ascii=False, indent=2)
    print()


if __name__ == "__main__":
    main()
