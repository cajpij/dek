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
