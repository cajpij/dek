# Kontrola faktur — cvičný projekt

Postavený podle lekce **Od e-mailu k platbě** z DEK Academy. Sleduje
schránku s fakturami, vytáhne z PDF šest povinných údajů a eviduje je podle
dodavatele. Když něco chybí, sám pošle dodavateli e-mail s žádostí o
doplnění. Nic neschvaluje, nic neplatí. Všechna data jsou vymyšlená.

## Co v tom je

```
faktury-kontrola/
├── CLAUDE.md                 pravidla a slovník, čtou se při každém spuštění
├── vstup/                    5 vzorových faktur v PDF — sem se jen čte
├── data/objednavky.xlsx      evidence přijatých faktur, sešit pro každého dodavatele
├── vystup/                   vzorový výstup prvního běhu: tabulka + protokol
├── .claude/
│   ├── skills/kontrola-faktur/SKILL.md    postup, který se spustí jednou větou
│   ├── hooks/chran-vstup.sh              zábrana: do vstup/ smí přibýt jen nová PDF
│   └── settings.json                     zapojení hooku
├── rutina.md                 co vyplnit v naplánované úloze a jaký konektor potřebuje
└── runbook.md                co dělat, když to spadne
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
všechny faktury mají řádek. To je správně — úloha, která běží každých
15 minut, musí umět nedělat nic.

## Jak to rozjet

1. Otevři tuhle složku v aplikaci Claude: záložka **Code**, prostředí
   **Local**, **Select folder**, potvrď důvěru.
2. Napiš: `Postupuj podle skillu kontrola-faktur.`
3. Porovnej, co vzniklo, se soubory, které ve `vystup/` už jsou.
4. Teprve pak, chceš-li to napojit na skutečnou schránku, nastav
   naplánovanou úlohu podle `rutina.md` — tam je i to, co si zařídit u
   správce Microsoft 365, aby úloha mohla e-mail fakticky odeslat.

## Jak to přepnout na svoje faktury

1. Přesuň celou složku do nasyncované knihovny nebo si nastav naplánovanou
   úlohu nad ní — projekt je obyčejná složka, nic jiného se měnit nemusí.
2. `vstup/` a `data/objednavky.xlsx` vyprázdni, nech je naplnit skutečnými
   fakturami.
3. Uprav v `CLAUDE.md`, `rutina.md` a ve skillu adresu schránky a kopii, kam
   se posílá žádost o doplnění — jsou na několika místech, projdi je všechny.
4. **Prvních deset faktur si projdi řádek po řádku**, než tomu začneš věřit.
   Co Claude přečetl špatně, dopiš do `CLAUDE.md` nebo do skillu.
