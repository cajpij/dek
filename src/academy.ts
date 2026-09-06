/**
 * Obsah DEK Academy — inline lekce, které si člověk projde sám u počítače.
 *
 * Struktura je vzatá z Claude Academy: rozcestník kurzů po sekcích, detail
 * kurzu se sylabem po modulech a stránka lekce se sidebarem a postupem.
 * Rozdíl je v tom, že tady se nenatáčí. Lekce jsou psané tak, aby se daly
 * odklikat u vlastního počítače — každý krok má být něco, co jde udělat hned;
 * videa jsou jen odkazy na cizí, když to někdo ukázal líp než text.
 *
 * Obsah je oddělený od komponent schválně: doplnit lekci znamená přidat objekt
 * do LESSONS, ne sahat do UI.
 */

/* ------------------------------------------------------------------ typy */

/** Stavební bloky, ze kterých se skládá tělo lekce. */
export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'steps'; items: { title: string; body: string; code?: string }[] }
  | { kind: 'code'; text: string; caption?: string }
  | { kind: 'note'; tone: 'info' | 'warn' | 'ok'; title: string; text: string }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'figure'; name: 'regal-flow' | 'sync-map' | 'project-tree' | 'automation-ladder'; caption: string }
  | { kind: 'checklist'; title: string; items: string[] }
  | { kind: 'task'; title: string; intro: string; items: string[]; hint?: string }
  | { kind: 'video'; title: string; items: VideoRef[] }
  /** Stejný krok, jiný systém — čtenář si přepne a vidí jen svou variantu. */
  | { kind: 'platform'; mac: Block[]; win: Block[] }
  /** Táž látka na příkladech z různých agend — každý si najde tu svoji. */
  | { kind: 'tabs'; items: { label: string; blocks: Block[] }[] }
  /** Odkazy ven — oficiální dokumentace, ke které se dá vrátit. */
  | { kind: 'links'; title: string; items: { label: string; href: string; note?: string }[] }

export interface VideoRef {
  /** ID z YouTube, tedy to za `watch?v=`. */
  id: string
  title: string
  author: string
  /** Proč to sem patří — jedna věta, ať je jasné, jestli to má cenu pouštět. */
  note: string
}

export interface Lesson {
  slug: string
  /** Do kterého modulu lekce patří — modul se skládá podle tohohle klíče. */
  module: string
  title: string
  /** Jedna věta do sylabu a do sidebaru. */
  summary: string
  minutes: number
  kind: 'lekce' | 'zadání'
  /** „Po téhle lekci budeš umět…“ */
  outcomes: string[]
  body: Block[]
}

export interface Module {
  key: string
  title: string
  summary: string
}

export interface Course {
  slug: string
  title: string
  summary: string
  /** Delší odstavec na detailu kurzu. */
  intro: string
  level: string
  section: string
  modules: Module[]
  lessons: Lesson[]
  learn: string[]
  prerequisites: string[]
}

/** Karta na rozcestníku, na kterou se ještě nedá kliknout. */
export interface Upcoming {
  section: string
  title: string
  summary: string
  note: string
}

/* --------------------------------------------------------------- obsah */

const VIDEOS_CLAUDE_CODE: VideoRef[] = [
  {
    id: 'inxAjCRHe2o',
    title: 'Claude Code Tutorial for Non-Coders',
    author: 'Kevin Stratvert',
    note: 'Od instalace po první úlohu, bez předpokladu, že umíš programovat.',
  },
  {
    id: 'cV52QdcfA0s',
    title: 'How to Use CLAUDE.md, Skills, and Hooks',
    author: 'Code With Robby',
    note: 'Konkrétně k CLAUDE.md a skillům — pusť si to, až budeš psát svůj první.',
  },
]

