#!/bin/bash
# Zábrana nad složkou vstup/: smí do ní přibýt nová PDF faktura, ale nic
# existujícího se nesmí přepsat, přejmenovat ani smazat. Originály jsou důkaz.
#
# Claude Code pošle hooku na vstup JSON s popisem toho, co se chystá udělat.
# Vytáhneme z něj jméno nástroje a cestu k souboru. Schválně bez nástroje jq
# — ten na Macu ani na Windows standardně není a hook, který se nespustí,
# nic nechrání.
VSTUP_JSON=$(cat)
NASTROJ=$(printf '%s' "$VSTUP_JSON" | sed -n 's/.*"tool_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
CESTA=$(printf '%s' "$VSTUP_JSON" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

case "$CESTA" in
  */vstup/*)
    if [ "$NASTROJ" = "Edit" ]; then
      echo "Úprava souboru ve vstup/ je zakázaná — leží tam originály faktur, nic se v nich nesmí měnit." >&2
      exit 2
    fi
    if [ -e "$CESTA" ]; then
      echo "Přepsání souboru ve vstup/ je zakázané — tam smí jen přibýt nová faktura, ne se přepsat stará." >&2
      exit 2
    fi
    case "$CESTA" in
      *.pdf) exit 0 ;;
      *)
        echo "Do vstup/ smí přibýt jen nová PDF faktura." >&2
        exit 2
        ;;
    esac
    ;;
esac
exit 0
