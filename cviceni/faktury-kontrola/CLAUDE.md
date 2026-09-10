# Kontrola faktur

Cvičný projekt z workshopu DEK Academy. Zpracovává faktury dodavatelů —
buď přímo z e-mailu v Doručené poště (to dělá naplánovaná automatizace,
`rutina.md`), nebo z PDF, které přibylo ve složce vstup/ (to dělá i skill
sám, viz `.claude/skills/kontrola-faktur/`) — vytáhne z nich šest povinných
údajů a zapíše je do evidence podle dodavatele. Když některý údaj chybí,
sám pošle dodavateli e-mail s žádostí o doplnění.

**Posílá poštu bez potvrzení — ale jenom žádost o doplnění chybějícího údaje,
nikdy nic k platbě.** Neschvaluje faktury, nezadává je k platbě a nepíše nic
do účetního systému. To zůstává na člověku.

## Slovník
- faktura = buď e-mail s PDF přílohou v Doručené poště fakturace@dek.cz
  od odesílatele mimo dek.cz/dek-cz.com, nebo PDF soubor ve vstup/ — obojí
  se zpracovává stejným postupem, jen z jiného zdroje (viz „Dvě cesty..."
  níž)
- šest povinných údajů = číslo faktury, dodavatel, IČO dodavatele, číslo
  objednávky, základ daně (částka bez DPH), splatnost
- IČO = vždycky IČO dodavatele. IČO odběratele (DEK a.s.) je na faktuře taky
  a nepočítá se — když je u dodavatele jen jméno a adresa, údaj chybí.
- kompletní faktura = má všech šest údajů čitelných
- evidence = data/objednavky.xlsx, jeden sešit pro každého dodavatele

## Dvě cesty, jak se faktura zpracuje

**Hlavní cesta — přímo z Doručené pošty (od 2026-09-09), jen v naplánované
automatizaci.** M365 konektor umí e-mail i jeho PDF přílohu přečíst jako
text, a to na vytažení šesti údajů stačí — nepotřebuje se surová binární
data přílohy, ani uložený soubor na disku. Naplánovaná automatizace
(`rutina.md`, blok Instructions) proto při každém běhu projde Doručenou
poštu, najde e-maily s přílohou od odesílatele mimo dek.cz/dek-cz.com a
zpracuje je rovnou: vytáhne šest údajů, zapíše řádek do evidence (i bez
souboru ve vstup/) a při chybějícím údaji pošle žádost o doplnění přímo
na adresu z hlavičky e-mailu. **Je to krok v zadání automatizace, ne
v tomhle skillu** — schválně, aby šel skill bezpečně spustit i samostatně (např.
podle `README.md`), bez vedlejšího efektu na reálnou schránku.

**Doplňková cesta — PDF ve vstup/, i v samotném skillu.** Skill (viz
`.claude/skills/kontrola-faktur/`) zpracuje cokoli, co se objeví jako
soubor ve vstup/ a ještě nemá řádek v evidenci — typicky fakturu vhozenou
tam ručně. U týhle cesty ale není živý e-mail, a tím pádem ani adresa,
komu psát: skill fakturu zaeviduje, chybějící údaj sepíše do
vystup/kontrola-<RRRR-MM-DD>.xlsx a napíše „adresa dodavatele nenalezena,
k ruční kontrole". **Odeslat se z týhle cesty nedá nikdy** — kdo fakturu
do vstup/ vhodil, ví, od koho je, a odpoví sám.

Obě cesty zapisují do stejné evidence a duplicitu ověřují podle čísla
faktury napříč všemi sešity — takže stejná faktura zpracovaná nejdřív
z Doručené pošty (automatizací) a později znovu objevená jako soubor ve
vstup/ (nebo naopak) se podruhé nezapíše ani neodešle.