const LESSON_PROJEKT: Lesson = {
  slug: 'projekt-v-claude-code',
  module: 'start',
  title: 'Projekt v Claude Code: co si založit',
  summary:
    'Projekt, CLAUDE.md, skill, artefakt, konektor — co který pojem znamená, na hotových příkladech z logistiky, dopravy, BI, marketingu a vedení.',
  minutes: 30,
  kind: 'lekce',
  outcomes: [
    'vysvětlit, co je v Claude Code projekt, sezení, skill, artefakt a konektor',
    'rozhodnout, co patří do CLAUDE.md a co do skillu',
    'založit si složku projektu se správnou strukturou',
    'napsat CLAUDE.md, který nemusíš každé ráno opakovat v chatu',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Claude Code se nespouští „v aplikaci“. Spouští se ve složce — a všechno, co si v něm nastavíš, jsou obyčejné soubory v té složce. To je dobrá zpráva: nastavení se dá číst, poslat kolegovi a verzovat. Tahle lekce projde pojmy, o které se opřeš, a končí seznamem toho, co musíš mít vytvořené, než začneš automatizovat vlastní agendu.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Pro koho to je',
      text:
        'Pro lidi z logistiky, dopravy, BI, marketingu a vedení, kteří nechtějí programovat, ale chtějí, aby se opakovaná práce dělala sama. Nic z toho, co je níž, není kód — jsou to textové soubory a složky.',
    },
    { kind: 'h', text: 'Projekt je složka' },
    {
      kind: 'p',
      text:
        'Claude vidí obsah složky, ve které ho spustíš, a nic nad ní. Proto platí jednoduché pravidlo: jedna agenda = jedna složka. Ne jedna velká složka „AI“, do které se sype všechno. Když si založíš zvlášť akční regál, zvlášť reporty a zvlášť ceníky, každý projekt si drží svoje pravidla a nepletou se dohromady.',
    },
    {
      kind: 'figure',
      name: 'project-tree',
      caption: 'Struktura, která se osvědčila. Nic z toho není povinné — a přesto se všechno vyplatí.',
    },
    { kind: 'h', text: 'A když ta složka je sdílená knihovna?' },
    {
      kind: 'p',
      text:
        'Většina agend nemá data na ploše, ale ve sdílené knihovně na SharePointu. Dobrá zpráva: nic zvláštního se nekoná. Nasyncovaná knihovna je pro počítač obyčejná složka, takže projekt může ležet přímo v ní — struktura je úplně stejná, mění se jenom cesta.',
    },
    {
      kind: 'platform',
      mac: [
        {
          kind: 'code',
          text: `~/Library/CloudStorage/OneDrive-SharedLibraries-DEK/Magazín/
└── akcni-regal/
    ├── CLAUDE.md
    ├── data/
    ├── vystupy/
    └── .claude/skills/`,
          caption: 'Na Macu je složka Library skrytá — do Finderu se dostaneš přes ⇧⌘G. Složka .claude začíná tečkou, takže ji Finder taky nezobrazuje; ⇧⌘. skryté soubory přepne.',
        },
      ],
      win: [
        {
          kind: 'code',
          text: `C:\\Users\\<jmeno>\\DEK\\Magazín\\
└── akcni-regal\\
    ├── CLAUDE.md
    ├── data\\
    ├── vystupy\\
    └── .claude\\skills\\`,
          caption: 'Ve Windows je knihovna pod profilem uživatele, v Průzkumníku s ikonou budovy. Složku .claude Průzkumník normálně ukazuje.',
        },
      ],
    },
    {
      kind: 'table',
      head: ['Co se změní', 'Proč na tom záleží'],
      rows: [
        [
          'CLAUDE.md a skilly se nasyncují celému týmu',
          'To je většinou výhoda: pravidla přestanou být tvoje a stanou se týmová. Zároveň to znamená, že do nich nepiš nic osobního.',
        ],
        [
          'Všechno ve vystupy/ uvidí ostatní',
          'Rozpracované věci pojmenovávej tak, aby bylo poznat, že rozpracované jsou. Nikdo nemá poznat verzi podle data změny.',
        ],
        [
          'Soubory musí být stažené v zařízení',
          'Files On-Demand jinak nechá na disku jen zástupce a Claude v nich nic nepřečte. Pravý klik na složku → Vždy ponechat v tomto zařízení.',
        ],
        [
          'Dva lidi ve stejné složce naráz',
          'OneDrive udělá konfliktní kopii. Nespouštěj Clauda nad stejnou složkou ze dvou počítačů současně.',
        ],
        [
          'Práva se dědí ze SharePointu',
          'Claude vidí přesně to, co vidíš ty. Nic víc, nic míň.',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Druhá varianta: projekt lokálně, knihovna jako zdroj',
      text:
        'Když nechceš svoje pokusy syncovat celému oddělení, nech projekt u sebe na disku a knihovnu připoj jako druhou složku. Claude pak čte data z knihovny a zapisuje k tobě. Nevýhoda: pravidla ani skilly nikdo jiný neuvidí. Rozhodni se podle toho, jestli je agenda tvoje, nebo týmová.',
    },
    { kind: 'h', text: 'CLAUDE.md je paměť projektu' },
    {
      kind: 'p',
      text:
        'Textový soubor v kořeni složky, který se načte na začátku každého sezení. Sem patří to, co bys jinak vysvětlovala pokaždé znovu: firemní slovník (co je min/max, CS-ko, produkťák, divize), kde leží která data, jak se mají jmenovat výstupy a co se nikdy nesmí. Pravidlo, kdy něco dopsat: když stejnou opravu píšeš podruhé.',
    },
    {
      kind: 'code',
      text: `# Akční regál

## Slovník
- CS = centrální sklad
- produkťák = produktový manažer divize, vybírá položky do regálu
- min/max = doporučené množství na pobočku

## Kde jsou data
- data/ — export z Google Tabulky, vždy nejnovější soubor podle data v názvu
- vystupy/ — sem ukládej všechno, co vytvoříš

## Pravidla
- Nikdy nepřepisuj soubory v data/. Výsledek ulož jako nový soubor do vystupy/.
- Názvy výstupů: <agenda>-<divize>-<RRRR-MM-DD>.xlsx
- Když si nejsi jistý, kterou verzi vzít, zeptej se místo hádání.`,
      caption: 'Takhle vypadá CLAUDE.md, který dává smysl. Drž ho pod dvěma sty řádky a piš konkrétně.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nemusíš ho psát na prázdno',
      text:
        'Příkaz /init si projde složku a vygeneruje první verzi. Příkaz /memory ukáže, které soubory s pravidly se do sezení načetly, a otevře je k úpravě. Claude si navíc sám zapisuje opravy, které mu dáš — i ty najdeš přes /memory.',
    },
    { kind: 'h', text: 'Sezení začíná načisto' },
    {
      kind: 'p',
      text:
        'Každý nový rozhovor začíná bez paměti na ten předchozí — kromě CLAUDE.md a poznámek, které si Claude zapsal sám. Zní to jako nevýhoda, ale je to ochrana: dlouhé sezení, ve kterém se míchá pět různých úloh, dává horší výsledky než pět krátkých. Jedna úloha = jedno sezení, mezi nimi /clear.',
    },
    { kind: 'h', text: 'Skill je zabalený postup' },
    {
      kind: 'p',
      text:
        'Když stejný postup popisuješ potřetí, přestaň ho popisovat a udělej z něj skill. Je to složka se souborem SKILL.md: nahoře pár řádků o tom, co skill dělá a kdy se má použít, pod tím samotný postup. Claude si ho pak vybere sám, když na takovou úlohu narazí — nebo ho spustíš lomítkem podle jména.',
    },
    {
      kind: 'code',
      text: `.claude/skills/rozpad-divizi/SKILL.md

---
name: rozpad-divizi
description: Rozdělí velký Excel s položkami magazínu na čtyři divizní soubory (nářadí, dekton, elektro, voda-topo). Použij, když je v data/ nový export a mají se rozeslat produkťákům.
---

1. Najdi v data/ nejnovější export podle data v názvu.
2. Zkontroluj, že má sloupce Kód, Název, Divize, Min, Max.
3. Pro každou divizi vytvoř samostatný soubor do vystupy/.
...`,
      caption: 'Řádek description rozhoduje o tom, kdy se skill sám nabídne. Piš do něj i slova, která bys sama napsala do zadání.',
    },
    { kind: 'h', text: 'Artefakt je publikovaná stránka' },
    {
      kind: 'p',
      text:
        'Přehled, dashboard, kalkulačka, checklist pro tým. Na rozdíl od souboru má vlastní adresu, dá se poslat kolegovi odkazem a příště se aktualizuje na stejném místě, takže nikomu nezůstane v ruce stará verze. Tahle akademie je taky jen publikovaná stránka.',
    },
    {
      kind: 'table',
      head: ['Chceš…', 'Uděláš z toho'],
      rows: [
        ['pravidlo, které platí pořád', 'řádek v CLAUDE.md'],
        ['postup, který opakuješ každý týden', 'skill v .claude/skills/'],
        ['přehled, do kterého se bude někdo dívat', 'artefakt'],
        ['soubor, který někomu pošleš mailem', 'obyčejný výstup do vystupy/'],
        ['přístup do systému, kde data žijí', 'konektor'],
      ],
    },
    { kind: 'h', text: 'Konektor napojí systém' },
    {
      kind: 'p',
      text:
        'Konektor (technicky MCP server) dá Claudovi nástroje k jednomu konkrétnímu systému — katalogu, úložišti, ticketovacímu nástroji. Zapojuj jen to, co pro danou agendu opravdu potřebuješ: každý konektor navíc je další místo, kde se dá něco splést, a další účet, který někdo spravuje.',
    },
    { kind: 'h', text: 'Než se něco změní, ptá se' },
    {
      kind: 'p',
      text:
        'U věcí, které mění soubory, se vyplatí nechat si nejdřív napsat plán, přečíst ho a teprve pak odsouhlasit. Claude se navíc ptá, než něco zapíše nebo spustí; mazání souborů je vypnuté, dokud ho výslovně nepovolíš. Neber ta potvrzení jako obtěžování — je to jediné místo, kde chybu chytíš dřív, než se stane.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Do složky projektu nepatří všechno',
      text:
        'Claude vidí celý obsah složky. Nedávej do ní věci, které s agendou nesouvisejí — osobní dokumenty, hesla, exporty s údaji, které tam nemají co dělat. Platí to samé, co u sdílené složky pro kolegu.',
    },
    {
      kind: 'video',
      title: 'Videa k Claude Code',
      items: VIDEOS_CLAUDE_CODE,
    },
    { kind: 'h', text: 'Konkrétní příklad: projekt akčního regálu' },
    {
      kind: 'p',
      text:
        'Takhle to vypadá u agendy, kterou v tomhle kurzu rozebíráme celou. Logistika dostává od produkťáků obsah magazínu ve sdílené tabulce, doplňuje k položkám skladová data, rozpadá to na čtyři divizní soubory a rozesílá produkťákům. Projekt na tuhle agendu vypadá takhle — a všechno v něm je obyčejný text.',
    },
    {
      kind: 'code',
      text: `akcni-regal/
├── CLAUDE.md
├── data/
│   ├── 20260902_Data_CS_skladem.xlsx
│   ├── 20260902_SD_CS.xlsx
│   ├── 20260901_minmax.xlsx
│   └── Magazin2026_Logistika_export.csv
├── vystupy/
│   ├── Magazín ŘÍJEN - Nářadí.xlsx
│   ├── Magazín ŘÍJEN - Elektro.xlsx
│   ├── Magazín ŘÍJEN - VTS.xlsx
│   └── Magazín ŘÍJEN - Piekarová.xlsx
└── .claude/
    └── skills/
        └── logisticke-dostupnosti/SKILL.md`,
      caption: 'Reálné názvy z té agendy. Data zůstávají v data/ nedotčená, všechno nové vzniká ve vystupy/.',
    },
    {
      kind: 'code',
      text: `# Akční regál

Připravuju obsah akčního regálu na pobočkách podle tištěného magazínu.
Zdroj je Google Tabulka Magazín 2026, list Logistika. Cyklus začíná
zhruba šest týdnů před vydáním magazínu.

## Slovník
- CS = centrální sklad
- SD = skladová dostupnost (SD celkem, SD sklad, SD prodejna, SD na CS)
- PM / produkťák = produktový manažer, vybírá co půjde do regálu
- divize = Nářadí, Elektro, VTS, Piekarová
- barva = zelená / oranžová / šedá podle klíče v řádku 1 a 2 listu Logistika
- vzorování = fyzická zkouška v regálu, varianty 1,33 m a 1,00 m,
  vždy pro jeden i dva regály

## Kde jsou data
- data/<RRRRMMDD>_Data_CS_skladem — zásoby na centrálním skladu
- data/<RRRRMMDD>_SD_CS — skladová dostupnost CS
- data/<RRRRMMDD>_minmax — doporučená množství
- Ber vždy nejnovější podle data v názvu. Když u všech tří není stejné,
  napiš to a zastav se.

## Pravidla
- Do data/ nezapisuj. Výstupy patří do vystupy/.
- Názvy výstupů: Magazín <MĚSÍC> - <divize>
- Čísla položek a katalogová čísla jsou text. Nepřevádět na čísla,
  nedoplňovat nuly.
- Sloupce, které vyplňuje produkťák, nechávej prázdné:
  AKČNÍ REGÁL (ANO/NE), POZNÁMKA, PRIORITA.
- Prodeje počítám za posledních 12 měsíců, ne za kalendářní rok.
- Když v exportu chybí sloupec, napiš to a zastav se. Nedopočítávej.`,
      caption: 'Celý CLAUDE.md téhle agendy. Většina řádků vznikla tak, že se něco pokazilo a příště se to nemělo opakovat.',
    },
    {
      kind: 'h',
      text: 'První tři zadání, která v tom projektu dávají smysl',
    },
    {
      kind: 'list',
      items: [
        '„Podívej se do data/ a řekni mi, který soubor je u každého ze tří zdrojů nejnovější a jestli mají stejné datum.“ — ověření, že rozumí pojmenování.',
        '„Ke každé položce z exportu listu Logistika dotáhni min/max, SD CS a zásobu na CS. Kde data chybí, nech prázdno a na konci vypiš, u kolika položek to bylo.“ — spojení tří zdrojů.',
        '„Rozděl to podle divize na soubory Magazín ŘÍJEN - Nářadí, - Elektro, - VTS a - Piekarová do vystupy/. Sloupce AKČNÍ REGÁL, POZNÁMKA a PRIORITA nech prázdné.“ — to, co se dělalo ručně.',
      ],
    },
    { kind: 'h', text: 'Dobré a špatné zadání' },
    {
      kind: 'table',
      head: ['Místo tohohle', 'Napiš tohle', 'Proč'],
      rows: [
        [
          '„Zpracuj mi ten Excel.“',
          '„Vezmi nejnovější magazin-*.xlsx z data/, dotáhni k položkám min/max a ulož výsledek do vystupy/.“',
          'Pojmenuj vstup, operaci i místo výsledku. Jinak hádá všechno tři.',
        ],
        [
          '„Uprav to, ať je to hezčí.“',
          '„Sloupce Kód, Název, Divize, Min, Max v tomhle pořadí, zamrazený první řádek, čísla bez desetinných míst.“',
          'Ověřitelné zadání se dá zkontrolovat. „Hezčí“ ne.',
        ],
        [
          '„Doplň chybějící hodnoty.“',
          '„Kde min/max chybí, nech prázdno a vypiš mi seznam těch položek.“',
          'Nechceš odhad tam, kde má být otazník.',
        ],
        [
          '„Udělej to jako minule.“',
          '„Postupuj podle skillu logisticke-dostupnosti.“',
          'Minule si nepamatuje. Skill ano.',
        ],
      ],
    },
    { kind: 'h', text: 'A co u jiných agend' },
    {
      kind: 'p',
      text:
        'Struktura je pokaždé stejná, mění se jen slovník a pravidla. Přepni si agendu, která je nejblíž té tvojí.',
    },
    {
      kind: 'tabs',
      items: [
        {
          label: 'Autodoprava',
          blocks: [
            {
              kind: 'code',
              text: `svozy/
├── CLAUDE.md      # turnus, dispečer, prázdný km, kdo je dopravce
├── data/          # export z knihy jízd, CSV po týdnech
└── vystupy/       # týdenní přehledy

Zadání na začátek:
- „Spočítej z jízd za minulý týden podíl prázdných kilometrů po vozidlech.“
- „Vypiš tři vozidla s nejhorším poměrem a u každého tři nejdelší prázdné úseky.“
- „Ulož to jako přehled do vystupy/ a shrň do pěti vět, co bych měl řešit.“`,
            },
          ],
        },
        {
          label: 'BI a reporting',
          blocks: [
            {
              kind: 'code',
              text: `bi-logistika/
├── CLAUDE.md      # zkratky ŘZ, CS, ARG, SD_CZ; co musí obsahovat požadavek
├── data/          # export požadavků z nástěnky, exporty k modelům
└── vystupy/       # zadání pro realizaci, datové slovníky

U BI se nepřelévají data mezi soubory, ale zadání mezi lidmi:
nástěnka jde Nové požadavky → Specifikace → Analýza BI → Tvorba zadání
→ Připraveno k realizaci → Realizace.

Zadání na začátek:
- „Vezmi tenhle požadavek a napiš ho ve tvaru, který projde ze Specifikace
   do Analýzy napoprvé. Co chybí, vypiš jako otázky na zadavatele.“
- „Porovnej sloupce dvou exportů a vypiš, kde se schéma rozešlo.“
- „Projdi požadavky za poslední půlrok a řekni, které se opakují natolik,
   že mají být modelem, ne jednorázovkou.“`,
            },
          ],
        },
        {
          label: 'Marketing',
          blocks: [
            {
              kind: 'code',
              text: `magazin/
├── CLAUDE.md      # tón, délky textů, zakázaná slova, jak píšeme ceny
├── data/          # tabulka položek, podklady od dodavatelů
└── vystupy/       # texty pro web a leták

Zadání na začátek:
- „Z tabulky položek napiš popisky pro web, každý do 200 znaků, podle tónu z CLAUDE.md.“
- „Zkontroluj, jestli někde nepoužíváme zakázaná slova ze seznamu.“
- „Udělej přehled, které položky mají hotový text a které ne.“`,
            },
          ],
        },
        {
          label: 'Vedení',
          blocks: [
            {
              kind: 'code',
              text: `porady/
├── CLAUDE.md      # kdo je kdo, co sledujeme, jak vypadá úkol
├── data/          # přepisy porad, podklady
└── vystupy/       # zápisy a přehledy

Zadání na začátek:
- „Z přepisu porady vytáhni rozhodnutí, úkoly a kdo je vlastní. Co není jasné, označ.“
- „Porovnej úkoly z posledních tří porad a řekni, co se veze bez pohybu.“
- „Shrň mi to na jednu stránku pro vedení — bez omáčky, jen stav a rizika.“`,
            },
          ],
        },
      ],
    },
    {
      kind: 'checklist',
      title: 'Co mít vytvořené, než začneš',
      items: [
        'Složka pojmenovaná po agendě, ne po nástroji',
        'CLAUDE.md se slovníkem, cestami k datům a zákazy',
        'Podsložka data/ s reálným vzorkem, ne s celou databází',
        'Podsložka vystupy/, kam jdou výsledky',
        'První skill na postup, který děláš každý týden',
        'Jeden artefakt jako živý přehled pro tým',
        'Zapojený konektor, pokud data žijí v systému',
      ],
    },
    {
      kind: 'task',
      title: 'Cvičení: založ projekt na svoji agendu',
      intro:
        'Vyber si jednu činnost, kterou děláš každý týden a která tě štve. Nezačínej tou nejsložitější.',
      items: [
        'Založ složku pojmenovanou po té agendě a v ní data/ a vystupy/.',
        'Do data/ dej jeden reálný soubor, se kterým běžně pracuješ.',
        'Napiš CLAUDE.md: pět řádků slovníku, kde jsou data, dvě pravidla, co se nesmí.',
        'Spusť Clauda v té složce a nech ho popsat vlastními slovy, čemu ta agenda slouží. Co nesedí, dopiš do CLAUDE.md.',
        'Zadej mu první úlohu a všímej si, kolikrát mu musíš něco vysvětlit. Každé takové vysvětlení je kandidát na řádek v CLAUDE.md.',
      ],
      hint:
        'Nesnaž se napsat dokonalé CLAUDE.md napoprvé. Vzniká tak, že do něj týden dopisuješ věci, které ses přistihla vysvětlovat podruhé.',
    },
  ],
}

const VIDEOS_SHAREPOINT: VideoRef[] = [
  {
    id: 'lM7feEPhtgE',
    title: 'Sync vs Add shortcut to OneDrive for SharePoint library?',
    author: 'SharePoint Wizard',
    note: 'Rozdíl mezi Synchronizovat a Přidat zástupce do OneDrivu. Pusť si to, než se rozhodneš, kterou cestou jít.',
  },
  {
    id: 'EGWuRI5oYg0',
    title: 'Learn how to work properly with "Add Shortcut to OneDrive"',
    author: 'SharePoint Wizard',
    note: 'Celý postup naklikaný v knihovně dokumentů — i to, co se stane, když zástupce odeberete.',
  },
  {
    id: 'SQIIah7EIGM',
    title: 'Always Keep on this Device Option',
    author: 'TutorTube',
    note: 'Files On-Demand a proč jsou soubory prázdné, dokud je nestáhnete do zařízení.',
  },
]

const STEPS_MAC: Block[] = [
  {
    kind: 'steps',
    items: [
      {
        title: 'Otevři knihovnu v prohlížeči',
        body:
          'V SharePointu jdi do týmového webu a otevři knihovnu dokumentů, se kterou chceš pracovat — třeba Dokumenty nebo konkrétní podsložku s podklady. Pracuj radši s podsložkou než s celou knihovnou: syncovat stovky gigabajtů podkladů, ze kterých potřebuješ tři, nemá smysl.',
      },
      {
        title: 'Klikni na Přidat zástupce do OneDrivu',
        body:
          'V horní liště knihovny je Synchronizovat a vedle Přidat zástupce do OneDrivu (Add shortcut to OneDrive). Vezmi zástupce — chová se stejně, ale funguje i na jiných počítačích, kde jsi přihlášený, a dá se snáz odebrat. Systém se zeptá, jestli má otevřít OneDrive, potvrď to.',
      },
      {
        title: 'Počkej, až OneDrive dosyncuje',
        body:
          'Ikona mráčku v horní liště Macu ukazuje průběh. Než je hotovo, ve složce jsou jen názvy souborů bez obsahu.',
      },
      {
        title: 'Najdi složku ve Finderu',
        body:
          'Ve Finderu v levém panelu přibude OneDrive – <název firmy> a v něm ta knihovna. Když ji tam nevidíš, otevři ji přes Finder → Otevřít složku (⇧⌘G) a vlož cestu níž. Složka Library je normálně skrytá, proto se tam nedostaneš klikáním.',
        code: '~/Library/CloudStorage/',
      },
      {
        title: 'Řekni Macu, ať soubory drží u sebe',
        body:
          'Pravý klik na složku → Vždy ponechat v tomto zařízení (Always Keep on This Device). Bez tohohle kroku má většina souborů na disku jen zástupce a Claude v nich nic nepřečte — vidí název, ale ne obsah.',
      },
      {
        title: 'Připoj složku v Claudovi',
        body:
          'V desktopové aplikaci Claude otevři úkol v Coworku a použij tlačítko Add folder / Přidat složku. Vyber tu nasyncovanou složku. Od téhle chvíle v ní Claude umí číst, hledat a zakládat soubory.',
      },
      {
        title: 'Ověř to jednou větou',
        body:
          'Napiš Claudovi zadání níž. Když ti vypíše skutečné názvy souborů a velikosti, je hotovo.',
        code: 'Vypiš mi, co je v připojené složce — kolik souborů, jaké typy a jak jsou staré.',
      },
    ],
  },
  {
    kind: 'table',
    head: ['Co se děje', 'Čím to je', 'Co s tím'],
    rows: [
      [
        'Složku ve Finderu nevidím',
        'OneDrive syncuje do skryté složky Library',
        '⇧⌘G a vlož ~/Library/CloudStorage/ — pak si ji přetáhni do levého panelu',
      ],
      [
        'Soubory jsou prázdné nebo se nedají otevřít',
        'Files On-Demand — na disku je jen zástupce',
        'Pravý klik na složku → Vždy ponechat v tomto zařízení',
      ],
      [
        'U složky svítí mráček místo zelené fajfky',
        'Obsah ještě není stažený',
        'Počkej, až se ikona změní; velké knihovny to můžou táhnout desítky minut',
      ],
    ],
  },
]

const STEPS_WIN: Block[] = [
  {
    kind: 'steps',
    items: [
      {
        title: 'Otevři knihovnu v prohlížeči',
        body:
          'V SharePointu jdi do týmového webu a otevři knihovnu dokumentů, se kterou chceš pracovat — třeba Dokumenty nebo konkrétní podsložku s podklady. Pracuj radši s podsložkou než s celou knihovnou: syncovat stovky gigabajtů podkladů, ze kterých potřebuješ tři, nemá smysl.',
      },
      {
        title: 'Klikni na Přidat zástupce do OneDrivu',
        body:
          'V horní liště knihovny je Synchronizovat a vedle Přidat zástupce do OneDrivu (Add shortcut to OneDrive). Vezmi zástupce — chová se stejně, ale funguje i na jiných počítačích, kde jsi přihlášený, a dá se snáz odebrat.',
      },
      {
        title: 'Počkej, až OneDrive dosyncuje',
        body:
          'Modrý mráček v oznamovací oblasti u hodin ukazuje průběh. Než je hotovo, ve složce jsou jen názvy souborů bez obsahu.',
      },
      {
        title: 'Najdi složku v Průzkumníku',
        body:
          'V levém panelu Průzkumníka přibude položka s názvem firmy a ikonou budovy, a v ní ta knihovna. Na disku je pod tvým profilem — cestu níž můžeš vložit rovnou do adresního řádku.',
        code: '%UserProfile%\\<název firmy>\\',
      },
      {
        title: 'Řekni Windows, ať soubory drží u sebe',
        body:
          'Pravý klik na složku → Vždy zachovat v tomto zařízení (Always keep on this device). Bez tohohle kroku má většina souborů na disku jen zástupce a Claude v nich nic nepřečte — vidí název, ale ne obsah.',
      },
      {
        title: 'Připoj složku v Claudovi',
        body:
          'V desktopové aplikaci Claude otevři úkol v Coworku a použij tlačítko Add folder / Přidat složku. Vyber tu nasyncovanou složku. Od téhle chvíle v ní Claude umí číst, hledat a zakládat soubory.',
      },
      {
        title: 'Ověř to jednou větou',
        body:
          'Napiš Claudovi zadání níž. Když ti vypíše skutečné názvy souborů a velikosti, je hotovo.',
        code: 'Vypiš mi, co je v připojené složce — kolik souborů, jaké typy a jak jsou staré.',
      },
    ],
  },
  {
    kind: 'table',
    head: ['Co se děje', 'Čím to je', 'Co s tím'],
    rows: [
      [
        'Soubory mají u sebe modrý mráček',
        'Files On-Demand — na disku je jen zástupce',
        'Pravý klik na složku → Vždy zachovat v tomto zařízení',
      ],
      [
        'Cesta je moc dlouhá, něco se nenasyncuje',
        'Limit délky cesty ve Windows',
        'Připoj radši podsložku níž, nebo zkrať názvy složek v knihovně',
      ],
      [
        'Složka v Průzkumníku není',
        'Zástupce se přidal do jiného účtu OneDrivu',
        'Klikni na ikonu mráčku → ozubené kolo → Nastavení → Účet a zkontroluj, kterým účtem jsi přihlášený',
      ],
    ],
  },
]

const LESSON_SHAREPOINT: Lesson = {
  slug: 'sdilena-slozka-sharepoint',
  module: 'napojeni',
  title: 'Sdílená složka ze SharePointu',
  summary:
    'Nasyncovat týmovou knihovnu do počítače a připojit ji Claudovi, aby si v ní mohl číst a psát. Pro Mac i Windows.',
  minutes: 15,
  kind: 'lekce',
  outcomes: [
    'nasyncovat knihovnu ze SharePointu do počítače přes OneDrive',
    'najít, kde ta složka na disku fyzicky leží — na Macu i ve Windows',
    'připojit ji jako složku do úkolu v Claudovi',
    'ověřit, že Claude opravdu vidí soubory, ne jen prázdné placeholdery',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Claude se do SharePointu sám nepřihlásí. Umí ale pracovat se složkou, která je fyzicky na tvém počítači — a přesně tím se nasyncovaná knihovna stává. Cíl téhle lekce je jednorázové nastavení: jednou to proklikáš a pak už jen v každém úkolu vybereš složku ze seznamu.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Co k tomu potřebuješ',
      text:
        'Počítač s nainstalovanou aplikací OneDrive přihlášenou firemním účtem, přístup do knihovny na SharePointu a desktopovou aplikaci Claude. Nic dalšího se neinstaluje.',
    },
    {
      kind: 'figure',
      name: 'sync-map',
      caption:
        'Knihovna se přes OneDrive stane běžnou složkou na disku. Liší se jen cesta — a tu si Claude pamatuje sám, jakmile složku jednou vybereš.',
    },
    { kind: 'h', text: 'Postup' },
    {
      kind: 'p',
      text: 'Kroky jsou stejné, cesty a názvy voleb ne. Přepni si systém, na kterém sedíš.',
    },
    { kind: 'platform', mac: STEPS_MAC, win: STEPS_WIN },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Práva se dědí ze SharePointu',
      text:
        'Připojením složky nikomu nic nepůjčuješ navíc — Claude vidí přesně to, co vidíš ty. Co se ale změní: soubory, které Claude zapíše, se nasyncují zpátky do knihovny a uvidí je celý tým. Pracovní verze si proto zakládej do vlastní podsložky.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Claude musí být spuštěný',
      text:
        'K souborům se sezení dostane jen dokud běží desktopová aplikace Claude. Když ji zavřeš nebo počítač usne, Claude hlásí, že složku nevidí — nic se nerozbilo, jen se přerušilo spojení.',
    },
    {
      kind: 'video',
      title: 'Videa k SharePointu a OneDrivu',
      items: VIDEOS_SHAREPOINT,
    },
    {
      kind: 'task',
      title: 'Cvičení: první dotaz nad týmovou složkou',
      intro:
        'Vezmi složku, ve které máš podklady k akčnímu regálu, nebo jakoukoli jinou sdílenou složku, se kterou pracuješ každý týden.',
      items: [
        'Připoj ji podle postupu výš.',
        'Nech Clauda vypsat, co v ní je, a rozdělit to podle typu souboru.',
        'Zeptej se na něco, co bys jinak hledala ručně — třeba ve kterém souboru se naposledy měnily počty na pobočky.',
        'Nech Clauda založit do podsložky krátké shrnutí toho, co našel.',
      ],
      hint:
        'Když je knihovna velká, připoj radši jednu konkrétní podsložku. Menší rozsah znamená rychlejší a přesnější odpovědi.',
    },
    {
      kind: 'checklist',
      title: 'Hotovo, když',
      items: [
        'Složka je vidět ve Finderu nebo v Průzkumníku v levém panelu',
        'Soubory jdou otevřít offline (mají u sebe zelenou fajfku, ne mráček)',
        'V Claudovi je složka v seznamu připojených',
        'Claude vypsal skutečný obsah složky',
      ],
    },
  ],
}

