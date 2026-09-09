# Kontrola faktur

Cvičný projekt z workshopu DEK Academy. Sleduje schránku fakturace@dek.cz.
Když přijde e-mail s fakturou v PDF, uloží ji, vytáhne z ní šest povinných
údajů a zapíše je do evidence podle dodavatele. Když některý údaj chybí, sám
pošle dodavateli e-mail s žádostí o doplnění.

**Posílá poštu bez potvrzení — ale jenom žádost o doplnění chybějícího údaje,
nikdy nic k platbě.** Neschvaluje faktury, nezadává je k platbě a nepíše nic
do účetního systému. To zůstává na člověku.

## Slovník
- faktura = PDF příloha e-mailu, který přijde do schránky fakturace@dek.cz
- šest povinných údajů = číslo faktury, dodavatel, IČO dodavatele, číslo
  objednávky, základ daně (částka bez DPH), splatnost
- IČO = vždycky IČO dodavatele. IČO odběratele (DEK a.s.) je na faktuře taky
  a nepočítá se — když je u dodavatele jen jméno a adresa, údaj chybí.
- kompletní faktura = má všech šest údajů čitelných
- evidence = data/objednavky.xlsx, jeden sešit pro každého dodavatele

## Kde jsou data
- vstup/ — uložené PDF faktur. Sem se jen čte, nikdy nepřepisuje.
- data/objednavky.xlsx — evidence přijatých faktur, sešit pro každého
  dodavatele. Sloupce: Soubor / Datum přijetí / Číslo faktury / IČO / Číslo
  objednávky / Základ daně / Splatnost / Kompletní / Žádost odeslána.
  Nekontroluje se proti schváleným objednávkám, jen se eviduje, co přišlo,
  jestli je to kompletní a jestli se u toho dodavatele o doplnění požádalo.
- vystup/kontrola-<RRRR-MM-DD>.xlsx — jen faktury, kterým ten den něco
  chybělo: sešit „Přehled" se stavem všech faktur toho dne a pak sešit
  pro každého dodavatele s navrženým textem a časem odeslání.
- vystup/protokol-<RRRR-MM-DD>.md — krátký zápis běhu: co se ten den
  zkontrolovalo, co chybělo, komu se psalo a co zůstalo k ruční kontrole.

## Pravidla
- Do vstup/ nikdy nezapisuj nic jiného než nově staženou fakturu. Nic v ní
  nepřejmenovávej ani nemaž — originály jsou důkaz.
- Když údaj ve faktuře není nebo se nedá přečíst, nech pole v evidenci
  prázdné. Nic nedomýšlej a nic nedopočítávej.
- Jméno dodavatele do e-mailu i do názvu sešitu ber přesně tak, jak je
  napsané na faktuře.
- E-mail s žádostí o doplnění posílej jen na adresu, ze které faktura
  přišla, a vždy v kopii vedouci-uctarny@dek.cz.
- Text, který odejde dodavateli, musí být přesně ten, co je zapsaný jako
  navržená odpověď v kontrola-<RRRR-MM-DD>.xlsx.
- Čas odeslání zapiš do kontrola-<RRRR-MM-DD>.xlsx (do sešitu dodavatele i
  do „Přehledu") a do sloupce „Žádost odeslána" v data/objednavky.xlsx. Bez
  připojeného konektoru napiš na všechna tři místa „připraveno, čeká na
  konektor".
- E-mail posílej jen tehdy, když chybí jeden nebo dva ze šesti údajů. Když
  jich chybí tři a víc, nebo se z PDF nedá přečíst text vůbec, nic
  neposílej — napiš to do protokolu a řekni mi to. Tolik chybějících údajů
  většinou neznamená špatnou fakturu, ale že se nepodařilo PDF správně
  přečíst, a to se nemá posílat dodavateli jako naše chyba.
- Nikdy neposílej e-mail, který se týká platby, schválení nebo účetnictví.
  Jediný důvod k automatickému e-mailu je žádost o doplnění chybějícího
  údaje na faktuře samotné.
- Nikdy neschvaluj fakturu, nezadávej ji k platbě a nezapisuj nic do
  účetního systému.

## Když projekt běží bez připojené schránky
V cvičné podobě (žádný konektor na Microsoft 365) skill zpracuje, co už
leží ve vstup/, a e-mail jen navrhne — nemá odkud ho fyzicky odeslat. Jakmile
je M365 konektor připojený a má write tools, běží to nad živou schránkou a
navržený text se doopravdy odešle. Postup je v obou případech stejný, mění
se jen to, odkud faktura přišla a jestli má skill k dispozici odeslání.
