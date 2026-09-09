# Runbook — kontrola faktur

Jedna stránka pro chvíli, kdy něco spadne a ty jsi na dovolené.

## Co to dělá

Naplánovaná automatizace `kontrola-faktur` v Claude každých 15 minut
v pracovní dny 7:00–18:00 zkontroluje faktury dvěma cestami:

- **Hlavní cesta — přímo z Doručené pošty.** Přes M365 konektor projde
  Doručenou poštu `fakturace@dek.cz`, najde e-maily s přílohou od
  odesílatele mimo dek.cz/dek-cz.com a u těch, které ještě nejsou
  v evidenci, přečte přílohu jako text (M365 konektor umí přílohu přečíst,
  ne stáhnout jako soubor — na text ale stačí) a rovnou je zpracuje.
  Adresu na žádost o doplnění bere přímo z hlavičky e-mailu.
- **Doplňková cesta — vstup/.** Zkontroluje i složku `vstup/` — PDF, které
  tam někdo vhodí ručně (nebo pokud si navíc nastavíš volitelný Power
  Automate tok, viz `rutina.md`, Krok 0). Adresu na doplnění u týhle cesty
  dohledá v `data/prijate-emaily.xlsx` podle jména souboru.

U obou cest: vytáhne šest povinných údajů (číslo faktury, dodavatel, IČO,
číslo objednávky, základ daně, splatnost), nejdřív zkontroluje podle čísla
faktury napříč všemi sešity `data/objednavky.xlsx`, že nejde o duplicitu,
a zapíše je do sešitu podle dodavatele. Když chybí jeden nebo dva údaje,
pošle e-mail s žádostí o doplnění (v kopii fakturace@dek.cz), zapíše
to do `vystup/kontrola-<datum>.xlsx` a čas odeslání doplní i do evidence,
do sloupce „Žádost odeslána".

**Posílá jen žádost o doplnění chybějícího údaje na faktuře samotné.**
Neschvaluje faktury, nic neplatí a nezapisuje nic do účetního systému.

## Kde to běží

Naplánovaná automatizace `kontrola-faktur` v aplikaci Claude, záložka
Code → Routines, typ Local. Běží na počítači, na kterém je nastavená — ne
v cloudu. Potřebuje konektor na Microsoft 365 se zapnutými write tools
(posílání pošty); bez nich Doručenou poštu i vstup/ zkontroluje, ale
e-mail jen navrhne, neodešle.

Používáš-li navíc volitelný Krok 0 (Outlook pravidlo + Power Automate tok,
`rutina.md`) pro doplňkovou cestu, tak to běží nezávisle v M365 cloudu,
bez ohledu na to, jestli je počítač nebo aplikace Claude zapnutá.

## Jak poznám, že to dopadlo

Otevři poslední `vystup/protokol-*.md` nebo sešit „Přehled" v posledním
`vystup/kontrola-*.xlsx`:

- **Kompletní = ano** — faktura má všech šest údajů, nic se neposílalo.
- **Kompletní = ne, e-mail odeslán má čas** — chybělo jedno nebo dvě pole,
  žádost o doplnění odešla. Zkontroluj v Odeslané poště, že to sedí.
- **„připraveno, čeká na konektor"** — text je navržený, ale M365 konektor
  v Claude nebyl připojený (nebo neměl write tools), takže se fyzicky
  neodeslal.
- **„adresa dodavatele nenalezena, k ruční kontrole"** — jen u faktury ze
  vstup/: v `data/prijate-emaily.xlsx` není pro ten soubor záznam (typicky
  proto, že se PDF do vstup/ dostalo ručně, ne přes volitelný tok), takže
  automatizace nevěděla, komu psát. U faktury z Doručené pošty tohle
  nemůže nastat — adresu bere přímo z e-mailu.
- **„k ruční kontrole" v protokolu** — chybělo moc údajů najednou nebo se
  text nedal přečíst. Tohle automatizace záměrně nechává na člověku.
- **Řádek v `data/objednavky.xlsx` beze souboru ve `vstup/`** — není chyba.
  Faktura zpracovaná hlavní cestou z Doručené pošty nemá fyzický soubor na
  disku, jen řádek v evidenci; sloupec „Soubor" nese jméno přílohy z
  e-mailu.

Když chceš vidět jen to, jestli se u konkrétního dodavatele o doplnění už
psalo, nemusíš hledat den, kdy se to stalo: stačí sloupec „Žádost odeslána"
v jeho sešitu v `data/objednavky.xlsx`.

## Když to spadne

