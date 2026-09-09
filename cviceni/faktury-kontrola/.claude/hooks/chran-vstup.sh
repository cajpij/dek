#!/bin/bash
# Zábrana nad složkou vstup/: Claude do ní nesmí sám nic zapsat, přepsat,
# přejmenovat ani smazat. Originály jsou důkaz.
#
# Přílohy faktur sem od 2026-09 ukládá Outlook pravidlo + Power Automate tok
# mimo Claude Code (viz rutina.md) — soubor se objeví přes synchronizaci
# OneDrive, ne přes nástroj Write/Edit. Proto už tenhle hook nikoho
# nevýjimkuje ani pro nové PDF: jediná cesta, jak má do vstup/ něco přibýt,
# je ta automatizace nebo člověk ručně. Claude smí vstup/ jen číst.
#
# Claude Code pošle hooku na vstup JSON s popisem toho, co se chystá udělat.
# Vytáhneme z něj jméno nástroje a cestu k souboru. Schválně bez nástroje jq
# — ten na Macu ani na Windows standardně není a hook, který se nespustí,
# nic nechrání.
VSTUP_JSON=$(cat)
CESTA=$(printf '%s' "$VSTUP_JSON" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

case "$CESTA" in
  */vstup/*)
    echo "Zápis do vstup/ z Claude Code je zakázaný — přílohy sem ukládá jen Outlook/Power Automate tok (nebo člověk ručně), nikdy skill sám. Originály jsou důkaz." >&2
    exit 2
    ;;
esac
exit 0
