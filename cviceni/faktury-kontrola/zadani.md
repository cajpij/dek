# Zadání, ze kterého tenhle projekt vznikl

Tohle je text, který dostal Claude. Je tu schválně i po dokončení projektu —
když se agenda změní, upravuje se nejdřív tenhle popis, a teprve podle něj
soubory ve složce.

---

Postav mi v téhle složce kontrolu došlých faktur.

## K čemu to je
Do schránky fakturace@dek.cz chodí od dodavatelů faktury v PDF. Někdo
je musí otevřít, opsat z nich šest údajů do evidence a u neúplných napsat
dodavateli o doplnění. Tohle má dělat automatizace místo mě.

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
   IČO dodavatele, číslo objednávky, základ daně (částku bez DPH, ne s DPH)
   a splatnost. IČO ber jen dodavatelovo — to odběratele je na faktuře taky
   a nepočítá se.
4. Zapiš je do data/objednavky.xlsx do sešitu pojmenovaného jménem
   dodavatele přesně tak, jak je na faktuře. Když takový sešit není, založ ho.
5. Když je vyplněných všech šest, tady skonči. Nic se neposílá.

## Když chybí jeden nebo dva údaje
6. Do vystup/kontrola-<datum>.xlsx zapiš, co chybí: sešit „Přehled" se stavem
   všech faktur toho dne a sešit dodavatele s chybějícím údajem a s návrhem
   odpovědi podle šablony níž.
7. Ten text pošli jako nový e-mail na adresu, ze které faktura přišla,
   v kopii fakturace@dek.cz. Předmět: Doplnění faktury <číslo faktury>.
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

---

## Aktualizace 2026-09-09 — M365 konektor neumí stáhnout přílohu

