# Akční regál — user flow (modelový příklad pro workshop)

Zdroj: nahrávka rozhovoru s logistikou, 18 min (strojový přepis — názvy divizí a systémů mohou být přeslechnuté).
Vizualizace: diagram „Od magazínu do regálu" (je v lekci Co je automatizace).

## Kontext v číslech

- ~6 týdnů dopředu, bez pevného termínu
- 4 divize: nářadí · dekton (pěny, silikony) · elektro · voda-topo
- 11 produkťáků, každý má svoje značky/sekce
- regál 130 × 900 cm
- z ~150 položek magazínu se do regálu vejde ~80
- 3 datové zdroje: min/max, zásoby poboček, centrální sklad

## Flow

1. **Produkťáci nasypou obsah magazínu do Google Tabulky** — průběžně, ~6 týdnů předem. Kritéria zařazení: sezónnost, dohoda s dodavatelem, potřeba odprodat zásoby.
2. **Logistika si vezme svých ~7 sloupců** — zbytek tabulky patří marketingu, ostatní divize k ní přístup nemají.
3. **Vznikne velký Excel** — položky na jeden list, na další listy min/max, zásoby poboček, centrální sklad + status položky (napřímo od dodavatele vs. přes centrální sklad).
4. **Rozpad na 4 divizní Excely** ← *hotspot 2*. Dnes už s pomocí AI: vkládá se jen složený list („vložit jinak → hodnoty"), celý soubor je moc velký.
5. **Rozeslání 11 produkťákům e-mailem** ← *hotspot 2*. Každý dostane ~50 položek ze své sekce.
6. **Produkťák vybere 5–10 položek do regálu** — přidá prioritu a poznámku (titulka / omezené množství → jen 50 poboček).
7. **Ruční přepis odpovědí zpět do tabulky** ← *hotspot 1, největší bolest*. Kontrola, že se nic neposunulo; jeden produkťák posílá print screeny, které se přeťukávají.
8. **Fyzické vzorování v regálu** — měrné jednotky neodpovídají realitě (jednotka je vrtačka, ne kufr). Zkouší se, jestli se tři kufry vejdou vedle sebe; fotka slouží jako důkazní materiál.
9. **Návrh min/max + schválení** — podle prodejů za posledních 12 měsíců a skladových zásob; produkťáci upraví podle dohod s dodavateli.
10. **Tři finální podklady** ← *hotspot 3*: Word + Excel pro marketing (odtud na web), Excel pro centrální sklad (naskladnění), Excel pro backoffice (nastavení poboček).

## Místa pro automatizaci

**1 — Sběr odpovědí od produkťáků (kroky 6–7).** Teď: e-mail tam, e-mail zpět, vykopírovat, zkontrolovat posuny, přeťukat print screeny. Posun: zrušit e-mail jako přenosový formát — sdílený list nebo formulář, kde produkťák zapíše výběr, prioritu a poznámku přímo. Data nikdy neopustí tabulku, navíc je vidět, kdo neodpověděl.

**2 — Rozpad a rozeslání divizních Excelů (kroky 4–5).** Vlastní návrh z nahrávky: složený list na SharePoint / OneDrive, odtud automaticky vygenerovat 4 soubory podle divize a rozeslat notifikaci na konkrétní adresy.

**3 — Generování finálních podkladů (krok 10).** Jeden schválený zdroj dat + tři šablony. Návrh min/max podle prodejů se dá předpočítat, člověk potvrzuje.

**Co nechat člověku:** vzorování v regálu. Data o měrných jednotkách lžou, fotka je důkaz proti nim. Automatizace tomu má uvolnit místo, ne to nahradit.

## Citace

- „To je takový vysírací krok." (17:42 — o pinkání e-mailů)
- „Ona mi vždycky udělá print screen, takže já to tam vyťukávám." (17:49)
- „I když mi agenda říká, že se tam tři vejdou — vyfotím to a mám důkazní materiál." (~05:00)
- „Tady už by se to mohlo dělat automaticky." (06:42 — vlastní návrh u rozpadu Excelů)
