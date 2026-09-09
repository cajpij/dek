# Zadání, ze kterého tenhle projekt vznikl

Tohle je text, který dostal Claude. Je tu schválně i po dokončení projektu —
když se agenda změní, upravuje se nejdřív tenhle popis, a teprve podle něj
soubory ve složce.

---

Postav mi v téhle složce kontrolu došlých faktur.

## K čemu to je
Do schránky fakturace@dek.cz chodí od dodavatelů faktury v PDF. Někdo
je musí otevřít, opsat z nich šest údajů do evidence a u neúplných napsat
dodavateli o doplnění. Tohle má dělat úloha místo mě.

## Co potřebuješ
Konektor na Microsoft 365, který schránku umí **číst i z ní odesílat poštu**.
Když právo odesílat chybí, udělej všechno ostatní a e-mail nechej jen
navržený — napiš mi to a nehledej jinou cestu, jak poštu poslat.

## Postup pro každou novou fakturu
1. Najdi ve schránce e-maily s PDF přílohou, které ještě nejsou ve vstup/.
   Za zpracovanou ber jen fakturu, pro kterou tam leží soubor přesně toho
   jména, pod jakým bys ji ukládal. Další faktura od téhož dodavatele je
   nová faktura.
2. Ulož přílohu do vstup/ jako <datum přijetí>_<dodavatel>.pdf. Do vstup/
   smí jen přibývat — nic tam nepřepisuj, nepřejmenovávej ani nemaž.
3. Vytáhni z PDF šest údajů, jeden po druhém: číslo faktury, dodavatele,
   IČO, číslo objednávky, základ daně (částku bez DPH, ne s DPH) a splatnost.
4. Zapiš je do data/objednavky.xlsx do sešitu pojmenovaného jménem
   dodavatele přesně tak, jak je na faktuře. Když takový sešit není, založ ho.
5. Když je vyplněných všech šest, tady skonči. Nic se neposílá.

## Když chybí jeden nebo dva údaje
6. Do vystup/kontrola-<datum>.xlsx zapiš, co chybí: sešit „Přehled" se stavem
   všech faktur toho dne a sešit dodavatele s chybějícím údajem a s návrhem
   odpovědi podle šablony níž.
7. Ten text pošli jako nový e-mail na adresu, ze které faktura přišla,
   v kopii vedouci-uctarny@dek.cz. Předmět: Doplnění faktury <číslo faktury>.
   Text mezi sešitem a odeslanou poštou neměň — v sešitu musí být přesně to,
   co dodavatel dostal.
8. Datum a čas odeslání zapiš na tři místa: do sešitu dodavatele, do
   „Přehledu" a do sloupce „Žádost odeslána" v evidenci.

## Kdy nedělat nic
- Chybí tři a víc údajů, nebo z PDF nejde přečíst text: neposílej nic, zapiš
  to do vystup/protokol-<datum>.md jako „k ruční kontrole" a řekni mi to.
  Tolik prázdných polí většinou neznamená špatnou fakturu, ale špatně
  přečtené PDF — a to není naše právo dávat za vinu dodavateli.
- Adresa odesílatele není čitelná: stejně tak.
- Údaj na faktuře není nebo je nečitelný: nech pole prázdné. Nic nedomýšlej
  a nic nedopočítávej.

## Co nesmíš nikdy
Schválit fakturu, zadat ji k platbě, zapsat cokoli do účetního systému nebo
poslat zprávu, která se týká platby či schválení. Jediná automatická zpráva,
kterou smíš odeslat, je žádost o doplnění chybějícího údaje na faktuře.

## Šablona e-mailu
```
Předmět: Doplnění faktury <číslo faktury>

Dobrý den, <dodavatel>,

děkujeme za zaslanou fakturu. Při kontrole naším účetním oddělením jsme
nenalezli <chybějící údaj/e>, které potřebujeme mít na faktuře. Prosíme
o doplnění a opětovné zaslání faktury zpět.

S pozdravem,
Účtárna DEK
```
Jméno dodavatele v oslovení ber přesně tak, jak je na faktuře. Když chybí
dva údaje, vyjmenuj oba.

## Až to bude fungovat
Popiš postup a pravidla do CLAUDE.md, README.md, rutina.md a runbook.md,
ať se v tom vyzná i někdo, kdo u toho nebyl.
