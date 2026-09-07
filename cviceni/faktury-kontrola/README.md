# Kontrola faktur — cvičný projekt

Postavený podle lekce **Celý příklad: od magazínu po mail produkťákům**,
jen na jiné agendě: místo rozpadu magazínu se kontrolují faktury.
Všechna data jsou vymyšlená.

## Co v tom je

```
faktury-kontrola/
├── CLAUDE.md                 pravidla a slovník, čtou se při každém spuštění
├── vstup/                    5 vzorových faktur v PDF — sem se jen čte
├── data/objednavky.xlsx      seznam schválených objednávek, proti kterému se kontroluje
├── vystup/                   vzorový výstup prvního běhu: tabulka + protokol
├── .claude/
│   ├── skills/kontrola-faktur/SKILL.md    postup, který se spustí jednou větou
│   ├── hooks/chran-vstup.sh              zábrana: do vstup/ se nesmí zapisovat
│   └── settings.json                     zapojení hooku
├── rutina.md                 co vyplnit v naplánované úloze na 7:00
└── runbook.md                co dělat, když to spadne
```

## Co je ve vzorových fakturách schválně špatně

Aby bylo na čem ukázat, že kontrola něco najde:

| Faktura | Co s ní je |
| --- | --- |
| Stavebniny Morava | v pořádku |
| Nářadí Profi | v pořádku |
| Elektro Dvořák | **chybí číslo objednávky** |
| VTS Technik | **částka nesedí** — 33 100 Kč proti schváleným 31 900 Kč |
| Barvy Piekarová | **objednávka OBJ-9999-0001 není v seznamu schválených** |

Vzorový výstup v `vystup/` přesně tyhle tři nálezy obsahuje. Když si to
pustíš znovu, musí vyjít totéž — a to je zároveň způsob, jak si ověřit,
že projekt funguje.

## Jak to rozjet

1. Otevři tuhle složku v aplikaci Claude: záložka **Code**, prostředí **Local**,
   **Select folder**, potvrď důvěru.
2. Napiš: `Postupuj podle skillu kontrola-faktur.`
3. Porovnej, co vzniklo, se soubory, které ve `vystup/` už jsou.
4. Teprve pak nastav naplánovanou úlohu podle `rutina.md`.

## Jak to překlopit na skutečné faktury

1. Přesuň celou složku do nasyncované knihovny ze SharePointu — projekt je
   obyčejná složka, takže se nic jiného měnit nemusí.
2. V naplánované úloze přepiš pole **Folder** na nové umístění.
3. Do `data/objednavky.xlsx` dej skutečný export objednávek.
4. `vstup/` vyprázdni a nech do ní chodit opravdové faktury.
5. **Prvních deset faktur si projdi řádek po řádku**, než tomu začneš věřit.
   Co Claude přečetl špatně, dopiš do CLAUDE.md nebo do skillu.
