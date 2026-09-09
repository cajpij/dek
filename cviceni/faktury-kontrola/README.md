# Kontrola faktur — cvičný projekt

Postavený podle lekce **Cvičný projekt: kontrola faktur** z DEK Academy.
Sleduje schránku s fakturami, vytáhne z PDF šest povinných údajů a eviduje
je podle dodavatele. Když něco chybí, sám pošle dodavateli e-mail s žádostí
o doplnění. Nic neschvaluje, nic neplatí. Všechna data jsou vymyšlená.

## Co to udělá, až to pustíš

Otevři složku v Claude Code a napiš `Postupuj podle skillu kontrola-faktur.`
Konektor na schránku k tomu není potřeba — poprvé se jede nad tím, co leží
ve `vstup/`. Mělo by se stát tohle:

1. Projde pět PDF ve `vstup/`. Evidence je zatím prázdná, takže je vezme
   všechny.
2. Z každé faktury vytáhne šest údajů a založí v `data/objednavky.xlsx`
   sešit pojmenovaný jménem dodavatele.
3. Čtyři faktury jsou kompletní a tím pro ně končí — nic se neposílá.
4. U **Elektro Dvořák** chybí číslo objednávky, takže vznikne
   `vystup/kontrola-<dnešní datum>.xlsx` s návrhem odpovědi.
5. E-mail se **neodešle** — bez konektoru nemá odkud. Do sloupce „Žádost
   odeslána" se zapíše „připraveno, čeká na konektor". To je správný konec,
   ne chyba.
6. Vznikne `vystup/protokol-<dnešní datum>.md` se shrnutím běhu.

Porovnej to se soubory, které ve `vystup/` už leží — musí vyjít tentýž
jeden nález. Když to pustíš podruhé, neudělá nic: všechny faktury už mají
řádek. To je taky správně — automatizace, která běží každých 15 minut, musí umět
nedělat nic.

## Co v tom je

```
faktury-kontrola/
├── zadani.md                  ← text, ze kterého celá složka vznikla
├── CLAUDE.md                  ← pravidla a slovník, čtou se pokaždé
├── vstup/                     ← 5 vzorových faktur v PDF, sem se jen čte
├── data/objednavky.xlsx       ← evidence faktur, sešit pro každého dodavatele
├── vystup/                    ← referenční výstup: tabulka + protokol
├── .claude/skills/kontrola-faktur/SKILL.md
├── .claude/hooks/chran-vstup.sh
├── .claude/settings.json
├── rutina.md                  ← co vyplnit v naplánované automatizaci
└── runbook.md                 ← co dělat, když to spadne
```

## Co je na vzorové faktuře schválně špatně

Aby bylo na čem ukázat, že kontrola něco najde — podle nových pravidel se
kontroluje jen úplnost šesti údajů, ne shoda s objednávkou:

| Faktura | Kompletní | Co (ne)chybí |
| --- | --- | --- |
| Stavebniny Morava | ano | — |
| Nářadí Profi | ano | — |
| Elektro Dvořák | **ne** | chybí číslo objednávky |
| VTS Technik | ano | — |
| Barvy Piekarová | ano | — |

Vzorový výstup v `vystup/` přesně tenhle jeden nález obsahuje: sešit pro
Elektro Dvořák s navrženým textem žádosti o doplnění. Bez připojeného
konektoru se e-mail neodešle — text se jen navrhne a do sloupce „Žádost
odeslána" se zapíše „připraveno, čeká na konektor".

**`data/objednavky.xlsx` je zatím prázdný** — má jen hlavičky sloupců, aby
bylo předem vidět, co se kam bude zapisovat. Naplní ho až první běh: každá
faktura dostane řádek v sešitu svého dodavatele. Právě proto se dá porovnat,
co ti vyšlo, s referenčním výstupem ve `vystup/` — a je to zároveň způsob,
jak si ověřit, že projekt funguje. Když ho pustíš podruhé, neudělá už nic:
všechny faktury mají řádek. To je správně — automatizace, která běží každých
15 minut, musí umět nedělat nic.

## Jak to rozjet

1. Otevři tuhle složku v aplikaci Claude: záložka **Code**, prostředí
   **Local**, **Select folder**, potvrď důvěru.
2. Napiš: `Postupuj podle skillu kontrola-faktur.`
3. Porovnej, co vzniklo, se soubory, které ve `vystup/` už jsou.
4. Teprve pak, chceš-li to napojit na skutečnou schránku, nastav
   naplánovanou automatizaci podle `rutina.md` — tam je i to, co si zařídit u
   správce Microsoft 365, aby automatizace mohla e-mail fakticky odeslat.

## Jak to přepnout na svoje faktury

1. Přesuň celou složku do nasyncované knihovny nebo si nastav naplánovanou
   automatizaci nad ní — projekt je obyčejná složka, nic jiného se měnit nemusí.
2. `vstup/` a `data/objednavky.xlsx` vyprázdni, nech je naplnit skutečnými
   fakturami.
3. Přepiš adresy na svoje. Ve složce jsou na **třinácti místech v pěti
   souborech**: `CLAUDE.md` (3×), `rutina.md` (3×), `SKILL.md` (3×),
   `runbook.md` (2×) a `zadani.md` (2×). Nehledej je ručně — řekni Claudovi:

   > V celé téhle složce nahraď fakturace@dek.cz mojí schránkou
   > a vedouci-uctarny@dek.cz adresou, kam chci kopii. Podpis
   > „Účtárna DEK" změň na moje jméno. Vypiš, co jsi kde změnil.
4. **Prvních deset faktur si projdi řádek po řádku**, než tomu začneš věřit.
   Co Claude přečetl špatně, dopiš do `CLAUDE.md` nebo do skillu.
