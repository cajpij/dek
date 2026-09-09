---
name: kontrola-faktur
description: Sleduje schránku fakturace@dek.cz (přes M365) nebo zpracuje, co
  leží ve vstup/, ukládá příchozí faktury v PDF, vytáhne z nich šest povinných
  údajů a zapíše je do evidence podle dodavatele. Když něco chybí, sám pošle
  dodavateli e-mail s žádostí o doplnění. Použij, když se má zkontrolovat
  schránka na nové faktury, nebo když se ptám, co je s fakturami k vyřízení.
---

# Kontrola faktur

## Kdy to spustit
Při každém běhu naplánované úlohy, nebo kdykoli se řekne „zkontroluj nové
faktury". Je-li připojený konektor na Microsoft 365, podívej se do schránky
fakturace@dek.cz na e-maily s PDF přílohou, které ještě nejsou uložené ve
vstup/. Bez konektoru (třeba při prvním spuštění cvičného projektu) zpracuj
místo toho PDF, která už ve vstup/ leží a která ještě nemají řádek v evidenci
— postup je od kroku 2 dál stejný, jen se u odeslání e-mailu jen navrhne text
(viz krok 6c). Když nic nového nepřišlo, nic nedělej a napiš to.

## Postup pro každou novou fakturu

1. Je-li faktura z e-mailu, ulož PDF přílohu do vstup/ jako
   `<RRRR-MM-DD>_<dodavatel>.pdf` (datum přijetí e-mailu, dodavatele zkrať
   na jedno slovo bez diakritiky; při shodě přidej `-2`, `-3`). Faktury, které
   už ve vstup/ jsou, znovu neukládej.
2. Z PDF vytáhni šest údajů: číslo faktury, dodavatele (přesně podle
   faktury), IČO, číslo objednávky, základ daně (částku bez DPH — ne částku
   s DPH) a datum splatnosti.
3. Co se nepodaří přečíst, nech prázdné. Nic nedomýšlej.
4. Najdi v data/objednavky.xlsx sešit se jménem dodavatele; když neexistuje,
   založ ho s hlavičkou Soubor / Datum přijetí / Číslo faktury / IČO / Číslo
   objednávky / Základ daně / Splatnost / Kompletní. Přidej řádek s dnešní
   fakturou. Kompletní = ano, když jsou vyplněných všech šest údajů, jinak ne.
5. Když je faktura kompletní, tady skončit — nic se neposílá.
6. Když něco chybí a chybí jen jeden nebo dva údaje:
   a. Otevři (nebo založ) vystup/kontrola-<RRRR-MM-DD>.xlsx s prvním sešitem
      „Přehled" (Soubor / Dodavatel / Kompletní / Chybí / E-mail odeslán) a
      dál sešitem pro každého dodavatele, kterému toho dne něco chybělo
      (Soubor / Číslo faktury / Chybí / Navržená odpověď / E-mail odeslán).
   b. Do sešitu dodavatele napiš, který údaj chybí, a navrhni text podle
      šablony níž.
   c. Je-li konektor na M365 se zapnutými write tools připojený, pošli e-mail
      na adresu, ze které faktura přišla, v kopii vedouci-uctarny@dek.cz, s
      tím textem, a do stejného řádku zapiš datum a čas odeslání. Bez
      připojeného konektoru e-mail neodešli — do sloupce E-mail odeslán napiš
      „připraveno, čeká na konektor" a nech text tak, jak je navržený.
      Předmět v obou případech: „Doplnění faktury <číslo faktury>".
7. Když chybí tři a víc údajů, nebo se z PDF nedal přečíst text vůbec:
   nic neposílej. Zapiš to do protokolu jako „k ruční kontrole" a řekni mi
   to — je pravděpodobnější, že se PDF nepodařilo přečíst, než že je špatná
   faktura, a to není důvod psát dodavateli.
8. Na konec dne (nebo po každé faktuře) připiš řádek do
   vystup/protokol-<RRRR-MM-DD>.md: soubor, dodavatel, kompletní ano/ne,
   co chybělo, jestli se poslal e-mail (nebo jen navrhl) a kdy.

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

Když chybí víc než jeden údaj, vyjmenuj je („IČO a číslo objednávky").

## Kdy se zastavit a nic neposílat
- z PDF se nedá přečíst text (sken bez OCR) — zapiš k ruční kontrole, e-mail neposílej
- chybí tři a víc ze šesti údajů — stejně, jde spíš o špatně přečtené PDF
- e-mail nemá jasně čitelnou adresu odesílatele, na kterou by šlo odpovědět
- data/objednavky.xlsx nejde otevřít nebo má jinou strukturu, než čekáš

## Co do skillu nepatří
Rozhodnutí, jestli fakturu zaplatit, cokoli k jejímu schválení nebo zápis do
účetního systému. Jediná automatická zpráva, kterou tenhle skill smí poslat,
je žádost dodavateli o doplnění chybějícího údaje na faktuře samotné.
