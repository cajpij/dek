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
- šest povinných údajů = číslo faktury, dodavatel, IČO, číslo objednávky,
  základ daně (částka bez DPH), splatnost
- kompletní faktura = má všech šest údajů čitelných
- evidence = data/objednavky.xlsx, jeden sešit pro každého dodavatele

## Kde jsou data
- vstup/ — uložené PDF faktur. Sem se jen čte, nikdy nepřepisuje.
- data/objednavky.xlsx — evidence přijatých faktur, sešit pro každého
  dodavatele. Nekontroluje se proti schváleným objednávkám, jen se eviduje,
  co přišlo a jestli je to kompletní.
- vystup/kontrola-<RRRR-MM-DD>.xlsx — jen faktury, kterým ten den něco
  chybělo: sešit „Přehled" se stavem všech faktur toho dne a pak sešit
  pro každého dodavatele s navrženým textem a časem odeslání.

## Pravidla
- Do vstup/ nikdy nezapisuj nic jiného než nově staženou fakturu. Nic v ní
  nepřejmenovávej ani nemaž — originály jsou důkaz.
- Když údaj ve faktuře není nebo se nedá přečíst, nech pole v evidenci
  prázdné. Nic nedomýšlej a nic nedopočítávej.
- Jméno dodavatele do e-mailu i do názvu sešitu ber přesně tak, jak je
  napsané na faktuře.
- E-mail s žádostí o doplnění posílej jen na adresu, ze které faktura
  přišla, a vždy v kopii vedouci-uctarny@dek.cz.
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