const LESSON_CO_VIDI: Lesson = {
  slug: 'co-claude-ve-slozce-vidi',
  module: 'napojeni',
  title: 'Co Claude ve složce vidí a co ne',
  summary:
    'Hranice připojené složky: co si přečte, co změní, kdy potřebuje povolení a kdy je offline.',
  minutes: 8,
  kind: 'lekce',
  outcomes: [
    'vysvětlit, kam až sahá přístup k připojené složce',
    'poznat, kdy je práce s daty bezpečná a kdy potřebuje povolení navíc',
    'napsat zadání tak, aby Claude nepřepsal originál',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Připojená složka není přístup do počítače. Je to přesně vymezený kus disku — ten, který jsi vybrala — a všechno ostatní zůstává mimo dosah. Vyplatí se vědět, kde ta hranice vede, protože podle toho se píše zadání.',
    },
    { kind: 'h', text: 'Uvnitř složky' },
    {
      kind: 'list',
      items: [
        'Číst a prohledávat soubory — tabulky, dokumenty, PDF, obrázky.',
        'Upravovat soubory na místě, když o to výslovně požádáš.',
        'Zakládat nové soubory vedle původních.',
        'Přejmenovat a přesouvat.',
      ],
    },
    { kind: 'h', text: 'Mimo dosah' },
    {
      kind: 'list',
      items: [
        'Cokoli mimo připojené složky — jiné disky, plocha, pošta.',
        'Mazání souborů. Je vypnuté, dokud ho výslovně nepovolíš, a povolení platí jen do konce sezení.',
        'Práce se soubory, když je desktopová aplikace Claude zavřená.',
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Pravidlo pro zadání',
      text:
        'Když chceš vyčistit, převést nebo přeskládat data, řekni „ulož to jako nový soubor vedle původního“. Do existujícího souboru sahej jen tam, kde je to opravdu záměr — třeba oprava adresy v patičce dokumentu.',
    },
    {
      kind: 'task',
      title: 'Cvičení: bezpečná transformace',
      intro: 'Vezmi jednu tabulku, kterou pravidelně čistíš ručně.',
      items: [
        'Popiš Claudovi, co je v ní špatně — sloučené buňky, prázdné řádky, hlavička na třetím řádku.',
        'Nech ho udělat vyčištěnou kopii do stejné složky s jasným názvem.',
        'Porovnej řádek po řádku, jestli sedí počty.',
      ],
    },
  ],
}

