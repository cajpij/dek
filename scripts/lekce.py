#!/usr/bin/env python3
"""Vypíše všechny lekce akademie: odkaz, název, shrnutí.

Naplánovaná automatizace (`scripts/rutina-otazky.md`) z toho vybírá, kde
hledat odpověď, aniž by musela číst celý src/academy.ts. Odkaz je přesně
v tom tvaru, v jakém patří do zdrojů odpovědi.

    python3 scripts/lekce.py
    python3 scripts/lekce.py faktury objednávk     # jen lekce, kde se slova vyskytnou
"""

from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

ZDROJ = Path(__file__).resolve().parent.parent / "src" / "academy.ts"


def bez_diakritiky(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if not unicodedata.combining(c))


def lekce_podle_konstanty(text: str) -> dict[str, tuple[str, str, str]]:
    """NAZEV_KONSTANTY -> (slug, titul, shrnutí)"""
    out: dict[str, tuple[str, str, str]] = {}
    for m in re.finditer(r"^const (\w+): Lesson = \{(.*?)^\}", text, re.S | re.M):
        nazev, telo = m.group(1), m.group(2)
        slug = re.search(r"slug:\s*'([^']+)'", telo)
        titul = re.search(r"title:\s*'((?:[^'\\]|\\.)*)'", telo)
        shrnuti = re.search(r"summary:\s*\n?\s*'((?:[^'\\]|\\.)*)'", telo)
        if slug and titul:
            out[nazev] = (
                slug.group(1),
                titul.group(1).replace("\\'", "'"),
                (shrnuti.group(1).replace("\\'", "'") if shrnuti else ""),
            )
    return out


def main() -> None:
    text = ZDROJ.read_text(encoding="utf-8")
    podle_konstanty = lekce_podle_konstanty(text)

    kurzy = re.search(r"export const COURSES: Course\[\] = \[(.*)\n\]", text, re.S)
    if not kurzy:
        sys.exit("nenašel jsem COURSES v src/academy.ts")

    hledane = [bez_diakritiky(a) for a in sys.argv[1:]]
    radky: list[str] = []

    for blok in re.finditer(
        r"slug:\s*'([^']+)',\s*\n\s*title:\s*'((?:[^'\\]|\\.)*)',.*?lessons:\s*\[(.*?)\]",
        kurzy.group(1),
        re.S,
    ):
        kurz_slug, kurz_titul, seznam = blok.group(1), blok.group(2), blok.group(3)
        v_kurzu: list[str] = []
        for nazev in re.findall(r"\b([A-Z][A-Z0-9_]+)\b", seznam):
            if nazev not in podle_konstanty:
                continue
            slug, titul, shrnuti = podle_konstanty[nazev]
            radek = f"#academy/{kurz_slug}/{slug}  |  {titul}  |  {shrnuti}"
            if hledane and not all(s in bez_diakritiky(radek) for s in hledane):
                continue
            v_kurzu.append(radek)
        if v_kurzu:  # při filtrování nemá smysl ukazovat prázdný kurz
            radky.append(f"\n## {kurz_titul}  ({kurz_slug})")
            radky += v_kurzu

    print("\n".join(radky).strip())


if __name__ == "__main__":
    main()
