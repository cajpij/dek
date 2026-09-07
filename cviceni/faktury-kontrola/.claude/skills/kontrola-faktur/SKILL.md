---
name: kontrola-faktur
description: Projde faktury v PDF ve složce vstup/, vytáhne z nich povinné údaje
  a porovná je se seznamem schválených objednávek. Výsledkem je kontrolní tabulka
  a protokol ve vystup/. Použij, když přibyly nové faktury, když se má udělat ranní
  kontrola faktur, nebo když se ptám, co je s fakturami k vyřízení.
---

# Kontrola faktur

## Kdy to spustit
Když ve vstup/ jsou faktury, pro které ještě není řádek v poslední kontrolní
tabulce ve vystup/. Když nic nového nepřibylo, nic nedělej a napiš to.

## Postup

1. Najdi ve vystup/ nejnovější kontrola-*.xlsx a zapamatuj si, které soubory
   už v ní mají řádek.
2. Projdi PDF ve vstup/, která tam ještě nejsou, a z každé vytáhni:
   soubor, číslo faktury, dodavatele, IČO, číslo objednávky, základ daně
   (částku bez DPH) a datum splatnosti.
3. Co ve faktuře není, nech prázdné a název toho údaje připiš do sloupce CHYBÍ.
   Nic nedomýšlej a nic nedopočítávej.
4. Ke každé faktuře najdi v data/objednavky.xlsx řádek se stejným číslem
   objednávky a doplň sloupec SEDÍ:
   - ano — základ daně se shoduje se schválenou částkou
   - ne — číslo objednávky sedí, ale částka ne
   - nenalezeno — faktura číslo objednávky nemá, nebo takové číslo v seznamu není
5. Ulož vystup/kontrola-<RRRR-MM-DD>.xlsx. Řádky, kde něco chybí, podbarvi
   žlutě; řádky s ne nebo nenalezeno červeně. První řádek zmraz.
6. Napiš vystup/protokol-<RRRR-MM-DD>.md: kolik faktur zpracováno, kolik má
   chybějící údaj, u kolika částka nesedí a u kolika objednávka nebyla nalezena.
   Pod to seznam konkrétních nálezů, jeden řádek na fakturu.

## Kdy se zastavit a nic neposílat
- ve vstup/ je faktura, ze které se nedá přečíst text (sken bez OCR) — napiš to a pokračuj u ostatních
- data/objednavky.xlsx nejde otevřít nebo nemá čekané sloupce
- nesouladů je víc než tři — to obvykle neznamená pět špatných faktur, ale změnu na vstupu

## Co do skillu nepatří
Rozhodnutí, jestli fakturu zaplatit. Skill připraví podklad, schvaluje člověk.
