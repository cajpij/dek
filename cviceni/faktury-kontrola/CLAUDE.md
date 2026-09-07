# Kontrola faktur

Cvičný projekt z workshopu DEK Academy. Každé ráno projde faktury, které
přes noc přibyly ve vstup/, srovná je se seznamem schválených objednávek
a připraví podklad ke schválení. Neschvaluje a neplatí — to dělá člověk.

## Slovník
- faktura = PDF od dodavatele ve složce vstup/
- objednávka = řádek v data/objednavky.xlsx, na který se faktura odkazuje
- základ daně = částka bez DPH; kontroluje se právě ta, ne částka s DPH
- protokol = krátký soubor na konci běhu; z něj poznám výsledek bez otevírání faktur

## Kde jsou data
- vstup/ — faktury v PDF. Sem se jen čte.
- data/objednavky.xlsx — schválené objednávky: číslo, dodavatel, částka, středisko
- vystup/ — kontrolní tabulka a protokol, jeden pár souborů na každý běh

## Pravidla
- Do vstup/ nikdy nezapisuj, nic v ní nepřejmenovávej ani nemaž. Originály jsou důkaz.
- Když údaj ve faktuře není, nech pole prázdné a napiš ho do sloupce CHYBÍ. Nedomýšlej si.
- Prázdno není nula. Chybějící částku nikdy nenahrazuj nulou ani odhadem z jiného pole.
- Porovnávej vždy základ daně proti schválené částce, ne celkovou částku s DPH.
- Názvy výstupů: kontrola-<RRRR-MM-DD>.xlsx a protokol-<RRRR-MM-DD>.md
- Faktury neschvaluj, neposílej do účetnictví a nezadávej k platbě. Ani když je všechno v pořádku.
- Když je nesouladů víc než tři, nic nerozesílej a napiš mi to.
