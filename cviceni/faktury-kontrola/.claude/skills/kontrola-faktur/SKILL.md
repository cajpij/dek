---
name: kontrola-faktur
description: Zpracuje PDF faktury, které přibyly ve vstup/ a ještě nemají řádek
  v evidenci — vytáhne z nich šest povinných údajů a zapíše je podle dodavatele.
  Když něco chybí, sepíše návrh žádosti o doplnění — odeslat ho ale z týhle
  cesty nejde, protože k souboru ve vstup/ není adresa. Použij, když se má
  zkontrolovat vstup/ na nové faktury, nebo když se ptám, co je s fakturami
  k vyřízení.
---

# Kontrola faktur

## Kdy to spustit
Při každém běhu naplánované automatizace, nebo kdykoli se řekne „zkontroluj
nové faktury".

Tenhle skill sám o sobě zpracovává jen PDF ve vstup/ — bezpečně i jako
samostatný test/demo (viz `README.md`), bez rizika, že by kvůli tomu
odešel e-mail na základě něčeho, co zrovna leží v reálné schránce. Čtení
a zpracování přímo z Doručené pošty (viz níž) je krok navíc, který dělá
až naplánovaná automatizace (`rutina.md`), ne tenhle skill.

## Odkud se bere PDF ve vstup/
Tenhle skill přílohy ze schránky **sám nestahuje ani neukládá** — M365
konektor, který má Claude k dispozici, umí e-mail a jeho přílohu přečíst jako
text, ale nemá nástroj, který by vrátil surová binární data PDF, aby šlo
uložit jako soubor. Do vstup/ proto soubory dává člověk ručně — a je to
jediná cesta, jak tam něco přibude.

Proto tenhle skill sám nikdy nerozlišuje „s konektorem" / „bez konektoru" při
hledání nové faktury — nová faktura je vždycky PDF ve vstup/, které ještě
nemá řádek v evidenci. Konektor na M365 je potřeba jen na samotné odeslání
e-mailu dodavateli (krok 6d), ne na zjištění, že faktura dorazila.