## Kde jsou data
- vstup/ — uložené PDF faktur pro doplňkovou cestu. Skill sem nikdy nic
  sám nezapisuje, jen čte — soubory sem dává člověk ručně (hlídá to hook
  chran-vstup.sh, který Claude Code zápis do vstup/ úplně zakazuje).
- data/objednavky.xlsx — evidence přijatých faktur, sešit pro každého
  dodavatele. Sloupce: Soubor / Datum přijetí / Číslo faktury / IČO / Číslo
  objednávky / Základ daně / Splatnost / Kompletní / Žádost odeslána.
  Řádek zapsaný hlavní cestou (z Doručené pošty) nemusí mít odpovídající
  soubor na disku — sloupec „Soubor" pak nese jen jméno přílohy z e-mailu.
  Evidence se nekontroluje proti schváleným objednávkám, jen eviduje, co
  přišlo, jestli je to kompletní a jestli se u toho dodavatele o doplnění
  požádalo.
- vystup/kontrola-<RRRR-MM-DD>.xlsx — jen faktury, kterým ten den něco
  chybělo: sešit „Přehled" se stavem všech faktur toho dne a pak sešit
  pro každého dodavatele s navrženým textem a časem odeslání.
- vystup/protokol-<RRRR-MM-DD>.md — krátký zápis běhu: co se ten den
  zkontrolovalo, co chybělo, komu se psalo a co zůstalo k ruční kontrole.

## Pravidla
- Skill do vstup/ nikdy nic nezapisuje ani nepřejmenovává — originály jsou
  důkaz a jediná cesta, jak tam má něco přibýt, je člověk ručně.
- Než se nová faktura zapíše do evidence, zkontroluj podle čísla faktury (a
  dodavatele) napříč všemi sešity data/objednavky.xlsx, jestli tam už
  neleží — ať přichází z Doručené pošty nebo ze vstup/, stejná faktura se
  může objevit oběma cestami. Duplicitu jen zapiš do protokolu, neeviduj ji
  podruhé a nic kvůli ní neposílej.
- Když údaj ve faktuře není nebo se nedá přečíst, nech pole v evidenci
  prázdné. Nic nedomýšlej a nic nedopočítávej.
- Jméno dodavatele do e-mailu i do názvu sešitu ber přesně tak, jak je
  napsané na faktuře.
- Komu se má poslat žádost o doplnění: jen u faktury z Doručené pošty, a to
  přímo z hlavičky toho e-mailu, ne odjinud. Vždy v kopii
  fakturace@dek.cz. U faktury ze vstup/ se neposílá nikdy — není odkud
  vzít adresu.
- Text, který odejde dodavateli, musí být přesně ten, co je zapsaný jako
  navržená odpověď v kontrola-<RRRR-MM-DD>.xlsx.
- Čas odeslání zapiš do kontrola-<RRRR-MM-DD>.xlsx (do sešitu dodavatele i
  do „Přehledu") a do sloupce „Žádost odeslána" v data/objednavky.xlsx. Když
  se neodeslalo, napiš na všechna tři místa proč — „připraveno, čeká na
  konektor" (chybí M365 konektor/write tools) nebo, u každé faktury ze
  vstup/, „adresa dodavatele nenalezena, k ruční kontrole".
- E-mail posílej jen tehdy, když chybí jeden nebo dva ze šesti údajů. Když
  jich chybí tři a víc, nebo se text nedá přečíst vůbec, nic neposílej —
  napiš to do protokolu a řekni mi to. Tolik chybějících údajů většinou
  neznamená špatnou fakturu, ale že se nepodařilo text správně přečíst, a
  to se nemá posílat dodavateli jako naše chyba.
- Nikdy neposílej e-mail, který se týká platby, schválení nebo účetnictví.
  Jediný důvod k automatickému e-mailu je žádost o doplnění chybějícího
  údaje na faktuře samotné.
- Nikdy neschvaluj fakturu, nezadávej ji k platbě a nezapisuj nic do
  účetního systému.
