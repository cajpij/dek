# Moderátorský run-sheet

Jedna stránka, ze které se dá odmoderovat celodenní školení: program po blocích,
odpočet běžícího bloku, druhá obrazovka s velkým časem na plátno a průběžný
přehled o tom, jestli jedeš podle plánu.

Výchozí program je školení podle kurzu
[Introduction to Claude Cowork](https://academy.claude.com/courses/introduction-to-claude-cowork)
— 4 moduly, 14 lekcí a cvičení mezi nimi. Délky bloků jsou odhad, program se přepisuje
přímo v aplikaci.

## Spuštění

```bash
npm install
npm run dev
```

Aplikace naběhne na <http://localhost:5181>.

## Jak se to používá

**Konzole** (`/`) je to, co má moderátor před sebou. V hlavičce je aktuální čas,
skluz proti plánu a odhad konce akce. Vlevo běží aktuální blok s odpočtem, jeho
vnitřním programem k odškrtávání a poznámkami. Vpravo je celý harmonogram —
kliknutím na řádek se skočí na daný blok.

Pravý sloupec má dvě záložky: **Program** a **Účastníci**.

Aplikace má čtyři pohledy na jedné adrese:

| Adresa | Pro koho |
| --- | --- |
| `/` | Konzole lektora — program, odpočet, účastníci |
| `/#display` | Plátno pro sál — velký odpočet, u cvičení i zadání |
| `/#quiz` | Vstupní kvíz pro účastníky — rozdělí díly práce podle úrovně |
| `/#kb` | Knowledge base — úlohy podle agendy, ke kterým se tým vrací |

Odkazy na kvíz a knowledge base jsou i v **Nastavení a program**, ke zkopírování.

### Vstupní kvíz

Osm otázek na rozhodnutí z jejich práce, ne na definice. Z bodů (0–30, čtyři pásma)
nevypadne známka, ale díl paletové evidence, který si má člověk ve cvičeních vzít —
od převodu exportu do tabulky až po naplánovanou kontrolu a plugin pro tým.

Odpovědi nikam neodcházejí, zůstávají v prohlížeči účastníka. Na konci se jedním
tlačítkem zkopíruje shrnutí, které pošle lektorovi vlastním kanálem. Bez backendu
se centrálně sbírat nedají a předstírat opak by nemělo smysl.

### Knowledge base

Rozcestník pro tým po workshopu: úlohy podle agendy (palety, sklad, objednávky,
autodoprava, reklamace, faktury, technické listy, zákaznické centrum), u každé co
Claude dostane na vstupu a co má vypadnout. K tomu pravidla, která platí vždycky.
Obsah je v [`src/kb.ts`](src/kb.ts) — **žádná firemní data ani jména**, jen postupy,
takže stránka může být veřejná.

**Plátno** (`/#display`) je druhá obrazovka pro sál: název bloku, obří odpočet a co
bude následovat. Otevře se tlačítkem *Plátno* nebo klávesou <kbd>D</kbd>, přetáhne se
na projektor a přepne na celou obrazovku (<kbd>F</kbd> nebo dvojklik). Obě okna drží
`BroadcastChannel`, takže plátno reaguje okamžitě a nic mezi nimi netiká po drátě —
posílá se jen stav a čas si dopočítá samo.

### Klávesové zkratky

| Klávesa | Akce |
| --- | --- |
| <kbd>mezerník</kbd> | spustit / pauza |
| <kbd>→</kbd> <kbd>←</kbd> | další / předchozí blok |
| <kbd>+</kbd> <kbd>−</kbd> | prodloužit / zkrátit blok o minutu |
| <kbd>D</kbd> | otevřít okno na plátno |
| <kbd>F</kbd> | celá obrazovka |
| <kbd>R</kbd> | vynulovat odpočet bloku |

### Barvy odpočtu

Modrá běží normálně, zelená je pauza, oranžová poslední minuta, červená znamená,
že blok přetahuje — čas jde do minusu a počítá se, o kolik.

### Skluz proti plánu

Počítá se jen z uzavřených bloků: kolik času blok reálně sežral proti tomu, kolik
měl. Během běžícího bloku se tedy nehýbe a nerozhodí ho pauznutí odpočtu.
Odhad konce akce naopak počítá se zbytkem aktuálního bloku i všemi dalšími.

## Seznam účastníků

Záložka *Účastníci* drží u každého člověka odhad úrovně, co už umí, co od školení
potřebuje a poznámku pro lektora — aby bylo při cvičeních jasné, koho obejít dřív a
komu dát těžší zadání.

**Ve zdrojáku je `participants` prázdné schválně.** Jsou to údaje o konkrétních lidech
a repozitář je veřejný. Skutečný seznam žije v `ucastnici.json`, který je v `.gitignore`.
Na plátno se účastníci nedostanou nikdy.

Do aplikace se dostanou dvěma cestami:

1. **Lokálně** — **Nastavení a program → Načíst ze souboru**. Jména neopustí notebook.
2. **Zašifrovaně v nasazení** — viz níž. Na webu je zamčená obrazovka na heslo.

Soubor jen s klíčem `participants` se přilije ke stávajícímu programu. Soubor, který má
i `agenda`, nahradí celý program. Tvar je v [`ucastnici.example.json`](ucastnici.example.json):

```jsonc
{
  "participants": [
    {
      "name": "Jméno",
      "role": "pozice",                  // nepovinné
      "level": "advanced",               // unknown | beginner | intermediate | advanced
      "work": "na čem hlavně pracuje",   // z úvodního dotazníku
      "claudeCode": "Používám dost…",    // z úvodního dotazníku
      "wants": ["Automatizace opakovaných úkolů"],
      "knows": ["co už používá"],
      "needs": ["co od školení potřebuje"],
      "note": "Jak s ním pracovat."
    }
  ]
}
```

Tlačítko *Uložit do souboru* vyexportuje aktuální program i s účastníky — hodí se na
přenos mezi notebooky. Takový export už osobní údaje obsahuje, takže ho necommituj.
Tlačítko *Zapomenout* v záhlaví seznamu smaže účastníky z prohlížeče.

### Zašifrovaný seznam v nasazení

GitHub Pages neumí přihlašování — cokoli tam leží, je veřejné. Proto se na web nedává
seznam, ale jeho **šifra**: AES-256-GCM, klíč odvozený z hesla přes PBKDF2-SHA256
(600 000 iterací, doporučení OWASP). Aplikace se zeptá na heslo a dešifruje v prohlížeči;
heslo se nikam neodesílá ani neukládá.

```bash
npm run encrypt:participants        # zeptá se na heslo, přečte ucastnici.json
git add public/ucastnici.enc        # commituje se jen šifra
```

Heslo se zadává na terminálu, takže se nedostane do historie shellu. Skript odmítne heslo
kratší než 12 znaků a umí i jiný vstup a výstup:
`node scripts/encrypt-participants.mjs zdroj.json cil.enc`.

Co je potřeba vědět, než se to nasadí:

- **Heslo předej lidem jinou cestou než tímhle repem** — ne v commitu, ne v README.
- Šifru si kdokoli stáhne a může na ní **hádat heslo offline**. Proto to dlouhé odvozování
  klíče a proto musí být heslo silné; „cowork2026“ nestačí.
- Git historie je trvalá. Když heslo někdy unikne, dá se z historie vytáhnout i starý
  `.enc`. Při změně hesla je proto potřeba počítat s tím, že staré verze zůstávají.
- Chce-li to opravdový login a přehled, kdo se díval, patří to na hosting s ověřováním
  (Cloudflare Pages + Access), ne na GitHub Pages.

## Úprava programu

V aplikaci: **Nastavení a program** → JSON → *Použít*. Uloží se do `localStorage`,
takže přežije zavření stránky i pád notebooku uprostřed akce.

Trvale (a pro ostatní): [`src/config.ts`](src/config.ts). Tlačítko *Obnovit výchozí
program* se vrací k tomu, co je tam.

Struktura bloku:

```jsonc
{
  "title": "Modul 1 — Meet Claude Cowork",
  "min": 35,                    // plánovaná délka v minutách
  "kind": "talk",               // talk | work | qna | break
  "who": "Lektor",              // nepovinné
  "notes": ["…"],               // odrážky pro moderátora
  "steps": [                    // vnitřní program bloku, dá se odškrtávat
    { "title": "What is Claude Cowork", "min": 8, "detail": "Čím se liší od Chatu" }
  ]
}
```

`kind` řídí barvu a štítek: `break` je zelená pauza, `work` cvičení, `qna` otázky.
Časy v levém sloupci harmonogramu se dopočítávají z `event.startsAt` a délek bloků —
nezadávají se ručně.

## Nasazení na GitHub Pages

V repozitáři zapni **Settings → Pages → Source: GitHub Actions**. Workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) se pustí při pushi do
`main`, sám si dosadí `BASE_PATH` podle jména repozitáře a nasadí `dist/`.

Lokální produkční build:

```bash
npm run build && npm run preview
```

## Stack

React 19, TypeScript, MUI 9, Vite. Žádný backend — stav žije v prohlížeči.