Po nasazení se ukázalo, že M365 konektor, který Claude má, umí e-mail i PDF
přílohu **přečíst jako text**, ale nemá nástroj, který by vrátil surová
binární data přílohy — takže krok 2 původního zadání („Ulož přílohu do
vstup/") nejde nástroji, co má Claude k dispozici, splnit. Zkoušet to
obcházet přes přihlášení do webového Outlooku nebo přes export z Wordu
nemá smysl (první chce heslo, které se nemá zadávat, druhé blokuje
bezpečnostní filtr) — je to mezera v sadě nástrojů, ne něco, co se dá
doprosit.

Řešení: ukládání PDF do vstup/ dělá od teď **Outlook pravidlo + Power
Automate tok mimo Claude Code**, ne Claude sám. Protože je celá tahle
složka uvnitř `OneDrive - DEK a.s`, stačí, aby tok uložil přílohu do
odpovídajícího místa v OneDrive — na disk k Marii se soubor dostane běžnou
synchronizací, bez jakéhokoli zásahu Claude. Tok zároveň zapisuje řádek do
nového `data/prijate-emaily.xlsx` (odesílatel, čas přijetí, předmět), aby
skill věděl, komu poslat žádost o doplnění, i když samotnou přílohu
nestáhl.

Důsledky pro postup:
- Skill (krok 1) už nerozlišuje „s konektorem" / „bez konektoru" při
  hledání nové faktury — nová faktura je vždycky PDF ve vstup/ bez řádku
  v evidenci, ať konektor běží nebo ne. Konektor je potřeba jen na
  odeslání e-mailu (krok 7 dál).
- Jméno souboru ve vstup/ už neurčuje skill (dodavatele nezná, dokud PDF
  nepřečte) — určuje ho tok, typicky `<datum přijetí>_<původní název
  přílohy>.pdf`. Skill s tímhle jménem jen pracuje, nevynucuje formát
  `<datum>_<dodavatel>`.
- Přibyl krok „zkontroluj duplicitu": protože tok může stejnou fakturu
  uložit dvakrát pod jiným jménem souboru, skill před zápisem do evidence
  porovnává číslo faktury napříč sešity, ne jen jméno souboru.
- Adresu, na kterou jde žádost o doplnění, skill hledá v
  `data/prijate-emaily.xlsx` podle jména souboru — ne živým hledáním
  v poštovní schránce.
- Hook `chran-vstup.sh` teď zakazuje Claude Code zápis do vstup/ úplně,
  i pro nové PDF — jediná cesta, jak tam má něco přibýt, je ten tok nebo
  člověk ručně.

Popsáno dál v `CLAUDE.md`, `.claude/skills/kontrola-faktur/SKILL.md`,
`rutina.md`, `runbook.md` a `README.md`.

---

## Aktualizace 2026-09-09 — doplňková kontrola schránky před zpracováním vstup/

Naplánovaná automatizace (`rutina.md`) teď na začátku každého běhu, ještě
před spuštěním skillu `kontrola-faktur`, udělá vlastní krátkou kontrolu
schránky fakturace@dek.cz přes M365 konektor (jen čtení) — za
posledních pár dní najde e-maily s PDF přílohou, které ještě nejsou
v `data/prijate-emaily.xlsx`. Najde-li takový, jehož příloha ještě není
ani uložená ve `vstup/`, nic nestahuje ani neukládá (na to nástroj pořád
nemá — viz aktualizace výše) — jen to nahlásí k ruční kontrole.

Důvod: Outlook pravidlo + Power Automate tok je hlavní a jediná cesta, jak
se PDF dostane do `vstup/`, ale může se stát, že na konkrétní e-mail
nesedí filtr pravidla nebo tok zrovna vypadl — a bez týhle pojistky by si
toho automatizace všimla až s velkým zpožděním (teprve když by si někdo
ručně zkontroloval schránku).

Důsledky pro postup:
- Tahle kontrola je krok navíc v **zadání naplánované automatizace**
  (`rutina.md`, blok Instructions), ne součást skillu
  `kontrola-faktur` samotného — skill dál pozná novou fakturu výhradně
  podle souboru ve `vstup/` bez řádku v evidenci, přesně jako dřív.
- Nález z týhle kontroly jde jen do `vystup/protokol-<datum>.md` jako
  „k ruční kontrole" — nikdy nezakládá řádek v `data/objednavky.xlsx` ani
  neposílá žádost o doplnění. To se stane až běžným postupem, jakmile
  tok (nebo člověk ručně) přílohu skutečně uloží do `vstup/`.

Popsáno dál v `rutina.md`, `CLAUDE.md`,
`.claude/skills/kontrola-faktur/SKILL.md` a `runbook.md`. Do `README.md`
se nepromítá — jeho ukázkový běh je přímé spuštění skillu bez tohohle
kroku automatizace navíc.

### Doplnění téhož dne — kontrola schránky má i vytáhnout údaje a napsat proč

Ověřeno na živém příkladu (e-mail od fakturace@baranek.cz, příloha
`novafaktura.pdf`, faktura 2026-114): konektor na M365 přílohu skutečně
umí přečíst jako text (přes `read_resource` na URI přílohy), jen nemá
způsob, jak vrátit surová binární data souboru — potvrzuje to, co říká
aktualizace výše, ne novou možnost.

Kontrola schránky z aktualizace výše proto nemá jen nahlásit, že e-mail
existuje, ale rovnou z něj — stejně jako u faktury ve `vstup/` — zkusit
vytáhnout všech šest údajů, a k nálezu napsat i odhad, proč to Outlook
pravidlo / Power Automate tok ještě nezachytilo samo (tok neproběhl, nesedí
filtr, nebo Krok 0 v `rutina.md` ještě vůbec není nastavený — což je
v tomhle cvičném projektu, kde tok nikdy nebyl reálně zapojený, ten
nejpravděpodobnější důvod). Pořád platí, že se nic nestahuje, neukládá do
`vstup/` ani nezapisuje do evidence — jde jen o bohatší nález v protokolu
k ruční kontrole.

Popsáno v `rutina.md`, `CLAUDE.md` a
`.claude/skills/kontrola-faktur/SKILL.md`.

### Doplnění téhož dne — Krok 0, část 1 (Outlook pravidlo) hotová

V Outlooku je založená podsložka `faktury ke zpracování` pod Doručenou
poštou. Pravidlo, které do ní přesouvá poštu, jsem založila já přes M365
konektor (`outlook_create_filter`), ne ona ručně — proto má oproti
původnímu zadání (Krok 0, „PDF příloha, odesílatel mimo dek.cz /
dek-cz.com") dvě omezení, daná tím, co tenhle nástroj na pravidla umí:

- Podmínky jde skládat jen jako „obsahuje/rovná se", ne jako negaci —
  „odesílatel NENÍ dek.cz" se tímhle nástrojem nedá vyjádřit. Pravidlo
  proto místo toho kombinuje „má přílohu" + „předmět obsahuje faktura",
  což riziko zachycení interní pošty sníží, ale nevyloučí úplně.
- „Má přílohu" je obecné, ne specificky PDF — typ přílohy se přes tenhle
  nástroj filtrovat nedá.

Protože pravidlo neumí vyloučit interní odesílatele, dostala tenhle úkol
naplánovaná automatizace: při kontrole podsložky `faktury ke zpracování`
(viz aktualizace výše) nejdřív přeskočí e-maily od dek.cz/dek-cz.com a
dál se dívá jen na externí odesílatele. Krok 2 z Kroku 0 (Power Automate
tok, který by z týhle podsložky uložil přílohu do vstup/ a zapsal řádek
do data/prijate-emaily.xlsx) pořád není nastavený — bez něj se do vstup/
z týhle podsložky nic samo nedostane.

Popsáno v `rutina.md` (Krok 0, „Jak celý proces zjišťuje...", Instructions,
„Co je dobré vědět"), `CLAUDE.md` a
`.claude/skills/kontrola-faktur/SKILL.md`.

### Doplnění téhož dne — hlavní cesta je teď přímo z Doručené pošty, Krok 0 volitelný

Zásadní změna proti celému dosavadnímu zadání: naplánovaná automatizace už
nečeká, až se PDF fyzicky uloží do `vstup/`. Místo toho při každém běhu
přečte přímo z Doručené pošty `fakturace@dek.cz` e-maily s přílohou od
odesílatele mimo dek.cz/dek-cz.com, a u nových (podle čísla faktury a
dodavatele v `data/objednavky.xlsx`) rovnou: vytáhne šest údajů z textu
přílohy, zapíše řádek do evidence (i bez souboru na disku), a při
chybějícím údaji pošle žádost o doplnění přímo na adresu z hlavičky
e-mailu — bez použití `data/prijate-emaily.xlsx`.

Důsledky:
- **Krok 0 (Outlook pravidlo + Power Automate tok) přestává být podmínkou
  provozu** — je to teď jen volitelná doplňková cesta pro fakturu vhozenou
  ručně do `vstup/`, ne nutný předpoklad. Motivace: tok stejně nikdy
  nebyl reálně zapojený a jeho zprovoznění je mimo možnosti Claude
  (Power Automate nemá žádný nástroj/konektor) — dávalo tedy smysl přesunout
  těžiště na to, co Claude už umí (číst e-mail jako text).
- **`data/objednavky.xlsx` může mít řádek bez odpovídajícího PDF na
  disku** — u faktur zpracovaných hlavní cestou. Sloupec „Soubor" nese jen
  jméno přílohy z e-mailu. Vlastnice si tohle riziko vyžádala vědomě (viz
  odpověď „ano" na otázku, jestli tohle fakt chce, položenou předtím, než
  se to implementovalo) — přijala, že tím padá dřívější princip „faktura =
  PDF soubor ve vstup/, je to fyzický důkaz".
- **Pravidlo z předchozí aktualizace (přesun do `faktury ke zpracování`)
  se teď s hlavní cestou kříží** — kontroluje se přímo Doručená pošta, ne
  podsložka, takže dokud pravidlo běží, přesouvá z Doručené pošty pryč
  přesně to, co by tam hlavní cesta měla najít. Řešení (vypnout pravidlo,
  nebo rozšířit kontrolu i na podsložku) zůstává otevřené — zapsáno jako
  upozornění v `rutina.md` a jako řádek v `runbook.md`.
- Skill (`.claude/skills/kontrola-faktur/SKILL.md`) i `CLAUDE.md` byly
  schválně upravené tak, aby čtení přímo z Doručené pošty zůstalo
  výhradně krokem v zadání automatizace (`rutina.md`, Instructions), ne
  součástí toho, co skill dělá sám o sobě — jinak by i obyčejné spuštění
  „Postupuj podle skillu kontrola-faktur." (např. podle `README.md`)
  mohlo poslat e-mail na základě toho, co zrovna leží v reálné schránce.
  `data/prijate-emaily.xlsx` zůstává v provozu jen kvůli doplňkové cestě
  ze vstup/.

Popsáno v `rutina.md` (celý přepis), `CLAUDE.md`, `runbook.md` a
`.claude/skills/kontrola-faktur/SKILL.md`. Do `README.md` se nepromítá —
jeho ukázkový běh je pořád jen skill nad vzorovými PDF ve vstup/.

## Aktualizace 2026-09-10 — Power Automate se nepoužívá, prijate-emaily.xlsx pryč

Rozhodnutí: **Power Automate v DEKu nepoužíváme.** Krok 0 (Outlook pravidlo
+ tok, který ukládá přílohu do vstup/ a připisuje řádek do
`data/prijate-emaily.xlsx`) tedy nikdy nasazený nebude a všechno, co na něm
viselo, jde ze složky pryč.

Co to mění:
- `data/prijate-emaily.xlsx` se maže. Byl to log toho, co uložil tok — bez
  toku se nikdy nenaplní, takže dohledání adresy v něm nemohlo dopadnout
  jinak než nenálezem.
- **Doplňková cesta (PDF ve vstup/) už nikdy neodesílá.** Fakturu zaeviduje,
  chybějící údaj sepíše do `vystup/kontrola-<datum>.xlsx` a zapíše „adresa
  dodavatele nenalezena, k ruční kontrole". Není to porucha, je to jediný
  možný konec: soubor vhozený do složky s sebou nenese odesílatele. Kdo ho
  tam vhodil, ví, od koho je, a odpoví sám.
- **Hlavní cesta se nemění.** Automatizace čte Doručenou poštu, adresu bere
  z hlavičky e-mailu a odesílá — to je nadále jediná cesta, ze které se
  žádost o doplnění posílá.
- Do `vstup/` tím pádem dává soubory výhradně člověk ručně. Hook to hlídá
  stejně jako dosud.

Nic se tím neztratilo: odesílat uměla vždycky jen hlavní cesta.

Popsáno v `CLAUDE.md`, `rutina.md` (sekce Krok 0 smazána), `README.md`,
`runbook.md` a `.claude/skills/kontrola-faktur/SKILL.md`. Historie výš
zůstává, jak byla — je to záznam toho, co se kdy rozhodlo, ne návod.

