# Naplánovaná automatizace: kontrola nových faktur

Co vyplnit v aplikaci Claude → záložka **Code** → **Routines** → **New routine**.

## Aktualizace 2026-09-09: hlavní cesta je teď přímo z Doručené pošty

Automatizace teď čte a rovnou zpracovává faktury přímo z Doručené pošty
`fakturace@dek.cz` — nečeká, až se PDF fyzicky uloží jako soubor do
`vstup/`. M365 konektor přílohu přečíst jako text umí, a na vytažení šesti
údajů to stačí; jen ji neumí stáhnout jako binární soubor. Ukládání do
`vstup/` proto pro běžný provoz **není potřeba** — zůstává jen jako
doplňková cesta pro fakturu vhozenou tam ručně.

**Důsledek, který si pohlídej:** V Outlooku už existuje pravidlo „Faktury ke
zpracování — příloha PDF + předmět faktura" (založené 2026-09-09), které
e-maily s přílohou a slovem „faktura" v předmětu přesouvá z Doručené pošty
do podsložky `faktury ke zpracování` — **dřív, než automatizace stihne
Doručenou poštu prohlédnout.** Dokud tohle pravidlo běží, hlavní cesta níž
takové e-maily v Doručené poště vůbec neuvidí. Buď to pravidlo vypni/smaž
(Outlook → Pravidla → Spravovat pravidla), nebo počítej s tím, že
automatizace musí prohlížet i podsložku `faktury ke zpracování`, ne jen
Doručenou poštu — momentálně (viz Instructions níž) kontroluje jen
Doručenou poštu, takže dokud pravidlo běží, je potřeba ho vypnout.

## Hlavní cesta: zpracování přímo z Doručené pošty

1. E-mail s fakturou dorazí do `fakturace@dek.cz`.
2. Naplánovaná automatizace v Claude (formulář a instrukce níž) při každém
   běhu přes M365 konektor projde Doručenou poštu za posledních pár dní
   a vybere e-maily s PDF přílohou od odesílatele mimo dek.cz / dek-cz.com.
3. U každého takového e-mailu, jehož faktura (podle čísla faktury a
   dodavatele) ještě není zapsaná v žádném sešitu `data/objednavky.xlsx`,
   přečte přílohu jako text a vytáhne šest povinných údajů — stejným
   postupem jako skill `kontrola-faktur` u faktury ve `vstup/` (číslo
   faktury, dodavatel, IČO dodavatele, číslo objednávky, základ daně,
   splatnost).
4. Zapíše řádek do sešitu dodavatele v `data/objednavky.xlsx` — i bez
   fyzického souboru ve `vstup/`. Do sloupce „Soubor" napíše jméno přílohy
   z e-mailu, i když na disku nic neleží; „Datum přijetí" je datum
   doručení e-mailu.
5. Je-li vyplněných všech šest údajů, tady to končí — nic se neposílá.
6. Chybí-li jeden nebo dva údaje: zapíše návrh do
   `vystup/kontrola-<dnešní datum>.xlsx` (sešit „Přehled" + sešit
   dodavatele, text podle šablony v `.claude/skills/kontrola-faktur/`) a
   rovnou pošle e-mail z `fakturace@dek.cz` zpátky na adresu, ze které
   faktura přišla (přímo z hlavičky e-mailu), v kopii
   `fakturace@dek.cz`. Předmět: „Doplnění faktury <číslo faktury>".
   Čas odeslání zapíše do `kontrola-<dnešní datum>.xlsx` i do sloupce
   „Žádost odeslána" v `data/objednavky.xlsx`.
7. Chybí-li tři a víc údajů, nebo se příloha nedá přečíst jako text: nic
   neposílá, jen to zapíše do `vystup/protokol-<dnešní datum>.md` jako
   „k ruční kontrole".

Adresu, na kterou jde žádost o doplnění, bere přímo z hlavičky e-mailu.
Je to jediné místo, kde ta adresa je — proto se posílá jen z týhle cesty.

