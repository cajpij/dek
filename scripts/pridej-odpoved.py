#!/usr/bin/env python3
"""Zapíše jednu odpověď do src/odpovedi.ts.

Automatizace nemá editovat TypeScript ručně — dostane JSON a tenhle skript
z něj udělá záznam, správně uvozený a na správné místo. Když už otázka
odpověď má, neudělá nic a řekne to.

    echo '{...}' | python3 scripts/pridej-odpoved.py

Čekaný JSON:

    {
      "id": "<id zprávy z nástěnky>",
      "jmeno": "Marie",
      "otazka": "...",
      "cas": "2026-09-10T13:03:00+00:00",
      "lekce": "Cvičný projekt: kontrola faktur",   // nepovinné
      "odpoved": "Odstavce\\n\\noddělené prázdným řádkem.",
      "zdroje": [{"label": "Kolik to stojí", "href": "#academy/claude-a-firemni-data/kolik-to-stoji"}]
    }

`zdroje` smí být prázdné pole — pak stránka u odpovědi napíše, že v lekcích
tohle není a patří to na lektora. Prázdné zdroje jsou správná odpověď,
vymyšlený odkaz ne.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SOUBOR = Path(__file__).resolve().parent.parent / "src" / "odpovedi.ts"

POVINNE = ("id", "jmeno", "otazka", "cas", "odpoved", "zdroje")


def ts(hodnota: str) -> str:
    """Řetězec do TypeScriptu v jednoduchých uvozovkách."""
    return "'" + hodnota.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n") + "'"


def main() -> None:
    try:
        d = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        sys.exit(f"nečitelný JSON na vstupu: {e}")

    chybi = [k for k in POVINNE if k not in d]
    if chybi:
        sys.exit(f"chybí povinné klíče: {', '.join(chybi)}")
    if not isinstance(d["zdroje"], list):
        sys.exit("zdroje musí být pole (klidně prázdné)")
    for z in d["zdroje"]:
        if not z.get("href", "").startswith("#academy/"):
            sys.exit(f"zdroj musí mířit do akademie (#academy/…), ne na {z.get('href')!r}")

    zdroj = SOUBOR.read_text(encoding="utf-8")
    if f"id: {ts(d['id'])}" in zdroj:
        print(f"otázka {d['id']} už odpověď má — nic se nezapisuje")
        return

    zdroje = ", ".join(
        "{ label: %s, href: %s }" % (ts(z["label"]), ts(z["href"])) for z in d["zdroje"]
    )

    radky = [
        "  {",
        f"    id: {ts(d['id'])},",
        f"    jmeno: {ts(d['jmeno'])},",
        f"    otazka: {ts(d['otazka'])},",
        f"    cas: {ts(d['cas'])},",
        f"    zodpovezeno: {ts(datetime.now(timezone.utc).isoformat(timespec='seconds'))},",
    ]
    if d.get("lekce"):
        radky.append(f"    lekce: {ts(d['lekce'])},")
    radky += [
        f"    odpoved: {ts(d['odpoved'])},",
        f"    zdroje: [{zdroje}],",
        "  },",
    ]
    zaznam = "\n".join(radky) + "\n"

    konec = "export const ODPOVEDI: Odpoved[] = ["
    if konec + "]" in zdroj:  # první zápis do prázdného pole
        novy = zdroj.replace(konec + "]", konec + "\n" + zaznam + "]")
    elif konec in zdroj:
        novy = zdroj.replace(konec + "\n", konec + "\n" + zaznam)
    else:
        sys.exit("v src/odpovedi.ts nenacházím pole ODPOVEDI")

    SOUBOR.write_text(novy, encoding="utf-8")
    print(f"zapsáno: {d['jmeno']} — {d['otazka'][:60]}")


if __name__ == "__main__":
    main()
