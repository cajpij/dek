# Runbook — kontrola faktur

Jedna stránka pro chvíli, kdy něco spadne a ty jsi na dovolené.

## Co to dělá

Každých 15 minut v pracovní dny 7:00–18:00 zkontroluje schránku
fakturace@dek.cz. Když najde e-mail s novou fakturou v PDF, uloží ji do
`vstup/`, vytáhne z ní šest povinných údajů (číslo faktury, dodavatel, IČO,
číslo objednávky, základ daně, splatnost) a zapíše je do
`data/objednavky.xlsx`, do sešitu podle dodavatele. Když chybí jeden nebo
dva údaje, sama pošle dodavateli e-mail s žádostí o doplnění (v kopii
vedouci-uctarny@dek.cz), zapíše to do `vystup/kontrola-<datum>.xlsx` a čas
odeslání doplní i do evidence, do sloupce „Žádost odeslána“.

**Posílá jen žádost o doplnění chybějícího údaje na faktuře samotné.**
Neschvaluje faktury, nic neplatí a nezapisuje nic do účetního systému.

## Kde to běží

Naplánovaná automatizace `kontrola-faktur` v aplikaci Claude, záložka Code →
Routines, typ Local. Běží na počítači, na kterém je nastavená — ne v cloudu.
Potřebuje konektor na Microsoft 365 se zapnutými write tools (posílání
pošty); bez nich přečte schránku, ale e-mail jen navrhne, neodešle.

## Jak poznám, že to dopadlo

Otevři poslední `vystup/protokol-*.md` nebo sešit „Přehled" v posledním
`vystup/kontrola-*.xlsx`:

- **Kompletní = ano** — faktura má všech šest údajů, nic se neposílalo.
- **Kompletní = ne, e-mail odeslán má čas** — chybělo jedno nebo dvě pole,
  žádost o doplnění odešla. Zkontroluj v Odeslané poště, že to sedí.
- **„připraveno, čeká na konektor"** — text je navržený, ale konektor
  nebyl připojený (nebo neměl write tools), takže se fyzicky neodeslal.
- **„k ruční kontrole" v protokolu** — chybělo moc údajů najednou nebo se
  PDF nedalo přečíst. Tohle automatizace záměrně nechává na člověku.

Když chceš vidět jen to, jestli se u konkrétního dodavatele o doplnění už
psalo, nemusíš hledat den, kdy se to stalo: stačí sloupec „Žádost odeslána"
v jeho sešitu v `data/objednavky.xlsx`.

## Když to spadne

| Co se stalo | Čím to bývá | Co s tím |
| --- | --- | --- |
| Automatizace se nespustila | počítač spal nebo byla zavřená aplikace | doženou se jen běhy bezprostředně předtím, ne celá historie |
| Běh se zastavil na dotazu | konektor ztratil přístup, nebo se ptá poprvé | otevři to sezení v postranním panelu, odpověz a dej „always allow" |
| E-mail se neodeslal, i když chybělo jen jedno pole | write tools na konektoru M365 nejsou zapnuté | napiš správci, ať je zapne (viz `rutina.md`) |
| Odešel e-mail se špatným textem nebo špatnému dodavateli | PDF se přečetlo špatně (adresa, jméno) | zkontroluj konkrétní fakturu ručně, oprav v `data/objednavky.xlsx`, případně napiš dodavateli omluvu sama |
| Protokol hlásí spoustu faktur „k ruční kontrole" | většinou se změnil formát PDF, ne že by bylo najednou hodně špatných faktur | projdi dvě tři faktury ručně, než necháš automatizaci pokračovat |
| Ve `vstup/` zmizel soubor | někdo tam uklidil | soubory ve `vstup/` maže jen člověk; automatizace do té složky zapisuje jen nové PDF (hlídá to hook). V evidenci řádek zůstává — je to záznam běhu, který se stal. |
| Jedna faktura je v evidenci dvakrát | přišla do schránky podruhé a její PDF mezitím ze `vstup/` zmizelo | nechej nový řádek být a starý si označ; automatizace pozná už zpracovanou fakturu podle toho, co leží ve `vstup/` |

## Komu napsat

Nejdřív tomu, kdo tuhle automatizaci nastavil. Když jde o obsah faktur nebo
o to,
co se poslalo dodavateli, účetní. Když jde o přístup ke schránce nebo
konektor, správce Microsoft 365.

## Co dělat, až tomu přeroste hlava

Pokud faktur bude denně desítky, přestane se vyplácet nechávat každý běh
kontrolovat celou schránku znovu. V tu chvíli má smysl nechat si napsat
malý skript, který hlídá jen nové zprávy, a Claudovi nechat posouzení a
sepsání odpovědi. Do té doby to nech, jak to je — je to čitelnější a snáz
se to kontroluje.
