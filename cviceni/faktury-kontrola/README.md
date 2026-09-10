# Kontrola faktur — cvičný projekt

Postavený podle lekce **Cvičný projekt: kontrola faktur** z DEK Academy.
Zpracovává PDF faktury, které přibyly ve `vstup/`, vytáhne z nich šest
povinných údajů a eviduje je podle dodavatele. Když něco chybí, sám pošle
dodavateli e-mail s žádostí o doplnění. Nic neschvaluje, nic neplatí.
Všechna data jsou vymyšlená.

Do `vstup/` dává soubory člověk ručně, ne Claude — M365 konektor, který
Claude používá, umí e-mail přečíst jako text, ale ne stáhnout přílohu jako
soubor. Hlavní cesta ho proto nepotřebuje: automatizace čte faktury přímo
z Doručené pošty. Víc v `CLAUDE.md`, sekce „Dvě cesty…".

## Co to udělá, až to pustíš

Otevři složku v Claude Code a napiš `Postupuj podle skillu kontrola-faktur.`
Poprvé se jede nad tím, co už leží ve `vstup/` — pět vzorových faktur.
Mělo by se stát tohle:

1. Projde pět PDF ve `vstup/`. Evidence je zatím prázdná, takže je vezme
   všechny.
2. Z každé faktury vytáhne šest údajů a založí v `data/objednavky.xlsx`
   sešit pojmenovaný jménem dodavatele.
3. Čtyři faktury jsou kompletní a tím pro ně končí — nic se neposílá.
4. U **Elektro Dvořák** chybí číslo objednávky, takže vznikne
   `vystup/kontrola-<dnešní datum>.xlsx` s návrhem odpovědi.
5. E-mail se **neodešle** — tahle vzorová faktura leží ve `vstup/` od
   začátku, nepřišla e-mailem, takže není komu psát. Do sloupce „Žádost
   odeslána" se zapíše „adresa dodavatele nenalezena, k ruční kontrole".
   To je správný konec, ne chyba — odesílá se jen z hlavní cesty, tedy
   u faktury, která doopravdy přišla do Doručené pošty.
6. Vznikne `vystup/protokol-<dnešní datum>.md` se shrnutím běhu.

Porovnej to se soubory, které ve `vystup/` už leží — musí vyjít tentýž
jeden nález. Když to pustíš podruhé, neudělá nic: všechny faktury už mají
řádek. To je taky správně — automatizace, která běží každých 15 minut, musí umět
nedělat nic.

## Co v tom je

```
faktury-kontrola/
├── zadani.md                  ← text, ze kterého celá složka vznikla (+ revize)
├── CLAUDE.md                  ← pravidla a slovník, čtou se pokaždé
├── vstup/                     ← 5 vzorových faktur v PDF, sem se jen čte
├── data/objednavky.xlsx       ← evidence faktur, sešit pro každého dodavatele
├── vystup/                    ← referenční výstup: tabulka + protokol
├── .claude/skills/kontrola-faktur/SKILL.md
├── .claude/hooks/chran-vstup.sh   ← zakazuje Claude Code jakýkoli zápis do vstup/
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
Elektro Dvořák s navrženým textem žádosti o doplnění. Protože tahle vzorová
faktura nepřišla e-mailem, není k ní adresa — e-mail se tedy nepošle ani
s připojeným konektorem a do sloupce „Žádost odeslána" se zapíše „adresa
dodavatele nenalezena, k ruční kontrole".

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
   naplánovanou automatizaci v Claude podle `rutina.md`. Tam je i to, co si
   zařídit u správce Microsoft 365, aby automatizace mohla e-mail fakticky
   odeslat.

## Jak to přepnout na svoje faktury

1. Přesuň celou složku do nasyncované knihovny nebo si nad ní rovnou
   nastav naplánovanou automatizaci — projekt je obyčejná složka, nic
   jiného se měnit nemusí.
2. `vstup/` a `data/objednavky.xlsx` vyprázdni (v xlsx nech jen hlavičky)
   a nech je naplnit skutečnými fakturami.
3. Přepiš adresy na svoje. Sledovaná schránka `fakturace@dek.cz` (a
   zároveň adresa, v jejíž kopii chodí každá žádost o doplnění) je na
   **deseti místech v pěti souborech**: `CLAUDE.md` (2×), `rutina.md` (2×),
   `SKILL.md` (2×), `runbook.md` (2×) a `zadani.md` (2×). Podpis „Účtárna
   DEK" je navíc v `zadani.md` a `SKILL.md`. Nehledej je ručně — řekni
   Claudovi:

   > V celé téhle složce nahraď fakturace@dek.cz mojí schránkou.
   > Podpis „Účtárna DEK" změň na moje jméno. Vypiš, co jsi kde změnil.
4. **Prvních deset faktur si projdi řádek po řádku**, než tomu začneš věřit.
   Co Claude přečetl špatně, dopiš do `CLAUDE.md` nebo do skillu.