## Doplňková cesta: PDF uložené ručně do vstup/

Beze změny oproti dřívějšku: cokoli, co se objeví jako soubor ve `vstup/`
a ještě nemá řádek v evidenci, skill `kontrola-faktur` zpracuje — typicky
fakturu, kterou tam někdo vhodil ručně. Protože u týhle cesty nemáme
živý e-mail, ze kterého by šlo vzít adresu, **žádost o doplnění se z ní
neodesílá nikdy** — jen se sepíše a do evidence se zapíše „adresa
dodavatele nenalezena, k ruční kontrole". Kdo fakturu do `vstup/` vhodil,
ví, od koho je, a odpoví sám.

**Duplicita mezi oběma cestami:** obě zapisují do stejné evidence
(`data/objednavky.xlsx`) a duplicitu ověřují podle čísla faktury napříč
všemi sešity — takže když stejnou fakturu nejdřív zpracuje hlavní cesta
z Doručené pošty (bez souboru na disku) a později se stejné PDF objeví i
ve `vstup/`, skill ho pozná jako duplicitu podle
čísla faktury a nezapíše ani neodešle nic podruhé.

## Než založíš automatizaci v Claude: konektor na Microsoft 365

Tahle automatizace potřebuje konektor Claude na Microsoft 365 se zapnutými
**write tools** (posílání pošty) — bez nich Doručenou poštu i vstup/
zkontroluje, ale e-mail neodešle, jenom ho navrhne (viz `CLAUDE.md`). Write
tools zapíná zvlášť správce Microsoft 365, přihlášený pracovním účtem;
osobní outlook.com nebo hotmail.com nefunguje. Text, který mu poslat, je
níž v „Co napsat správci". Čtecí přístup na M365 je teď hlavní cestou, jak
automatizace faktury vůbec najde — ne jen doplňková kontrola.

## Formulář

| Pole | Co vyplnit |
| --- | --- |
| **Name** | `kontrola-faktur` |
| **Description** | Zpracuje nové faktury z Doručené pošty a ze vstup/ a doplňuje chybějící údaje |
| **Model** | Sonnet — na tuhle práci stačí a je nejúspornější |
| **Permission mode** | Accept edits — jinak se běh zastaví na dotazu, na který nikdo neodpoví |
| **Folder** | složka tohoto projektu (`faktury-kontrola`) |
| **Schedule** | Every 15 minutes, v pracovní dny 7:00–18:00 |

Proč každých 15 minut, ne jednou denně: žádost o doplnění má dodavateli
přijít brzy, ne až druhý den. Claude Code nemá skutečné „hned jak přijde
e-mail" spouštění — nejblíž tomu je časté opakování. Když ti 15 minut
připadá zbytečně husté, dej to na 30 nebo na hodinu; nic se tím nerozbije,
jen se prodlouží čas do odpovědi dodavateli.

## Instructions

```
Postupuj podle skillu kontrola-faktur pro pravidla o šesti údajích,
duplicitě a šabloně e-mailu.

Hlavní krok — zpracuj faktury přímo z Doručené pošty fakturace@dek.cz:
projdi Doručenou poštu za posledních N dní a vyber e-maily s PDF přílohou
od odesílatele mimo dek.cz a dek-cz.com. U každého, jehož faktura (podle
čísla faktury a dodavatele) ještě není v žádném sešitu data/objednavky.xlsx,
přečti přílohu jako text a vytáhni šest povinných údajů (číslo faktury,
dodavatel, IČO dodavatele, číslo objednávky, základ daně, splatnost).
Zapiš řádek do sešitu dodavatele v data/objednavky.xlsx — do sloupce
Soubor napiš jméno přílohy z e-mailu, i když PDF nikde na disku neleží.

Když je faktura kompletní, tím pro ni končí. Když chybí jeden nebo dva
údaje, zapiš návrh do vystup/kontrola-<dnešní datum>.xlsx (sešit „Přehled"
i sešit dodavatele) a rovnou pošli e-mail z fakturace@dek.cz zpátky na
adresu, ze které faktura přišla (podle hlavičky e-mailu), v kopii
fakturace@dek.cz, textem podle
šablony ve skillu. Čas odeslání zapiš do kontrola-<dnešní datum>.xlsx i do
sloupce „Žádost odeslána" v data/objednavky.xlsx.

Když chybí tři a víc údajů, nebo se příloha nedá přečíst jako text, nic
neposílej — zapiš to do protokolu k ruční kontrole.

Doplňkový krok — zkontroluj i vstup/ a zpracuj PDF faktury, které tam
přibyly a ještě nemají řádek v data/objednavky.xlsx (typicky ručně vhozené).
Postupuj stejně, ale nic neodesílej — k souboru ve vstup/ není adresa.
Návrh odpovědi jen zapiš a do sloupce „Žádost odeslána" napiš „adresa
dodavatele nenalezena, k ruční kontrole".

Když ani jedna z cest nenajde nic nového, nic nedělej a nic neposílej.

Nikdy neposílej nic, co se týká platby, schválení nebo účetnictví.
```

