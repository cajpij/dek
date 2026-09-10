# Naplánovaná automatizace: odpovědi na otázky z nástěnky

Kdykoli se někdo jiný než lektor zeptá na [nástěnce](https://cajpij.github.io/dek/#academy?nastenka),
tahle automatizace najde odpověď v lekcích, dopíše ji do
[Zodpovězených otázek](https://cajpij.github.io/dek/#academy?odpovedi) a nasadí to.

Zakládá se v aplikaci Claude → záložka **Code** → **Routines** → **New routine**.

## Formulář

| Pole | Co vyplnit |
| --- | --- |
| **Name** | `odpovedi-z-nastenky` |
| **Description** | Odpoví z lekcí na nové otázky z nástěnky a nasadí je do akademie |
| **Model** | Sonnet — hledá se v textu, nic těžkého |
| **Permission mode** | Accept edits — jinak se běh zastaví na dotazu, na který nikdo neodpoví |
| **Folder** | `/Users/brnk/dek` |
| **Schedule** | Every 5 minutes, v pracovní dny 8:00–18:00 |

Proč každých pět minut: člověk, který se zeptal v sále, na odpověď nečeká do
druhého dne. Většina běhů neudělá nic — `nove-otazky.py` vrátí prázdné pole a
běh hned skončí, takže to skoro nic nestojí.

## Instructions

```
Pracuj ve složce /Users/brnk/dek.

1. Zjisti, na co se ještě neodpovědělo:
   python3 scripts/nove-otazky.py
   Vypíše JSON s otázkami z nástěnky, které nejsou od lektora a ještě
   nemají odpověď. Když je výstup prázdné pole, skonči — nic needituj,
   nic necommituj, nic nepushuj.

2. Každou otázku roztřiď.
   Patří do akademie: práce s Claudem, Claude Code, Cowork, konektory,
   automatizace a rutiny, složky a data, cvičný projekt s fakturami,
   MCP, design system, ceny a limity, bezpečnost a hranice.
   Nepatří: pozdravy, vtipy, jídlo, technika, HR, vzkazy jen pro lektora,
   cokoli, co s akademií nesouvisí.
   Co nepatří, připiš na nový řádek do scripts/preskocene.txt ve tvaru
   "<id>  <důvod třemi slovy>" a dál se tou otázkou nezabývej.

3. Na to, co patří, najdi odpověď V LEKCÍCH.
   python3 scripts/lekce.py               vypíše všechny lekce i s odkazy
   python3 scripts/lekce.py <slovo>       zúží to na lekce, kde slovo je
   Pak si najdi místo v src/academy.ts (grep -n) a přečti si ho.

   Odpověď musí vycházet z toho, co v lekcích doopravdy stojí. Nedomýšlej
   ji z obecných znalostí o Claudovi a hlavně si nevymýšlej, jak co chodí
   v DEKu — to nevíš.

   Když odpověď v lekcích není, napiš to rovnou ("Tohle lekce neřeší…")
   a nech zdroje prázdné. Prázdné zdroje jsou správná odpověď, vymyšlený
   odkaz ne.

   Piš krátce — dva tři odstavce, česky, tykáním, bez oslovení a bez
   podpisu. Odstavce odděl prázdným řádkem.

4. Odpověď zapiš. Ulož JSON do /tmp/odpoved.json a pusť:
   python3 scripts/pridej-odpoved.py < /tmp/odpoved.json

   Tvar JSONu:
   {
     "id": "<id z kroku 1>",
     "jmeno": "<jmeno z kroku 1>",
     "otazka": "<text z kroku 1>",
     "cas": "<cas z kroku 1>",
     "lekce": "<lekce z kroku 1, když není null>",
     "odpoved": "První odstavec.\n\nDruhý odstavec.",
     "zdroje": [{"label": "<název lekce>", "href": "<odkaz z lekce.py>"}]
   }

5. Až budeš mít všechny otázky z tohohle běhu hotové, nasaď to:
   npm run build
   Když build spadne, vrať změny (git checkout -- .) a NEPUSHUJ.
   Když projde:
   git add src/odpovedi.ts scripts/preskocene.txt
   git commit -m "Odpovědi z nástěnky: <jména tazatelů>"
   git push origin main

Co nikdy neděláš:
- Needituješ src/academy.ts, src/config.ts ani nic jiného než
  src/odpovedi.ts a scripts/preskocene.txt.
- Nemažeš a neupravuješ nic na nástěnce. Jen z ní čteš.
- Nepíšeš odpověď na otázku od lektora (Martin) — nove-otazky.py je
  vynechává, tak to nech být.
- Nepushuješ, když build neprošel.
```

## Než to necháš běžet samo

1. Po uložení klikni na **Run now** a projdi si, co to udělalo — hlavně
   jestli odpověď opravdu odpovídá tomu, co v odkazované lekci stojí.
2. Podívej se na `git log` a na
   [Zodpovězené otázky](https://cajpij.github.io/dek/#academy?odpovedi).
3. Teprve pak to nech běžet. **Odpovědi nikdo předem nečte** — jdou rovnou
   ven na stránku, kterou vidí celý sál. Stránka to říká nahlas, ale během
   workshopu se tam občas koukni.

## Co je dobré vědět

- Automatizace běží, jen když je aplikace Claude spuštěná a počítač vzhůru.
  Přeskočený běh se nedohání — otázka počká na ten další.
- Nasazení přes GitHub Actions trvá minutu dvě, takže od otázky k odpovědi
  na stránce uteče spíš pět až deset minut než pět.
- Otázka, u které se automatizace splete, se nepřepisuje sama. Oprav ji
  ručně v `src/odpovedi.ts` — nebo záznam smaž a smaž i její id, ať se
  otázka při dalším běhu zpracuje znovu.
- `scripts/preskocene.txt` je normální textový soubor. Když tam něco
  spadne omylem, řádek smaž a příští běh se k otázce vrátí.