**Naplánovaná automatizace (`rutina.md`) navíc — od 2026-09-09 jako svoje
hlavní, ne jen doplňkové zjišťování — čte a rovnou zpracovává faktury přímo
z Doručené pošty**, dřív než se vůbec dostane k tomuhle skillu a ke vstup/.
Prohlédne poštu, vybere e-maily s přílohou od odesílatele mimo
dek.cz/dek-cz.com, a u těch, které ještě nejsou v evidenci, udělá stejný
postup jako níž (vytažení šesti údajů, kontrola duplicity, zápis do
evidence, případná žádost o doplnění) — jen s tím rozdílem, že adresu na
doplnění bere přímo z hlavičky e-mailu — což je taky jediné místo, kde ta
adresa vůbec je — a že do evidence zapisuje, i když PDF nikde na disku neleží. To je celé
popsané v `rutina.md` (sekce „Hlavní cesta"), je to krok v zadání
automatizace, ne v tomhle skillu — proto to sem, ani do postupu níž,
záměrně nezasahuje. Tenhle skill (a jeho postup níž) zůstává jen pro
vstup/, aby šel bezpečně spustit i samostatně, bez vedlejšího efektu na
reálnou schránku.

## Postup pro každou novou fakturu

1. Projdi PDF soubory ve vstup/. Nová faktura je ten soubor, jehož jméno
   ještě není v žádném sešitu `data/objednavky.xlsx` ve sloupci „Soubor".
   Skill do vstup/ nic neukládá, nepřejmenovává ani nemaže (hlídá to i hook
   `chran-vstup.sh`) — pracuje jen s tím, co tam už leží.
2. Z PDF vytáhni šest údajů: číslo faktury, dodavatele (přesně podle
   faktury), IČO dodavatele, číslo objednávky, základ daně (částku bez DPH —
   ne částku s DPH) a datum splatnosti. Na faktuře bývají IČO dvě: dodavatele
   a odběratele (DEK a.s., 27636801). Ber jen to dodavatelovo — když je
   u dodavatele uvedené jen jméno a adresa, IČO chybí, i kdyby na faktuře
   jinde nějaké bylo.
3. Co se nepodaří přečíst, nech prázdné. Nic nedomýšlej.
4. **Zkontroluj duplicitu.** Projdi všechny sešity v `data/objednavky.xlsx` a
   podívej se, jestli už tam neleží řádek se stejným číslem faktury (a
   stejným dodavatelem) — může tam být i díky hlavní cestě z Doručené
   pošty popsané výše, ne jen díky Outlook toku. Pokud ano, jde o stejnou
   fakturu podruhé — nový řádek nepřidávej, nic neposílej, do protokolu
   napiš, že jde o duplicitu s odkazem na původní řádek/soubor.
5. Když nejde o duplicitu, najdi v `data/objednavky.xlsx` sešit se jménem
   dodavatele; když neexistuje, založ ho s hlavičkou Soubor / Datum přijetí /
   Číslo faktury / IČO / Číslo objednávky / Základ daně / Splatnost /
   Kompletní / Žádost odeslána. Přidej řádek s dnešní fakturou — do „Soubor"
   napiš přesně to jméno souboru, jaké má ve vstup/ (skill ho nevymýšlí).
   Kompletní = ano, když je vyplněných
   všech šest údajů, jinak ne. Sloupec „Žádost odeslána" zatím nech
   prázdný.
6. Když je faktura kompletní, tady skončit — nic se neposílá.
7. Když něco chybí a chybí jen jeden nebo dva údaje:
   a. Adresu, na kterou by se psalo, nemáš — soubor ve vstup/ přišel bez
      e-mailu. Odpověď proto jen sepiš a nic neodesílej; do sloupců
      „E-mail odeslán" a „Žádost odeslána" napiš „adresa dodavatele
      nenalezena, k ruční kontrole".
   b. Otevři (nebo založ) vystup/kontrola-<RRRR-MM-DD>.xlsx s prvním sešitem
      „Přehled" (Soubor / Dodavatel / Kompletní / Chybí / E-mail odeslán) a
      dál sešitem pro každého dodavatele, kterému toho dne něco chybělo
      (Soubor / Číslo faktury / Chybí / Navržená odpověď / E-mail odeslán).
      Sešit pojmenuj jménem dodavatele přesně tak, jak je na faktuře.
   c. Do sešitu dodavatele napiš, který údaj chybí, a navrhni text podle
      šablony níž.
   d. Je-li konektor na M365 se zapnutými write tools připojený **a** adresa
      z kroku 7a existuje, pošli ten text z kontrola-<RRRR-MM-DD>.xlsx jako
      nový e-mail na tuhle adresu, v kopii fakturace@dek.cz. Text neměň
      mezi tím, co je v sešitu, a tím, co odejde — v sešitu musí být přesně
      to, co dodavatel dostal. Předmět: „Doplnění faktury <číslo faktury>".
      Nehledej jinou cestu, jak poštu odeslat, ani odeslání nijak
      nenahrazuj.
   e. Datum a čas odeslání zapiš na tři místa: do řádku v sešitu dodavatele,
      do sešitu „Přehled" (obojí v kontrola-<RRRR-MM-DD>.xlsx) a do sloupce
      „Žádost odeslána" v data/objednavky.xlsx. Podle toho, proč se
      neodeslalo, napiš na všechna tři místa jednu z těchto hlášek:
      - konektor není připojený nebo nemá write tools: „připraveno, čeká na
        konektor",
      - adresa odesílatele se nenašla (krok 7a): „adresa dodavatele
        nenalezena, k ruční kontrole".
8. Když chybí tři a víc údajů, nebo se z PDF nedal přečíst text vůbec:
   nic neposílej. Zapiš to do protokolu jako „k ruční kontrole" a řekni mi
   to — je pravděpodobnější, že se PDF nepodařilo přečíst, než že je špatná
   faktura, a to není důvod psát dodavateli.
9. Na konec dne (nebo po každé faktuře) připiš řádek do
   vystup/protokol-<RRRR-MM-DD>.md: soubor, dodavatel, kompletní ano/ne,
   co chybělo, jestli se poslal e-mail (nebo proč ne) a kdy.

## Šablona e-mailu při chybějícím údaji

```
Předmět: Doplnění faktury <číslo faktury>

Dobrý den, <dodavatel>,

děkujeme za zaslanou fakturu. Při kontrole naším účetním oddělením jsme
nenalezli <chybějící údaj/e>, které potřebujeme mít na faktuře. Prosíme
o doplnění a opětovné zaslání faktury zpět.

S pozdravem,
Účtárna DEK
```

Jméno dodavatele v oslovení ber přesně tak, jak je napsané na faktuře.
Když chybí víc než jeden údaj, vyjmenuj je („IČO a číslo objednávky").

## Kdy se zastavit a nic neposílat
- z PDF se nedá přečíst text (sken bez OCR) — zapiš k ruční kontrole, e-mail neposílej
- chybí tři a víc ze šesti údajů — stejně, jde spíš o špatně přečtené PDF
- faktura přišla ze vstup/, ne z Doručené pošty — nemáš komu poslat,
  odpověď jen sepiš a označ ji k ruční kontrole
- data/objednavky.xlsx nejde otevřít nebo má jinou strukturu, než čekáš

## Co do skillu nepatří
Rozhodnutí, jestli fakturu zaplatit, cokoli k jejímu schválení nebo zápis do
účetního systému. Jediná automatická zpráva, kterou tenhle skill smí poslat,
je žádost dodavateli o doplnění chybějícího údaje na faktuře samotné.
Ukládání PDF do vstup/, zjišťování, kdo fakturu poslal, a čtení přímo
z Doručené pošty taky nepatří do skillu — o to se stará naplánovaná
automatizace popsaná v `rutina.md`.