const LESSON_REGAL: Lesson = {
  slug: 'od-magazinu-do-regalu',
  module: 'zadani',
  title: 'Zadání: Od magazínu do regálu',
  summary:
    'Reálný proces akčního regálu rozepsaný na kroky. Úkolem je najít místa, kde se dá práce automatizovat.',
  minutes: 40,
  kind: 'zadání',
  outcomes: [
    'přečíst pracovní proces jako tok dat mezi lidmi a soubory',
    'poznat kroky, ve kterých data mění formu ručně',
    'odlišit, co má automatizace převzít a co má zůstat člověku',
    'navrhnout první krok, který jde zkusit tenhle týden',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Tohle je skutečný proces z logistiky, zapsaný podle rozhovoru. Vzniká z něj akční regál na pobočkách — od chvíle, kdy produkťáci nasypou obsah magazínu do sdílené tabulky, až po podklady pro marketing, centrální sklad a backoffice. Přečti si ho celý a teprve pak se pusť do zadání pod diagramem.',
    },
    {
      kind: 'table',
      head: ['Parametr', 'Hodnota'],
      rows: [
        ['Předstih', '~6 týdnů, bez pevného termínu'],
        ['Divize', '4 — nářadí, dekton, elektro, voda-topo'],
        ['Produkťáci', '11, každý má svoje značky a sekce'],
        ['Plocha regálu', '130 × 900 cm'],
        ['Položky', 'z ~150 v magazínu se do regálu vejde ~80'],
        ['Datové zdroje', '3 — min/max, zásoby poboček, centrální sklad'],
      ],
    },
    {
      kind: 'figure',
      name: 'regal-flow',
      caption:
        'Tři účastníci, dvě kolečka přes e-mail. Oranžově jsou místa, kde data mění formu ručně.',
    },
    { kind: 'h', text: 'Proces krok za krokem' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Produkťáci nasypou obsah magazínu do Google Tabulky',
          body:
            'Zapisují průběžně, zhruba šest týdnů dopředu, bez pevného termínu. Je tam kompletní obsah tištěného letáku. Kritéria zařazení: sezónnost, dohoda s dodavatelem, potřeba odprodat zásoby před sezonou.',
        },
        {
          title: 'Logistika si vezme svých sedm sloupců',
          body:
            'Přístup má jen do logistického listu, zbytek tabulky patří marketingu — aby se navzájem nepřepisovali. Ostatní divize k té tabulce přístup nemají, zapisují si jinam.',
        },
        {
          title: 'Vznikne velký Excel se třemi datovými zdroji',
          body:
            'Položky na jeden list, na další listy min/max, zásoby na pobočkách a na centrálním skladu. K položkám se doplní status — jestli chodí napřímo od dodavatele, nebo přes centrální sklad.',
        },
        {
          title: 'Rozpad na čtyři divizní Excely',
          body:
            'Z jednoho velkého souboru vzniknou čtyři menší. Původní Excel je tak velký, že se do AI nedá vložit celý — kopíruje se jen ten jeden složený list přes vložit jinak → hodnoty.',
        },
        {
          title: 'Rozeslání jedenácti produkťákům e-mailem',
          body:
            'Každý dostane svůj list s padesáti položkami ze své sekce. Ručně, jeden e-mail po druhém.',
        },
        {
          title: 'Produkťák vybere, co chce do regálu',
          body:
            'Z padesáti položek vybere pět až deset — podle sezónnosti a dohod s dodavateli. Přidá prioritu a poznámku: tohle je na titulce, musí být všude; tohohle dostaneme jen pár kusů, dej to jen na padesát poboček.',
        },
        {
          title: 'Odpovědi se ručně přepíšou zpět do tabulky',
          body:
            'Každou odpověď je potřeba vykopírovat zpátky a zkontrolovat, jestli se v souboru něco neposunulo. Někdo místo tabulky pošle print screen — ten se přeťukává ručně.',
        },
        {
          title: 'Fyzické vzorování v regálu',
          body:
            'Měrné jednotky neodpovídají skutečnosti — jednotka je vrtačka, ne kufr. Takže se jde na sklad a zkusí se, jestli se tři kufry vejdou vedle sebe. Vzniknou fotky jako důkazní materiál.',
        },
        {
          title: 'Návrh min/max a schválení',
          body:
            'Podle prodejů za posledních dvanáct měsíců a skladových zásob se navrhne, kolik čeho poslat na jaké velikosti poboček. Jde to zpátky produkťákům i s fotkou regálu, ti to podle dohod s dodavateli ještě upraví.',
        },
        {
          title: 'Tři různé finální podklady',
          body:
            'Word a Excel pro marketing (odtud jde info na web), Excel pro centrální sklad (aby věděli, kolik toho přijde a že to nemají dávat dozadu do skladu), Excel pro backoffice (aby to nastavil na pobočky).',
        },
      ],
    },
    { kind: 'h', text: 'Soubory, o kterých je řeč' },
    {
      kind: 'p',
      text:
        'Než začneš hledat automatizace, podívej se, mezi čím se data přelévají. Tohle jsou skutečné soubory téhle agendy — ne zjednodušený model.',
    },
    {
      kind: 'table',
      head: ['Soubor', 'Co v něm je', 'Kdo ho vlastní'],
      rows: [
        [
          'Google Tabulka „Magazín 2026“, list Logistika',
          'Kompletní obsah magazínu, tisíce řádků seskupených po měsících. Sloupce Číslo položky, Název, MJ, PM, Typ skladování, SD celkem / sklad / prodejna, Skladem na CS, Barva, Poznámka Logistika, Výsledek v magazínu.',
          'Marketing. Logistika smí zapisovat jen do svých sloupců.',
        ],
        [
          '<RRRRMMDD>_Data_CS_skladem, _SD_CS, _minmax',
          'Tři exporty z agend, každý s datem v názvu. Doplňují k položkám zásoby a doporučená množství.',
          'Agendy',
        ],
        [
          'Magazín <MĚSÍC> - <divize>',
          'To, co dostane produkťák. Uvnitř list na každého PM, položky s barvou dostupnosti a prázdné sloupce k vyplnění.',
          'Logistika',
        ],
        [
          'Magazín <MĚSÍC> - Kontrola umístění + MINMAX',
          'Výsledek vzorování. U každé položky ANO/NE pro regál 1,33 m a 1,00 m, ve variantě jeden i dva regály, plus POS značení. Listy Umístěné položky, Kontrola MIN_MAX, Volná plocha, Prodeje, Skladem.',
          'Logistika',
        ],
        [
          'Freelo',
          'Krok za krokem manuál, aby se na nic nezapomnělo. Veřejný, kdyby náhodou. Do samotného magazínu nevstupuje.',
          'Logistika',
        ],
      ],
    },
    { kind: 'h', text: 'Kde se počítá min/max' },
    {
      kind: 'p',
      text:
        'V souboru Kontrola umístění + MINMAX je vedle výsledku vzorování i celý výpočet. Pro každou položku a každou variantu regálu je dvojice Min a Max, a za nimi sloupce, které se dopočítávají ze zásob a prodejů. Tohle je nejzajímavější místo celého procesu — část těch sloupců je čistá aritmetika, část ne.',
    },
    {
      kind: 'table',
      head: ['Sloupec', 'Odkud se bere'],
      rows: [
        ['Min / Max pro variantu regálu', 'z průměrného 14denního prodeje za poslední půlrok a počtu poboček dané varianty'],
        ['Stav SD prodejna, Stav CS, Objednáno CS', 'ze skladových exportů'],
        ['Potřebný počet', 'výpočet z min/max a počtu poboček'],
        ['ROZDÍL', 'Stav CS + objednáno − potřebný počet; záporná čísla červeně'],
        ['Dostatečný počet na CS', 'ANO / NE podle znaménka rozdílu'],
        ['Poznámka', 'ručně: „na pob. 7“, „na pob. 15, obj. 320“'],
        ['ANO / NE u 1,33 m a 1,00 m', 'fyzické vzorování — spočítat se nedá'],
      ],
    },
    { kind: 'h', text: 'Co vyplňuje produkťák' },
    {
      kind: 'p',
      text:
        'V souboru, který mu přijde, jsou položky jeho sekce a k nim čtyři sloupce, které jsou na něm. Tohle je přesně ta odpověď, která se pak ručně přepisuje zpátky.',
    },
    {
      kind: 'table',
      head: ['Sloupec', 'Co do něj patří'],
      rows: [
        ['AKČNÍ REGÁL (ANO/NE)', 'jestli položka půjde do regálu'],
        ['POZNÁMKA', 'všechny sestavy / největší / velké — co s položkou udělat'],
        ['PRIORITA', '1 = nejvyšší, 2 = nízká, 3 = nejnižší'],
        ['Opakuje se', 'položka byla v regálu i minule'],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Barva už něco říká',
      text:
        'Zelená, oranžová a šedá u položky nejsou dekorace — přiřazují se podle klíče z prvních dvou řádků listu Logistika a nesou dostupnost. Produkťák tedy nerozhoduje ve vzduchoprázdnu: část odpovědi mu data napovídají dřív, než na soubor sáhne.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Jeden krok už dnes běží s AI',
      text:
        'Ve složce s podklady leží vedle sebe „Logistické dostupnosti (vzorce)“ a „Logistické dostupnosti Claude“. Ten druhý soubor vzniká s pomocí Clauda. Tenhle proces tedy není nedotčený — jen se zatím automatizoval jeden krok z deseti.',
    },
    {
      kind: 'task',
      title: 'Zadání',
      intro:
        'Pracuj s procesem výš. Odpovědi si piš do dokumentu, na konci je porovnáme napříč skupinami.',
      items: [
        'Označ každý krok jedním ze tří štítků: data se přenášejí ručně / rozhoduje se člověk / počítá se z pravidel.',
        'Vyber tři kroky, ve kterých se nejvíc přepisuje. U každého napiš, mezi jakými dvěma formáty se data překlápějí.',
        'U toho nejhoršího navrhni, co by se muselo změnit, aby přepis úplně zmizel — ne jak to zrychlit, ale jak to zrušit.',
        'Najdi jeden krok, který má zůstat člověku, a napiš proč. Pojmenuj, co konkrétně tam člověk ví a data ne.',
        'Podívej se na čtyři sloupce, které vyplňuje produkťák. Který z nich by šel předvyplnit z dat, a proč zbylé ne?',
        'V tabulce MINMAX rozděl sloupce na dvě hromádky: co je čistý výpočet a co ne. U té první napiš, co by se muselo zajistit, aby se počítala sama.',
        'Napiš jednu změnu, kterou by šlo zkusit do týdne bez souhlasu IT.',
      ],
      hint:
        'Nápověda k bodu 3: e-mail není nástroj na sběr dat, je to přenos. Otázka nezní „jak rychleji přepsat odpověď z e-mailu“, ale „proč ta odpověď vůbec opouští tabulku“.',
    },
    { kind: 'h', text: 'Kam se to obvykle sejde' },
    {
      kind: 'p',
      text:
        'Když si tenhle proces projde víc skupin, vyjdou skoro vždycky tři stejná místa. Nedívej se na ně, dokud nemáš vlastní odpovědi.',
    },
    {
      kind: 'table',
      head: ['Místo', 'Jak to je teď', 'Kam to posunout'],
      rows: [
        [
          'Sběr odpovědí od produkťáků',
          'E-mail tam, e-mail zpět, vykopírovat, zkontrolovat posuny, přeťukat print screen',
          'Zrušit e-mail jako přenosový formát — sdílený list nebo formulář, kde produkťák zapíše výběr přímo. Data nikdy neopustí tabulku a je vidět, kdo neodpověděl',
        ],
        [
          'Rozpad a rozeslání divizních Excelů',
          'Ruční příprava listu, rozpad na čtyři soubory, jedenáct e-mailů',
          'Složený list na sdílené místo, odtud automaticky vygenerovat soubory podle divize a rozeslat notifikaci',
        ],
        [
          'Generování finálních podkladů',
          'Ze schválené tabulky se ručně staví Word a tři Excely',
          'Jeden schválený zdroj dat a tři šablony. Návrh min/max podle prodejů se dá předpočítat, člověk potvrzuje',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Co nechat člověku',
      text:
        'Vzorování v regálu. Měrné jednotky v systému neodpovídají realitě, takže žádná agenda neřekne, jestli se tři kufry vejdou vedle sebe. Fotka z regálu není administrativa, je to důkaz proti datům, která lžou. Automatizace tomu má uvolnit místo, ne to nahradit.',
    },
  ],
}

const LESSON_AUTOMATIZACE: Lesson = {
  slug: 'jak-se-nastavuje-automatizace',
  module: 'automatizace',
  title: 'Jak se v projektu nastaví automatizace',
  summary:
    'Pět stupňů od ručního zadání po běh bez tebe — na reálném rozpadu divizních Excelů, krok po kroku.',
  minutes: 25,
  kind: 'lekce',
  outcomes: [
    'popsat pět stupňů, po kterých se z ruční práce stane automatizace',
    'napsat skill, který spustí celý postup jednou větou',
    'nastavit hook, který se spustí sám při konkrétní události',
    'poznat, kdy je na další stupeň brzo — a co nikdy neautomatizovat',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Automatizace nevznikne tím, že si řekneš „automatizuj to“. Vzniká po schodech: nejdřív úlohu uděláš ručně a popíšeš výsledek, pak z toho, co jsi musela vysvětlit, uděláš pravidlo, pak z celého postupu skill — a teprve když skill několikrát doběhl správně, má smysl ho spouštět bez sebe. Schody se nedají přeskočit. Kdo začne posledním, nastaví automat na postup, který si nikdy neověřil.',
    },
    {
      kind: 'figure',
      name: 'automation-ladder',
      caption: 'Každý stupeň staví na tom předchozím. Na další jdeš, až když ten současný funguje bez oprav.',
    },
    { kind: 'h', text: '1. Zadání — udělej to jednou ručně' },
    {
      kind: 'p',
      text:
        'Otevři Clauda ve složce projektu a popiš, co má vzniknout. Ne jak to má udělat — co má být na konci. A pak si všímej, kolikrát mu musíš něco doříct. Každé takové doříkání je informace, která zatím chybí v projektu.',
    },
    {
      kind: 'code',
      text: `Vezmi nejnovější magazin-*.xlsx z data/, ke každé položce dotáhni min/max
a zásobu na pobočkách a ulož výsledek do vystupy/ podle pojmenování z CLAUDE.md.
Kde data chybí, nech prázdno a na konci mi napiš, u kolika položek to bylo.`,
      caption: 'Zadání, ze kterého se dá poznat, jestli výsledek sedí. To je celý rozdíl proti „zpracuj mi to“.',
    },
    { kind: 'h', text: '2. Pravidlo — ať to nemusíš vysvětlovat podruhé' },
    {
      kind: 'p',
      text:
        'Musela jsi říct, že kódy položek se nesmí měnit na čísla? Že se bere nejnovější soubor podle data v názvu? To nejsou postupy, to jsou fakta o agendě — patří do CLAUDE.md a od té chvíle platí v každém sezení. Tenhle stupeň je nejlevnější a nejvíc se vyplatí: většina „Claude to udělal blbě“ je ve skutečnosti pravidlo, které nikdo nenapsal.',
    },
    { kind: 'h', text: '3. Skill — zabal celý postup' },
    {
      kind: 'p',
      text:
        'Když stejný postup projde třikrát bez oprav, zapiš ho. Skill je složka se souborem SKILL.md: v hlavičce jméno a popis, kdy se má použít, pod tím kroky. Od té chvíle stačí jedna věta — nebo lomítko a jméno skillu.',
    },
    {
      kind: 'code',
      text: `.claude/skills/logisticke-dostupnosti/SKILL.md

---
name: logisticke-dostupnosti
description: Z exportu listu Logistika dotáhne skladová data a připraví
  soubory pro produkťáky po divizích (Nářadí, Elektro, VTS, Piekarová).
  Použij, když je v data/ nový export magazínu.
---

1. Najdi v data/ nejnovější export listu Logistika a nejnovější trojici
   <RRRRMMDD>_Data_CS_skladem, _SD_CS a _minmax. Když nemají stejné datum,
   napiš to a zastav se.
2. Ověř, že export má sloupce Číslo položky, Katalogové číslo, Název, MJ,
   PM a Určení barvy. Když některý chybí, zastav se.
3. Ke každé položce dotáhni počet kusů na CS, SD na pobočce a min/max.
   Kde údaj chybí, nech prázdno.
4. Rozděl položky podle divize a pro každou založ soubor
   vystupy/Magazín <MĚSÍC> - <divize>.xlsx, uvnitř list na každého PM.
5. Přidej prázdné sloupce AKČNÍ REGÁL (ANO/NE), POZNÁMKA a PRIORITA
   (1=nejvyšší, 2=nízká, 3=nejnižší).
6. Na konci vypiš počet položek po divizích a seznam položek,
   u kterých chyběla data.`,
      caption: 'Řádek description rozhoduje o tom, kdy si skill Claude vybere sám. Piš do něj i slova, která bys napsala do zadání ty.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Skill je obyčejný soubor',
      text:
        'Leží v projektu, dá se poslat kolegovi a dá se opravit tak, že do něj dopíšeš řádek. Když skill v projektu funguje a chceš ho mít všude, přesuň ho do ~/.claude/skills/.',
    },
    { kind: 'h', text: '4. Hook — ať se to spustí samo při události' },
    {
      kind: 'p',
      text:
        'Skill se pořád musí vyvolat. Hook ne — je to příkaz, který Claude Code spustí vždycky, když nastane určitá událost, bez ohledu na to, co si zrovna myslí. Hodí se na kontroly a zábrany, ne na složité úvahy: zálohuj před zápisem, odmítni sáhnout do data/, dej vědět, když je něco hotové.',
    },
    {
      kind: 'code',
      text: `.claude/settings.json

{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "cp \\"$CLAUDE_FILE_PATH\\" ~/zalohy/" }
        ]
      }
    ]
  }
}`,
      caption: 'Po každém zápisu souboru se udělá kopie. Hook je shellový příkaz, takže dělá přesně to, co je v něm napsané.',
    },
    {
      kind: 'table',
      head: ['Událost', 'Kdy se spustí', 'K čemu se hodí'],
      rows: [
        ['SessionStart', 'na začátku sezení', 'připomenout kontext, načíst aktuální data'],
        ['UserPromptSubmit', 'když odešleš zadání', 'doplnit k zadání stálou poznámku'],
        ['PreToolUse', 'před tím, než se něco provede', 'zablokovat zápis do chráněné složky'],
        ['PostToolUse', 'po úspěšném kroku', 'záloha, kontrola formátu, přejmenování'],
        ['Notification', 'když Claude čeká na tebe', 'upozornění na plochu, ať to nehlídáš'],
        ['Stop', 'když práci dokončí', 'poslat výsledek dál, zapsat do logu'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Hook není místo na rozhodování',
      text:
        'Spustí se vždycky a nemá úsudek. To je jeho síla u zábran („do data/ se nezapisuje“) a jeho slabina všude jinde. Když má něco záviset na posouzení, patří to do skillu, ne do hooku.',
    },
    { kind: 'h', text: '5. Běh bez tebe' },
    {
      kind: 'p',
      text:
        'Poslední stupeň má smysl teprve tehdy, když všechno předchozí běželo několikrát správně a ty víš, jak poznáš, že výsledek je špatně. Claude Code umí běžet i bez rozhovoru — dostane zadání, odpracuje ho a skončí. Takový běh se dá naplánovat na čas a jeho výsledek si ráno jen zkontroluješ.',
    },
    {
      kind: 'code',
      text: `claude -p "Postupuj podle skillu rozpad-divizi a výsledek ulož do vystupy/."`,
      caption: 'Jeden běh bez rozhovoru. Tohle je věta, kterou se dá naplánovat — ať už přes naplánovanou úlohu v Claude appce, nebo přes plánovač v systému.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Vždycky nech po sobě stopu',
      text:
        'Naplánovaný běh nikdo nesleduje. Ať proto vždycky vzniká krátký zápis toho, co se udělalo a co nesedělo — soubor ve vystupy/ nebo zpráva do chatu. Automat, po kterém nezůstane nic, se pozná až ve chvíli, kdy měsíc mlčky nedělá nic.',
    },
    { kind: 'h', text: 'Kdy na další stupeň' },
    {
      kind: 'table',
      head: ['Poznáš to podle', 'Další krok'],
      rows: [
        ['Vysvětluješ tutéž věc podruhé', 'řádek do CLAUDE.md'],
        ['Píšeš stejné zadání potřetí', 'skill'],
        ['Skill třikrát doběhl bez oprav', 'zvaž naplánovaný běh'],
        ['Bojíš se, že něco přepíše', 'hook, který to zakáže'],
        ['Musíš u toho rozhodovat', 'zůstaň u zadání — tohle se neautomatizuje'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Co automatizovat nechceš',
      text:
        'Kroky, kde se rozhoduje podle věcí, které nejsou v datech. Vzorování v regálu je učebnicový příklad: měrné jednotky lžou, takže žádný automat neřekne, jestli se tři kufry vejdou vedle sebe. Automatizace má takovým krokům uvolnit čas, ne je nahradit.',
    },
    {
      kind: 'task',
      title: 'Cvičení: posuň jeden krok o stupeň výš',
      intro:
        'Vezmi svoji agendu a v ní jeden krok, který děláš každý týden. Nezačínej tím nejsložitějším.',
      items: [
        'Napiš, na kterém stupni ten krok dneska je.',
        'Udělej ho jednou se zadáním a zapiš si každé doříkání, které jsi musela dodat.',
        'Doříkání, která platí pořád, přepiš do CLAUDE.md.',
        'Zbytek — samotný postup — přepiš do SKILL.md a spusť ho znovu na jiných datech.',
        'Napiš jednu větu o tom, jak poznáš, že výsledek je špatně. Bez ní na další stupeň nechoď.',
      ],
      hint:
        'Když ti u druhého běhu skill vyjde jinak než u prvního, není to chyba skillu — je to chybějící pravidlo. Doplň ho a zkus to znovu.',
    },
  ],
}

const LESSON_SKILL: Lesson = {
  slug: 'jak-napsat-skill',
  module: 'automatizace',
  title: 'Jak napsat skill (a nechat si ho napsat)',
  summary:
    'Z čeho se skill skládá, proč o všem rozhoduje jediný řádek, a co dát Claudovi, aby ti skill napsal sám a dobře.',
  minutes: 20,
  kind: 'lekce',
  outcomes: [
    'poznat, kdy je čas udělat ze zadání skill',
    'napsat description tak, aby se skill spouštěl ve správnou chvíli',
    'rozdělit obsah mezi SKILL.md a přílohy',
    'dát Claudovi podklady, ze kterých ti skill napíše sám',
    'ověřit, že skill funguje i na jiných datech než na těch, ze kterých vznikl',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Skill je zabalený postup: složka se souborem SKILL.md, ve kterém je nahoře pár řádků o tom, co skill dělá a kdy se má použít, a pod tím samotný postup. Nic víc. Celá dovednost je v tom napsat ty dvě části tak, aby si je Claude vybral ve správnou chvíli a odpracoval je pokaždé stejně.',
    },
    { kind: 'h', text: 'Kdy z toho udělat skill' },
    {
      kind: 'list',
      items: [
        'Stejné zadání píšeš potřetí.',
        'Postup má víc než tři kroky a pořadí na nich záleží.',
        'Existuje způsob, jak se v tom splést, a ty ho pokaždé připomínáš.',
        'Chceš, aby to uměl i někdo jiný než ty.',
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Co skill není',
      text:
        'Není to místo na fakta o agendě — ta patří do CLAUDE.md a platí pořád. Skill je postup, který se spustí, když je potřeba. Když si nejsi jistá, zeptej se: platí to i ve chvíli, kdy tenhle úkol nedělám? Když ano, je to pravidlo, ne skill.',
    },
    { kind: 'h', text: 'Kam skill patří' },
    {
      kind: 'code',
      text: `.claude/skills/<jmeno-skillu>/SKILL.md     ← platí jen v tomhle projektu
~/.claude/skills/<jmeno-skillu>/SKILL.md   ← platí ve všech tvých projektech`,
      caption: 'Začni v projektu. Když se skill osvědčí a používáš ho i jinde, přesuň složku do domovské.',
    },
    { kind: 'h', text: 'Anatomie souboru' },
    {
      kind: 'code',
      text: `---
name: logisticke-dostupnosti
description: Z exportu listu Logistika dotáhne skladová data a připraví
  soubory pro produkťáky po divizích. Použij, když je v data/ nový export
  magazínu a mají se rozeslat podklady produkťákům.
---

# Logistické dostupnosti

1. Najdi v data/ nejnovější export a trojici skladových souborů.
   Když nemají stejné datum, napiš to a zastav se.
2. Ověř sloupce Číslo položky, Katalogové číslo, Název, MJ, PM, Určení barvy.
3. …

## Na co si dát pozor
- Čísla položek jsou text. Excel je rád převádí na čísla a ukusuje nuly.`,
      caption: 'Otevírací --- musí být úplně první řádek souboru, jinak se hlavička nenačte.',
    },
    { kind: 'h', text: 'Description rozhoduje o všem' },
    {
      kind: 'p',
      text:
        'Tělo skillu se načte, až když si ho Claude vybere. A vybírá si ho podle jednoho jediného řádku — podle description. Když je vágní, skill se nespustí nikdy, nebo se naopak plete do věcí, kam nepatří. Piš do něj dvě věci: co skill dělá a kdy se má použít. A používej slova, která bys sama napsala do zadání.',
    },
    {
      kind: 'table',
      head: ['Špatně', 'Dobře', 'V čem je rozdíl'],
      rows: [
        [
          'description: Zpracuje data',
          'description: Rozdělí export magazínu na divizní soubory pro produkťáky. Použij, když je v data/ nový export.',
          'Vágní popis se netrefí do žádného zadání. Konkrétní se trefí do toho svého.',
        ],
        [
          'description: Skill na Excel',
          'description: Dotáhne k položkám min/max a zásoby z CS. Použij před rozesláním podkladů produkťákům.',
          'Nástroj není spouštěč. Spouštěč je situace.',
        ],
        [
          'description: Pro Katku',
          'description: Připraví podklady pro backoffice a centrální sklad ze schválené tabulky.',
          'Claude nezná Katku. Zná úlohu.',
        ],
      ],
    },
    { kind: 'h', text: 'Jak psát tělo' },
    {
      kind: 'list',
      items: [
        'Kroky, ne esej. Číslovaný seznam, jedna akce na krok.',
        'Ověřitelně. „Sloupce v pořadí Kód, Název, Divize“ místo „správně naformátovat“.',
        'Se zastavovacími pravidly. Napiš, kdy se má zastavit a zeptat, místo aby hádal.',
        'S pastmi. Sekce „na co si dát pozor“ ušetří víc než tři kroky navíc.',
        'Krátce. Když SKILL.md přeroste pár set řádků, přesuň detaily do souboru vedle a odkaž na něj.',
      ],
    },
    {
      kind: 'code',
      text: `.claude/skills/logisticke-dostupnosti/
├── SKILL.md          ← postup, krátký
├── references/
│   └── sloupce.md    ← úplný popis sloupců, načte se až když je potřeba
└── scripts/
    └── kontrola.py   ← pokud postup potřebuje něco spustit`,
      caption: 'Přílohy jsou volitelné. Většina užitečných skillů je jen SKILL.md.',
    },
    { kind: 'h', text: 'Nech si ho napsat' },
    {
      kind: 'p',
      text:
        'Nejrychlejší cesta k prvnímu skillu není psát ho na prázdno. Je udělat tu úlohu jednou ručně se zadáním a pak říct Claudovi, ať z toho, co se právě stalo, udělá skill. On zná průběh — včetně toho, co jsi mu musela doříct.',
    },
    {
      kind: 'code',
      text: `Z toho, co jsme teď udělali, napiš skill do .claude/skills/.

Dej mu jméno podle úlohy a do description napiš, co dělá a kdy se má
použít — takovými slovy, jaká bych do zadání napsala já.

V postupu drž pořadí kroků, které jsme prošli, a doplň místa, kde ses
mě ptal nebo kde jsem tě opravovala — z nich udělej buď krok navíc,
nebo zastavovací pravidlo.

Na konec přidej sekci "Na co si dát pozor" s věcmi, které se tady dají
splést. Pak mi ho ukaž, ať ho projdu, než ho uložíš.`,
      caption: 'Tenhle prompt napiš hned po tom, co úloha doběhla správně. Ne druhý den — kontext je to nejcennější, co v tu chvíli máš.',
    },
    { kind: 'h', text: 'Zkratka: skill na psaní skillů' },
    {
      kind: 'p',
      text:
        'Nemusíš na to sama. V Claude Code je skill-creator — napiš lomítko a jeho jméno a provede tě založením nového skillu, úpravou existujícího i tím, jestli se spouští ve správných situacích. Výsledek se ukládá přes kartu, kterou si nejdřív projdeš, ne tak, že by ti někdo psal do souborů za zády.',
    },
    {
      kind: 'code',
      text: `muj-skill/
├── SKILL.md          ← povinné, jediné co musí být
├── references/       ← delší dokumentace, načte se až když je potřeba
├── scripts/          ← spustitelné skripty
└── assets/           ← šablony, obrázky`,
      caption: 'Obsah se načítá postupně: nejdřív jen description, pak SKILL.md, a přílohy teprve když na ně dojde. Proto drž SKILL.md stručný — pod pět set řádků — a detaily odsuň do references/.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Tři věci, které rozhodují o kvalitě',
      text:
        'Jméno složky = jméno skillu. Description musí říct co to dělá i kdy to použít, slovy, která uživatel opravdu napíše. A tělo drž krátké, protože každý řádek navíc soutěží o pozornost s tím podstatným.',
    },
    {
      kind: 'links',
      title: 'Oficiální dokumentace',
      items: [
        {
          label: 'Skill authoring best practices',
          href: 'https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices',
          note: 'Nejužitečnější stránka z celé čtveřice. Začni tady.',
        },
        {
          label: 'Agent Skills — overview',
          href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
          note: 'Co skilly jsou a jak se načítají.',
        },
        {
          label: 'Extend Claude with skills (Claude Code)',
          href: 'https://code.claude.com/docs/en/skills',
          note: 'Umístění složek a všechna pole hlavičky.',
        },
        {
          label: 'The Complete Guide to Building Skills for Claude (PDF)',
          href: 'https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf',
          note: 'Delší materiál na jedno odpoledne.',
        },
      ],
    },
    { kind: 'h', text: 'Co Claudovi dát, aby vyšel dobře' },
    {
      kind: 'p',
      text:
        'Kvalita skillu se odvíjí od toho, kolik ze svého tichého vědění mu předáš. Tohle je pořadí podle užitku.',
    },
    {
      kind: 'table',
      head: ['Dej mu', 'Co z toho vytěží'],
      rows: [
        ['Reálný vstupní soubor a hotový výstup z minula', 'Pozná formát, pojmenování i to, co se ve výstupu očekává. Nic z toho nemusí hádat.'],
        ['Průběh jedné ruční úlohy', 'Zná pořadí kroků i všechna tvá doříkání — ta jsou v postupu nejcennější.'],
        ['Seznam věcí, které se dají splést', 'Vznikne sekce „na co si dát pozor“, díky které skill nespadne u kolegy.'],
        ['Kdy se má zastavit a zeptat', 'Skill přestane hádat tam, kde je odhad horší než otázka.'],
        ['Jak poznáš, že je výsledek špatně', 'Přidá si kontrolní krok na konec a sám ti řekne, když něco nesedí.'],
        ['Kdo ho bude spouštět a jak to řekne', 'Trefí se v description do slov, která ti lidé opravdu píšou.'],
      ],
    },
    { kind: 'h', text: 'Otestuj ho' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Pusť ho na jiných datech',
          body:
            'Ne na těch, ze kterých vznikl. Skill, který funguje jen na zářijovém exportu, není skill, ale poznámka.',
        },
        {
          title: 'Zkus ho vyvolat nepřímo',
          body:
            'Napiš úlohu vlastními slovy a nezmiňuj jméno skillu. Když se nespustí, problém je v description, ne v postupu.',
        },
        {
          title: 'Nech ho spustit někoho jiného',
          body:
            'To, co je pro tebe samozřejmé, v postupu chybí. Pozná se to jedině tak, že to zkusí člověk, který agendu nedělá.',
        },
        {
          title: 'Když vyjde jinak než minule, doplň pravidlo',
          body:
            'Rozdíl mezi dvěma běhy je skoro vždycky chybějící informace, ne chyba postupu. Přidej ji a zkus to znovu.',
        },
      ],
    },
    {
      kind: 'table',
      head: ['Častá chyba', 'Jak se projeví', 'Oprava'],
      rows: [
        ['Vágní description', 'skill se nikdy sám nespustí', 'dopiš, kdy se má použít, a slovy ze zadání'],
        ['Postup jako souvislý text', 'kroky se přeskakují', 'rozepiš na číslovaný seznam'],
        ['Fakta o agendě uvnitř skillu', 'jinde ta pravidla neplatí', 'přesuň je do CLAUDE.md'],
        ['Skill napsaný na jeden soubor', 'příští měsíc nefunguje', 'popiš vzor názvu, ne konkrétní jméno'],
        ['Žádné zastavovací pravidlo', 'dopočítá si, co nemá', 'napiš, kdy se má zastavit a zeptat'],
        ['Příliš dlouhý SKILL.md', 'kroky se ztrácejí', 'detaily do souboru vedle, odkaz v postupu'],
      ],
    },
    {
      kind: 'task',
      title: 'Cvičení: napiš první skill z toho, co jsi právě udělala',
      intro:
        'Vezmi úlohu, kterou jsi v předchozí lekci prošla ručně. Nezakládej nový soubor sama.',
      items: [
        'Nech Clauda napsat skill promptem výš a přečti si, co vygeneroval.',
        'Zkontroluj description: trefil by se do zadání, které bys napsala příště? Když ne, přepiš ho.',
        'Projdi kroky a doplň jedno zastavovací pravidlo, které tam chybí.',
        'Spusť skill na datech z jiného měsíce.',
        'Vyvolej ho podruhé, aniž bys řekla jeho jméno — jen popiš úlohu.',
      ],
      hint:
        'Když se skill nespustí sám, nepiš delší postup. Přepiš description. Devět z deseti případů je tam.',
    },
  ],
}

export const COURSES: Course[] = [
  {
    slug: 'claude-a-firemni-data',
    title: 'Claude a firemní data',
    summary:
      'Napojit Claudovi složku, ve které pracuješ, a naučit se v ní zadávat práci. Končí zadáním nad reálným procesem.',
    intro:
      'Kurz pro lidi, kteří každý týden přeskládávají tytéž tabulky a chtějí, aby se to dělalo samo. Nejdřív si založíš projekt a napíšeš pravidla, která se nemusí opakovat. Nejdřív napojíš Claudovi složku, ve které ta práce žije, pak si ohraničíš, co v ní smí a nesmí — a nakonec si na reálném procesu akčního regálu vyzkoušíš najít místa, kde se dá práce automatizovat.',
    level: 'Začátečník',
    section: 'Začni tady',
    modules: [
      {
        key: 'start',
        title: 'Než začneš',
        summary: 'Pojmy a nastavení projektu, o které se opře všechno ostatní.',
      },
      {
        key: 'napojeni',
        title: 'Napojení dat',
        summary: 'Jednorázové nastavení a hranice, ve kterých se pak pracuje.',
      },
      {
        key: 'automatizace',
        title: 'Automatizace',
        summary: 'Pět stupňů od ručního zadání po běh, který si ráno jen zkontroluješ — a jak napsat skill, na kterém to stojí.',
      },
      {
        key: 'zadani',
        title: 'Zadání',
        summary: 'Reálný proces z logistiky, na kterém se hledají automatizace.',
      },
    ],
    lessons: [LESSON_PROJEKT, LESSON_SHAREPOINT, LESSON_CO_VIDI, LESSON_AUTOMATIZACE, LESSON_SKILL, LESSON_REGAL],
    learn: [
      'založit projekt tak, aby se pravidla nemusela opakovat každé ráno',
      'poznat, co patří do CLAUDE.md, co do skillu a co do artefaktu',
      'nasyncovat knihovnu ze SharePointu do Macu a připojit ji Claudovi',
      'poznat, kdy jsou soubory jen zástupci a Claude v nich nic nepřečte',
      'napsat zadání tak, aby nevznikaly přepsané originály',
      'zabalit opakovaný postup do skillu a nechat ho běžet bez sebe',
      'napsat description tak, aby se skill spouštěl ve správnou chvíli',
      'číst pracovní proces jako tok dat mezi lidmi a soubory',
      'najít kroky, ve kterých data mění formu ručně',
      'odlišit, co má převzít automatizace a co má zůstat člověku',
    ],
    prerequisites: [
      'Nainstalovaný Claude Code',
      'Počítač s aplikací OneDrive přihlášenou firemním účtem',
      'Desktopová aplikace Claude',
      'Přístup do knihovny na SharePointu, se kterou pracuješ',
    ],
  },
]

export const UPCOMING: Upcoming[] = [
  {
    section: 'Připravujeme',
    title: 'Zadání práce Claudovi nad tabulkou',
    summary: 'Jak popsat výsledek tak, aby vyšel napoprvé — a co dělat, když nevyjde.',
    note: 'Vzniká z workshopu',
  },
  {
    section: 'Připravujeme',
    title: 'MCP nad katalogem dek.cz',
    summary: 'Zeptat se na sortiment, cenu a dostupnost vlastními slovy, bez klikání ve webu.',
    note: 'Stránka už existuje, dělá se z ní lekce',
  },
]

/* ------------------------------------------------------------ pomocníci */

export function findCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug)
}

export function findLesson(course: Course, slug: string): Lesson | undefined {
  return course.lessons.find((l) => l.slug === slug)
}

export function courseMinutes(course: Course): number {
  return course.lessons.reduce((sum, l) => sum + l.minutes, 0)
}

/** „1 lekce“ / „2 lekce“ / „5 lekcí“ — čeština se na plurálu pozná. */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return `${n} ${one}`
  if (n >= 2 && n <= 4) return `${n} ${few}`
  return `${n} ${many}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
