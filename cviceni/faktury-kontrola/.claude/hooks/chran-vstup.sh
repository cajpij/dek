#!/bin/bash
# Zábrana: do složky vstup/ se nesmí zapisovat. Originály faktur jsou důkaz.
#
# Claude Code pošle hooku na vstup JSON s popisem toho, co se chystá udělat.
# Vytáhneme z něj cestu k souboru. Schválně bez nástroje jq — ten na Macu
# ani na Windows standardně není a hook, který se nespustí, nic nechrání.
VSTUP_JSON=$(cat)
CESTA=$(printf '%s' "$VSTUP_JSON" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

case "$CESTA" in
  */vstup/*)
    echo "Zápis do vstup/ je zakázaný — leží tam originály faktur. Ulož to do vystup/." >&2
    exit 2
    ;;
esac
exit 0