## Než to necháš běžet samo

1. Po uložení klikni na **Run now** a projdi si, na co se to zeptá — u
   každého dotazu vyber „always allow". Další běhy se pak už neptají.
2. Zkontroluj vystup/kontrola-<dnešní datum>.xlsx a fakticky i schránku
   Odeslaná pošta — porovnej, že text, který se poslal, je slovo od slova
   ten, co je v sešitu dodavatele.
3. Mrkni i do data/objednavky.xlsx: nová faktura má mít řádek v sešitu svého
   dodavatele a u té, které něco chybělo, má být vyplněný sloupec „Žádost
   odeslána".
4. Teprve pak to nech běžet samo. **První den to nech běžet vedle sebe a
   po každém běhu se podívej, co se stalo** — je to jediná automatizace
   v tomhle projektu, která bez tvého kliknutí posílá poštu ven z firmy.

## Co je dobré vědět

- Řádek v `data/objednavky.xlsx` teď může existovat bez odpovídajícího
  PDF souboru na disku — hlavní cesta píše přímo z obsahu e-mailu. Sloupec
  „Soubor" u takového řádku je jen jméno přílohy z e-mailu, ne cesta
  k reálnému souboru ve `vstup/`.
- Pravidlo z Kroku 0 (pokud ho necháš zapnuté) nerozlišuje odesílatele —
  e-mail od kolegy z dek.cz s přílohou a slovem „faktura" v předmětu se
  přesune do „faktury ke zpracování" stejně jako od dodavatele, a hlavní
  cesta ho v Doručené poště pak nenajde. Buď pravidlo vypni, nebo do
  podsložky občas nakoukni ručně.
- Automatizace běží, jen když je aplikace Claude spuštěná a počítač vzhůru.
  Když počítač spí, běh se přeskočí a doženou se jen e-maily, které přišly
  bezprostředně předtím — ne všechny za celou dobu.
- Kdyby konektor na M365 spadl nebo přišel o přístup, automatizace se
  zastaví na dotazu, ne že by tiše nic nedělala — sleduj to hlavně první
  týden.
- Když chceš, aby tohle běželo i s vypnutým počítačem, není to tenhle typ
  automatizace. To už musí běžet někde jinde než na tvém stole.

## Co napsat správci

```
Ahoj, potřeboval bych u konektoru Microsoft 365 pro Claude povolit
write tools (odesílání pošty) pro schránku fakturace@dek.cz.

K čemu to bude: automatická kontrola došlých faktur. Automatizace zkontroluje
šest povinných údajů a dodavateli automaticky pošle žádost o doplnění,
když jeden nebo dva chybí. Nic k platbě, schválení ani do účetnictví
se automaticky neposílá — to zůstává na nás.

Čtecí přístup už mám a funguje. Práva se dědí z účtu, takže Claude uvidí
přesně to, co já, nic navíc.
```

## Kam sáhnout, když se něco pokazí

Runbook je v `runbook.md` vedle tohoto souboru.