| Co se stalo | Čím to bývá | Co s tím |
| --- | --- | --- |
| Automatizace nenašla fakturu, o které víš, že dorazila e-mailem | Je starší než „posledních N dní" v Instructions, nebo je od odesílatele z dek.cz/dek-cz.com (ty automatizace na hlavní cestě záměrně přeskakuje) | zkontroluj hlavičku e-mailu; případně spusť běh s ručním pokynem na konkrétní e-mail |
| Do vstup/ nepřibyl nový soubor, i když faktura evidentně dorazila (a používáš Krok 0) | Outlook pravidlo nebo Power Automate tok je vypnutý, spadlý, nebo nesedí filtr pravidla | v Power Automate zkontroluj Historii běhu toku; spusť ho ručně na tu zprávu. Bez Kroku 0 tohle stejně nevadí — hlavní cesta fakturu zpracuje přímo z pošty |
| Soubor je ve vstup/, ale automatizace v Claude ho nezpracovala | OneDrive ho ještě nestihl synchronizovat na tenhle počítač | zkontroluj stav synchronizace OneDrive, případně počkej na další běh |
| Automatizace v Claude se nespustila | počítač spal nebo byla zavřená aplikace | doženou se jen běhy bezprostředně předtím, ne celá historie |
| Běh se zastavil na dotazu | konektor ztratil přístup, nebo se ptá poprvé | otevři to sezení v postranním panelu, odpověz a dej „always allow" |
| E-mail se neodeslal, i když chybělo jen jedno pole, a v protokolu je „čeká na konektor" | write tools na konektoru M365 nejsou zapnuté | napiš správci, ať je zapne (viz `rutina.md`) |
| E-mail se neodeslal a v protokolu je „adresa nenalezena" (jen u faktury ze vstup/) | v `data/prijate-emaily.xlsx` chybí řádek pro ten soubor | dohledej odesílatele ručně a buď doplň řádek do `data/prijate-emaily.xlsx` a spusť běh znovu, nebo pošli žádost sama |
| Odešel e-mail se špatným textem nebo špatnému dodavateli | příloha se přečetla špatně (adresa, jméno), nebo je špatný záznam v `data/prijate-emaily.xlsx` (u vstup/) | zkontroluj konkrétní fakturu ručně, oprav v `data/objednavky.xlsx`, případně napiš dodavateli omluvu sama |
| Protokol hlásí spoustu faktur „k ruční kontrole" | většinou se změnil formát faktury, ne že by bylo najednou hodně špatných faktur | projdi dvě tři faktury ručně, než necháš automatizaci pokračovat |
| Ve `vstup/` zmizel soubor | někdo tam uklidil | soubory ve `vstup/` maže jen člověk; Claude Code do té složky nezapisuje vůbec (hlídá to hook). V evidenci řádek zůstává — je to záznam běhu, který se stal. |
| Jedna faktura je v evidenci dvakrát | kontrola duplicity podle čísla faktury selhala nebo byla obejita — může se stát i mezi hlavní a doplňkovou cestou (stejná faktura přišla e-mailem i skončila jako soubor ve vstup/) | nechej nový řádek být a starý si označ; zkontroluj, že obě verze mají opravdu stejné číslo faktury |
| Podsložka `faktury ke zpracování` se plní, ale automatizace ji nekontroluje | Instructions teď kontrolují jen Doručenou poštu, ne tuhle podsložku (viz `rutina.md`, aktualizace nahoře) | buď vypni pravidlo, které do ní přesouvá poštu, nebo dej Claudovi vědět, ať do Instructions přidá i kontrolu týhle podsložky |

## Komu napsat

Nejdřív tomu, kdo tuhle automatizaci nastavil. Když jde o obsah faktur nebo
o to, co se poslalo dodavateli, účetní. Když jde o přístup ke schránce nebo
konektor Claude, správce Microsoft 365. Používáš-li Krok 0 a do vstup/
nepřibývají soubory vůbec, tomu, kdo spravuje Power Automate tok (může být
stejná osoba jako ta, kdo agendu dělá, pokud si tok založila sama — viz `rutina.md`).

## Co dělat, až tomu přeroste hlava

Pokud faktur bude denně desítky, přestane se vyplácet nechávat každý běh
kontrolovat celou Doručenou poštu a složku vstup/ znovu. V tu chvíli má
smysl nechat si napsat malý skript, který hlídá jen nové zprávy/soubory, a
Claudovi nechat posouzení a sepsání odpovědi. Do té doby to nech, jak to
je — je to čitelnější a snáz se to kontroluje.
