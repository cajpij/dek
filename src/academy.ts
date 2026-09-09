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
  | {
      kind: 'steps'
      items: {
        title: string
        body: string
        code?: string
        /** Snímek obrazovky ke konkrétnímu kroku — soubor leží v public/. */
        /** maxWidth: strop v px pro úzké snímky na výšku, ať se neroztahují nad nativní velikost. */
        image?: { src: string; alt: string; caption?: string; maxWidth?: number }
        /** Odkazy „jak to vypadá" — obrazovky v cizí nápovědě, ke konkrétnímu kroku. */
        links?: { label: string; href: string; note?: string }[]
      }[]
    }
  | { kind: 'code'; text: string; caption?: string }
  | { kind: 'note'; tone: 'info' | 'warn' | 'ok'; title: string; text: string }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | {
      kind: 'figure'
      name:
        | 'regal-flow'
        | 'sync-map'
        | 'project-tree'
        | 'automation-ladder'
        | 'routine-form'
        | 'token-drains'
        | 'context-growth'
        | 'subagent-context'
        | 'context-window'
        | 'connector-setup'
        | 'folder-permission'
        | 'faktury-smycka'
        | 'kontrola-flow'
        | 'rucne-vs-automat'
        | 'prvni-beh'
    | 'tri-prikazy'
    | 'faktury-sezeni'
    | 'akcni-regal'
    | 'akcni-regal-po-rutine'
      caption: string
    }
  /** Snímek cizí obrazovky. Kreslené schéma patří do 'figure', tohle je fotka. */
  | { kind: 'image'; src: string; alt: string; caption?: string; maxWidth?: number }
  /** Předěl uvnitř lekce — dvě varianty téhož, každá se svou odrážkou v nabídce. */
  | { kind: 'sekce'; id: string; stitek: string; titul: string; popis: string }
  /** Soubor z projektu k nahlédnutí — klik otevře dialog s jeho obsahem. */
  | { kind: 'soubor'; nazev: string; popis: string; obsah: string }
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
  /** Kde se to dělá: doma před workshopem, v sále, nebo po něm. */
  track?: 'v sále' | 'potom'
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

const LESSON_PROGRAM: Lesson = {
  slug: 'program-dne',
  module: 'start',
  title: 'Jak workshop poběží',
  summary:
    'Čtyři hodiny v sále, skoro nic předem a zbytek potom. Přehled, co kdy a proč zrovna takhle.',
  minutes: 5,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'vědět, co si přinést s sebou',
    'vědět, co se bude dít v sále a co si z toho odnesete',
    'vědět, ke kterým lekcím se vrátit potom',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Workshop v sále má čtyři hodiny a víc ne schválně — nastavení složky i projektu děláme společně hned na začátku večera, takže si předem nemusíte lámat hlavu. Zbytek akademie je referenční materiál na potom, ke kterému se vracíte, až budete stavět.',
    },
    {
      kind: 'table',
      head: ['Štítek', 'Znamená'],
      rows: [
        ['v sále', 'otevřete si to během workshopu a děláte podle toho. Hlavně cvičení, ne přednášky.'],
        ['potom', 'referenční materiál. Vracejte se k němu, až budete stavět.'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nebyl jsi v sále? Dá se to projít i sám',
      text:
        'Cvičení, která se v sále dělají ve dvojicích, mají uvnitř „Sólo verzi“ — tazatele nahradí Claude. Pořadí pro samostudium je hned pod tabulkou fází a končí kontrolou, na které si ověříš, že ti nic nechybí.',
    },
    { kind: 'h', text: 'Pořadí pro samostudium' },
    {
      kind: 'p',
      text:
        'Cíl: na konci máš vlastní automatizaci, která běží bez tebe, a víš, jak poznáš, že doběhla dobře. Počítej se třemi až čtyřmi hodinami rozloženými do několika dní. Fáze 3 a 4 dělej na cvičném projektu — je to rychlejší a chyby nic nestojí; od fáze 5 už pracuj na vlastních datech.'
    },
    {
      kind: 'table',
      head: ['Fáze', 'Čím projít', 'Na konci máš'],
      rows: [
        [
          '1. Zorientovat se',
          'Slovníček, Z Coworku do Claude Code',
          'víš, co která slova znamenají a ve které aplikaci pracovat',
        ],
        [
          '2. Připojit data',
          'Sdílená složka ze SharePointu, Co Claude ve složce vidí, Projekt v Claude Code',
          'složku, ve které Claude čte i píše, a projekt s CLAUDE.md',
        ],
        [
          '3. Vidět to hotové',
          'Jak se v projektu nastaví automatizace, Cvičný projekt: kontrola faktur',
          'staženou složku, kterou jsi pustil a víš, co se v ní stalo',
        ],
        [
          '4. Postavit totéž sám',
          'Postav si tu složku sám, Automatizace pomocí routine',
          'tutéž složku znovu, od prázdné a bez kopírování, a v ní běh na rozvrh',
        ],
        [
          '5. Najít to ve vlastní práci',
          'Rozhovor o kolegově práci, Kresba flow a Sdílení map — všechna v sólo verzi',
          'mapu vlastního procesu s označenými místy ručního přenosu',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Lekce Kolik to stojí si nech na druhý den',
      text:
        'Dává smysl až ve chvíli, kdy jsi Clauda chvíli používal a máš co porovnávat — přečtená hned první den je jen teorie o tokenech.',
    },
    {
      kind: 'links',
      title: 'Kontrola na konci celé cesty',
      items: [
      ],
    },
    { kind: 'h', text: 'Předem: dvě věci, deset minut' },
    {
      kind: 'list',
      items: [
        'Nainstalovaný Claude Code a přihlášený firemní účet. Nic víc se instalovat nebude.',
        'Vědět, kterou svoji agendu chcete večer řešit, a mít k ní jeden reálný soubor — klidně jen v hlavě, soubor najdeme společně.',
        'SharePoint, projekt ani CLAUDE.md předem nedělejte — je to první blok v sále (16:20), ať vidíme na místě, když někomu nepojede sync.',
      ],
    },
    { kind: 'h', text: 'V sále: 16:00–20:00' },
    {
      kind: 'table',
      head: ['Čas', 'Co se děje'],
      rows: [
        ['16:00', 'Úvod — proč to děláme a co si odnesete'],
        ['16:10', 'Rozehřívačka — postavíme se a řekneme, co jsme dneska dělali ručně'],
        ['16:20', 'Nastavení: sdílená složka a projekt. U vlastního počítače, s asistencí.'],
        ['16:50', 'Vzor: kontrola faktur ručně — a co z ní po automatizaci zbude'],
        ['17:05', 'Pět schodů: z čeho se automatizace skládá'],
        ['17:25', 'Pauza'],
        ['17:35', 'Stáhnout cvičný projekt a pustit ho — ať je vidět cíl'],
        ['17:50', 'Postav si tu složku sám — od prázdné složky, každý u sebe'],
        ['18:35', 'Živá ukázka: naplánujeme běh na za pět minut a necháme ho běžet'],
        ['18:45', 'Pauza'],
        ['18:55', 'Rozhovory ve dvojicích — co děláš ručně ty'],
        ['19:30', 'Kresba flow a označení míst k automatizaci'],
        ['19:45', 'Sdílení map — každá dvojice dvě minuty'],
        ['19:55', 'Doběhlo to samo. Domluva, co do příště.'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nejdůležitější jsou dva bloky',
      text:
        'Stavění složky a rozhovory ve dvojicích. Když z programu něco vypadne, tyhle dva a nastavení na začátku zůstanou — jsou to jediné části, kde vám něco projde rukama.',
    },
    { kind: 'h', text: 'Po workshopu' },
    {
      kind: 'p',
      text:
        'Zbytek akademie nese štítek potom a čeká, až na něj dojde řada — nečtěte to dopředu, vracejte se podle fází v tabulce výš. Máte-li si vybrat jedno, vezměte Jak se v projektu nastaví automatizace — u pátého kroku je odkaz na Cvičný projekt: kontrola faktur, stažitelnou verzi celé cesty od prázdné složky po naplánovaný běh.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Mezi setkáními',
      text:
        'Úkol na týden je jediný: pustit svoji automatizaci na skutečné práci a přinést zpátky, co se stalo. I „nepustila jsem to a tady je proč“ je platná odpověď.',
    },
  ],
}

const VIDEOS_CLAUDE_CODE: VideoRef[] = [
  {
    id: 'inxAjCRHe2o',
    title: 'Claude Code Tutorial for Non-Coders',
    author: 'Kevin Stratvert',
    note: 'Od instalace po první zadání, bez předpokladu, že umíš programovat.',
  },
  {
    id: 'cV52QdcfA0s',
    title: 'How to Use CLAUDE.md, Skills, and Hooks',
    author: 'Code With Robby',
    note: 'Konkrétně k CLAUDE.md a skillům — pusť si to, až budeš psát svůj první.',
  },
]

const LESSON_SLOVNICEK: Lesson = {
  slug: 'slovnicek',
  module: 'start',
  title: 'Slovníček',
  summary:
    'Slova, která se v lekcích opakují. Každé jednou větou, bez techniky. Vracejte se sem, kdykoli něčemu nerozumíte.',
  minutes: 5,
  kind: 'lekce',
  track: 'potom',
  outcomes: ['rozumět slovům, která se v lekcích používají bez dalšího vysvětlování'],
  body: [
    {
      kind: 'p',
      text:
        'Pár slov se nedá obejít žargonem — jsou to názvy věcí, které v Claude Code skutečně takhle existují. Tady jsou pohromadě; nemusíte si je pamatovat, stačí vědět, kde je najít.',
    },
    { kind: 'h', text: 'Základ' },
    {
      kind: 'table',
      head: ['Slovo', 'Co znamená'],
      rows: [
        ['Claude Code', 'aplikace (nebo příkaz claude v terminálu), ve které se pracuje nad složkou s vlastními soubory. Není to chat na webu.'],
        ['Terminál', 'okno, do kterého se píšou příkazy textem. Na Macu aplikace Terminál, na Windows PowerShell. Většinu lekcí zvládnete bez něj.'],
        ['Projekt', 'obyčejná složka, kterou v Claude Code otevřete. Všechno, co v ní je, Claude vidí.'],
        ['CLAUDE.md', 'textový soubor v projektu s pravidly a slovníkem vaší agendy. Claude si ho přečte na začátku každého sezení, takže ho nemusíte opakovat.'],
        ['Sezení', 'jeden rozhovor s Claudem od otevření po zavření. Co v něm řeknete, si pamatuje jen do konce sezení — trvalé věci patří do CLAUDE.md.'],
        ['Zadání (prompt)', 'to, co Claudovi napíšete. V lekcích má vždycky čtyři části: co vzít, co udělat, kam uložit, co s výjimkou.'],
      ],
    },
    { kind: 'h', text: 'Pět schodů' },
    {
      kind: 'table',
      head: ['Slovo', 'Co znamená'],
      rows: [
        ['Pravidlo', 'věta v CLAUDE.md, která platí pořád — třeba „čísla položek jsou text, ne čísla".'],
        ['Skill', 'zabalený postup: složka se souborem SKILL.md, ve kterém je krok za krokem, jak se něco dělá. Claude ho použije sám, když pozná, že se hodí.'],
        ['description', 'jeden řádek na začátku skillu, který říká, co skill dělá a kdy se má použít. Podle něj Claude pozná, že ho má sáhnout.'],
        ['Plugin', 'balíček skillů (případně i hooků a konektorů), který se instaluje jedním příkazem. Takhle se osvědčený postup rozdá celému týmu, místo aby se kopírovaly složky.'],
        ['Hook', 'příkaz, který se spustí sám při určité události — třeba před každým zápisem souboru. Nemá úsudek, proto se hodí na zámky a upozornění, ne na rozhodování.'],
        ['Naplánovaná automatizace (routine)', 'zadání, které se spustí samo v daný čas — v pondělí v šest, každou hodinu. Local běží na vašem počítači, Cloud na serveru.'],
        ['Kontrolní protokol', 'krátký soubor, který automatizace zapíše na konec běhu: kolik čeho bylo na vstupu, kolik na výstupu, co nesedělo. Z něj poznáte, jestli to dopadlo, aniž byste otevírali výstupy.'],
        ['Runbook', 'jedna stránka pro chvíli, kdy něco spadne a vy jste na dovolené: co to dělá, kdy běží, co zkontrolovat, komu napsat.'],
      ],
    },
    { kind: 'h', text: 'Napojení' },
    {
      kind: 'table',
      head: ['Slovo', 'Co znamená'],
      rows: [
        ['Sync (synchronizace)', 'OneDrive drží kopii knihovny ze SharePointu na vašem disku a průběžně ji srovnává. Díky tomu s ní Claude umí pracovat jako s obyčejnou složkou.'],
        ['Zástupce souboru', 'soubor, který ve složce vidíte, ale jeho obsah je jen v cloudu. Claude v něm nic nepřečte. Řeší to „Vždy ponechat v tomto zařízení".'],
        ['Konektor', 'přípojka na službu mimo váš disk — na poštu, Teams, SharePoint jako web, katalog. Bez konektoru Claude vidí jen soubory ve složce.'],
        ['MCP server', 'způsob, jakým se konektor píše. Když někdo řekne „máme MCP na katalog", myslí konektor, přes který se Claude umí ptát katalogu.'],
        ['Write tools', 'část konektoru, která umí něco odeslat nebo změnit — třeba poslat e-mail. Zapíná se zvlášť a musí ji povolit správce.'],
        ['Správce (admin)', 'člověk z IT, který ve firmě povoluje konektory a oprávnění. Bez něj některé věci prostě nepůjdou — ptejte se ho dřív, než na nich něco postavíte.'],
      ],
    },
    { kind: 'h', text: 'Soubory' },
    {
      kind: 'table',
      head: ['Slovo', 'Co znamená'],
      rows: [
        ['data/', 'složka v projektu se vstupy. Nikdy se do ní nezapisuje — originál je jediná kopie.'],
        ['vystup/', 'složka v projektu, kam jdou výsledky. Když se něco pokazí, smaže se a udělá znovu.'],
        ['.claude/', 'skrytá složka v projektu, ve které jsou skilly a nastavení hooků. Tečka na začátku znamená, že ji Průzkumník ani Finder normálně neukazují.'],
        ['.xlsx', 'soubor Excelu. Není to text, proto si na něj Claude napíše kratičký skript — toho si ani nevšimnete.'],
        ['Repozitář (repo)', 'složka projektu uložená na GitHubu, aby se dala stáhnout a sdílet. Potkáte ho jen u MCP serveru — stačí vědět, že „stáhnout repozitář" znamená stáhnout složku.'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Když tu slovo není',
      text:
        'Zeptejte se Clauda: „co znamená X, řekni mi to jednou větou bez techniky" — a řekněte to lektorovi, doplní se sem.',
    },
  ],
}

const LESSON_TOKENY: Lesson = {
  slug: 'kolik-to-stoji',
  module: 'start',
  title: 'Kolik to stojí a jak platit míň',
  summary:
    'Co je token, proč dlouhé sezení stojí víc než pět krátkých, jaký model a effort si vybrat a jak se podívat, kam limit odtekl.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'vysvětlit vlastními slovy, za co se vlastně platí',
    'vybrat model a effort podle toho, co má úkol zač',
    'zkrátit dlouhé sezení pomocí /clear, /compact a /rewind',
    'poznat, co rozbíjí cache, a nedělat to uprostřed práce',
    'zjistit přes /usage a /context, kam limit odtekl',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Limit není trest — skoro vždycky za ním stojí pár návyků, které se dají opravit za deset minut. Rozdíl mezi opatrným a neopatrným sezením je násobek, ne pár procent.',
    },
    {
      kind: 'figure',
      name: 'token-drains',
      caption:
        'Skoro všechno drahé má jednu ze čtyř příčin — lekce jde postupně po všech.',
    },
    { kind: 'h', text: 'Deset minut úklidu, které se vrátí' },
    {
      kind: 'p',
      text: 'Nejrychlejší způsob, jak zjistit, kam příděl mizí: projdi těchhle pět kroků v libovolném sezení.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Napiš /context',
          body:
            'Ukáže, co všechno se posílá s každou zprávou: systémovou část, tvůj CLAUDE.md, připojené konektory, skilly.',
          code: '/context',
          image: {
            src: 'context-okno.webp',
            alt: 'Výpis Context window: zabráno 360,1k z 1M, tedy 36 %. Messages 282,6k (28,3 %), System tools 19,2k (1,9 %), MCP tools 13,3k (1,3 %), Skills 6,3k (0,6 %), System prompt 4,5k (0,4 %), Memory files 1,2k (0,1 %), Autocompact buffer 33k (3,3 %), Free space 639,9k (64 %). Pod čarou MCP tools (deferred) 191,8k a System tools (deferred) 14,7k, obojí bez procenta, a řádek MCP tools s 205k a 399 nástroji.',
            caption:
              'Takhle to vypadá po pár hodinách práce. Messages je 28 % a roste s každou zprávou — to je ta položka, kterou zkrátíš zavřením sezení, ne úklidem nastavení. Deferred řádky nemají procento schválně: konektory čekají stranou a načtou se, až jsou potřeba.',
          },
        },
        {
          title: 'Zkrať CLAUDE.md',
          body:
            'Co se nepoužije pokaždé, patří do skillu. CLAUDE.md je slovník, cesty k datům a pravidla — ne návod na všechno. Ukázka správné velikosti:',
          code: `# Kontrola faktur

## Slovník
- faktura = doklad od dodavatele, přijde e-mailem jako PDF
- objednávka = náš doklad, se kterým se faktura porovnává
- základ daně = částka bez DPH, tu se porovnává
- schválení = potvrzení vedoucího střediska, že se smí platit

## Kde jsou data
- data/ — exporty s datem v názvu, ber vždy nejnovější
- vystup/ — sem jdou výsledky

## Pravidla
- Do data/ nezapisuj. Výsledek ulož jako nový soubor do vystup/.
- Čísla objednávek jsou text. Nepřevádět, nedoplňovat nuly.
- Když chybí sloupec, napiš to a zastav se. Nedopočítávej.

# ⬇ TOHLE UŽ NE — patří do skillu, ne sem
# ## Jak vytáhnout údaje z PDF
# 1. Otevři fakturu a najdi číslo faktury…
# 2. Základ daně ber bez DPH, ne částku s DPH…
# 3. Pro každou fakturu ulož řádek…`,
        },
        {
          title: 'Odpoj nepoužívané konektory',
          body: 'Napiš /mcp a odpoj, co tam zbylo z pokusů. Připojíš zpátky kdykoli.',
          code: '/mcp',
        },
        {
          title: 'Podívej se, kam to odtéká',
          body:
            'Příkaz /usage ukáže vyčerpání přídělu a žebříček toho, co ho bere — podagenti, skilly, konektory, naplánované automatizace.',
          code: '/usage',
          image: {
            src: 'usage-panel.webp',
            maxWidth: 399,
            alt: 'Panel Usage. Nahoře tři pruhy vyčerpání: pětihodinový limit 6 % s obnovou za 2 h 29 min, týdenní přes všechny modely 32 % a týdenní Fable 23 %, obojí s obnovou v neděli ve 12:00. Sekce This session: Cost 32,24 dolaru, API 48 m 32 s, Active 4 m 26 s, Opus 100 %, Haiku 0 %, Cache hit 99 %. Breakdown pro Opus 5: Input 750, Output 2,2k, Cache read 82,4M, Cache write 692,9k. Sekce What is using your limits za posledních 24 hodin: 90 procent běželo nad 150k kontextu, 32 procent pochází ze sezení s podagenty; žebříček prusa MCP 8 %, Claude Browser MCP 7 %, general-purpose Subagent 3 %, skill xlsx 2 %, plugin anthropic-skills 2 %. Dole tip, že delší sezení jsou dražší i s cache.',
            caption:
              'Tři pruhy nahoře říkají, kolik zbývá a kdy se to obnoví. Zajímavější je spodek: „ran above 150k context" u 90 % běhů je diagnóza, ne statistika — příděl nebere jedna drahá otázka, ale to, že sezení běží dlouho a každá další zpráva se posílá i s celou historií. Řádek Active 4 m 26 s proti API 48 m 32 s ukazuje totéž z druhé strany.',
          },
        },
        {
          title: 'Nech si udělat rozbor návyků',
          body: 'Příkaz /insights jednou za měsíc projde poslední sezení a napíše, co dělat jinak.',
          code: '/insights',
        },
      ],
    },
    {
      kind: 'checklist',
      title: 'Šest návyků, které stačí',
      items: [
        '/clear při přechodu na jiný úkol — největší efekt ze všeho',
        'model a effort nastavit na začátku sezení a pak na ně nesahat',
        'na soubory odkazovat zavináčem místo opisování cesty',
        'upovídané příkazy ztišit přepínačem, nebo je nechat na podagentovi',
        '/context v čerstvém sezení a vyhodit, co se nepoužívá',
        '/compact před delší přestávkou, dokud je konverzace ještě v cache',
      ],
    },
    { kind: 'h', text: 'Co je token a proč se to sčítá' },
    {
      kind: 'p',
      text:
        'Token je kousek textu, zhruba slovo nebo jeho část — normostrana vyjde na tisícovku. Počítá se všechno tam i zpátky: zadání, obsah souborů, výpisy, odpověď. Model si mezi zprávami nic nepamatuje, takže se s každou zprávou posílá celá dosavadní konverzace znovu — neplatíš za zprávu, ale za celé sezení, ve kterém ji píšeš. Cache to zlevňuje asi na desetinu, proto je většina rad v téhle lekci o tom, jak ji nerozbít.',
    },
    {
      kind: 'table',
      head: ['Co to je', 'Kolik to stojí'],
      rows: [
        ['Vstup — co Claude čte', 'základní sazba'],
        ['Výstup — co napíše', 'zhruba pětinásobek vstupu'],
        ['Vstup z cache', 'zhruba desetina'],
        ['Zápis do cache', 'až dvojnásobek, platí se jednou'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Limit je společný pro chat, Cowork i Claude Code',
      text:
        'Jeden příděl, obnovuje se v pětihodinovém okně a ještě jednou týdně. Dlouhé sezení ráno v Coworku pocítíš odpoledne v Claude Code.',
    },
    { kind: 'h', text: 'Model a effort' },
    {
      kind: 'p',
      text:
        'Model je, jak chytrý pomocník odpovídá. Effort je, jak dlouho nad odpovědí přemýšlí. Selhal, protože něco nevěděl nebo nepochopil? Ber větší model. Selhal, protože to odbyl — zbrkle, přehlédl polovinu? Zvedni effort.',
    },
    {
      kind: 'table',
      head: ['Model', 'Kdy ho vzít'],
      rows: [
        ['Haiku 4.5', 'krátká faktická otázka, přejmenování souborů, jednoduchý výpis'],
        ['Sonnet 5', 'výchozí volba pro většinu toho, co budeš dělat'],
        ['Opus 5', 'když se něco nedaří napodruhé, návrh postupu, nepřehledná data'],
        ['Fable 5.1', 'výjimečně, když ani Opus nestačí'],
      ],
    },
    {
      kind: 'table',
      head: ['Effort', 'Kdy ho vzít'],
      rows: [
        ['Low', 'krátké a rychlé, na nenáročné věci'],
        ['High', 'výchozí a pro drtivou většinu práce správně'],
        ['Extra', 'hlubší přemýšlení za víc tokenů, když High odbylo práci'],
        ['Max', 'umí pomoct, ale taky se ukecat — 1,5× spotřeby a víc'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Praktické pravidlo',
      text:
        'Nech Sonnet 5 a effort High a nesahej na to. Nevyšlo to? Chybějící znalost → Opus, odbytá práce → Extra. Zvedat obojí najednou je nejdražší způsob, jak se nic nedozvědět.',
    },
    { kind: 'h', text: 'Dlouhá sezení: /clear, /compact, /rewind' },
    {
      kind: 'p',
      text:
        'Nejčastější důvod, proč limit mizí rychle: jedno sezení otevřené celý den, ve kterém se vystřídalo pět nesouvisejících úkolů. Každá další zpráva táhne s sebou všechny předchozí.',
    },
    {
      kind: 'figure',
      name: 'context-growth',
      caption:
        'Táž práce, tytéž otázky — vlevo jedno sezení celý den, vpravo tři sezení s /clear mezi úkoly.',
    },
    {
      kind: 'figure',
      name: 'tri-prikazy',
      caption:
        '/clear historii zahodí, /compact ji slisuje do souhrnu, /rewind ukrojí jen konec. Liší se hlavně tím, co to stojí.',
    },
    {
      kind: 'figure',
      name: 'faktury-sezeni',
      caption:
        'Odpoledne nad kontrolou faktur po zprávách — pět různých věcí, a právě mezi nimi se rozhoduje, jestli tě to bude stát kus přídělu, nebo celý.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Než dáš /clear',
      text:
        'Sezení se dá pojmenovat příkazem /rename a vrátit se k němu přes /resume — „zahodit" neznamená „ztratit", jen přestaneš platit v každé další zprávě.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Jediná otázka, kterou si u toho klaď',
      text:
        'Potřebuje další zpráva to, co je v historii? Ano → jsi ve stejné úloze, jeď dál (a /compact v přestávce, když je historie dlouhá). Ne → /clear.',
    },
    {
      kind: 'links',
      title: 'Ta automatizace z příkladu',
      items: [
        {
          label: 'Cvičný projekt: kontrola faktur ke stažení',
          href: '#academy/od-mapy-k-automatu/cvicny-projekt-faktury',
          note: 'Hotový projekt i s fakturami, skillem a naplánovanou automatizací — stáhneš a pustíš.',
        },
      ],
    },
    { kind: 'h', text: 'Co rozbíjí cache' },
    {
      kind: 'table',
      head: ['Rozbije cache', 'Nerozbije'],
      rows: [
        ['přepnutí modelu', 'úprava souborů v projektu'],
        ['změna effortu', 'spuštění skillu nebo příkazu s lomítkem'],
        ['připojení nebo odpojení konektoru', '/rewind zpět'],
        ['/compact', '/recap — jen shrne, nemění historii'],
        ['nasbírání většího množství obrázků', 'úprava CLAUDE.md (projeví se až po /clear)'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Z toho plyne pravidlo',
      text:
        'Model a effort vyber na začátku sezení a pak už na ně nesahej. Cache na firemním předplatném vydrží hodinu nečinnosti — po vyčerpání přídělu jen pět minut.',
    },
    { kind: 'h', text: 'Pár dalších věcí, co drží kontext lehký' },
    {
      kind: 'list',
      items: [
        'Zadávej konkrétně. „Vylepši mi ten projekt" znamená, že Claude začne číst všechno.',
        'CLAUDE.md drž do dvou set řádků — delší postupy patří do skillu, který se načte, jen když je potřeba.',
        'Do projektu nedávej celou databázi, ale reálný vzorek.',
        'Odkazuj na soubory zavináčem (@nazev-souboru) místo opisování cesty.',
        'U velkých úkolů si nech nejdřív napsat plán (Shift+Tab, plan mode) — levnější než dvakrát dělat špatnou věc.',
      ],
    },
    {
      kind: 'p',
      text:
        'Podagent není „druhý Claude, který ví totéž" — dostane vlastní čistý kontext, tvůj CLAUDE.md, ale ne tvoji konverzaci. Upovídaná práce zůstane u něj a zmizí s ním, zpátky přijde jen odpověď.',
    },
    {
      kind: 'figure',
      name: 'subagent-context',
      caption:
        'Tisíc řádků výpisu zůstane u podagenta. U tebe by se to posílalo znovu s každou další zprávou.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Naplánované automatizace nespí',
      text:
        'Spustí se i bez tebe u počítače a posílají s sebou celý svůj kontext. Po týdnu zkontroluj v /usage, kolik si vzaly.',
    },
    {
      kind: 'task',
      title: 'Cvičení: zjisti, kam ti odtéká příděl',
      intro: 'Deset minut, jednou. Většinou se ukáže jedna věc, která žere víc než všechno ostatní dohromady.',
      items: [
        'Napiš /usage a přepni se na posledních sedm dní. Zapiš si, co je nahoře.',
        'Napiš /context a podívej se, kolik zabírá CLAUDE.md a konektory.',
        'Odpoj jeden nepoužívaný konektor a jeden delší postup z CLAUDE.md přesuň do skillu.',
        'Zkus jeden pracovní den zavírat sezení příkazem /clear při každé změně tématu.',
        'Za týden se podívej znovu a porovnej.',
      ],
      hint:
        'Když v /usage vyskočí „long context" nebo „cache misses", je to přesně ten návyk, o kterém je tahle lekce — dlouhá sezení, nebo příliš časté přepínání modelu.',
    },
    {
      kind: 'links',
      title: 'Kam se podívat dál',
      items: [
        {
          label: 'Maximizing the value of your Claude Code sessions',
          href: 'https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions',
          note: 'Lydia Hallie, Anthropic — pět minut čtení, anglicky. Odsud lekce vychází.',
        },
        {
          label: 'Manage costs effectively',
          href: 'https://code.claude.com/docs/en/costs',
          note: 'dokumentace: /usage, /insights, snižování spotřeby',
        },
        {
          label: 'How Claude Code uses prompt caching',
          href: 'https://code.claude.com/docs/en/prompt-caching',
          note: 'úplný seznam toho, co cache rozbíjí a co ne',
        },
      ],
    },
  ],
}

const LESSON_COWORK: Lesson = {
  slug: 'z-coworku-do-claude-code',
  module: 'start',
  title: 'Z Coworku do Claude Code',
  summary:
    'Většina z vás zatím zná jen Cowork. Čím se Code liší, kdy se který hodí, a co si mezi nimi přenesete.',
  minutes: 8,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'vysvětlit rozdíl mezi chatem, Coworkem a Claude Code',
    'vybrat si pro konkrétní úkol tu správnou ze tří záložek',
    'vědět, co se mezi nimi přenáší a co ne',
    'poznat úkoly, u kterých se Cowork hodí víc než Claude Code',
  ],
  body: [
    {
      kind: 'p',
      text:
        'V aplikaci Claude jsou tři záložky a pletou se. Nejsou to úrovně pokročilosti, ale trojí způsob, jak k Claudovi pustit práci — rozdíl je v tom, kde leží vaše soubory a jestli u nich sedíte.',
    },
    {
      kind: 'table',
      head: ['Záložka', 'K čemu je', 'Kde má vaše soubory'],
      rows: [
        [
          'Chat',
          'zeptat se, nechat si něco vysvětlit nebo napsat, projít text',
          'nikde — dostane jen to, co do rozhovoru vložíte',
        ],
        [
          'Cowork',
          'zadat delší práci a jít dělat něco jiného; agent pracuje sám na pozadí',
          've vlastním odděleném prostředí; soubory se do něj předávají',
        ],
        [
          'Code',
          'pracovat nad složkou na svém počítači a vidět každou změnu',
          'přímo ve složce, kterou otevřete — čte i zapisuje do ní',
        ],
      ],
    },
    { kind: 'h', text: 'Kdy zůstat v Coworku' },
    {
      kind: 'list',
      items: [
        'Práce, která nemá co dělat s vašimi soubory: rešerše, sepsání podkladu, projití něčeho, co jste dostali odjinud.',
        'Dlouhá práce, u které nechcete sedět a nevadí, že poběží ve vlastním prostředí.',
        'Něco, co chcete rozjet z telefonu nebo z jiného počítače, než na kterém máte složku.',
      ],
    },
    { kind: 'h', text: 'Kdy přejít do Code' },
    {
      kind: 'list',
      items: [
        'Data jsou ve složce na disku nebo v nasyncované knihovně a mají tam zůstat.',
        'Výsledkem má být soubor uložený na konkrétní místo, ne text v rozhovoru.',
        'Tentýž postup se opakuje každý týden a chcete z něj mít skill.',
        'Má to jednou běžet bez vás a po každém běhu zůstat kontrola.',
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Nejde o to, co je „lepší“',
      text:
        'Cowork je silný v tom, že běží bez vás. Code je silný v tom, že pracuje rovnou ve složce s vašimi daty a nic se nikam nepřepisuje. Většina agend v logistice je druhý případ.',
    },
    { kind: 'h', text: 'Co se změní, když přejdete do Code' },
    {
      kind: 'list',
      items: [
        'Práce má domov — otevřete složku a Claude vidí data, výstupy, pravidla; příště vyberete tutéž složku ze seznamu.',
        'Pravidla se nemusí opakovat — CLAUDE.md se načte na začátku každého sezení.',
        'Postupy se dají zabalit do skillu, který se spustí jednou větou.',
        'Dá se to naplánovat, aby to jednou běželo samo a po sobě nechalo protokol.',
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Příděl je společný',
      text:
        'Chat, Cowork i Code čerpají z jednoho přídělu. Dlouhé sezení dopoledne v Coworku poznáte odpoledne v Code — víc v lekci Kolik to stojí a jak platit míň.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Co si přenesete',
      text:
        'Zvyk psát konkrétní zadání — co vzít, co udělat, kam uložit, co s výjimkou — platí ve všech třech záložkách stejně. Code navíc přidává složku, pravidla a možnost nechat postup běžet znovu.',
    },
  ],
}

const LESSON_PROJEKT: Lesson = {
  slug: 'projekt-v-claude-code',
  module: 'napojeni',
  title: 'Projekt v Claude Code: co si založit',
  summary:
    'Projekt založí Claude jedním zadáním. Co při tom vznikne a proč — CLAUDE.md, skill, artefakt, konektor — na příkladech z logistiky, dopravy, BI, marketingu a vedení.',
  minutes: 15,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'vysvětlit, co je v Claude Code projekt, sezení, skill, artefakt a konektor',
    'rozhodnout, co patří do CLAUDE.md a co do skillu',
    'nechat Clauda projekt založit a rozhodnout jediné, co za tebe nerozhodne: kam složku dát',
    'napsat CLAUDE.md, který nemusíš každé ráno opakovat v chatu',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Claude Code se spouští ve složce a všechno, co v něm nastavíš, jsou obyčejné soubory v ní — dají se číst, poslat kolegovi, verzovat. Nic z toho ale nevyrábíš ručně: projekt založí Claude sám, ty jen rozhodneš jedinou věc, kterou za tebe rozhodnout nemůže — kde ta složka bude.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Pro koho to je',
      text:
        'Pro logistiku, dopravu, BI, marketing a vedení — bez programování. Všechno níž jsou textové soubory a složky, ne kód.',
    },
    { kind: 'h', text: 'Projekt je složka' },
    {
      kind: 'p',
      text:
        'Claude vidí obsah složky, ve které ho spustíš, a nic nad ní. Proto: jedna agenda = jedna složka, ne jedna velká „AI“ složka se vším dohromady. Zvlášť kontrola faktur, zvlášť reporty, zvlášť ceníky — každý projekt si drží svoje pravidla.',
    },
    {
      kind: 'figure',
      name: 'project-tree',
      caption:
        'Takhle vypadá hotový projekt. Za chvíli ho takhle Claude založí sám — nic z toho není povinné a přesto se to vyplatí.',
    },
    { kind: 'h', text: 'Založení nech na Claudovi' },
    {
      kind: 'p',
      text: 'První věta v novém projektu je zadání, ne klikání v Průzkumníku. Nejdřív ale otevři Clauda ve správné složce:',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Otevři aplikaci Claude a přepni na záložku Code',
          body:
            'Prostředí nech na Local — to znamená „na mém počítači, s mými soubory". Ve Windows se hned ozve hláška, že chybí Git: bez něj se místní sezení nespustí. Stáhni ho z git-scm.com, spusť instalátor a nic v něm neměň, pak Claude restartuj. Vypadá to takhle. **Na Macu se nic takového neobjeví a tenhle krok přeskakuješ.**',
          image: {
            src: 'git-pro-windows.webp',
            alt: 'Stránka git-scm.com se záložkami Windows, macOS, Linux a Build from Source. Na záložce Windows je nahoře odkaz Click here to download, kterým se stáhne poslední udržovaná verze Gitu pro Windows pro procesory x64. Pod ním jsou další možnosti: samostatný instalátor pro x64 i ARM64, přenosná verze na flash disk a příkaz winget install --id Git.Git -e --source winget pro ty, kdo instalují z příkazové řádky.',
            caption:
              'Jen pro Windows. Klikni na Click here to download, spusť instalátor a nic neměň. Pak restartuj aplikaci Claude.',
          },
          links: [
            {
              label: 'git-scm.com/downloads/win — stažení Gitu pro Windows',
              href: 'https://git-scm.com/downloads/win',
              note: 'Stránka pozná, jestli máš x64 nebo ARM64, a nabídne správnou verzi sama.',
            },
          ],
        },
        {
          title: 'Založ prázdnou složku — na zkoušku klidně na ploše',
          body:
            'V Průzkumníku nebo Finderu, jméno je jedno. Napoprvé ji dej na plochu a pojmenuj třeba slozka: propojení si na ní vyzkoušíš za deset vteřin a nic nerozbiješ. Ostrá složka agendy pak patří dovnitř nasyncované knihovny — na firemních Windows bývá plocha do OneDrivu přesměrovaná, takže i ta může být uvnitř; pozná se to z cesty, kterou Claude ukáže v dalším kroku. Existovat musí dřív, než ji vybereš: Claude si ji sám nevytvoří, protože neví kam.',
        },
        {
          title: 'Vyber ji přes Select folder',
          body:
            'Otevře se obyčejný výběr složek. Proklikej se tam, kam jsi ji dal — přes OneDrive a Plochu, když je na ploše — a vyber ji. Vybíráš složku samotnou, ne soubor v ní.',
          image: {
            src: 'vyber-slozky.webp',
            alt: 'Výběr složky ve Windows. Ve stromu je OneDrive – DEK a.s. a pod ním Dokumenty, MAGAZÍN, Obrázky a Plocha. Plocha je rozbalená a jsou v ní tři složky: Claude code, faktury-kontrola a archiv. Označená je faktury-kontrola.',
            caption: 'Takhle to vypadá na Windows. Plocha bývá na firemních počítačích uvnitř OneDrivu, takže je i tahle složka nasyncovaná.',
            maxWidth: 380,
          },
        },
        {
          title: 'Potvrď důvěru — mělo by vyskočit tohle okno',
          body:
            'Claude se zeptá „Trust this workspace?" a napíše, že v té složce smí číst, zapisovat i spouštět soubory. Pod tím je celá cesta — přečti si ji, je to jediné místo, kde se dá ověřit, kterou složku vlastně potvrzuješ. Pak klikni na Trust workspace. Když se okno vůbec neobjeví, tuhle složku už jsi jednou potvrzoval a Claude si to pamatuje.',
          image: {
            src: 'trust-workspace.webp',
            alt: 'Dialog Trust this workspace? v aplikaci Claude. Píše se v něm, že Claude Code smí v této složce číst, zapisovat i spouštět soubory, a že se má pokračovat jen u složky, které člověk věří. Pod tím je celá cesta ke složce. Dole je řádek Execution allowed by s hodnotou tečka claude lomítko settings tečka json a tlačítka Cancel a Trust workspace.',
            caption: 'Řádek „Execution allowed by" se objeví jen tehdy, když ve složce leží .claude/settings.json — tedy nastavení, které samo něco spouští. U staženého cvičného projektu je to zábrana nad vstup/ a je to schválně; u složky odjinud je to důvod se do toho souboru podívat, než potvrdíš.',
            maxWidth: 480,
          },
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Zkouška na dvě minuty, než na to pustíš ostrá data',
      text:
        'Založ složku na ploše, propoj ji, potvrď důvěru a napiš Claudovi „co je v téhle složce?". Odpoví, že nic — a je to hotová zkouška celého propojení. Teprve pak to samé udělej nad složkou agendy v nasyncované knihovně, kde už jsou soubory, na kterých záleží. Ta zkušební složka na ploše se pak dá smazat.',
    },
    {
      kind: 'p',
      text: 'Teď jsi uvnitř. Vlep tohle:',
    },
    {
      kind: 'code',
      text: `Založ mi tady projekt faktury-kontrola: složky data a vystup a soubor
CLAUDE.md. Do CLAUDE.md napiš slovník téhle agendy — na pojmy se mě
zeptej — kde jsou data, a pravidlo, že originály v data/ se nikdy
nepřepisují: všechno nové se ukládá do vystup/.`,
      caption: 'Dvacet vteřin a struktura stojí. Zbytek lekce vysvětluje, co vzniklo a proč — až se něco pokazí, budeš to potřebovat vědět.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Projekt a nasyncovaná složka nestojí vedle sebe',
      text:
        'Projekt v Claude Code není nic zvláštního — je to prostě složka, kterou otevřeš. „Projekt v nasyncované knihovně“ tak znamená obyčejnou podsložku v ní. Claude přitom vidí jen otevřenou složku a to, co je pod ní.',
    },
    { kind: 'h', text: 'A když ta složka je sdílená knihovna?' },
    {
      kind: 'p',
      text:
        'Většina agend má data ve sdílené knihovně na SharePointu, ne na ploše. Nic zvláštního se nekoná — nasyncovaná knihovna je pro počítač obyčejná složka, takže projekt může ležet přímo v ní. Struktura je stejná, mění se jen cesta.',
    },
    {
      kind: 'platform',
      mac: [
        {
          kind: 'code',
          text: `~/Library/CloudStorage/OneDrive-SharedLibraries-DEK/Ucetnictvi/
└── faktury-kontrola/
    ├── CLAUDE.md
    ├── data/
    ├── vystup/
    └── .claude/skills/`,
          caption: 'Library je na Macu skrytá — do Finderu se dostaneš přes ⇧⌘G. .claude začíná tečkou, takže ji skryje taky; ⇧⌘. skryté soubory přepne.',
        },
      ],
      win: [
        {
          kind: 'code',
          text: `C:\\Users\\<jmeno>\\DEK\\Ucetnictvi\\
└── faktury-kontrola\\
    ├── CLAUDE.md
    ├── data\\
    ├── vystup\\
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
          'Většinou výhoda — pravidla jsou týmová. Zároveň do nich nepiš nic osobního.',
        ],
        [
          'Všechno ve vystup/ uvidí ostatní',
          'Rozpracované věci pojmenovávej tak, aby to bylo poznat.',
        ],
        [
          'Soubory musí být stažené v zařízení',
          'Files On-Demand jinak nechá jen zástupce a Claude v nich nic nepřečte. Pravý klik na složku → Vždy ponechat v tomto zařízení.',
        ],
        [
          'Dva lidi ve stejné složce naráz',
          'OneDrive udělá konfliktní kopii — nespouštěj Clauda nad stejnou složkou ze dvou počítačů zároveň.',
        ],
        [
          'Práva se dědí ze SharePointu',
          'Claude vidí přesně to, co vidíš ty. Nic víc, nic míň.',
        ],
      ],
    },
    { kind: 'h', text: 'CLAUDE.md je paměť projektu' },
    {
      kind: 'p',
      text:
        'Textový soubor v kořeni složky, načte se na začátku každého sezení. Patří sem to, co bys jinak vysvětlovala pokaždé znovu: firemní slovník, kde leží která data, jak se mají jmenovat výstupy a co se nikdy nesmí. Dopisuj, když stejnou opravu píšeš podruhé.',
    },
    {
      kind: 'code',
      text: `# Kontrola faktur

## Slovník
- faktura = PDF příloha e-mailu od dodavatele
- šest povinných údajů = číslo faktury, dodavatel, IČO, číslo objednávky,
  základ daně (částka bez DPH), splatnost
- kompletní faktura = má všech šest údajů čitelných

## Kde jsou data
- vstup/ — uložené PDF faktur. Sem se jen čte.
- data/objednavky.xlsx — evidence, sešit pro každého dodavatele
- vystup/ — kontrola-<RRRR-MM-DD>.xlsx a protokol, jen dny s nálezem

## Pravidla
- Do vstup/ nikdy nezapisuj nic jiného než nově staženou fakturu.
- Když údaj na faktuře není, nech pole prázdné. Nic nedomýšlej.
- Fakturu neschvaluj a nezadávej k platbě. To zůstává na člověku.`,
      caption: 'Takhle vypadá CLAUDE.md, který dává smysl. Drž ho pod dvěma sty řádky, piš konkrétně.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nemusíš ho psát na prázdno',
      text:
        '/init projde složku a vygeneruje první verzi, /memory ukáže, které soubory s pravidly se do sezení načetly, a otevře je k úpravě. Claude si navíc opravy, které mu dáš, zapisuje sám — i ty najdeš přes /memory.',
    },
    { kind: 'h', text: 'Sezení začíná načisto' },
    {
      kind: 'p',
      text:
        'Nový rozhovor nezná ten předchozí — kromě CLAUDE.md a poznámek, které si Claude zapsal sám. Je to ochrana: dlouhé sezení s pěti různými úkoly dává horší výsledky než pět krátkých. Jeden úkol = jedno sezení, mezi nimi /clear.',
    },
    { kind: 'h', text: 'Skill je zabalený postup' },
    {
      kind: 'p',
      text:
        'Když stejný postup popisuješ potřetí, udělej z něj skill: složku se souborem SKILL.md, nahoře pár řádků co skill dělá a kdy se má použít, pod tím samotný postup. Claude si ho pak vybere sám, nebo ho spustíš lomítkem podle jména.',
    },
    {
      kind: 'code',
      text: `.claude/skills/kontrola-faktur/SKILL.md

---
name: kontrola-faktur
description: Uloží příchozí faktury v PDF, vytáhne z nich šest povinných
  údajů a zapíše je do evidence podle dodavatele. Použij, když přibyly
  nové faktury nebo když se ptám, co je k vyřízení.
---

1. Najdi faktury, které ještě nejsou uložené ve vstup/, a ulož je tam.
2. Z každé vytáhni šest údajů. Co na faktuře není, nech prázdné.
3. Zapiš je do data/objednavky.xlsx do sešitu podle dodavatele.
...`,
      caption: 'Řádek description rozhoduje, kdy se skill sám nabídne — piš do něj slova, která se běžně říkají v zadání.',
    },
    { kind: 'h', text: 'Artefakt je publikovaná stránka' },
    {
      kind: 'p',
      text:
        'Přehled, dashboard, kalkulačka, checklist pro tým. Na rozdíl od souboru má vlastní adresu, dá se poslat odkazem a příště se aktualizuje na stejném místě — nikomu nezůstane v ruce stará verze. Tahle akademie je taky jen publikovaná stránka.',
    },
    {
      kind: 'table',
      head: ['Chceš…', 'Uděláš z toho'],
      rows: [
        ['pravidlo, které platí pořád', 'řádek v CLAUDE.md'],
        ['postup, který opakuješ každý týden', 'skill v .claude/skills/'],
        ['přehled, do kterého se bude někdo dívat', 'artefakt'],
        ['soubor, který někomu pošleš mailem', 'obyčejný výstup do vystup/'],
        ['přístup do systému, kde data žijí', 'konektor'],
      ],
    },
    { kind: 'h', text: 'Konektor napojí systém' },
    {
      kind: 'p',
      text:
        'Konektor (technicky MCP server) dá Claudovi nástroje k jednomu konkrétnímu systému — katalogu, úložišti, ticketovacímu nástroji. Zapojuj jen to, co pro danou agendu opravdu potřebuješ: každý navíc je další místo, kde se dá něco splést, a další účet, který někdo spravuje.',
    },
    { kind: 'h', text: 'Než se něco změní, ptá se' },
    {
      kind: 'p',
      text:
        'U věcí, které mění soubory, se vyplatí nechat si nejdřív napsat plán a teprve pak ho odsouhlasit. Claude se navíc ptá, než něco zapíše nebo spustí; mazání souborů je vypnuté, dokud ho výslovně nepovolíš. Je to jediné místo, kde chybu chytíš dřív, než se stane.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Do složky projektu nepatří všechno',
      text:
        'Claude vidí celý obsah složky. Nedávej do ní věci, které s agendou nesouvisejí — osobní dokumenty, hesla, exporty, které tam nemají co dělat.',
    },
    {
      kind: 'video',
      title: 'Videa k Claude Code',
      items: VIDEOS_CLAUDE_CODE,
    },
    { kind: 'h', text: 'Konkrétní příklad: projekt kontroly faktur' },
    {
      kind: 'p',
      text:
        'Takhle to vypadá u agendy, kterou v akademii rozebíráme do hloubky — kontrola faktur. Projekt uloží příchozí PDF faktury, vytáhne z nich šest povinných údajů a zapíše je do evidence podle dodavatele; u neúplných napíše dodavateli o doplnění. Neschvaluje a neplatí, to zůstává na člověku. Stáhneš si ho hotový v lekci Cvičný projekt: kontrola faktur — tady je jen vidět, z čeho se skládá.',
    },
    {
      kind: 'code',
      text: `faktury-kontrola/
├── CLAUDE.md
├── vstup/
│   ├── 2026-09-01_stavebniny-morava.pdf
│   ├── 2026-09-02_naradi-profi.pdf
│   ├── 2026-09-03_elektro-dvorak.pdf
│   ├── 2026-09-04_vts-technik.pdf
│   └── 2026-09-05_barvy-piekarova.pdf
├── data/
│   └── objednavky.xlsx
├── vystup/
│   ├── kontrola-2026-09-08.xlsx
│   └── protokol-2026-09-08.md
└── .claude/
    └── skills/
        └── kontrola-faktur/SKILL.md`,
      caption: 'Reálné názvy z té agendy. Faktury zůstávají ve vstup/ nedotčené, všechno nové vzniká ve vystup/.',
    },
    {
      kind: 'code',
      text: `# Kontrola faktur

Cvičný projekt z workshopu DEK Academy. Sleduje schránku fakturace@dek.cz.
Když přijde e-mail s fakturou v PDF, uloží ji, vytáhne z ní šest povinných
údajů a zapíše je do evidence podle dodavatele. Když některý údaj chybí, sám
pošle dodavateli e-mail s žádostí o doplnění.

**Posílá poštu bez potvrzení — ale jenom žádost o doplnění chybějícího údaje,
nikdy nic k platbě.** Neschvaluje faktury, nezadává je k platbě a nepíše nic
do účetního systému. To zůstává na člověku.

## Slovník
- faktura = PDF příloha e-mailu, který přijde do schránky fakturace@dek.cz
- šest povinných údajů = číslo faktury, dodavatel, IČO dodavatele, číslo
  objednávky, základ daně (částka bez DPH), splatnost
- IČO = vždycky IČO dodavatele. IČO odběratele (DEK a.s.) je na faktuře taky
  a nepočítá se — když je u dodavatele jen jméno a adresa, údaj chybí.
- kompletní faktura = má všech šest údajů čitelných
- evidence = data/objednavky.xlsx, jeden sešit pro každého dodavatele

## Kde jsou data
- vstup/ — uložené PDF faktur. Sem se jen čte, nikdy nepřepisuje. Přibýt smí
  jen nově stažená faktura, nic jiného (hlídá to hook chran-vstup.sh).
- data/objednavky.xlsx — evidence přijatých faktur, sešit pro každého
  dodavatele. Sloupce: Soubor / Datum přijetí / Číslo faktury / IČO / Číslo
  objednávky / Základ daně / Splatnost / Kompletní / Žádost odeslána.
  Nekontroluje se proti schváleným objednávkám, jen se eviduje, co přišlo,
  jestli je to kompletní a jestli se u toho dodavatele o doplnění požádalo.
- vystup/kontrola-<RRRR-MM-DD>.xlsx — jen faktury, kterým ten den něco
  chybělo: sešit „Přehled" se stavem všech faktur toho dne a pak sešit
  pro každého dodavatele s navrženým textem a časem odeslání.
- vystup/protokol-<RRRR-MM-DD>.md — krátký zápis běhu: co se ten den
  zkontrolovalo, co chybělo, komu se psalo a co zůstalo k ruční kontrole.

## Pravidla
- Do vstup/ nikdy nezapisuj nic jiného než nově staženou fakturu. Nic v ní
  nepřejmenovávej ani nemaž — originály jsou důkaz.
- Když údaj ve faktuře není nebo se nedá přečíst, nech pole v evidenci
  prázdné. Nic nedomýšlej a nic nedopočítávej.
- Jméno dodavatele do e-mailu i do názvu sešitu ber přesně tak, jak je
  napsané na faktuře.
- E-mail s žádostí o doplnění posílej jen na adresu, ze které faktura
  přišla, a vždy v kopii vedouci-uctarny@dek.cz.
- Text, který odejde dodavateli, musí být přesně ten, co je zapsaný jako
  navržená odpověď v kontrola-<RRRR-MM-DD>.xlsx.
- Čas odeslání zapiš do kontrola-<RRRR-MM-DD>.xlsx (do sešitu dodavatele i
  do „Přehledu") a do sloupce „Žádost odeslána" v data/objednavky.xlsx. Bez
  připojeného konektoru napiš na všechna tři místa „připraveno, čeká na
  konektor".
- E-mail posílej jen tehdy, když chybí jeden nebo dva ze šesti údajů. Když
  jich chybí tři a víc, nebo se z PDF nedá přečíst text vůbec, nic
  neposílej — napiš to do protokolu a řekni mi to. Tolik chybějících údajů
  většinou neznamená špatnou fakturu, ale že se nepodařilo PDF správně
  přečíst, a to se nemá posílat dodavateli jako naše chyba.
- Nikdy neposílej e-mail, který se týká platby, schválení nebo účetnictví.
  Jediný důvod k automatickému e-mailu je žádost o doplnění chybějícího
  údaje na faktuře samotné.
- Nikdy neschvaluj fakturu, nezadávej ji k platbě a nezapisuj nic do
  účetního systému.

## Když projekt běží bez připojené schránky
V cvičné podobě (žádný konektor na Microsoft 365) skill zpracuje, co už
leží ve vstup/, a e-mail jen navrhne — nemá odkud ho fyzicky odeslat. Jakmile
je M365 konektor připojený a má write tools, běží to nad živou schránkou a
navržený text se doopravdy odešle. Postup je v obou případech stejný, mění
se jen to, odkud faktura přišla a jestli má skill k dispozici odeslání.`,
      caption: 'Celý CLAUDE.md téhle agendy, doslova — je to ten samý soubor, který je v cvičném projektu ke stažení. Většina řádků vznikla tak, že se něco pokazilo a příště se to nemělo opakovat.',
    },
    {
      kind: 'h',
      text: 'První tři zadání, která v tom projektu dávají smysl',
    },
    {
      kind: 'list',
      items: [
        '„Podívej se do vstup/ a řekni mi, kolik je tam faktur a jestli má každá čitelný text.“ — ověření, že se dá vůbec začít.',
        '„Ke každé faktuře najdi v data/objednavky.xlsx odpovídající objednávku podle čísla a porovnej základ daně se schválenou částkou.“ — spojení dvou zdrojů.',
        '„Ulož výsledek jako kontrola-<datum>.xlsx do vystup/ a napiš k tomu krátký protokol.“ — to, co se dělalo ručně.',
      ],
    },
    { kind: 'h', text: 'Dobré a špatné zadání' },
    {
      kind: 'table',
      head: ['Místo tohohle', 'Napiš tohle', 'Proč'],
      rows: [
        [
          '„Zkontroluj mi ty faktury.“',
          '„Projdi PDF ve vstup/, z každé vytáhni šest povinných údajů a zapiš je do data/objednavky.xlsx do sešitu podle dodavatele.“',
          'Pojmenuj vstup, operaci i místo výsledku — jinak hádá všechno tři.',
        ],
        [
          '„Uprav to, ať je to přehlednější.“',
          '„Sloupce Faktura, Dodavatel, Základ daně, SEDÍ, CHYBÍ v tomhle pořadí, řádky s nálezem podbarvi červeně.“',
          'Ověřitelné zadání se dá zkontrolovat, „přehlednější“ ne.',
        ],
        [
          '„Doplň, co ve faktuře chybí.“',
          '„Co na faktuře není, nech prázdné a nic nedomýšlej — sloupec Kompletní pak řekne ne.“',
          'Nechceš odhad tam, kde má být otazník.',
        ],
        [
          '„Udělej to jako minule.“',
          '„Postupuj podle skillu kontrola-faktur.“',
          'Minule si nepamatuje, skill ano.',
        ],
      ],
    },
    { kind: 'h', text: 'A co u jiných agend' },
    {
      kind: 'p',
      text: 'Struktura je pokaždé stejná, mění se jen slovník a pravidla. Přepni si agendu, která je nejblíž té tvojí.',
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
└── vystup/       # týdenní přehledy

Zadání na začátek:
- „Spočítej z jízd za minulý týden podíl prázdných kilometrů po vozidlech.“
- „Vypiš tři vozidla s nejhorším poměrem a u každého tři nejdelší prázdné úseky.“`,
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
└── vystup/       # zadání pro realizaci, datové slovníky

Zadání na začátek:
- „Vezmi tenhle požadavek a napiš ho ve tvaru, který projde ze Specifikace
   do Analýzy napoprvé. Co chybí, vypiš jako otázky na zadavatele.“
- „Porovnej sloupce dvou exportů a vypiš, kde se schéma rozešlo.“`,
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
└── vystup/       # texty pro web a leták

Zadání na začátek:
- „Z tabulky položek napiš popisky pro web, každý do 200 znaků, podle tónu z CLAUDE.md.“
- „Zkontroluj, jestli někde nepoužíváme zakázaná slova ze seznamu.“`,
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
└── vystup/       # zápisy a přehledy

Zadání na začátek:
- „Z přepisu porady vytáhni rozhodnutí, úkoly a kdo je vlastní. Co není jasné, označ.“
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
        'Podsložka vystup/, kam jdou výsledky',
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
        'Rozhodni, kde projekt bude: v nasyncované knihovně (týmová agenda), nebo u sebe na disku (tvoje pokusy).',
        'Otevři tam Claude Code a nech ho projekt založit — zadáním jako výš, jen s názvem tvojí agendy. Na otázky ke slovníku odpovídej konkrétně, píše se to rovnou do CLAUDE.md.',
        'Do data/ dej jeden reálný soubor, se kterým běžně pracuješ.',
        'Nech Clauda popsat vlastními slovy, čemu ta agenda slouží. Co nesedí, dopiš do CLAUDE.md.',
        'Zadej mu první úkol a všímej si, kolikrát mu musíš něco vysvětlit. Každé takové vysvětlení je kandidát na řádek v CLAUDE.md.',
      ],
      hint:
        'Nesnaž se napsat dokonalé CLAUDE.md napoprvé. Vzniká tak, že do něj týden dopisuješ věci, u kterých se přistihneš, že je vysvětluješ podruhé.',
    },
  ],
}

const VIDEOS_PLAN: VideoRef[] = [
  {
    id: 'U_cDKkDvPAQ',
    title: 'Claude Code Scheduled Tasks Are Insane',
    author: 'Tyler Germain | AI Automation',
    note: 'Naplánované automatizace v Claude Code od nuly. Nejblíž tomu, co budeme dělat.',
  },
  {
    id: 'ZbawXiYm4Go',
    title: "Claude Code's New Upgrade Lets You Automate Any Task",
    author: 'Rob The AI Guy',
    note: 'Delší a pomalejší, klikací. Pusť si to, když ti to první video ujede.',
  },
  {
    id: 'xIjUdWMgzbM',
    title: 'Turn Claude Code Into an Employee That Works 24/7',
    author: 'Achuth G. Ramesh',
    note: 'Až budeš mít první automatizaci a začneš přemýšlet, co dál.',
  },
]

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
          'V horní liště knihovny je Synchronizovat a vedle Přidat zástupce do OneDrivu (Add shortcut to OneDrive). Vezmi zástupce — chová se stejně, ale funguje i na jiných počítačích, kde je člověk přihlášený, a dá se snáz odebrat. Systém se zeptá, jestli má otevřít OneDrive, potvrď to.',
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
        title: 'Otevři složku v Claude Code',
        body:
          'V desktopové aplikaci Claude (záložka Code) nech prostředí přepnuté na Local, klikni na Select folder / Vybrat složku a vyber tu nasyncovanou. Když se zeptá, jestli složce věříš, potvrď. Od téhle chvíle v ní Claude umí číst, hledat a zakládat soubory. Kdo pracuje v terminálu, udělá totéž příkazem níž.',
        code: 'cd ~/Library/CloudStorage/OneDrive-<firma>/<knihovna>\nclaude',
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
        links: [
          {
            label: 'Jak týmový web vypadá',
            href: 'https://support.microsoft.com/cs-CZ/SharePoint/sites-in-sharepoint/what-is-a-sharepoint-team-site',
            note: 'nápověda Microsoftu — snímek levé nabídky webu, kde je knihovna Dokumenty',
          },
        ],
      },
      {
        title: 'Klikni na Přidat zástupce do OneDrivu',
        body:
          'V horní liště knihovny je Synchronizovat a vedle Přidat zástupce do OneDrivu (Add shortcut to OneDrive). Vezmi zástupce — chová se stejně, ale funguje i na jiných počítačích, kde je člověk přihlášený, a dá se snáz odebrat.',
        links: [
          {
            label: 'Jak ta horní lišta vypadá',
            href: 'https://support.microsoft.com/cs-cz/sharepoint/sync/sync-sharepoint-and-teams-files-with-your-computer',
            note: 'snímek tlačítka Synchronizovat v knihovně — Přidat zástupce je hned vedle',
          },
          {
            label: 'Co přesně dělá Přidat zástupce',
            href: 'https://support.microsoft.com/cs-cz/onedrive/add-shortcuts-to-shared-folders-in-onedrive',
            note: 'obrázky výběru složky a rozdíl proti Synchronizovat',
          },
        ],
      },
      {
        title: 'Počkej, až OneDrive dosyncuje',
        body:
          'Modrý mráček v oznamovací oblasti u hodin ukazuje průběh. Než je hotovo, ve složce jsou jen názvy souborů bez obsahu.',
        links: [
          {
            label: 'Který mráček znamená co',
            href: 'https://support.microsoft.com/cs-cz/onedrive/what-do-the-onedrive-icons-mean',
            note: 'tabulka všech stavů ikony u hodin i v Průzkumníku — kolečko se šipkami znamená, že se ještě syncuje',
          },
        ],
      },
      {
        title: 'Najdi složku v Průzkumníku',
        body:
          'V levém panelu Průzkumníka přibude položka s názvem firmy a ikonou budovy, a v ní ta knihovna. Na disku je pod tvým profilem — cestu níž můžeš vložit rovnou do adresního řádku.',
        code: '%UserProfile%\\<název firmy>\\',
        links: [
          {
            label: 'Jak to v Průzkumníku vypadá',
            href: 'https://support.microsoft.com/cs-cz/sharepoint/sync/sync-sharepoint-and-teams-files-with-your-computer',
            note: 'na téže stránce níž: snímek „složky synchronizace OneDrivu a webů" — složka firmy a pod ní knihovny',
          },
        ],
      },
      {
        title: 'Řekni Windows, ať soubory drží u sebe',
        body:
          'Pravý klik na složku → Vždy ponechat na tomto zařízení (v některých verzích Windows „Vždy zachovat v tomto zařízení", anglicky Always keep on this device). Bez tohohle kroku má většina souborů na disku jen zástupce a Claude v nich nic nepřečte — vidí název, ale ne obsah.',
        links: [
          {
            label: 'Jak ta nabídka vypadá',
            href: 'https://support.microsoft.com/cs-cz/onedrive/save-disk-space-with-onedrive-files-on-demand-for-windows',
            note: 'snímek nabídky po pravém kliknutí a tabulka ikon: modrý mráček = jen online, zelená fajfka = staženo',
          },
        ],
      },
      {
        title: 'Otevři složku v Claude Code',
        body:
          'V desktopové aplikaci Claude (záložka Code) nech prostředí přepnuté na Local, klikni na Select folder / Vybrat složku a vyber tu nasyncovanou. Když se zeptá, jestli složce věříš, potvrď. Od téhle chvíle v ní Claude umí číst, hledat a zakládat soubory. Kdo pracuje v terminálu, udělá totéž příkazem níž.',
        code: 'cd %UserProfile%\\<firma>\\<knihovna>\nclaude',
        links: [
          {
            label: 'První sezení krok za krokem',
            href: 'https://code.claude.com/docs/en/desktop-quickstart',
            note: 'dokumentace Claude Code: záložka Code, volba Local a Select folder. Ve Windows musí být nainstalovaný Git, jinak se místní sezení nespustí.',
          },
        ],
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
        'Pravý klik na složku → Vždy ponechat na tomto zařízení',
      ],
      [
        'Cesta je moc dlouhá, něco se nenasyncuje',
        'Limit délky cesty ve Windows',
        'Připoj radši podsložku níž, nebo zkrať názvy složek v knihovně',
      ],
      [
        'Složka v Průzkumníku není',
        'Zástupce se přidal do jiného účtu OneDrivu',
        'Klikni na ikonu mráčku → ozubené kolo → Nastavení → Účet a zkontroluj, kterým účtem je OneDrive přihlášený',
      ],
    ],
  },
  {
    kind: 'note',
    tone: 'info',
    title: 'Odkazy u kroků vedou na obrazovky',
    text:
      'U většiny kroků je odkaz do české nápovědy Microsoftu, kde je snímek přesně té obrazovky. Schválně je sem nekopírujeme: jsou Microsoftu a jeho rozhraní se mění několikrát do roka, takže obrázek v lekci by za půl roku lhal — odkaz ukazuje pořád to, co uvidíš na svém počítači.',
  },
]

const LESSON_SHAREPOINT: Lesson = {
  slug: 'sdilena-slozka-sharepoint',
  module: 'napojeni',
  title: 'Sdílená složka ze SharePointu',
  summary:
    'Nasyncovat týmovou knihovnu do počítače a připojit ji Claudovi, aby si v ní mohl číst a psát. Pro Mac i Windows.',
  minutes: 12,
  kind: 'lekce',
  track: 'v sále',
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
        'Claude se do SharePointu sám nepřihlásí, ale umí pracovat se složkou nasyncovanou na tvůj počítač přes OneDrive. Potřebuješ k tomu OneDrive přihlášený firemním účtem, přístup do knihovny na SharePointu a Claude Code — nic dalšího se neinstaluje.',
    },
    { kind: 'h', text: 'Postup' },
    {
      kind: 'p',
      text: 'Kroky jsou stejné, cesty a názvy voleb ne — přepni si systém, na kterém sedíš.',
    },
    { kind: 'platform', mac: STEPS_MAC, win: STEPS_WIN },
    {
      kind: 'figure',
      name: 'sync-map',
      caption:
        'Knihovna se přes OneDrive stane běžnou složkou na disku. Cestu si Claude pamatuje sám, jakmile ji jednou vybereš.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Práva se dědí ze SharePointu',
      text:
        'Claude vidí přesně to, co vidíš ty. Co ale zapíše, se nasyncuje zpátky do knihovny a uvidí to celý tým — pracovní verze si proto zakládej do vlastní podsložky.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Claude musí být spuštěný',
      text:
        'K souborům se dostane jen dokud běží desktopová aplikace. Zavřeš ji nebo počítač usne — Claude hlásí, že složku nevidí. Nic se nerozbilo, jen se přerušilo spojení.',
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
        'Vezmi složku, ve které máš podklady ke kontrole faktur, nebo jakoukoli jinou sdílenou složku, se kterou pracuješ každý týden.',
      items: [
        'Připoj ji podle postupu výš.',
        'Nech Clauda vypsat, co v ní je, a rozdělit to podle typu souboru.',
        'Zeptej se na něco, co bys jinak hledala ručně — třeba ve kterém souboru se naposledy měnily počty na pobočky.',
        'Nech Clauda založit do podsložky krátké shrnutí toho, co našel.',
      ],
      hint:
        'Když je knihovna velká, připoj radši jednu konkrétní podsložku — menší rozsah znamená rychlejší a přesnější odpovědi.',
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
  minutes: 5,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'vysvětlit, kam až sahá přístup k připojené složce',
    'poznat, kdy je práce s daty bezpečná a kdy potřebuje povolení navíc',
    'napsat zadání tak, aby Claude nepřepsal originál',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Připojená složka není přístup do počítače — je to přesně vymezený kus disku, ten, který si vybereš. Vyplatí se vědět, kde vede hranice, protože podle toho se píše zadání.',
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
        'Mazání souborů bez dotazu. Na smazání se Claude Code zeptá a ty ho musíš odkliknout — pokud si to výslovně nepovolíš jinak.',
        'Práce se soubory, když je Claude Code zavřený — nic neběží na pozadí, dokud si to nenaplánuješ.',
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Pravidlo pro zadání',
      text:
        'Chceš vyčistit, převést nebo přeskládat data? Řekni „ulož to jako nový soubor vedle původního“. Do existujícího souboru sahej, jen když je to opravdu záměr — třeba oprava adresy v patičce.',
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

const LESSON_AUTOMATIZACE: Lesson = {
  slug: 'jak-se-nastavuje-automatizace',
  module: 'postav',
  title: 'Jak se v projektu nastaví automatizace',
  summary:
    'Pět stupňů od ručního zadání po běh bez tebe, včetně toho, co musí platit, než něco pustíš na plán. Na konci je odkaz na stažitelný cvičný projekt, kde je tenhle postup vidět celý na jednom hotovém případu.',
  minutes: 25,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'popsat pět stupňů, po kterých se z ruční práce stane automatizace',
    'napsat skill, který spustí celý postup jednou větou',
    'nastavit hook, který se spustí sám při konkrétní události',
    'ověřit na checklistu, že je automatizace připravená běžet bez dozoru, a napsat k ní runbook',
    'poznat, kdy je na další stupeň brzo — a co nikdy neautomatizovat',
    'projít si celou cestu na jednom hotovém příkladu a ověřit si, že nic nechybí',
    'vědět, co vyplnit do formuláře naplánované automatizace a které konektory připojit',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Automatizace nevzniká tím, že řekneš „automatizuj to“ — vzniká po schodech: ručně → pravidlo → skill → běh bez tebe, každý stupeň staví na tom předchozím. Schody se nedají přeskočit; kdo začne posledním, nastaví automat na postup, který si nikdy neověřil.',
    },
    {
      kind: 'figure',
      name: 'automation-ladder',
      caption:
        'Každý stupeň staví na tom předchozím. Na další jdeš, až když ten současný funguje bez oprav. Pod každým je soubor, který po tom stupni zůstane ve složce — a k nim ještě runbook.md, který není stupeň, ale stránka pro chvíli, kdy to spadne a ty jsi na dovolené.',
    },
    { kind: 'h', text: '1. Zadání — udělej to jednou ručně' },
    {
      kind: 'p',
      text:
        'Otevři Clauda ve složce projektu a popiš, co má vzniknout — ne jak na to. Všímej si, kolikrát mu musíš něco doříct: každé doříkání je informace, která v projektu zatím chybí.',
    },
    {
      kind: 'code',
      text: `Projdi faktury ve vstup/ a z každé vytáhni šest povinných údajů
do data/objednavky.xlsx, do sešitu pojmenovaného jménem dodavatele.
Co na faktuře není, nech prázdné a nic nedomýšlej.
Kde něco chybí, zapiš to do vystup/ podle pojmenování z CLAUDE.md.`,
      caption: 'Zadání, ze kterého se dá poznat, jestli výsledek sedí. To je celý rozdíl proti „zpracuj mi to“.',
    },
    {
      kind: 'soubor',
      nazev: 'zadani.md',
      popis: 'Kam až tenhle odstavec doroste, když se agenda dotáhne do konce. Přesně tenhle soubor je v cvičném projektu.',
      obsah: `# Zadání, ze kterého tenhle projekt vznikl

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
   v kopii vedouci-uctarny@dek.cz. Předmět: Doplnění faktury <číslo faktury>.
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
\`\`\`
Předmět: Doplnění faktury <číslo faktury>

Dobrý den, <dodavatel>,

děkujeme za zaslanou fakturu. Při kontrole naším účetním oddělením jsme
nenalezli <chybějící údaj/e>, které potřebujeme mít na faktuře. Prosíme
o doplnění a opětovné zaslání faktury zpět.

S pozdravem,
Účtárna DEK
\`\`\`
Jméno dodavatele v oslovení ber přesně tak, jak je na faktuře. Když chybí
dva údaje, vyjmenuj oba.

## Až to bude fungovat
Popiš postup a pravidla do CLAUDE.md, README.md, rutina.md a runbook.md,
ať se v tom vyzná i někdo, kdo u toho nebyl.`,
    },
    { kind: 'h', text: '2. Pravidlo — ať to nemusíš vysvětlovat podruhé' },
    {
      kind: 'p',
      text:
        'Musela jsi říct, že kódy položek se nesmí měnit na čísla, nebo že se bere nejnovější soubor podle data v názvu? To nejsou postupy, ale fakta o agendě — patří do CLAUDE.md a platí od té chvíle v každém sezení. Tenhle stupeň je nejlevnější: většina „Claude to udělal blbě“ je ve skutečnosti nenapsané pravidlo.',
    },
    {
      kind: 'soubor',
      nazev: 'CLAUDE.md',
      popis: 'Pravidla kontroly faktur, jak vypadají po pár týdnech provozu. Slovník, kde jsou data, a čeho se automatizace nesmí dotknout.',
      obsah: `# Kontrola faktur

Cvičný projekt z workshopu DEK Academy. Sleduje schránku fakturace@dek.cz.
Když přijde e-mail s fakturou v PDF, uloží ji, vytáhne z ní šest povinných
údajů a zapíše je do evidence podle dodavatele. Když některý údaj chybí, sám
pošle dodavateli e-mail s žádostí o doplnění.

**Posílá poštu bez potvrzení — ale jenom žádost o doplnění chybějícího údaje,
nikdy nic k platbě.** Neschvaluje faktury, nezadává je k platbě a nepíše nic
do účetního systému. To zůstává na člověku.

## Slovník
- faktura = PDF příloha e-mailu, který přijde do schránky fakturace@dek.cz
- šest povinných údajů = číslo faktury, dodavatel, IČO dodavatele, číslo
  objednávky, základ daně (částka bez DPH), splatnost
- IČO = vždycky IČO dodavatele. IČO odběratele (DEK a.s.) je na faktuře taky
  a nepočítá se — když je u dodavatele jen jméno a adresa, údaj chybí.
- kompletní faktura = má všech šest údajů čitelných
- evidence = data/objednavky.xlsx, jeden sešit pro každého dodavatele

## Kde jsou data
- vstup/ — uložené PDF faktur. Sem se jen čte, nikdy nepřepisuje. Přibýt smí
  jen nově stažená faktura, nic jiného (hlídá to hook chran-vstup.sh).
- data/objednavky.xlsx — evidence přijatých faktur, sešit pro každého
  dodavatele. Sloupce: Soubor / Datum přijetí / Číslo faktury / IČO / Číslo
  objednávky / Základ daně / Splatnost / Kompletní / Žádost odeslána.
  Nekontroluje se proti schváleným objednávkám, jen se eviduje, co přišlo,
  jestli je to kompletní a jestli se u toho dodavatele o doplnění požádalo.
- vystup/kontrola-<RRRR-MM-DD>.xlsx — jen faktury, kterým ten den něco
  chybělo: sešit „Přehled" se stavem všech faktur toho dne a pak sešit
  pro každého dodavatele s navrženým textem a časem odeslání.
- vystup/protokol-<RRRR-MM-DD>.md — krátký zápis běhu: co se ten den
  zkontrolovalo, co chybělo, komu se psalo a co zůstalo k ruční kontrole.

## Pravidla
- Do vstup/ nikdy nezapisuj nic jiného než nově staženou fakturu. Nic v ní
  nepřejmenovávej ani nemaž — originály jsou důkaz.
- Když údaj ve faktuře není nebo se nedá přečíst, nech pole v evidenci
  prázdné. Nic nedomýšlej a nic nedopočítávej.
- Jméno dodavatele do e-mailu i do názvu sešitu ber přesně tak, jak je
  napsané na faktuře.
- E-mail s žádostí o doplnění posílej jen na adresu, ze které faktura
  přišla, a vždy v kopii vedouci-uctarny@dek.cz.
- Text, který odejde dodavateli, musí být přesně ten, co je zapsaný jako
  navržená odpověď v kontrola-<RRRR-MM-DD>.xlsx.
- Čas odeslání zapiš do kontrola-<RRRR-MM-DD>.xlsx (do sešitu dodavatele i
  do „Přehledu") a do sloupce „Žádost odeslána" v data/objednavky.xlsx. Bez
  připojeného konektoru napiš na všechna tři místa „připraveno, čeká na
  konektor".
- E-mail posílej jen tehdy, když chybí jeden nebo dva ze šesti údajů. Když
  jich chybí tři a víc, nebo se z PDF nedá přečíst text vůbec, nic
  neposílej — napiš to do protokolu a řekni mi to. Tolik chybějících údajů
  většinou neznamená špatnou fakturu, ale že se nepodařilo PDF správně
  přečíst, a to se nemá posílat dodavateli jako naše chyba.
- Nikdy neposílej e-mail, který se týká platby, schválení nebo účetnictví.
  Jediný důvod k automatickému e-mailu je žádost o doplnění chybějícího
  údaje na faktuře samotné.
- Nikdy neschvaluj fakturu, nezadávej ji k platbě a nezapisuj nic do
  účetního systému.

## Když projekt běží bez připojené schránky
V cvičné podobě (žádný konektor na Microsoft 365) skill zpracuje, co už
leží ve vstup/, a e-mail jen navrhne — nemá odkud ho fyzicky odeslat. Jakmile
je M365 konektor připojený a má write tools, běží to nad živou schránkou a
navržený text se doopravdy odešle. Postup je v obou případech stejný, mění
se jen to, odkud faktura přišla a jestli má skill k dispozici odeslání.`,
    },
    { kind: 'h', text: '3. Skill — zabal celý postup' },
    {
      kind: 'p',
      text:
        'Když stejný postup projde třikrát bez oprav, zapiš ho. Skill je složka se souborem SKILL.md: v hlavičce jméno a popis, kdy se má použít, pod tím kroky. Od té chvíle stačí jedna věta — nebo lomítko a jméno skillu.',
    },
    {
      kind: 'code',
      text: `.claude/skills/kontrola-faktur/SKILL.md

---
name: kontrola-faktur
description: Ukládá příchozí faktury v PDF, vytáhne z nich šest povinných
  údajů a zapíše je do evidence podle dodavatele. Použij, když se má
  zkontrolovat schránka na nové faktury.
---

1. Najdi faktury, které ještě nejsou uložené ve vstup/, a ulož je tam.
2. Z každé vytáhni šest údajů: číslo faktury, dodavatele, IČO dodavatele,
   číslo objednávky, základ daně a splatnost. Co na faktuře není, nech prázdné.
3. Zapiš je do data/objednavky.xlsx do sešitu pojmenovaného jménem dodavatele.
4. Když je vyplněných všech šest, skonči. Nic se neposílá.
5. Když chybí jeden nebo dva údaje, zapiš to do
   vystup/kontrola-<RRRR-MM-DD>.xlsx i s návrhem odpovědi dodavateli.
6. Když chybí tři a víc, neposílej nic — jde to k ruční kontrole.`,
      caption: 'Řádek description rozhoduje o tom, kdy si skill Claude vybere sám. Piš do něj i slova, která do zadání píšeš ty.',
    },
    {
      kind: 'soubor',
      nazev: 'SKILL.md',
      popis: 'Ta zkrácená ukázka nahoře v úplné podobě: rozcestí podle počtu chybějících údajů, šablona e-mailu a seznam situací, kdy se nemá poslat nic.',
      obsah: `---
name: kontrola-faktur
description: Sleduje schránku fakturace@dek.cz (přes M365) nebo zpracuje, co
  leží ve vstup/, ukládá příchozí faktury v PDF, vytáhne z nich šest povinných
  údajů a zapíše je do evidence podle dodavatele. Když něco chybí, sám pošle
  dodavateli e-mail s žádostí o doplnění. Použij, když se má zkontrolovat
  schránka na nové faktury, nebo když se ptám, co je s fakturami k vyřízení.
---

# Kontrola faktur

## Kdy to spustit
Při každém běhu naplánované automatizace, nebo kdykoli se řekne „zkontroluj
nové faktury". Je-li připojený konektor na Microsoft 365, podívej se do schránky
fakturace@dek.cz na e-maily s PDF přílohou, které ještě nejsou uložené ve
vstup/. Bez konektoru (třeba při prvním spuštění cvičného projektu) zpracuj
místo toho PDF, která už ve vstup/ leží a která ještě nemají řádek v evidenci
— postup je od kroku 2 dál stejný, jen se u odeslání e-mailu jen navrhne text
(viz krok 6c). Když nic nového nepřišlo, nic nedělej a napiš to.

## Postup pro každou novou fakturu

1. Je-li faktura z e-mailu, ulož PDF přílohu do vstup/ jako
   \`<RRRR-MM-DD>_<dodavatel>.pdf\` (datum přijetí e-mailu, dodavatele zkrať
   na jedno slovo bez diakritiky; při shodě přidej \`-2\`, \`-3\`). Faktury, které
   už ve vstup/ jsou, znovu neukládej.
2. Z PDF vytáhni šest údajů: číslo faktury, dodavatele (přesně podle
   faktury), IČO dodavatele, číslo objednávky, základ daně (částku bez DPH —
   ne částku s DPH) a datum splatnosti. Na faktuře bývají IČO dvě: dodavatele
   a odběratele (DEK a.s., 27636801). Ber jen to dodavatelovo — když je
   u dodavatele uvedené jen jméno a adresa, IČO chybí, i kdyby na faktuře
   jinde nějaké bylo.
3. Co se nepodaří přečíst, nech prázdné. Nic nedomýšlej.
4. Najdi v data/objednavky.xlsx sešit se jménem dodavatele; když neexistuje,
   založ ho s hlavičkou Soubor / Datum přijetí / Číslo faktury / IČO / Číslo
   objednávky / Základ daně / Splatnost / Kompletní / Žádost odeslána. Přidej
   řádek s dnešní fakturou. Kompletní = ano, když je vyplněných všech šest
   údajů, jinak ne. Sloupec „Žádost odeslána" zatím nech prázdný — vyplní se
   až v kroku 6.
5. Když je faktura kompletní, tady skončit — nic se neposílá.
6. Když něco chybí a chybí jen jeden nebo dva údaje:
   a. Otevři (nebo založ) vystup/kontrola-<RRRR-MM-DD>.xlsx s prvním sešitem
      „Přehled" (Soubor / Dodavatel / Kompletní / Chybí / E-mail odeslán) a
      dál sešitem pro každého dodavatele, kterému toho dne něco chybělo
      (Soubor / Číslo faktury / Chybí / Navržená odpověď / E-mail odeslán).
      Sešit pojmenuj jménem dodavatele přesně tak, jak je na faktuře.
   b. Do sešitu dodavatele napiš, který údaj chybí, a navrhni text podle
      šablony níž.
   c. Je-li konektor na M365 se zapnutými write tools připojený, pošli ten
      text z kontrola-<RRRR-MM-DD>.xlsx jako nový e-mail na adresu, ze které
      faktura přišla, v kopii vedouci-uctarny@dek.cz. Text neměň mezi tím, co
      je v sešitu, a tím, co odejde — v sešitu musí být přesně to, co
      dodavatel dostal. Bez připojeného konektoru e-mail neodesílej a nech
      text tak, jak je navržený; nehledej jinou cestu, jak poštu odeslat.
      Předmět v obou případech: „Doplnění faktury <číslo faktury>".
   d. Datum a čas odeslání zapiš na tři místa: do řádku v sešitu dodavatele,
      do sešitu „Přehled" (obojí v kontrola-<RRRR-MM-DD>.xlsx) a do sloupce
      „Žádost odeslána" v data/objednavky.xlsx, aby bylo i v evidenci vidět,
      že se o doplnění už požádalo. Bez konektoru napiš na všechna tři místa
      „připraveno, čeká na konektor".
7. Když chybí tři a víc údajů, nebo se z PDF nedal přečíst text vůbec:
   nic neposílej. Zapiš to do protokolu jako „k ruční kontrole" a řekni mi
   to — je pravděpodobnější, že se PDF nepodařilo přečíst, než že je špatná
   faktura, a to není důvod psát dodavateli.
8. Na konec dne (nebo po každé faktuře) připiš řádek do
   vystup/protokol-<RRRR-MM-DD>.md: soubor, dodavatel, kompletní ano/ne,
   co chybělo, jestli se poslal e-mail (nebo jen navrhl) a kdy.

## Šablona e-mailu při chybějícím údaji

\`\`\`
Předmět: Doplnění faktury <číslo faktury>

Dobrý den, <dodavatel>,

děkujeme za zaslanou fakturu. Při kontrole naším účetním oddělením jsme
nenalezli <chybějící údaj/e>, které potřebujeme mít na faktuře. Prosíme
o doplnění a opětovné zaslání faktury zpět.

S pozdravem,
Účtárna DEK
\`\`\`

Jméno dodavatele v oslovení ber přesně tak, jak je napsané na faktuře.
Když chybí víc než jeden údaj, vyjmenuj je („IČO a číslo objednávky").

## Kdy se zastavit a nic neposílat
- z PDF se nedá přečíst text (sken bez OCR) — zapiš k ruční kontrole, e-mail neposílej
- chybí tři a víc ze šesti údajů — stejně, jde spíš o špatně přečtené PDF
- e-mail nemá jasně čitelnou adresu odesílatele, na kterou by šlo odpovědět
- data/objednavky.xlsx nejde otevřít nebo má jinou strukturu, než čekáš

## Co do skillu nepatří
Rozhodnutí, jestli fakturu zaplatit, cokoli k jejímu schválení nebo zápis do
účetního systému. Jediná automatická zpráva, kterou tenhle skill smí poslat,
je žádost dodavateli o doplnění chybějícího údaje na faktuře samotné.`,
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
        'Skill je postup, který někdo musí vyvolat. Hook je zábrana, která se spustí sama — pokaždé, když nastane určitá situace, ať si o ní kdo chce myslí co chce. Nejblíž tomu je turniket: nepřemýšlí, jestli máš dobrý důvod, prostě tě bez lístku nepustí. Proto se hodí na jednoduché „tohle se nesmí“ a na věci, na které se zapomíná — zálohuj před přepsáním, do téhle složky nesahej, dej vědět, že je hotovo. Ne na nic, co se musí posoudit.',
    },
    {
      kind: 'code',
      text: `.claude/settings.json

{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/chran-vstup.sh"
          }
        ]
      }
    ]
  }
}`,
      caption:
        'Zábrana z cvičného projektu. Čtou se z toho dvě věci: kdy se má spustit — PreToolUse znamená před každým zápisem souboru — a co se spustí, tedy skript ve složce projektu. Víc v tom nastavení není.',
    },
    {
      kind: 'soubor',
      nazev: 'chran-vstup.sh',
      popis: 'Ten skript. Třicet řádků, které hlídají, aby do složky s originály faktur směla jen přibýt nová faktura — nic se nepřepsalo ani nesmazalo.',
      obsah: `#!/bin/bash
# Zábrana nad složkou vstup/: smí do ní přibýt nová PDF faktura, ale nic
# existujícího se nesmí přepsat, přejmenovat ani smazat. Originály jsou důkaz.
#
# Claude Code pošle hooku na vstup JSON s popisem toho, co se chystá udělat.
# Vytáhneme z něj jméno nástroje a cestu k souboru. Schválně bez nástroje jq
# — ten na Macu ani na Windows standardně není a hook, který se nespustí,
# nic nechrání.
VSTUP_JSON=$(cat)
NASTROJ=$(printf '%s' "$VSTUP_JSON" | sed -n 's/.*"tool_name"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p')
CESTA=$(printf '%s' "$VSTUP_JSON" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p')

case "$CESTA" in
  */vstup/*)
    if [ "$NASTROJ" = "Edit" ]; then
      echo "Úprava souboru ve vstup/ je zakázaná — leží tam originály faktur, nic se v nich nesmí měnit." >&2
      exit 2
    fi
    if [ -e "$CESTA" ]; then
      echo "Přepsání souboru ve vstup/ je zakázané — tam smí jen přibýt nová faktura, ne se přepsat stará." >&2
      exit 2
    fi
    case "$CESTA" in
      *.pdf) exit 0 ;;
      *)
        echo "Do vstup/ smí přibýt jen nová PDF faktura." >&2
        exit 2
        ;;
    esac
    ;;
esac
exit 0`,
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nemusíš umět shell',
      text:
        'Ten skript vypadá odborně, ale ručně ho nikdo neťukal. Vznikl z jedné věty: „Nechci, aby se cokoli ve složce vstup/ přepsalo nebo smazalo — smí tam jen přibýt nová faktura v PDF." Zábranu popisuješ slovy, ne kódem. Co si ale přečti a zkontroluj, co ti vzniklo — spouští se to pak samo při každém zápisu.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Nemusíš to psát ručně',
      text:
        'V Claude Code napiš `/hooks` — otevře se prohlížeč hooků: vidíš všechny události a co přesně který spouští, a nejrychleji tak zjistíš, jestli se hook zaregistroval. Samotný settings.json ti klidně napíše Claude, řekni mu jen, co se má stát a při jaké události.',
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
      kind: 'table',
      head: ['Co chceš', 'Hook, nebo pravidlo?'],
      rows: [
        ['Do data/ se nikdy nezapisuje', 'hook — je to zábrana, ne doporučení'],
        ['Výstupy se jmenují podle vzoru', 'pravidlo — je to konvence, ne bezpečnost'],
        ['Před přepsáním vznikne záloha', 'hook — má platit i tehdy, když na to nikdo nemyslí'],
        ['Když chybí sloupec, zastav se', 'pravidlo — vyžaduje to posouzení'],
        ['Dej vědět, až je hotovo', 'hook — nemá to co dělat s obsahem práce'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Hook není místo na rozhodování',
      text:
        'Spustí se vždycky a nemá úsudek. To je jeho síla u zábran („do data/ se nezapisuje“) a jeho slabina všude jinde. Když má něco záviset na posouzení, patří to do skillu, ne do hooku.',
    },
    { kind: 'h', text: 'Dva hooky, které stojí za to mít hned' },
    {
      kind: 'p',
      text:
        'Zbytek si nastavíš, až na něj narazíš. Tyhle dva se ale vyplatí mít od začátku — notifikace, že je hotovo, a zábrana proti zápisu do dat. Bez nich se nedá pustit naplánovaný běh.',
    },
    {
      kind: 'platform',
      mac: [
        {
          kind: 'code',
          text: `~/.claude/settings.json

{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \\"Doběhlo to\\" with title \\"Claude Code\\"'"
          }
        ]
      }
    ]
  }
}`,
          caption: 'Notifikace na plochu, jakmile Claude práci dokončí.',
        },
        {
          kind: 'note',
          tone: 'warn',
          title: 'Když se nic neukáže',
          text:
            'osascript posílá notifikace přes aplikaci Script Editor. Spusť si v Terminálu `osascript -e \'display notification "test"\'` — nic se neobjeví, ale Script Editor se tím zapíše do Nastavení systému → Oznámení, kde mu povolíš oznámení. Pak to funguje.',
        },
      ],
      win: [
        {
          kind: 'code',
          text: `%UserProfile%\\.claude\\settings.json

{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -Command \\"[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Doběhlo to', 'Claude Code')\\""
          }
        ]
      }
    ]
  }
}`,
          caption: 'Na Windows to není notifikace v rohu, ale dialogové okno — a může se otevřít za terminálem.',
        },
      ],
    },
    {
      kind: 'p',
      text:
        'Druhý hook je zábrana. Zapisuje se do `vystup/`, do složky s originály nikdy — jenže „nikdy" napsané v CLAUDE.md je doporučení, ne zámek. Tohle je zámek: skript, který se spustí před každým zápisem a nepovolený zápis rovnou odmítne.',
    },
    {
      kind: 'code',
      text: `.claude/hooks/chran-vstup.sh

#!/bin/bash
VSTUP=$(cat)
CESTA=$(printf '%s' "$VSTUP" | sed -n 's/.*"file_path"[^"]*"\\([^"]*\\)".*/\\1/p')

case "$CESTA" in
  */vstup/*)
    echo "Do vstup/ smí jen přibýt nová faktura — přepsat ani smazat nic nejde." >&2
    exit 2
    ;;
esac
exit 0`,
      caption:
        'Celá zábrana. Claude hooku pošle popis toho, co se chystá udělat; skript z něj vytáhne cestu k souboru a když v ní je data/, skončí kódem 2 — to zápis zastaví a text z chybové hlášky se Claudovi vrátí jako vysvětlení. Schválně bez nástroje jq: ten na Macu ani na Windows standardně není a zábrana, která se nespustí, nic nechrání.',
    },
    {
      kind: 'code',
      text: `chmod +x .claude/hooks/chran-vstup.sh

.claude/settings.json

{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/chran-vstup.sh"
          }
        ]
      }
    ]
  }
}`,
      caption: 'Na Macu skript nejdřív zpřístupni přes chmod, jinak se nespustí. Pak ho zaregistruj na událost PreToolUse.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Tohle je ta dvojice, o kterou jde',
      text:
        'Zábrana plus notifikace: zábrana je důvod, proč se dá běh pustit bez dozoru — nemůže se stát to nejhorší; notifikace je důvod, proč se pozná, že doběhl. Bez nich je naplánovaná automatizace jen rychlejší způsob, jak si nadělat škodu.',
    },
    {
      kind: 'links',
      title: 'Když budeš chtít víc',
      items: [
        {
          label: 'Automate actions with hooks — dokumentace',
          href: 'https://code.claude.com/docs/en/hooks-guide',
          note: 'Všechny události, příklady pro Mac, Windows i Linux, ladění.',
        },
      ],
    },
    { kind: 'h', text: '5. Běh bez tebe' },
    {
      kind: 'p',
      text:
        'Poslední stupeň dává smysl, až když všechno předchozí běželo opakovaně správně a víš, jak poznáš špatný výsledek — jinak to nepouštěj. Claude Code pak umí dostat zadání, odpracovat ho a skončit bez rozhovoru, a takový běh se dá naplánovat na čas.',
    },
    {
      kind: 'code',
      text: `cd <složka projektu — ta nasyncovaná z lekce Sdílená složka>
claude -p "Postupuj podle skillu kontrola-faktur a výsledek ulož do vystup/."`,
      caption: 'Spusť si to nejdřív ručně přesně takhle. Tahle věta pak jde do naplánované automatizace — v Claude Code záložka Code → Routines → New routine → Local. Když to takhle nedoběhne, na plánu to nedoběhne taky.',
    },
    {
      kind: 'image',
      src: 'routines-seznam.webp',
      alt: 'Seznam rutin v Claude Code. Nahoře pole „What do you want automated" s příklady automatizací a tlačítkem Draft routine. Pod ním upozornění, že lokální rutiny běží, jen když je počítač vzhůru a online. Dole jediný záznam: kontrola-faktur, přibližně každých 15 minut mezi 7:00 a 17:59 od pondělí do pátku, další běh dnes v 16:09.',
      caption:
        'Takhle ta věta vypadá, když se z ní stane automatizace. Rozvrh i čas dalšího běhu jsou vidět na jednom řádku — a hlášku nahoře si přečti: lokální rutina běží, jen když je počítač vzhůru a aplikace puštěná.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Vždycky nech po sobě stopu',
      text:
        'Naplánovaný běh nikdo nesleduje. Ať proto vždycky vzniká krátký zápis toho, co se udělalo a co nesedělo — u kontroly faktur je to protokol ve vystup/. Automat, po kterém nezůstane nic, se pozná až ve chvíli, kdy měsíc mlčky nedělá nic.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Jak se automatizace zakládá, je v samostatné lekci',
      text:
        'Klikání ve formuláři, rozdíl mezi Local a Cloud a to, co se stane, když počítač spal, je v lekci Automatizace v Claude Code pomocí routine. Tady zůstává jen to, co platí bez ohledu na formulář: kdy to pustit, co po sobě má běh nechat — a že rozvrh nemá bydlet jen v aplikaci. Automatizace založená klikáním je záznam, který kolega nevidí a který zmizí s přeinstalovaným počítačem. Zapiš ji proto do složky jako rutina.md, ať se dá znovu založit podle popisu.',
    },
    {
      kind: 'soubor',
      nazev: 'rutina.md',
      popis: 'Rozvrh napsaný ve složce: co vyplnit ve formuláři, co zařídit u správce a co zkontrolovat, než to poběží samo. Založení se tím smrskne na větu „Založ automatizaci podle rutina.md".',
      obsah: `# Naplánovaná automatizace: kontrola nových faktur v Outlooku

Co vyplnit v aplikaci Claude → záložka **Code** → **Routines** → **New routine**.

## Než založíš automatizaci: konektor na Microsoft 365

Tahle automatizace potřebuje konektor Claude na Microsoft 365 se zapnutými
**write tools** (posílání pošty) — bez nich přečte schránku, ale e-mail
neodešle,
jenom ho navrhne (viz \`CLAUDE.md\`, „Když projekt běží bez připojené
schránky"). Write tools zapíná zvlášť správce Microsoft 365, přihlášený
pracovním účtem; osobní outlook.com nebo hotmail.com nefunguje. Text, který
mu poslat, je níž v „Co napsat správci".

## Formulář

| Pole | Co vyplnit |
| --- | --- |
| **Name** | \`kontrola-faktur\` |
| **Description** | Sleduje schránku a doplňuje chybějící údaje na fakturách |
| **Model** | Sonnet — na tuhle práci stačí a je nejúspornější |
| **Permission mode** | Accept edits — jinak se běh zastaví na dotazu, na který nikdo neodpoví |
| **Folder** | složka tohoto projektu (\`faktury-kontrola\`) |
| **Schedule** | Every 15 minutes, v pracovní dny 7:00–18:00 |

Proč každých 15 minut, ne jednou denně: tahle automatizace nahrazuje ruční
sledování schránky, takže žádost o doplnění má dodavateli přijít brzy po
faktuře, ne až druhý den. Claude Code nemá skutečné „hned jak přijde
e-mail" spouštění — nejblíž tomu je časté opakování. Když ti 15 minut
připadá zbytečně husté, dej to na 30 nebo na hodinu; nic se tím nerozbije,
jen se prodlouží čas do odpovědi dodavateli.

## Instructions

\`\`\`
Postupuj podle skillu kontrola-faktur.

Zkontroluj schránku fakturace@dek.cz na nové e-maily s PDF přílohou, které
ještě nejsou uložené ve vstup/. Když nic nového nepřišlo, nic nedělej a
nic neposílej.

Ke každé nové faktuře udělej celý postup ze skillu — uložení do vstup/,
vytažení šesti údajů, zápis do data/objednavky.xlsx do sešitu podle
dodavatele, a když něco chybí a je toho jeden nebo dva údaje, zapiš to do
vystup/kontrola-<dnešní datum>.xlsx i s navrženým textem a ten text pošli
dodavateli na adresu, ze které faktura přišla, v kopii
vedouci-uctarny@dek.cz. Čas odeslání zapiš do kontrola-<dnešní datum>.xlsx
i do sloupce „Žádost odeslána" v data/objednavky.xlsx.

Když u některé faktury chybí tři a víc údajů, nebo se PDF nedá přečíst,
nic neposílej — zapiš to do protokolu k ruční kontrole.

Nikdy neposílej nic, co se týká platby, schválení nebo účetnictví.
\`\`\`

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

- Místní automatizace běží, jen když je aplikace Claude spuštěná a počítač
  vzhůru. Když počítač spí, běh se přeskočí a doženou se jen ty, co chyběly
  bezprostředně předtím — ne všechny za celou dobu.
- Kdyby konektor na M365 spadl nebo přišel o přístup, automatizace se
  zastaví na dotazu, ne že by tiše nic nedělala — sleduj to hlavně první týden.
- Když chceš, aby tohle běželo i s vypnutým počítačem, není to tenhle typ
  automatizace. To už musí běžet někde jinde než na tvém stole.

## Co napsat správci

\`\`\`
Ahoj, potřeboval bych u konektoru Microsoft 365 pro Claude povolit
write tools (odesílání pošty) pro schránku fakturace@dek.cz.

K čemu to bude: automatická kontrola došlých faktur. Automatizace zkontroluje
šest povinných údajů a dodavateli automaticky pošle žádost o doplnění,
když jeden nebo dva chybí. Nic k platbě, schválení ani do účetnictví
se automaticky neposílá — to zůstává na nás.

Čtecí přístup už mám a funguje. Práva se dědí z účtu, takže Claude uvidí
přesně to, co já, nic navíc.
\`\`\`

## Kam sáhnout, když se něco pokazí

Runbook je v \`runbook.md\` vedle tohoto souboru.`,
    },
    {
      kind: 'checklist',
      title: 'Než to pustíš na plán',
      items: [
        'Skill proběhl třikrát po sobě na různých datech bez opravy',
        'Poslední krok skillu vyrábí kontrolní protokol',
        'Ve skillu jsou zastavovací pravidla — ví, kdy se má zastavit místo hádání',
        'Výstupy jdou do vystup/, do vstupních dat se nezapisuje (a hlídá to hook)',
        'Umíš jednou větou popsat, jak poznáš, že výsledek je špatně',
        'Víš, co se stane, když vstupní data ten den nepřijdou',
      ],
    },
    { kind: 'h', text: 'Co ještě může na konci udělat' },
    {
      kind: 'table',
      head: ['Na konci běhu', 'K čemu to je', 'Jak'],
      rows: [
        [
          'Notifikace na plochu',
          'víš, že doběhlo, i když jsi u něčeho jiného',
          'hook na události Stop',
        ],
        [
          'Soubor do sdílené složky',
          'výstup uvidí celý tým, aniž bys ho posílala',
          'projekt leží v nasyncované knihovně, výstup se nasyncuje sám',
        ],
        [
          'Krátká zpráva o tom, co se stalo',
          'zůstane stopa i za dny, kdy se nic nezměnilo',
          'poslední krok skillu zapíše shrnutí do vystup/',
        ],
        [
          'E-mail příjemcům',
          'podklad dorazí bez tvého zásahu',
          'konektor Microsoft 365 se zapnutými write tools',
        ],
      ],
    },
    { kind: 'h', text: 'Runbook' },
    {
      kind: 'p',
      text:
        'Naplánovaný běh nikdo nesleduje — dokud se něco nepokazí, a to bývá ve chvíli, kdy jsi na dovolené. Runbook je jedna stránka v projektu, která odpoví na to, na co se v tu chvíli někdo bude ptát.',
    },
    {
      kind: 'code',
      text: `# Runbook: kontrola faktur

## Co to dělá
Uloží nové faktury do vstup/, vytáhne z nich šest údajů do evidence
a u neúplných pošle dodavateli žádost o doplnění.

## Kdy to běží
Každých 15 minut v pracovní dny 7:00–18:00. Jeden běh trvá pár minut.

## Kde je výsledek
vystup/kontrola-<datum>.xlsx
a vedle toho protokol-<datum>.md

## Jak poznám, že je něco špatně
- protokol hlásí víc faktur k ruční kontrole než obvykle
- chybí protokol za dnešek, i když ve vstup/ faktury jsou
- ve vstup/ je faktura, kterou skill přeskočil

## Co dělat, když to spadne
1. Podívej se, jestli jsou ve vstup/ soubory z posledních dnů.
2. Pusť to ručně: v terminálu ve složce projektu claude -p "..."
3. Když to spadne i ručně, běh vypni a napiš tomu, kdo automatizaci nastavil.

## Jak to vypnout
Claude Code → Code → Routines → u automatizace přepnout Status na Paused.`,
      caption: 'Šest nadpisů. Kratší runbook nikdo nenapíše, delší nikdo nepřečte.',
    },
    {
      kind: 'soubor',
      nazev: 'runbook.md',
      popis: 'Tentýž runbook, jak vyrostl provozem: tabulka nejčastějších poruch s tím, čím to bývá a co s tím, a komu psát, když jde o obsah faktur a komu, když o konektor.',
      obsah: `# Runbook — kontrola faktur

Jedna stránka pro chvíli, kdy něco spadne a ty jsi na dovolené.

## Co to dělá

Každých 15 minut v pracovní dny 7:00–18:00 zkontroluje schránku
fakturace@dek.cz. Když najde e-mail s novou fakturou v PDF, uloží ji do
\`vstup/\`, vytáhne z ní šest povinných údajů (číslo faktury, dodavatel, IČO,
číslo objednávky, základ daně, splatnost) a zapíše je do
\`data/objednavky.xlsx\`, do sešitu podle dodavatele. Když chybí jeden nebo
dva údaje, sama pošle dodavateli e-mail s žádostí o doplnění (v kopii
vedouci-uctarny@dek.cz), zapíše to do \`vystup/kontrola-<datum>.xlsx\` a čas
odeslání doplní i do evidence, do sloupce „Žádost odeslána“.

**Posílá jen žádost o doplnění chybějícího údaje na faktuře samotné.**
Neschvaluje faktury, nic neplatí a nezapisuje nic do účetního systému.

## Kde to běží

Naplánovaná automatizace \`kontrola-faktur\` v aplikaci Claude, záložka Code →
Routines, typ Local. Běží na počítači, na kterém je nastavená — ne v cloudu.
Potřebuje konektor na Microsoft 365 se zapnutými write tools (posílání
pošty); bez nich přečte schránku, ale e-mail jen navrhne, neodešle.

## Jak poznám, že to dopadlo

Otevři poslední \`vystup/protokol-*.md\` nebo sešit „Přehled" v posledním
\`vystup/kontrola-*.xlsx\`:

- **Kompletní = ano** — faktura má všech šest údajů, nic se neposílalo.
- **Kompletní = ne, e-mail odeslán má čas** — chybělo jedno nebo dvě pole,
  žádost o doplnění odešla. Zkontroluj v Odeslané poště, že to sedí.
- **„připraveno, čeká na konektor"** — text je navržený, ale konektor
  nebyl připojený (nebo neměl write tools), takže se fyzicky neodeslal.
- **„k ruční kontrole" v protokolu** — chybělo moc údajů najednou nebo se
  PDF nedalo přečíst. Tohle automatizace záměrně nechává na člověku.

Když chceš vidět jen to, jestli se u konkrétního dodavatele o doplnění už
psalo, nemusíš hledat den, kdy se to stalo: stačí sloupec „Žádost odeslána"
v jeho sešitu v \`data/objednavky.xlsx\`.

## Když to spadne

| Co se stalo | Čím to bývá | Co s tím |
| --- | --- | --- |
| Automatizace se nespustila | počítač spal nebo byla zavřená aplikace | doženou se jen běhy bezprostředně předtím, ne celá historie |
| Běh se zastavil na dotazu | konektor ztratil přístup, nebo se ptá poprvé | otevři to sezení v postranním panelu, odpověz a dej „always allow" |
| E-mail se neodeslal, i když chybělo jen jedno pole | write tools na konektoru M365 nejsou zapnuté | napiš správci, ať je zapne (viz \`rutina.md\`) |
| Odešel e-mail se špatným textem nebo špatnému dodavateli | PDF se přečetlo špatně (adresa, jméno) | zkontroluj konkrétní fakturu ručně, oprav v \`data/objednavky.xlsx\`, případně napiš dodavateli omluvu sama |
| Protokol hlásí spoustu faktur „k ruční kontrole" | většinou se změnil formát PDF, ne že by bylo najednou hodně špatných faktur | projdi dvě tři faktury ručně, než necháš automatizaci pokračovat |
| Ve \`vstup/\` zmizel soubor | někdo tam uklidil | soubory ve \`vstup/\` maže jen člověk; automatizace do té složky zapisuje jen nové PDF (hlídá to hook). V evidenci řádek zůstává — je to záznam běhu, který se stal. |
| Jedna faktura je v evidenci dvakrát | přišla do schránky podruhé a její PDF mezitím ze \`vstup/\` zmizelo | nechej nový řádek být a starý si označ; automatizace pozná už zpracovanou fakturu podle toho, co leží ve \`vstup/\` |

## Komu napsat

Nejdřív tomu, kdo tuhle automatizaci nastavil. Když jde o obsah faktur nebo
o to,
co se poslalo dodavateli, účetní. Když jde o přístup ke schránce nebo
konektor, správce Microsoft 365.

## Co dělat, až tomu přeroste hlava

Pokud faktur bude denně desítky, přestane se vyplácet nechávat každý běh
kontrolovat celou schránku znovu. V tu chvíli má smysl nechat si napsat
malý skript, který hlídá jen nové zprávy, a Claudovi nechat posouzení a
sepsání odpovědi. Do té doby to nech, jak to je — je to čitelnější a snáz
se to kontroluje.`,
    },
    { kind: 'h', text: 'Co se stane, když' },
    {
      kind: 'table',
      head: ['Situace', 'Co se má stát', 'Jak to zařídit'],
      rows: [
        [
          'Data ten den nepřijdou',
          'běh se zastaví a napíše to, nic nevyrobí',
          'zastavovací pravidlo ve skillu: „když v data/ není soubor z tohohle týdne, zastav se“',
        ],
        [
          'Změní se formát vstupu',
          'běh se zastaví u kontroly sloupců',
          'krok „ověř sloupce“ hned na začátku skillu',
        ],
        [
          'Běh spadne uprostřed',
          'nezůstane po něm polovičatý soubor',
          'skill zapisuje až na konci, ne průběžně',
        ],
        [
          'Nikdo si týden nevšimne, že to neběželo',
          'to je ten skutečný problém',
          'notifikace na Stop hooku, nebo se prostě podívej do vystup/ na datum',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Automat, po kterém nezůstane stopa, se pozná pozdě',
      text:
        'Nejhorší varianta není běh, který spadne, ale ten, co měsíc tiše nedělá nic a nikdo to nečeká. Proto ať po každém běhu zůstane soubor s datem — i když se nic nezměnilo.',
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
        'Kroky, kde se rozhoduje podle věcí, které nejsou v datech. Schválení faktury k platbě je učebnicový příklad: i když všechna čísla sedí, může se čekat na dodací list nebo na telefonicky dohodnutou výjimku — to žádná kontrola v datech neuvidí. Automatizace takovým krokům připraví podklad, nenahradí je.',
    },
    { kind: 'h', text: 'Celý příklad: kde ho najdeš hotový' },
    {
      kind: 'note',
      tone: 'info',
      title: 'Tohle už jsi viděl v akademii',
      text:
        'Celá cesta od prázdné složky po naplánovaný běh je vidět krok po kroku v Cvičném projektu: kontrola faktur — je to ten samý postup, jen na hotovém, stažitelném příkladu, který si můžeš pustit a porovnat s referenčním výstupem. Nestav to tady znovu, jdi rovnou tam.',
    },
    {
      kind: 'links',
      title: 'Cvičný projekt',
      items: [
        {
          label: 'Cvičný projekt: kontrola faktur ke stažení',
          href: '#academy/od-mapy-k-automatu/cvicny-projekt-faktury',
          note: 'Folder, CLAUDE.md, skill, hook, vyplněná naplánovaná automatizace — všechno pohromadě.',
        },
      ],
    },
    {
      kind: 'figure',
      name: 'routine-form',
      caption: 'Takhle vypadá vyplněný formulář naplánované automatizace v tom cvičném projektu. Hodnoty jsou reálné, ne ilustrační.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Když tvoje agenda potřebuje odeslat mail bez potvrzení',
      text:
        'Kontrola faktur to dělá: žádost o doplnění chybějícího údaje odejde dodavateli bez ptaní. Potřebuje k tomu konektor a druhý souhlas správce — čtení a odesílání jsou dvě různá povolení. Je to vědomá výjimka, ne výchozí nastavení: špatná žádost o doplnění je trapná, špatné „k proplacení“ se může zaplatit.',
    },
    {
      kind: 'task',
      title: 'Cvičení: posuň jeden krok o stupeň výš',
      intro:
        'Vezmi svoji agendu a v ní jeden krok, který děláš každý týden — nezačínej tím nejsložitějším. Příklad výš použij jako kontrolní seznam, ne jako předlohu ke kopírování.',
      items: [
        'Napiš, na kterém z pěti schodů ten krok dneska je.',
        'Udělej ho jednou se zadáním a zapiš si každé doříkání, které bylo potřeba dodat.',
        'Doříkání, která platí pořád, přepiš do CLAUDE.md — a přidej slovník: tři pojmy, kterým by cizí člověk nerozuměl.',
        'Zbytek — samotný postup — přepiš do SKILL.md a spusť ho znovu na jiných datech.',
        'Do skillu napiš sekci „zastav se, když". Bez ní dál nechoď.',
        'Napiš jednu větu o tom, jak poznáš, že výsledek je špatně.',
        'Nastav zábranu a notifikaci a zábranu si otestuj — chtěj vidět, že zápis odmítne.',
        'Projdi checklist „Než to pustíš na plán" a čestně si odškrtej, co platí. Pak spusť skill jedním příkazem bez rozhovoru.',
        'Napiš runbook podle šablony.',
        'Založ automatizaci na Manual a pusť ji přes Run now aspoň třikrát na různých datech. Teprve pak jí dej rozvrh, nejdřív na den, kdy jsi u počítače — a jako první ať jen ukládá soubory, bez odesílání.',
      ],
      hint:
        'Když ti u druhého běhu skill vyjde jinak než u prvního, není to chyba skillu — je to chybějící pravidlo. Odesílání zapínej úplně nakonec, ideálně po měsíci, kdy se maily odklikávaly ručně a nic nepřekvapilo.',
    },
  ],
}

const LESSON_CVICENI: Lesson = {
  slug: 'zmapuj-kolegovi-workflow',
  module: 'agenda',
  title: 'Rozhovor o kolegově práci',
  summary:
    'Ve dvojici si navzájem vyzpovídáte kus vlastní práce. Rozhovor nahrajete na telefon a přepis i reálné soubory skončí v projektu. Kreslit se bude až v další lekci.',
  minutes: 40,
  kind: 'zadání',
  track: 'v sále',
  outcomes: [
    'vést rozhovor o práci tak, aby vyšlo najevo i to, co je pro majitele agendy neviditelné',
    'zapsat cizí proces jako tok dat mezi lidmi a soubory',
    'poznat ve větě kolegy místo, kde se data přenášejí ručně',
    'dostat nahrávku, přepis i reálné soubory do projektu, aby se s nimi dalo dál pracovat',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Totéž, co jsme dělali na vzoru kontroly faktur, tentokrát na vaší agendě. Ve dvojicích — sami sobě proces nikdo nepopíše dobře, protože se vám dávno slil do jednoho kroku. Vyberte kus práce, který děláte pravidelně a kde vám vstupuje e-mail nebo tabulka a někam posíláte výstup — stačí výsek, ne celá agenda, a ne ten nejsložitější.',
    },
    { kind: 'h', text: 'Jak to poběží' },
    {
      kind: 'table',
      head: ['Čas', 'Co se děje', 'Kdo mluví'],
      rows: [
        ['5 min', 'Každý si vybere svůj výsek a napíše ho jednou větou', 'oba'],
        ['15 min', 'Rozhovor: A se ptá, B popisuje svoji práci. A si zapisuje.', 'B'],
        ['15 min', 'Prohodíte se. B se ptá, A popisuje.', 'A'],
        ['5 min', 'Nahrávku a reálné soubory uložit do projektu do podklady/', 'oba'],
      ],
    },
    { kind: 'h', text: 'Jak se ptát' },
    {
      kind: 'p',
      text:
        'Lidé popisují práci jinak, než ji dělají: „jak to děláš“ dá uklizenou verzi, „ukaž mi, jak to bylo naposledy“ tu skutečnou, s print screeny a ručním přeťukáváním.',
    },
    {
      kind: 'list',
      items: [
        'Ptej se na poslední konkrétní případ, ne jak se to dělá obecně.',
        'Nech ho otevřít ten soubor — papír zapomíná, obrazovka ne.',
        'Po každém kroku: „a co se stane pak?“ Dokud nedojdete na konec.',
        'Když přeskočí dva kroky najednou, vrať se: „a to se stane kde?“',
        'Nenavrhuj řešení. Jakmile začneš radit, druhý přestane popisovat a začne se obhajovat.',
        'Nahraj si to na telefon — ale zeptej se, jestli může.',
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Ptej se pořádně — kreslit budeš ty',
      text:
        'V další části kreslí flow ten, kdo se ptal, ne majitel agendy — co tazatel nedokáže nakreslit, to se v rozhovoru nedozvěděl. Ptej se tak, abys to za chvíli uměl nakreslit.',
    },
    { kind: 'h', text: 'Otázky, které se dají použít rovnou' },
    {
      kind: 'code',
      text: `Jak se dozvíš, že máš začít? Přijde e-mail, je to termín, nebo se podíváš sám?
Co je vstup? Kdo ti ho posílá a v čem?
Ukaž mi ten soubor. Co v něm musíš najít jako první?
Co s tím uděláš, než to pošleš dál? Krok po kroku.
Kolikrát se ta data překlopí z jednoho souboru do druhého?
Komu to posíláš a v čem? Odpoví ti zpátky, nebo je to jednosměrka?
Co děláš, když někdo neodpoví?
Kde se to nejčastěji pokazí? Co jsi naposledy musela opravovat?
Co z toho víš z hlavy a není to nikde napsané?
Kdyby ses zítra nemohla dostat k počítači, co by kolega nevěděl?`,
      caption: 'Poslední dvě otázky bývají nejcennější — odhalí to, co v žádném manuálu není.',
    },
    { kind: 'h', text: 'Slova, na která nastražit uši' },
    {
      kind: 'p',
      text:
        'Padají mimochodem, ale skoro vždycky ukazují na místo k automatizaci. Když zazní, zapiš si celý krok.',
    },
    {
      kind: 'table',
      head: ['Když zazní', 'Znamená to'],
      rows: [
        ['„to si pak vykopíruju“', 'data se přenášejí ručně mezi dvěma soubory'],
        ['„to si vždycky musím zkontrolovat“', 'nikdo nevěří vstupu — chybí pravidlo nebo validace'],
        ['„to mi pošle print screenem“', 'odpověď přichází ve formátu, ze kterého se musí přeťukávat'],
        ['„to mám v hlavě“', 'pravidlo, které není nikde zapsané a odejde s člověkem'],
        ['„a pak čekám, až mi odpoví“', 'proces stojí na e-mailu jako na frontě'],
      ],
    },
    { kind: 'h', text: 'Nahrajte si to a dejte do projektu' },
    {
      kind: 'p',
      text:
        'Nahrávka drží to, co nestihnete zapsat: přesné názvy souborů, věty jako „to mi vždycky pošle print screenem“. Z ní vznikne přepis a z přepisu podklad, ke kterému se dá vrátit za měsíc.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Zeptejte se, než zmáčknete nahrávání',
      text:
        'Nahráváte kolegu při práci — řekněte, k čemu to bude, a nechte ho říct ne. Bez nahrávání to jde taky, jen si víc zapisujte.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Na začátku nahrávky řekněte, o co jde',
          body:
            'Jedna věta do mikrofonu: kdo mluví, jaká agenda, jaké datum — jinak nahrávky za pár týdnů nerozeznáte.',
          code: 'Šestého října, účtárna, kontrola faktur. Ptá se Martin, popisuje Katka.',
        },
        {
          title: 'Přesuňte nahrávku do projektu',
          body: 'Uložte ji do složky projektu, do podsložky podklady/. Ne na plochu — projekt je to, co Claude vidí.',
        },
        {
          title: 'Nechte ji přepsat — ale ne Claudem',
          body:
            'Claude Code zvuk neslyší. Nejjednodušší je přepis vestavěný v telefonu (Hlasové záznamy na iPhonu, Rekordér na Androidu) — text zkopírujte vedle nahrávky, stejný název, přípona .txt. Kdo to v telefonu nemá, použije skript od lektora. Skill níž pak přepis uklidí, doplní časy a vytáhne pojmy.',
          code: 'V podklady/ je nahrávka a vedle ní přepis. Postupuj podle skillu prepis-rozhovoru.',
        },
        {
          title: 'Doplňte reálné soubory, ne screenshoty',
          body:
            'Soubor ukáže, co v tom je, a dá se s ním pracovat. Vezměte kopii exportu, jeden e-mail se zadáním a jeden hotový výstup z minula. Sdílenou tabulku ze SharePointu kopírujte do podklady/, originál nechte na pokoji.',
        },
        {
          title: 'Nechte si udělat flow z přepisu',
          body:
            'Zadání níž. Výsledek si schovejte — v další lekci ho porovnáte s tím, co jste nakreslili na papír.',
          code: `Přečti přepis v podklady/ a soubory vedle něj.

Rozepiš proces na kroky: kdo co dělá, čím se data přenášejí
a kde mění formu. U každého kroku napiš, jestli je to ruční
přenos, rozhodnutí člověka, nebo výpočet z pravidel.

Na konec vypiš tři místa, kde se nejvíc přepisuje.`,
        },
      ],
    },
    {
      kind: 'code',
      text: `svozy/
├── CLAUDE.md                 ← slovník téhle agendy, vzniká z rozhovoru
├── podklady/
│   ├── 20261006_rozhovor-katka.m4a
│   ├── 20261006_rozhovor-katka.txt      ← přepis
│   ├── Magazin2026_Logistika_kopie.xlsx ← kopie sdílené tabulky
│   ├── zadani-od-produktaka.eml         ← jeden reálný e-mail
│   └── vystup-zari.xlsx                 ← jak to vypadalo minule
├── vystup/
└── .claude/skills/prepis-rozhovoru/SKILL.md`,
      caption:
        'Podklady zůstávají u nahrávky, ze které vznikly. Sdílený soubor ze SharePointu se sem kopíruje — originál zůstává na místě.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Kopie, ne originál',
      text:
        'Co je v nasyncovaném projektu, vidí celý tým. Kopie exportu je v pořádku — osobní údaje a ceny, co tam nepatří, nedávejte a v přepisu smažte.',
    },
    { kind: 'h', text: 'Skill na přepis' },
    {
      kind: 'p',
      text:
        'Tenhle skill napíšete jednou a použijete na každý další rozhovor. Založte v projektu .claude/skills/prepis-rozhovoru/SKILL.md s textem níž, nebo řekněte Claudovi „založ mi skill prepis-rozhovoru s tímhle obsahem".',
    },
    {
      kind: 'code',
      text: `.claude/skills/prepis-rozhovoru/SKILL.md

---
name: prepis-rozhovoru
description: Uklidí strojový přepis rozhovoru o něčí práci, doplní časy
  a vytáhne z něj pojmy a místa ručního přenosu dat. Použij, když je
  v podklady/ nový přepis rozhovoru s kolegou o jeho agendě.
---

1. Najdi v podklady/ nejnovější přepis (.txt) vedle zvukové nahrávky.
   Když u nahrávky přepis chybí, zastav se a řekni to — sám ji
   přepsat neumíš.
2. Přepis uklid: rozděl na úseky po mluvčích a ke každému napiš čas
   ve tvaru [MM:SS], pokud v přepisu je.
3. Uklizený přepis ulož vedle původního jako <název>-prepis.txt.
   Původní soubor nech beze změny.
4. Na začátek přepisu napiš tři řádky: datum, agendu a kdo mluví —
   ber je z první věty rozhovoru.
5. Nakonec vypiš:
   - názvy souborů, systémů a zkratek, které v rozhovoru zazněly
   - věty, ve kterých někdo popisuje ruční přenos dat
   - místa, kde je nahrávka nesrozumitelná, s časem

## Na co si dát pozor
- Přepis je strojový. Firemní zkratky a jména se komolí — proto ten
  seznam pojmů na konci, aby šly opravit na jednom místě.
- Nic nedomýšlej. Když je něco nesrozumitelné, napiš to.`,
      caption:
        'Věty o ručním přenosu dat jsou seznam kandidátů na automatizaci ještě předtím, než někdo něco nakreslí.',
    },
    {
      kind: 'task',
      title: 'Než půjdete kreslit',
      intro: 'Tohle má být hotové, než začne další část.',
      items: [
        'Zápisky z rozhovoru — každý ze svého kolegy, ne ze sebe.',
        'Nahrávka a její přepis ve složce projektu, v podklady/.',
        'Kopie reálných souborů, o kterých byla řeč: jeden vstup, jeden e-mail, jeden hotový výstup z minula.',
        'Výpis, který vám Claude udělal z přepisu — schovaný na porovnání s kresbou.',
      ],
      hint:
        'Když nahrávat nešlo, nevadí. Musíte mít ale zapsané názvy souborů a to, čím se data mezi kroky přenášejí — bez toho se flow nakreslit nedá.',
    },
    { kind: 'h', text: 'Když se to zasekne' },
    {
      kind: 'table',
      head: ['Zádrhel', 'Co s tím'],
      rows: [
        [
          '„Já žádný proces nemám.“',
          'Vezmi cokoli, co děláš každý týden a co by bylo potřeba vysvětlovat náhradě. To je proces.',
        ],
        [
          'Dvojice se zasekne na jednom kroku',
          'Držte časy. Nedopovězený detail je lepší než nedodělaný rozhovor.',
        ],
        [
          'Majitel agendy se začne obhajovat',
          'Tazatel se ptá, ne hodnotí. Vrať se k „ukaž mi, jak to bylo naposledy“.',
        ],
        [
          'Proces se větví do tří variant',
          'Ptej se na tu nejčastější a větve si poznač stranou. Výjimky řešte až u návrhu.',
        ],
      ],
    },
    { kind: 'h', text: 'Sólo verze: nech se vyzpovídat Claudem' },
    {
      kind: 'p',
      text:
        'Studuješ sám a kolegu po ruce nemáš? Tazatele udělá Claude — otevři ho ve složce projektu, dej mu zadání níž a nech ho ptát se, dokud nedojdete na konec. Odpovídej nahlas, piš krátce, počítej dvacet minut. Nahrávka, přepis i soubory do projektu platí stejně jako výš.',
    },
    {
      kind: 'code',
      text: `Budeš mi klást otázky o jednom kusu mojí práce. Nenavrhuj řešení,
neraď a nekomentuj — jenom se ptej a zapisuj, co odpovím.

Postupuj takhle:
1. Zeptej se, který kus práce chci popsat, a nech mě ho říct jednou větou.
2. Pak se ptej po jedné otázce a čekej na odpověď. Ptej se na poslední
   konkrétní případ, ne na to, jak se to dělá obecně.
3. Po každé mojí odpovědi se zeptej „a co se stane pak?", dokud
   nedojdeme na konec.
4. Když odpovím obecně nebo přeskočím dva kroky najednou, zeptej se
   znovu konkrétněji. Nespokoj se s "pak už to jenom pošlu".
5. Vždycky se zeptej na název souboru, systému nebo zkratky, které
   zmíním, i když si myslíš, že je znáš.

Na konci vypiš:
- kroky procesu v pořadí, jak šly
- u každého, čím se data přenesly a jestli je to ruční přenos,
  rozhodnutí člověka, nebo výpočet z pravidel
- tři místa, kde se nejvíc přepisuje
- seznam pojmů, které jsem použil a nejsou nikde vysvětlené

Ulož to do podklady/rozhovor-<datum>.md.`,
      caption:
        'Pátý bod je ten, kvůli kterému to má cenu: pojmy, které říkáš mimochodem, jsou základ slovníku do CLAUDE.md.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Nepusť ho k radám',
      text:
        'Claude bude chtít radit. Řekni „jenom se ptej" — jakmile začne radit, přestaneš popisovat a začneš se obhajovat, stejná past jako u lidí.',
    },
    {
      kind: 'links',
      title: 'Pokračuje to tady',
      items: [
        {
          label: 'Kresba flow a označení míst',
          href: '#academy/od-mapy-k-automatu/nakresli-flow',
          note: 'Druhá část cvičení — z rozhovoru vznikne obrázek a v něm se označí místa k automatizaci.',
        },
      ],
    },
  ],
}

const LESSON_FLOW: Lesson = {
  slug: 'nakresli-flow',
  module: 'agenda',
  title: 'Kresba flow a označení míst',
  summary:
    'Z rozhovoru nakreslíte flow do tří pruhů, popíšete šipky a každý krok označíte jednou ze tří značek. Kreslí ten, kdo se ptal.',
  minutes: 15,
  kind: 'zadání',
  track: 'v sále',
  outcomes: [
    'nakreslit cizí proces do tří pruhů podle toho, kdo co drží',
    'popsat šipky tím, čím se data opravdu přenášejí',
    'označit místa, kde se data přenášejí ručně',
    'odlišit, co má převzít automatizace a co má zůstat člověku',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Rozhovor máte za sebou. Teď z něj vznikne obrázek a v něm se označí místa k automatizaci. Kreslí ten, kdo se ptal, ne majitel agendy — co tazatel nedokáže nakreslit, to se v rozhovoru nedozvěděl. Čtvrt hodiny, nesnažte se o krásu.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Když na to jsi sám',
      text:
        'Kreslíš podle vlastního přepisu, ne z hlavy — co v něm není, to se nakreslit nedá. Zbytek lekce platí beze změny.',
    },
    { kind: 'h', text: 'Jak to poběží' },
    {
      kind: 'table',
      head: ['Čas', 'Co se děje', 'Kdo'],
      rows: [
        ['9 min', 'Nakreslit flow do tří pruhů', 'každý sám, mlčky'],
        ['2 min', 'Popsat šipky — čím se co přenáší', 'každý sám'],
        ['4 min', 'Ukázat si kresby a společně označit každý krok', 'oba'],
      ],
    },
    { kind: 'h', text: 'Kresba: tři pruhy' },
    {
      kind: 'p',
      text:
        'Papír na šířku, tři vodorovné pruhy: nahoře kdo dodává vstup, uprostřed člověk, o kterém je řeč, dole kdo dostává výstup. Kroky zleva doprava. Nad každou šipku napiš, čím se to přenáší — e-mail, tabulka, print screen, telefon. Popis šipky je důležitější než boxy: automatizuje se přenos, ne práce.',
    },
    {
      kind: 'figure',
      name: 'regal-flow',
      caption: 'Vzor mapy ručního procesu — takhle vypadá kontrola faktur, než ji převezme automatizace. Vaše kresba nemusí být hezká, musí být čitelná.',
    },
    { kind: 'h', text: 'Označení míst' },
    {
      kind: 'p',
      text: 'Projděte flow spolu a označte každý krok jednou ze tří značek — tři barvy fixů, nebo jak se domluvíte.',
    },
    {
      kind: 'table',
      head: ['Značka', 'Znamená', 'Co s tím'],
      rows: [
        [
          'Ruční přenos',
          'data mění formu nebo místo a dělá to člověk',
          'nejsilnější kandidát na automatizaci — ptejte se, proč data vůbec opouštějí původní soubor',
        ],
        [
          'Rozhoduje člověk',
          'krok závisí na něčem, co v datech není',
          'nechte být, ale zapište, podle čeho se rozhoduje — třeba to jde do dat doplnit',
        ],
        [
          'Počítá se z pravidel',
          'výsledek jde odvodit ze vstupů',
          'automatizovatelné do posledního sloupce, i když se to dnes dělá ručně',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nejzajímavější je hranice mezi druhou a třetí',
      text:
        'Spousta kroků vypadá jako rozhodování, ale ve skutečnosti se počítá — jen to pravidlo nikdo nenapsal. Když u kroku umíte říct „když je tohle větší než tamto, tak…“, není to rozhodnutí. Je to vzorec.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Porovnejte to s tím, co vypsal Claude',
      text:
        'Claude vám z přepisu vypsal kroky se stejnými třemi značkami. Rozdíly proti kresbě jsou zajímavější než shody — co je jen v kresbě, zaznělo mimochodem; co je jen u Clauda, jste při kreslení zapomněli.',
    },
    {
      kind: 'task',
      title: 'Výstup dvojice',
      intro:
        'Na konci má každá dvojice dvě kresby — jednu za každého. Vyfoťte je a nahrajte tam, kde se sbírají podklady z workshopu.',
      items: [
        'Flow ve třech pruzích, od „přijde mi to“ po „pošlu to dál“.',
        'Popsané šipky — čím se co přenáší.',
        'Každý krok označený jednou ze tří značek.',
        'Vypsaná tři místa, kde se nejvíc přepisuje, seřazená podle toho, jak moc to štve.',
        'U toho nejhoršího jedna věta o tom, co by se muselo změnit, aby přepis úplně zmizel.',
        'Jeden krok, který má zůstat člověku, a proč — co tam ten člověk ví a data ne.',
      ],
      hint:
        'U posledního bodu nebuďte skromní. Krok, který vypadá jako administrativa, ale ve skutečnosti opravuje data, která lžou, je ten nejcennější kus práce v celém procesu.',
    },
    { kind: 'h', text: 'Když se to zasekne' },
    {
      kind: 'table',
      head: ['Zádrhel', 'Co s tím'],
      rows: [
        ['Kresba nejde dokončit', 'To je taky výsledek. Označ místo, kde to drhlo — tam informace chybí i v reálu.'],
        [
          'Krok nejde zařadit pod žádnou ze tří značek',
          'Napiš k němu otazník a jdi dál — probere se při sdílení map.',
        ],
        ['Celé to vyjde jako jeden dlouhý pruh', 'Zeptej se, komu jde výstup a odkud přišel vstup.'],
        ['Nestíháte', 'Devět minut je schválně málo. Rozkreslené flow s popsanými šipkami je lepší než hotové bez nich.'],
      ],
    },
    {
      kind: 'links',
      title: 'Pokračuje to tady',
      items: [
        {
          label: 'Sdílení map: co si z toho odnese sál',
          href: '#academy/od-mapy-k-automatu/sdileni-map',
          note: 'Třetí část — dvě minuty na dvojici a hledání toho, co se opakuje napříč odděleními.',
        },
      ],
    },
  ],
}

const LESSON_SDILENI: Lesson = {
  slug: 'sdileni-map',
  module: 'agenda',
  title: 'Sdílení map: co si z toho odnese sál',
  summary:
    'Dvě minuty na dvojici. Jak svoji mapu představit, aby to ostatním k něčemu bylo, a co poslouchat u ostatních — protože stejné místo se skoro vždycky opakuje ve třech odděleních najednou.',
  minutes: 10,
  kind: 'zadání',
  track: 'v sále',
  outcomes: [
    'představit cizí proces za dvě minuty tak, aby tomu rozuměl někdo z jiného oddělení',
    'poznat u cizí mapy místo, které máte i vy',
    'odejít se seznamem míst, která se opakují napříč odděleními',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Poslední část cvičení: dvě minuty na dvojici, pak sál hledá, co mají mapy společné — obvykle vyjde, že tři oddělení řeší tutéž věc třemi způsoby. Kdo studuje sám, najde náhradu na konci v části „Sólo verze“.',
    },
    { kind: 'h', text: 'Dvě minuty na dvojici' },
    {
      kind: 'p',
      text:
        'Mluví ten, kdo kreslil, ne majitel agendy — popisuje, co pochopil, a to je úroveň, které rozumí i zbytek sálu. Držte se čtyř vět.',
    },
    {
      kind: 'code',
      text: `Katka dělá <agenda>. Začíná to tím, že <čím přijde vstup>.
Nejhorší místo je <krok>, protože tam <co se přenáší ručně>.
Dělá se to <jak často> a zabere to <kolik času>.
Jeden krok tam musí zůstat člověku: <který> — protože <co ten člověk ví>.`,
      caption: 'Poslední věta je ta hlavní — sál se z ní naučí, kde je hranice, za kterou se automatizovat nemá.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Neomlouvejte se za kresbu',
      text: 'Nikdo ji nehodnotí. Dvě minuty jsou krátké — nepromrhejte je na „to je hrozně nakreslené, ale…“.',
    },
    { kind: 'h', text: 'Co poslouchat u ostatních' },
    {
      kind: 'p',
      text:
        'Hledejte, co znáte — jiné oddělení, jiný soubor, ale tentýž problém. Čtyři vzorce se opakují skoro vždycky.',
    },
    {
      kind: 'table',
      head: ['Když u někoho slyšíte', 'Zapište si to jako'],
      rows: [
        [
          'export z jednoho systému, který se vkládá do druhého',
          'ruční přenos mezi dvěma soubory — stejný tvar úkolu má logistika i marketing',
        ],
        [
          'čekání na odpovědi od poboček nebo kolegů',
          'proces stojí na e-mailu jako na frontě — má to řešení, které je pro všechny stejné',
        ],
        [
          'kontrola, kterou někdo dělá „pro jistotu“',
          'nikdo nevěří vstupu; místo kontroly patří pravidlo na vstupu',
        ],
        [
          'sestava, kterou někdo skládá každé pondělí ráno',
          'kandidát na naplánovanou automatizaci — přesně to, co se staví po pauze',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Tohle je zadání pro zbytek dne',
      text:
        'Po tomhle bloku si každý vybírá krok, který po pauze skutečně staví — nejlépe ten, co se v sále objevil víckrát než jednou.',
    },
    {
      kind: 'task',
      title: 'Než se jde na pauzu',
      intro: 'Dva řádky, které si každý napíše sám pro sebe.',
      items: [
        'Jeden krok z vlastní mapy, který chci po pauze postavit — jednou větou, s názvem souboru.',
        'Jedno místo z cizí mapy, které mám taky, a čí to byla mapa.',
      ],
      hint: 'Ten druhý řádek je hlavní důvod bloku — za měsíc je to jediná poznámka, díky které někomu napíšete.',
    },
    { kind: 'h', text: 'Sólo verze: s kým to porovnat, když nikdo jiný není' },
    {
      kind: 'p',
      text:
        'Sál dává cizího čtenáře a přehled, co se opakuje napříč odděleními. Sám dostaneš obojí, jen jinak — a to druhé jen napůl.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Nech si mapu přečíst někým, kdo tvoji agendu nezná',
          body:
            'Cizího čtenáře udělá Claude. Vyfoť kresbu nebo dej svůj výpis kroků a nech ho ptát se na to, čemu bez znalosti tvojí práce nerozumí — každá otázka je místo, kde v mapě chybí informace.',
          code: `Přečti tuhle mapu procesu. Neznáš moji agendu ani naši firmu.

Napiš:
- co jsi z ní pochopil, vlastními slovy, v pěti větách
- kde ti chybí informace, aby ses v tom vyznal
- které zkratky a názvy jsi nepochopil
- kde podle tebe data mění formu, i když to v mapě není napsané

Nenavrhuj řešení.`,
        },
        {
          title: 'Porovnej tvar s hotovou mapou',
          body:
            'Otevři vzorovou mapu kontroly faktur z lekce Kresba flow a polož ji vedle svojí. Jde o tvar, ne obsah: tři pruhy, popsané šipky, vidět hranici odpovědností? Rozdíly v tvaru bývají místa, kde jsi něco přeskočil.',
        },
        {
          title: 'Projdi čtyři vzorce výš a odškrtej, které máš',
          body:
            'Tabulka „Když u někoho slyšíte" platí i na tvoji mapu. Když aspoň jeden vzorec sedí, máš kandidáta na první automatizaci — a víš, že to nebude jen tvoje.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Co ti sólo doopravdy unikne',
      text:
        'To, že tentýž problém řeší ještě jiná oddělení — tohle Claude nenahradí. Pošli dvěma kolegům jinam jednu větu: „u nás se každý týden přepisuje X do Y, děláte to taky?". Odpověď rozhodne, jestli stavíš věc pro sebe, nebo pro celou firmu.',
    },
    { kind: 'h', text: 'Pro lektora' },
    {
      kind: 'list',
      items: [
        'Držet dvě minuty tvrdě — třináct dvojic je půl hodiny, když se nechá plynout.',
        'Psát na tabuli, co se opakuje, ne co je zajímavé — seznam opakování je výstup tohohle bloku.',
        'Hodící se mapu zmínit hned nahlas — je to kandidát na domácí stavbu.',
        'Nekomentovat řešení. Sál je teď sběrač problémů, ne návrhář.',
      ],
    },
    {
      kind: 'links',
      title: 'Odkud to sem vede',
      items: [
        {
          label: 'Rozhovor o kolegově práci',
          href: '#academy/od-mapy-k-automatu/zmapuj-kolegovi-workflow',
          note: 'První část cvičení.',
        },
        {
          label: 'Kresba flow a označení míst',
          href: '#academy/od-mapy-k-automatu/nakresli-flow',
          note: 'Druhá část — mapa, kterou tady představujete.',
        },
      ],
    },
  ],
}

/* --------------------------------- kurz 2: Od vzoru k vlastní automatizaci */

const L2_PLAN: Lesson = {
  slug: 'naplanovana-uloha',
  module: 'postav',
  title: 'Automatizace v Claude Code pomocí routine',
  summary:
    'Kde se automatizace zakládá, proč pro nás platí Local a ne Cloud, co vyplnit, a co se stane, když počítač spal.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'založit naplánovanou automatizaci v Claude Code — klikáním i větou',
    'rozhodnout mezi Local a Cloud a vědět, proč je pro nás skoro vždycky Local',
    'vědět, co se stane se zmeškaným během a jak na to napsat zadání',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Technická část posledního schodu: samotné založení automatizace, která se spustí sama. V desktopové aplikaci Claude Code je to záložka Code → Routines.',
    },
    {
      kind: 'sekce',
      id: 'local',
      stitek: 'Část 1',
      titul: 'Local — běží na tvém počítači',
      popis:
        'Varianta, kterou u nás chceš skoro vždycky: automatizace pracuje přímo ve tvojí složce na disku. Cenou za to je zapnutý počítač a puštěná aplikace.',
    },
    {
      kind: 'image',
      src: 'routines-formular.webp',
      alt: 'Formulář nové lokální rutiny v Claude Code. Nahoře upozornění, že lokální rutiny běží, jen když je počítač vzhůru a online. Pole Name a Description jsou povinná, pod nimi velké pole Instructions, pod ním řádek s režimem povolování, výběrem složky a volbou Worktree. Sekce Schedule nabízí Manual, Hourly, Daily, Weekdays, Weekly a Custom; vybráno je Daily s časem 09:00 a poznámkou, že rutiny používají několikaminutové náhodné zpoždění. Vpravo dole tlačítka Cancel a Create.',
      caption:
        'Prázdný formulář, jak vypadá po Code → Routines → New routine. Šedý text v polích jsou jen příklady, ne předvyplněné hodnoty. Povinné je jméno a popis; bez vybrané složky se automatizace neuloží.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nemusíš to klikat — stačí si o to říct',
      text:
        'Celý formulář níž umí Claude vyplnit sám. Napiš mu v chatu jednou větou, co má automatizace dělat a kdy, a založí ji i s rozvrhem — třeba: „Založ mi naplánovanou automatizaci kontrola-faktur nad touhle složkou. Ať běží každých 15 minut v pracovní dny od sedmi do šesti a postupuje podle skillu kontrola-faktur." Přednastavené rozvrhy ve formuláři jsou Manual, Hourly, Daily, Weekdays a Weekly; cokoli jiného se skládá pod volbou Custom. Větou v chatu je to ale rychlejší — „každých 15 minut v pracovní dny od sedmi do šesti" si Claude přeloží sám. Stejnou cestou vznikne i jednorázová automatizace — „připomeň mi zítra ve tři, ať zkontroluju ten běh" se po odpálení sama vypne — a stejně tak se automatizace pozastavují a vypisují: „pozastav mi automatizaci kontrola-faktur", „ukaž mi moje naplánované automatizace". Postup níž si projdi hlavně proto, abys věděl, co se ti tím založilo a kde to zkontrolovat.',
    },
    {
      kind: 'image',
      src: 'rutina-panel.webp',
      alt: 'Detail naplánované automatizace kontrola-faktur v Claude Code. Popis říká, že sleduje schránku, eviduje nové faktury a u neúplných pošle dodavateli žádost o doplnění. Stav je Active s dalším během dnes ve 13:24. Je vyplněná pracovní složka faktury-kontrola, rozvrh zní přibližně každých 15 minut mezi 7:00 a 17:59 od pondělí do pátku, historie je zatím prázdná. Vpravo nahoře je tlačítko Run now, vedle něj ikony pro úpravu a smazání.',
      caption:
        'Takhle vypadá hotová automatizace, kterou Claude založil z jedné věty. Rozvrh „každých 15 minut v pracovní dny" ve formuláři na výběr není — vznikl z toho, jak byl popsaný slovy. Historie je prázdná, protože ještě nic neproběhlo; první běh si vyvoláš tlačítkem Run now vpravo nahoře.',
    },
    {
      kind: 'image',
      src: 'routines-prvni-beh.webp',
      alt: 'První běh rutiny kontrola-faktur. Vpravo panel Runs se záznamem Today at 1:24 PM ve stavu Running. Uprostřed průběh: Claude čte pokyny projektu a soubor skillu, přečetl dva soubory, spustil dva příkazy z toho jeden neúspěšně, a hlásí, že mezi dostupnými nástroji není konektor na Microsoft 365, takže si to chce ověřit, než z toho udělá závěr. Dole dotaz na oprávnění „Allow Claude to use list connectors" s tlačítky Deny, Always allow a Allow once.',
      caption:
        'První běh po Run now. Na každý nástroj se automatizace zeptá — „Always allow" si odpověď uloží a další běhy už se neptají; bez toho se běh ve tři ráno zastaví na dotazu a nikdo neodpoví. Všimni si i řádku o chybějícím konektoru: automatizace nepředstírá, že mail odešle, a jde to ověřit, než něco tvrdí.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Ještě líp: měj rozvrh napsaný ve složce',
      text:
        'Automatizace založená v aplikaci je jen záznam v ní. Kolega ho nevidí, do zálohy se nedostane, a když přeinstaluješ počítač, je pryč i s tím, jak byla nastavená. Proto si do projektu přidej soubor rutina.md a popiš v něm, co do formuláře patří: název, model, režim povolování, složku, rozvrh — a celé instrukce k překopírování. Cvičný projekt ho takhle má. Založení se tím smrskne na jednu větu: „Založ naplánovanou automatizaci podle rutina.md." A hlavně se tím otočí pořadí: když se agenda změní, přepíšeš nejdřív ten soubor a teprve podle něj automatizaci, takže popis nikdy nezaostane za tím, co doopravdy běží.',
    },
    {
      kind: 'soubor',
      nazev: 'rutina.md',
      popis: 'Přesně tenhle soubor je v cvičném projektu. Takhle vypadá rozvrh napsaný ve složce.',
      obsah: `# Naplánovaná automatizace: kontrola nových faktur v Outlooku

Co vyplnit v aplikaci Claude → záložka **Code** → **Routines** → **New routine**.

## Než založíš automatizaci: konektor na Microsoft 365

Tahle automatizace potřebuje konektor Claude na Microsoft 365 se zapnutými
**write tools** (posílání pošty) — bez nich přečte schránku, ale e-mail
neodešle,
jenom ho navrhne (viz \`CLAUDE.md\`, „Když projekt běží bez připojené
schránky"). Write tools zapíná zvlášť správce Microsoft 365, přihlášený
pracovním účtem; osobní outlook.com nebo hotmail.com nefunguje. Text, který
mu poslat, je níž v „Co napsat správci".

## Formulář

| Pole | Co vyplnit |
| --- | --- |
| **Name** | \`kontrola-faktur\` |
| **Description** | Sleduje schránku a doplňuje chybějící údaje na fakturách |
| **Model** | Sonnet — na tuhle práci stačí a je nejúspornější |
| **Permission mode** | Accept edits — jinak se běh zastaví na dotazu, na který nikdo neodpoví |
| **Folder** | složka tohoto projektu (\`faktury-kontrola\`) |
| **Schedule** | Every 15 minutes, v pracovní dny 7:00–18:00 |

Proč každých 15 minut, ne jednou denně: tahle automatizace nahrazuje ruční
sledování schránky, takže žádost o doplnění má dodavateli přijít brzy po
faktuře, ne až druhý den. Claude Code nemá skutečné „hned jak přijde
e-mail" spouštění — nejblíž tomu je časté opakování. Když ti 15 minut
připadá zbytečně husté, dej to na 30 nebo na hodinu; nic se tím nerozbije,
jen se prodlouží čas do odpovědi dodavateli.

## Instructions

\`\`\`
Postupuj podle skillu kontrola-faktur.

Zkontroluj schránku fakturace@dek.cz na nové e-maily s PDF přílohou, které
ještě nejsou uložené ve vstup/. Když nic nového nepřišlo, nic nedělej a
nic neposílej.

Ke každé nové faktuře udělej celý postup ze skillu — uložení do vstup/,
vytažení šesti údajů, zápis do data/objednavky.xlsx do sešitu podle
dodavatele, a když něco chybí a je toho jeden nebo dva údaje, zapiš to do
vystup/kontrola-<dnešní datum>.xlsx i s navrženým textem a ten text pošli
dodavateli na adresu, ze které faktura přišla, v kopii
vedouci-uctarny@dek.cz. Čas odeslání zapiš do kontrola-<dnešní datum>.xlsx
i do sloupce „Žádost odeslána" v data/objednavky.xlsx.

Když u některé faktury chybí tři a víc údajů, nebo se PDF nedá přečíst,
nic neposílej — zapiš to do protokolu k ruční kontrole.

Nikdy neposílej nic, co se týká platby, schválení nebo účetnictví.
\`\`\`

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

- Místní automatizace běží, jen když je aplikace Claude spuštěná a počítač
  vzhůru. Když počítač spí, běh se přeskočí a doženou se jen ty, co chyběly
  bezprostředně předtím — ne všechny za celou dobu.
- Kdyby konektor na M365 spadl nebo přišel o přístup, automatizace se
  zastaví na dotazu, ne že by tiše nic nedělala — sleduj to hlavně první týden.
- Když chceš, aby tohle běželo i s vypnutým počítačem, není to tenhle typ
  automatizace. To už musí běžet někde jinde než na tvém stole.

## Co napsat správci

\`\`\`
Ahoj, potřeboval bych u konektoru Microsoft 365 pro Claude povolit
write tools (odesílání pošty) pro schránku fakturace@dek.cz.

K čemu to bude: automatická kontrola došlých faktur. Automatizace zkontroluje
šest povinných údajů a dodavateli automaticky pošle žádost o doplnění,
když jeden nebo dva chybí. Nic k platbě, schválení ani do účetnictví
se automaticky neposílá — to zůstává na nás.

Čtecí přístup už mám a funguje. Práva se dědí z účtu, takže Claude uvidí
přesně to, co já, nic navíc.
\`\`\`

## Kam sáhnout, když se něco pokazí

Runbook je v \`runbook.md\` vedle tohoto souboru.`,
    },
    { kind: 'h', text: 'Postup' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Routines → New routine → Local',
          body:
            'Cloud si na automatizaci klonuje repozitář z GitHubu a do tvojí složky se nedostane — pro práci nad vlastní složkou proto chceš Local (víc v tabulce níž).',
        },
        {
          title: 'Vyplnit název, popis a instrukce',
          body:
            'Instrukce píšeš stejně, jako když píšeš Claudovi do chatu. Tady vybereš i model a režim povolování.',
        },
        {
          title: 'Vybrat pracovní složku',
          body:
            'Bez složky se automatizace nedá uložit. Vyber projektovou — tu s CLAUDE.md, data/ a vystup/. Bez označení jako důvěryhodná se na to aplikace zeptá.',
        },
        {
          title: 'Nastavit rozvrh',
          body:
            'Přednastavené jsou Manual, Hourly, Daily, Weekdays a Weekly, pod Custom se dá složit i jiný. Rychlejší je říct to Claudovi v chatu vlastními slovy — každých patnáct minut, prvního v měsíci.',
        },
        {
          title: 'Hned kliknout na Run now',
          body:
            'Nepřeskakuj. První běh si odklikáš oprávnění a u každého dáš „always allow" — jinak se automatizace při ostrém běhu zastaví na dotazu, na který nikdo neodpoví, a bude to vypadat, že spadla.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Když počítač spal, běh se přeskočí',
      text:
        'Automatizace běží jen při puštěné aplikaci a probuzeném počítači. Zaspaný běh se zahodí, po probuzení se dohání jen ten poslední zmeškaný — automatizace, která nešla šest dní, doběhne jednou. Ranní automatizace se tak může spustit v jedenáct večer. Piš proto zadání s tím, že počítá: „Pracuj jenom s dnešním exportem. Po páté odpoledne nic nepočítej, jen napiš, že se to nestihlo." V Nastavení → Aplikace → Obecné jde zapnout Keep computer awake, ale zavřené víko uspí počítač tak jako tak.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Zadání automatizace je obyčejný SKILL.md',
      text:
        'Text automatizace leží na disku v ~/.claude/scheduled-tasks/<název>/SKILL.md — stejný formát jako u skillů, YAML hlavička s name a description a pod tím zadání. Dá se editovat ručně, projeví se to při dalším běhu. Rozvrh, složka a model se mění ve formuláři, ne v souboru.',
    },
    {
      kind: 'sekce',
      id: 'cloud',
      stitek: 'Část 2',
      titul: 'Cloud — běží na serveru',
      popis:
        'Druhá varianta, která nepotřebuje tvůj počítač. Zní líp, ale na naši práci nesedí — a stojí za to vědět proč, ne to jen slyšet.',
    },
    {
      kind: 'p',
      text:
        'Cloudová automatizace běží na serveru, takže doběhne i se zavřeným notebookem. Nevidí ale na tvůj disk: pracuje nad repozitářem, který si naklonuje z GitHubu. Tabulka je rozdíl po rozdílu.',
    },
    {
      kind: 'table',
      head: ['Vlastnost', 'Local — na tvém počítači', 'Cloud — na serveru'],
      rows: [
        [
          'Vidí soubory na tvém disku',
          'ano, pracuje přímo v tvojí složce',
          'ne, klonuje si repozitář z GitHubu',
        ],
        ['Potřebuje zapnutý počítač', 'ano, a puštěnou aplikaci', 'ne, běží i se zavřeným notebookem'],
        ['Nejkratší interval', 'minuta', 'hodina'],
        ['Povolování nástrojů', 'nastavíš si režim, může se doptat', 'běží samo, na nic se neptá'],
        ['Kdy ji zvolit', 'skoro vždycky u nás — data máme ve složce', 'práce nad repozitářem, co nesmí čekat na notebook'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Pro naši práci je správně Local — a to je ta nepříjemná zpráva',
      text:
        'Cloud zní líp, protože běží i se zavřeným notebookem — jenže data leží jen v nasyncované knihovně na disku, kam se cloudová automatizace nedostane. Takže platí Local: zapnutý počítač, puštěná aplikace. Má-li běh vyjít i přes zavřený notebook, musí data přestat žít jen na disku — přes konektor, nebo tokem v Power Automate.',
    },
    { kind: 'h', text: 'Nutné minimum o GitHubu' },
    {
      kind: 'p',
      text:
        'Cloudová automatizace nepracuje se složkou na disku, ale s repozitářem na GitHubu. Kdo GitHub nezná, tady je minimum, se kterým se dá tenhle rozdíl pochopit — víc na to teď nepotřebuješ.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'GitHub je Disk pro složky projektů',
      text:
        'Představ si Google Disk, ale pro celé složky projektů — a s pamětí. Ke každé změně si pamatuje, kdo ji udělal, kdy a hlavně proč: ke každé se píše krátký popisek. Dva rozdíly proti Disku: nesynchronizuje se sám na pozadí, změny se posílají vědomě a po dávkách; a umí spouštět automatizace sám, když se něco stane. Jinak je to pořád jen složka se soubory.',
    },
    {
      kind: 'table',
      head: ['Slovo, které uslyšíš', 'Co to je'],
      rows: [
        ['repozitář (repo)', 'jedna složka projektu i s celou historií. Tahle akademie je repozitář cajpij/dek.'],
        ['commit', 'jedna uložená změna s popiskem, proč se stala'],
        ['push', 'odeslání hotových commitů z počítače na GitHub'],
        ['branch (větev)', 'souběžná verze složky, ať se rozdělaná práce nemíchá do hotové; hlavní se jmenuje main'],
        ['GitHub Actions', 'automatizace, které GitHub spouští sám — po každém pushi nebo podle času'],
      ],
    },
    {
      kind: 'image',
      src: 'github-repozitar.webp',
      alt: 'Stránka repozitáře cajpij/dek na GitHubu. Nahoře jméno vlastníka a repozitáře se štítkem Public, pod tím záložky Code, Issues, Pull requests, Actions. Uprostřed výpis složek a souborů: .github/workflows, cviceni/faktury-kontrola, mcp-dek, public, scripts, src, .gitignore, README.md, index.html. U každé položky je popisek poslední změny a doba, kdy se stala — od třinácti minut po týden. Vpravo panel About s počty hvězd, sledujících a forků.',
      caption:
        'Repozitář téhle akademie. Vypadá jako obyčejný výpis složky — a je to obyčejný výpis složky. U každé položky je navíc vidět, čím se naposledy měnila a jak dávno. Složka cviceni/faktury-kontrola je ten cvičný projekt, co si stahuješ v jiné lekci.',
    },
    {
      kind: 'image',
      src: 'github-historie.webp',
      alt: 'Stránka Commits repozitáře cajpij/dek. Seznam uložených změn z 9. září 2026, každá s popiskem, jménem autora, dobou a krátkým identifikátorem: Lekce ukazuje, jak vypadá první běh rutiny; Lekce o routine se dělí na Local a Cloud; Pryč s modulem Dotáhni to do provozu; Snímek formuláře rutiny, a oprava.',
      caption:
        'Historie změn. Tohle je ten rozdíl proti Disku: u každé úpravy je věta, proč se stala. Za dvě hodiny práce na téhle lekci jich přibylo pár desítek — a dá se v nich zpětně listovat a vracet se.',
    },
    {
      kind: 'image',
      src: 'github-actions.webp',
      alt: 'Stránka Actions repozitáře cajpij/dek se 104 běhy. Každý řádek má zelené kolečko, název odpovídající poslední změně, poznámku Deploy to GitHub Pages s číslem běhu a commitem, větev main, dobu před několika minutami a délku běhu kolem čtyřiceti sekund.',
      caption:
        'A tohle je „jak tam něco běží". Po každém odeslání změny spustí GitHub sám automatizaci, která z repozitáře postaví web — těch 104 běhů je 104 verzí téhle akademie. Čtyřicet sekund a je venku. Nikdo u toho neseděl.',
    },
    { kind: 'h', text: 'Co by to znamenalo pro kontrolu faktur' },
    {
      kind: 'p',
      text:
        'Formulář cloudové rutiny se ptá na dvě věci, které lokální nechce: na repozitář a na cloudové prostředí. Bez repozitáře se automatizace nedá založit — a to je celá odpověď na otázku, jestli by kontrola faktur šla pustit v cloudu.',
    },
    {
      kind: 'image',
      src: 'routines-cloud-formular.webp',
      maxWidth: 620,
      alt: 'Formulář nové cloudové rutiny. Pole Name a Instructions, pod nimi zvýrazněný řádek Select a repository s šipkou a popiskem „sem musí složka projektu", vedle Select a cloud environment. Níž výběr spouštěče: Schedule, GitHub event, API. Dole seznam konektorů a oranžové varování, že Claude smí tyto konektory používat včetně zápisu, aniž by se během běhů ptal.',
      caption:
        'Zvýrazněné pole je jádro věci: cloudová automatizace nepracuje se složkou na disku, ale s repozitářem. Naše faktury-kontrola by se tedy musela přestěhovat na GitHub.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'A tady to padá',
      text:
        'Do repozitáře by musely jít i faktury — tedy PDF od dodavatelů s částkami a IČO, do místa, které je ze své podstaty stavěné na sdílení. To u došlé pošty nechceš, ani když je repozitář soukromý. K tomu by pořád byl potřeba konektor na Microsoft 365, protože faktury chodí e-mailem, ne do repozitáře. Cloud tedy nesedí na naši agendu — ne že by nefungoval.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Kdy cloud naopak sedí',
      text:
        'Když je práce sama o sobě v repozitáři. Tahle akademie je toho příklad: lekce jsou soubory v cajpij/dek, takže cloudová automatizace by je uměla upravovat i se zavřeným notebookem — a Actions, které jsi viděl výš, ji po každé změně samy nasadí. Rozhoduje tedy jediná otázka: leží data, se kterými se pracuje, v repozitáři, nebo na disku?',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Pro Rossiho: tohle by mohla být dobrá inovace',
      text:
        'Tahle akademie není ukázka, je to fungující aplikace — a neběží na žádném našem serveru. Leží v repozitáři, po každém odeslání změny ji GitHub sám postaví a nasadí, do čtyřiceti sekund je venku. Žádná objednávka hostingu, žádná údržba, žádná faktura. Stejně by mohly bydlet interní aplikace, které v DEKu vznikají: kalkulačky, prototypy, přehledy, dokumentace, ukázky design systému. Než se z toho udělá pravidlo, jedna věc k ověření: veřejný repozitář znamená veřejný web, a Pages nad soukromým repozitářem chtějí placený plán. Pro věci bez firemních dat je to hotová věc hned, pro zbytek je to otázka na správce, ne důvod to zahodit.',
    },
    {
      kind: 'video',
      title: 'Jak naplánovaná automatizace vypadá',
      items: VIDEOS_PLAN,
    },
    {
      kind: 'links',
      title: 'Dokumentace',
      items: [
        {
          label: 'Schedule recurring tasks in Claude Code Desktop',
          href: 'https://code.claude.com/docs/en/desktop-scheduled-tasks',
          note: 'Ta varianta Local. Rozvrhy, oprávnění, zmeškané běhy.',
        },
        {
          label: 'Automate work with routines',
          href: 'https://code.claude.com/docs/en/routines',
          note: 'Cloudová varianta — až budeš mít práci nad repozitářem.',
        },
        {
          label: 'Automate actions with hooks',
          href: 'https://code.claude.com/docs/en/hooks-guide',
          note: 'Zábrany a notifikace, které k naplánovanému běhu patří.',
        },
      ],
    },
  ],
}

const L2_MCP: Lesson = {
  slug: 'mcp-nad-katalogem',
  module: 'vic',
  title: 'MCP nad katalogem dek.cz',
  summary:
    'Zeptat se na sortiment vlastními slovy, bez klikání ve webu. Jak server rozjet na svém počítači za dvě minuty, jak ověřit, že jede, a na co se ho ptát.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'vysvětlit, co MCP server přidává oproti běžnému Claudovi',
    'rozjet server na svém počítači a připojit ho v Claude Code',
    'ověřit přes /mcp, že se opravdu spojil, a poradit si, když ne',
    'poznat, na které dotazy je dobrý a na které ne',
    'zkombinovat katalog s vlastní složkou v jednom zadání',
  ],
  body: [
    {
      kind: 'p',
      text:
        '„Projdi tenhle seznam kódů a řekni, které už nevedeme.“ „Vezmi kategorii technických izolací a udělej z ní tabulku.“ Tohle jde napsat rovnou Claudovi, jakmile má připojený MCP server nad katalogem dek.cz — žádné klikání ve webu, žádné kopírování jednoho produktu po druhém. Konektor je přípojka na službu mimo tvůj disk, to už znáš. MCP je způsob, jak se taková přípojka píše: server nabídne pár nástrojů a Claude si mezi nimi sám vybere ten, který se hodí na tvůj dotaz.',
    },
    { kind: 'h', text: 'Dvě varianty, se kterými se potkáš' },
    {
      kind: 'table',
      head: ['', 'mcp-dek — běží u tebe', 'Hotový server s adresou'],
      rows: [
        ['Kde běží', 'na tvém počítači, jako program', 'někde na síti, ty jen znáš adresu'],
        ['Odkud ho vezmeš', 'je ve složce mcp-dek v repu akademie', 'adresu ti dá ten, kdo ho provozuje'],
        ['Co umí', 'produkty a kategorie z veřejného katalogu', 'produkty i obsah — návody, příručky, články'],
        ['Přihlášení', 'žádné, čte jen veřejný web', 'podle toho, jak je postavený'],
        ['Kdy ho použít', 'hned. Rozjede se za dvě minuty a nikoho nemusíš prosit.', 'když ho ve firmě někdo provozuje'],
      ],
    },
    { kind: 'h', text: 'Nástroje' },
    {
      kind: 'tabs',
      items: [
        {
          label: 'mcp-dek (lokální)',
          blocks: [
            {
              kind: 'table',
              head: ['Nástroj', 'Co dělá'],
              rows: [
                ['hledat_produkt', 'najde produkty podle názvu nebo kódu v lokálním rejstříku'],
                ['detail_produktu', 'název, popis, značka, veřejná cena, dostupnost, zařazení'],
                ['hledat_kategorii', 'najde kategorie podle názvu'],
                ['produkty_v_kategorii', 'vypíše produkty z kategorie — na obecné dotazy lepší než hledání'],
                ['stav_rejstriku', 'kolik toho rejstřík zná a kdy se stavěl; umí ho postavit znovu'],
              ],
            },
          ],
        },
        {
          label: 'Hotový server',
          blocks: [
            {
              kind: 'table',
              head: ['Nástroj', 'Co dělá'],
              rows: [
                ['eshop_search_products', 'najde produkty podle názvu, značky nebo kódu'],
                ['eshop_list_products', 'vypíše, co je v kategorii'],
                ['eshop_get_product', 'detail jednoho produktu'],
                ['content_search', 'hledá v návodech, příručkách a článcích'],
                ['content_get_document', 'vytáhne celý dokument i s odkazem na zdroj'],
                ['content_get_multilingual', 'tentýž obsah v jiném jazyce'],
              ],
            },
          ],
        },
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nemusíš vědět, který nástroj je který',
      text:
        'Nástroje si Claude vybírá sám podle toho, na co se ptáš — tabulky jsou tu jen aby bylo poznat, co se přitom děje. Ptej se jako člověka, ne jako vyhledávače.',
    },
    { kind: 'h', text: 'Jak ho rozjet lokálně' },
    {
      kind: 'p',
      text:
        'Server je jeden soubor bez závislostí kromě oficiálního SDK, takže se rozjede dřív, než se stihneš někoho zeptat, jestli smíš. Potřebuješ jen Node (node --version musí něco vypsat, jinak stáhni z nodejs.org) a vlastní složku na disku, třeba Dokumenty — server pak běží u tebe pro všechny projekty najednou.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Jenom ne do nasyncované knihovny',
      text:
        'Instalace vyrobí složku node_modules s tisícovkami drobných souborů, které by OneDrive začal syncovat kolegům. Dej mcp-dek mimo nasyncované složky — nic tím neztratíš, díky --scope user ho Claude stejně vidí ve všech projektech včetně toho na SharePointu.',
    },
    {
      kind: 'tabs',
      items: [
        {
          label: 'Nech to na Claudovi',
          blocks: [
            {
              kind: 'p',
              text:
                'Nejrychlejší cesta a nemusíš u toho rozumět ani jednomu příkazu. Otevři Claude Code ve složce, kam to chceš stáhnout, a vlep tohle:',
            },
            {
              kind: 'code',
              text: `Stáhni mi repozitář https://github.com/cajpij/dek do složky
Dokumenty — je v něm složka mcp-dek, což je MCP server nad katalogem
dek.cz. Nainstaluj závislosti, postav rejstřík a připoj ho jako MCP
server pod názvem dek se scope user, ať ho mám ve všech projektech.
Nedávej to do nasyncované složky na OneDrivu. Pak mi napiš, kam jsi
to dala a jestli se to povedlo.`,
              caption:
                'Claude si stažení, instalaci i připojení udělá sám a řekne ti, kde to skončilo. Když se něco nepovede, rovnou to i vysvětlí.',
            },
          ],
        },
        {
          label: 'Terminál, když máš git',
          blocks: [
            {
              kind: 'code',
              text: `# 1. stáhnout k sobě
git clone https://github.com/cajpij/dek.git ~/Documents/dek

# 2. připravit server
cd ~/Documents/dek/mcp-dek
npm install
node server.js --build-index

# 3. připojit ho Claudovi
claude mcp add --scope user dek -- node ~/Documents/dek/mcp-dek/server.js`,
              caption:
                'Když už repozitář máš, první krok přeskoč. Krok 2 stáhne 42 sitemap a postaví z nich rejstřík — asi 81 tisíc produktů a 4 650 kategorií, pár vteřin. Je nepovinný: bez něj se rejstřík postaví sám při prvním hledání.',
            },
          ],
        },
        {
          label: 'Bez gitu, přes ZIP',
          blocks: [
            {
              kind: 'steps',
              items: [
                {
                  title: 'Stáhnout ZIP z GitHubu',
                  body:
                    'Otevři github.com/cajpij/dek, klikni na zelené tlačítko Code a dole na Download ZIP. Stáhne se dek-main.zip.',
                },
                {
                  title: 'Rozbalit a najít složku mcp-dek',
                  body:
                    'Rozbal ho k sobě do Dokumentů — ne do sdílené knihovny. Uvnitř je složka mcp-dek, a v ní soubor server.js. To je celý ten server.',
                },
                {
                  title: 'Zkopírovat si cestu k té složce',
                  body:
                    'Na Macu na ni klikni pravým tlačítkem, podrž Alt a vyber „Kopírovat jako název cesty". Na Windows Shift + pravé tlačítko a „Kopírovat jako cestu".',
                },
                {
                  title: 'Spustit tři příkazy',
                  body: 'V terminálu, s tou zkopírovanou cestou místo té naší.',
                  code: `cd /zkopírovaná/cesta/mcp-dek
npm install
node server.js --build-index

claude mcp add --scope user dek -- node /zkopírovaná/cesta/mcp-dek/server.js`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Dvě pomlčky před node tam patří',
      text:
        'Oddělují v příkazu claude mcp add nastavení Clauda od příkazu, který se má spustit — bez nich skončí hláškou, které nebudeš rozumět. Cestu k server.js piš vždy celou, ne relativní.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Ověř /mcp, než se začneš ptát',
      text:
        'Napiš v Claude Code /mcp — u serveru dek musí svítit Connected. Dokud nesvítí, Claude odpovídá z hlavy a tváří se stejně jistě, což je nejhorší stav. Failed to connect skoro vždy znamená špatnou cestu k server.js nebo neproběhlé npm install.',
    },
    {
      kind: 'table',
      head: ['Když to nejede', 'Co s tím'],
      rows: [
        ['claude: command not found', 'nemáš Claude Code v terminálu. Lekce Projekt v Claude Code.'],
        ['node: command not found', 'chybí Node. Nainstaluj ho z nodejs.org, verze 18 a výš.'],
        ['Failed to connect', 'zkontroluj cestu k server.js a jestli proběhlo npm install'],
        ['Hledání nic nenajde', 'napiš „jaký je stav rejstříku" — server na to má nástroj a umí ho postavit znovu'],
        ['Stažení rejstříku skončí chybou', 'firemní síť blokuje dek.cz. Zkus to z jiné sítě.'],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Rejstřík se obnovuje sám',
      text:
        'Leží v ~/.cache/mcp-dek/index.json a platí týden. Když se katalog dřív výrazně změní, řekni Claudovi, ať ho obnoví — nástroj stav_rejstriku to umí, bez terminálu.',
    },
    { kind: 'h', text: 'Sdílet ho s kolegy' },
    {
      kind: 'p',
      text:
        'Pro celé oddělení patří server do projektu, ne do osobního nastavení. Soubor .mcp.json leží v kořeni projektové složky a nese se s ní — kdo si ji otevře, dostane při prvním spuštění dotaz, jestli serveru věří.',
    },
    {
      kind: 'code',
      text: `.mcp.json

{
  "mcpServers": {
    "dek": {
      "type": "stdio",
      "command": "node",
      "args": ["/plná/cesta/k/mcp-dek/server.js"]
    }
  }
}`,
      caption: 'Pro hotový server s adresou je to místo command a args jen "type": "http" a "url". Token do souboru nikdy nepiš natvrdo — použij ${PROMENNA}.',
    },
    {
      kind: 'code',
      text: `# hotový server s adresou, jednou pro všechny tvoje projekty
claude mcp add --transport http --scope user dek <adresa serveru>

# přehled a odebrání
claude mcp list
claude mcp remove dek`,
      caption: 'Když se server přihlašuje, přidej po prvním spuštění claude mcp login dek.',
    },
    { kind: 'h', text: 'Zkouška na pět minut' },
    {
      kind: 'p',
      text:
        'Než na tom něco postavíš, projdi tyhle čtyři dotazy — je to přejímka. U každého víš dopředu, jak má odpověď vypadat, takže hned poznáš, jestli si server sáhl do katalogu, nebo si vymýšlí.',
    },
    {
      kind: 'checklist',
      title: 'Čtyři dotazy a co u nich sleduješ',
      items: [
        'Zeptej se na produkt, který znáš zpaměti. Sedí název, značka i zařazení?',
        'Zeptej se na kód, který jsme loni vyřadili. Má odpovědět, že ho nenašel — ne si ho domyslet.',
        'Zeptej se, co vedeme v jedné konkrétní kategorii. Je výpis úplný, nebo končí po deseti položkách?',
        'Zeptej se na návod nebo příručku. Přišel s odkazem na zdroj, který se dá otevřít?',
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Nejdůležitější je ten druhý dotaz',
      text:
        'Vyřazený kód je zkouška poctivosti. Server, který místo „nenašel jsem" vrátí něco podobného, se nedá použít na kontrolu seznamů — a to je ta práce, kvůli které by ho člověk chtěl nejvíc. Zkus to na třech kódech, ne na jednom.',
    },
    { kind: 'h', text: 'Na co se ho ptát' },
    {
      kind: 'table',
      head: ['Kdo', 'Dotaz, který se klikáním dělá špatně'],
      rows: [
        ['Logistika', 'Projdi tenhle seznam kódů ze skladové inventury a řekni, které už v katalogu nejsou.'],
        ['Obchod', 'Zákazník chce hydroizolaci na plochou střechu. Co mu můžu nabídnout a čím se to liší?'],
        ['Marketing', 'Vezmi kategorii technických izolací a udělej z ní tabulku: název, značka, cena.'],
        ['BI', 'K těmhle kódům z exportu doplň názvy a zařazení do kategorií.'],
        ['Kdokoli', 'Najdi návod na tenhle postup a shrň mi ho do pěti bodů i s odkazem.'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Sílu to dostane až ve spojení s tvojí složkou',
      text:
        'Katalog sám o sobě je hezký, ale sílu dostane až propojený s tvými daty: „vezmi exportovaný soubor z vystup/, ke každé položce dohledej v katalogu aktuální název a zařazení a rozdíly zapiš do nového sloupce". Tohle je ten okamžik, kdy MCP přestane být hračka.',
    },
    { kind: 'h', text: 'Co nezvládne' },
    {
      kind: 'list',
      items: [
        'Zákaznické a pobočkové ceny. Vrací veřejnou cenu bez přihlášení — do nabídky ji nedávej.',
        'Skladové zásoby po pobočkách. Zná jen obecnou dostupnost z webu.',
        'Technické listy a podrobné parametry. Ve veřejném obsahu nejsou.',
        'Objednávky, doklady a cokoli za přihlášením. Je to nástroj nad katalogem, ne nad systémy.',
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Cenu z katalogu nikdy nekopíruj do nabídky',
      text:
        'Je to veřejná cena bez přihlášení, jiná než ta zákaznická. Na orientaci je dobrá, do dokumentu, který někomu pošleš, nepatří. Napiš si to rovnou do CLAUDE.md, ať to nemusíš hlídat hlavou.',
    },
    {
      kind: 'task',
      title: 'Cvičení: přejímka a jeden reálný dotaz',
      intro: 'Patnáct minut, žádná příprava.',
      items: [
        'Připoj server a ověř /mcp, že svítí Connected.',
        'Projdi všechny čtyři dotazy z přejímky a poznamenej si, co nesedělo.',
        'Vezmi jeden skutečný seznam kódů ze své agendy a nech ho zkontrolovat proti katalogu.',
        'Napiš jednou větou, co by ti to ušetřilo za měsíc — a jestli to stojí za to.',
      ],
      hint: 'Když u přejímky něco nesedí, není to tvoje chyba a nemá cenu to obcházet promptem. Řekni to tomu, kdo server provozuje.',
    },
  ],
}

const L2_DESIGN: Lesson = {
  slug: 'dek-design-system',
  module: 'vic',
  title: 'Design system DEK ve Storybooku',
  summary:
    'Stavebnice barev, písem a komponent, ze které jde složit cokoli, co má vypadat jako dek.cz. Kde bydlí, jak vznikla, jak do ní přidat vlastní kompozici a jak ji předat Claude Designu.',
  minutes: 15,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'vysvětlit, co je design system a co je Storybook',
    'otevřít Storybook DEKu a najít v něm komponentu i celou stránku',
    'spustit si ho na svém počítači a přidat kompozici z hotových komponent',
    'napojit design system do Claude Design, aby návrhy vznikaly rovnou ve stylu DEKu',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Otevři Storybook DEKu a napiš Claude Designu: „Leták na jarní výprodej zahradní techniky." Vznikne rovnou ve stylu DEKu — protože design system, ze kterého Claude Design čerpá, existuje. Bez něj by se pokaždé kopírovala stará verze a přebarvovala, dokud to nevypadá „nějak jako DEK". Tahle lekce ukazuje design system DEKu, který vznikl stejně jako všechno ostatní v kurzu — člověk řekl co, Claude Code to postavil.',
    },
    {
      kind: 'table',
      head: ['Vrstva', 'Co to je', 'Příklad z DEKu'],
      rows: [
        ['Tokeny', 'holé hodnoty: barvy, písma, odsazení, zaoblení', 'červená #e2001a · písmo Roboto · zaoblení 4 px'],
        ['Téma', 'pravidla, jak se tokeny používají', 'tlačítko má červené pozadí a při najetí ztmavne'],
        ['Komponenty', 'hotové dílky k opakovanému použití', 'tlačítko, karta produktu, cenovka, hlavička, patička'],
        ['Stránky', 'kompozice — dílky poskládané do celku', 'úvodní stránka, výpis kategorie, detail produktu'],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'K čemu to je, když web už existuje',
      text:
        'Web existuje, ale jeho vzhled žije jen v něm — kdo chce interní nástroj, prezentaci nebo novou stránku ve stylu DEKu, začíná od nuly. Design system ten vzhled vytahuje ven jako stavebnici, a změna na jednom místě (jiná červená, jiné písmo) se propíše do všech dílků najednou.',
    },
    { kind: 'h', text: 'Kde bydlí a jak se na něj podívat' },
    {
      kind: 'p',
      text:
        'Design system je repozitář na GitHubu, prohlíží se přes Storybook a nasazená verze je na webu — nemusíš nic instalovat. V levém sloupci jsou komponenty, každá s pojmenovanými ukázkami (stories) a záložkou Docs. Sekce Pages DEK jsou celé stránky poskládané z těch komponent, se skutečnými produkty, cenami a fotkami z webu.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nic z toho není odhad',
      text:
        'Každá barva a rozměr má v kódu poznámku, ze které třídy skutečného CSS webu pochází. V sekci Reference je vedle sebe originální kousek webu a tatáž věc postavená z design systemu — hned je vidět, kdyby se stavebnice od webu rozjela.',
    },
    { kind: 'h', text: 'Jak vznikl' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Stáhnout produkční CSS z www.dek.cz',
          body: 'Jeden soubor s celým vzhledem webu. Leží v repozitáři ve složce vendor, aby šlo kdykoli ověřit, z čeho se vycházelo.',
        },
        {
          title: 'Vytáhnout z něj tokeny',
          body: 'Web má barvy pojmenované jako proměnné (--brand-primary, --gray-lightest…), přepsané do souboru tokenů se stejnými jmény.',
        },
        {
          title: 'Postavit z tokenů téma',
          body: 'Téma říká komponentám z knihovny MUI, jak mají vypadat: červené tlačítko, které při najetí ztmavne přesně jako na webu, stejná písma, stejné zaoblení.',
        },
        {
          title: 'Poskládat komponenty a srovnat s originálem',
          body: 'Karta produktu, cenovka, štítek dostupnosti, hlavička s vyhledáváním… ke každé vzniklo referenční srovnání s originálem z webu.',
        },
        {
          title: 'Složit z komponent celé stránky',
          body: 'Sekce Pages DEK — stejné pořadí bloků jako skutečný web, s reálným obsahem: fotky a loga jdou přímo z fotobanky webu, takže zůstávají aktuální.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Celé to psal Claude Code',
      text:
        'Lidská práce byla říct, kde je CSS, kontrolovat referenční srovnání a vracet, co nesedí. Stejným postupem se dá vytáhnout design system z libovolného webu — třeba z toho vašeho divizního.',
    },
    { kind: 'h', text: 'Spusť si ho u sebe' },
    {
      kind: 'p',
      text:
        'Nasazená verze stačí na prohlížení, na přidávání ho potřebuješ u sebe. Platí totéž co u MCP serveru: Node (node --version musí něco vypsat) a složka mimo nasyncovanou knihovnu, protože instalace vyrobí tisíce drobných souborů, které do OneDrivu nepatří.',
    },
    {
      kind: 'tabs',
      items: [
        {
          label: 'Nech to na Claudovi',
          blocks: [
            {
              kind: 'code',
              text: `Stáhni mi repozitář https://github.com/cajpij/dek-design-system
do Dokumentů, nainstaluj závislosti a spusť Storybook.`,
              caption: 'Claude Code to udělá sám a na konci ti řekne adresu, na které Storybook běží.',
            },
          ],
        },
        {
          label: 'Radši sám v terminálu',
          blocks: [
            {
              kind: 'code',
              text: `git clone https://github.com/cajpij/dek-design-system.git
cd dek-design-system
npm install
npm run storybook`,
              caption: 'Poslední příkaz otevře Storybook v prohlížeči na adrese localhost:6006.',
            },
          ],
        },
      ],
    },
    { kind: 'h', text: 'Přidej si vlastní kompozici' },
    {
      kind: 'p',
      text:
        'Kompozice je nová story, která skládá hotové komponenty do vlastního celku — třeba banner a pod ním mřížka produktových karet. Je to jeden malý soubor; Storybook si ho všimne sám a hned ukáže v levém sloupci.',
    },
    {
      kind: 'code',
      text: `// src/pages/AkcniNabidka.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HeroBanner } from '../components/HeroBanner/HeroBanner'
import { ProductCard } from '../components/ProductCard/ProductCard'
import { FEATURED, MAIN_BANNER } from './data'

const meta = { title: 'Pages DEK/Akční nabídka', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

export const AkcniNabidka: StoryObj = {
  render: () => (
    <>
      <HeroBanner title={MAIN_BANNER.alt} imageUrl={MAIN_BANNER.img} imageOnly />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, padding: 16 }}>
        {FEATURED.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>
    </>
  ),
}`,
      caption: 'Celá kompozice. Banner i produkty se berou z připravených dat, vzhled řeší komponenty.',
    },
    {
      kind: 'p',
      text:
        'Nemusíš to ale psát sám — otevři složku dek-design-system v Claude Code a řekni: „Přidej do Pages DEK story Akční nabídka — banner Mega akce a pod ním mřížka pěti produktů z FEATURED.“ Kód komponent už zná, tak se trefí do stejného stylu.',
    },
    { kind: 'h', text: 'A teď Claude Design' },
    {
      kind: 'p',
      text:
        'Storybook je pravda o tom, co existuje. Claude Design je skicák na claude.com, kde návrhy vznikají povídáním — řekneš, co potřebuješ, Claude nakreslí návrh a ty ho upravíš přímo na plátně: komentářem u prvku, přepsáním textu, posuvníkem nebo tažením. Je součástí Pro, Max, Team i Enterprise (tam ho zapíná správce).',
    },
    {
      kind: 'p',
      text:
        'Podstatné pro nás: umí si načíst design system, z GitHub repozitáře, kódu nebo design souborů. Když mu při zakládání ukážeš dek-design-system, každý návrh staví z barev, písem a komponent DEKu a sám si ho proti nim kontroluje — nic už nezačíná od bílého plátna a „nějaké červené“.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Ukaž mu stavebnici',
          body: 'Při zakládání dej Claude Designu adresu github.com/cajpij/dek-design-system. Načte si tokeny, téma i komponenty.',
        },
        {
          title: 'Zadávej návrhy větou',
          body: '„Leták na jarní výprodej zahradní techniky.“ „Banner pro kategorii hydroizolace.“ Vznikají rovnou ve stylu DEKu.',
        },
        {
          title: 'Uprav přímo na plátně',
          body: 'Komentář k prvku, přepsání textu, posunutí, posuvníky na barvu a odsazení. Bez grafického editoru.',
        },
        {
          title: 'Výsledek exportuj, nebo vrať do stavebnice',
          body: 'Export do PDF, PowerPointu nebo HTML. Když z návrhu má být trvalý dílek, předej ho Claude Code — udělá z něj novou story a stavebnice se rozroste.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Claude Design se rychle mění',
      text:
        'Je to čerstvá věc v režimu náhledu, obrazovky a tlačítka se můžou příští měsíc lišit. Princip ale platí: design system je zdroj pravdy, skicuje se nad ním, a co se osvědčí, vrací se do Storybooku.',
    },
    {
      kind: 'links',
      title: 'Kam se vracet',
      items: [
        {
          label: 'Storybook DEK — nasazená verze',
          href: 'https://cajpij.github.io/dek-design-system/',
          note: 'komponenty, reference i celé stránky, bez instalace',
        },
        {
          label: 'Repozitář dek-design-system',
          href: 'https://github.com/cajpij/dek-design-system',
          note: 'tokeny, téma, komponenty a původní CSS webu',
        },
        {
          label: 'Claude Design',
          href: 'https://claude.com/product/design',
          note: 'skicák — tady se zakládá tým a napojuje design system',
        },
        {
          label: 'Storybook — dokumentace',
          href: 'https://storybook.js.org/docs',
          note: 'až budeš chtít se stories víc než jen kompozice',
        },
      ],
    },
  ],
}

const L2_FORMULAR: Lesson = {
  slug: 'formular-misto-emailu',
  module: 'vic',
  title: 'Formulář místo pinkání e-mailů',
  summary:
    'Když vám data mají poslat kolegové: jak zrušit e-mail jako přenosový formát, kdo co schvaluje a jak hlídat termíny.',
  minutes: 12,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'poznat, kdy je e-mail ten problém, a ne to, co se v něm posílá',
    'rozdělit takový proces na sběr, schválení, zápis a hlídání',
    'vědět, co v tom udělá Claude a co musí udělat systém, ve kterém data žijí',
    'napsat si k tomu kontrolní přehled, ze kterého je vidět, kdo neodpověděl',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Pošlete kolegům soubor, oni odpoví mailem — někdo tabulkou, někdo obrázkem obrazovky. Vy odpovědi ručně přepíšete zpátky, zkontrolujete, že se nic neposunulo, a kdo neodpověděl, toho obvoláte. Tenhle tvar má v DEKu víc agend, než by člověk čekal: kontrola faktur ho má u schválení k platbě, sklad logistiky u poboček, které hlásí termín vývozu.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Automatizovat přepisování je ta horší cesta',
      text:
        'První nápad bývá „ať mi Claude ty maily přečte a přepíše je do tabulky" — jde to a je to lepší než nic, ale pořád stavíte na tom, že data cestují mailem. Takže dál řešíte přílohy, obrázky obrazovky, překlepy a to, kdo ještě neodpověděl. Levnější je e-mail z té cesty rovnou vyndat.',
    },
    { kind: 'h', text: 'Rozdělte si to na čtyři části' },
    {
      kind: 'table',
      head: ['Část', 'Kdo to dělá', 'Proč zrovna tak'],
      rows: [
        [
          'Sběr',
          'formulář nebo sdílený seznam, kam kolega zapíše přímo',
          'data od začátku vznikají ve strojově čitelném tvaru a je vidět, kdo ještě nic nevyplnil',
        ],
        [
          'Schválení',
          'člověk — vy',
          'zůstává rozhodnutí, ne přepisování. Schvalujete tvrzení, ne formátování.',
        ],
        [
          'Zápis do kontrolní tabulky',
          'Claude',
          'ze schválených řádků udělá zápis včetně poznámek a data, a rovnou napíše, co nesedělo',
        ],
        [
          'Hlídání termínů',
          'Claude, naplánovaně',
          'jednou týdně projde, komu termín utekl, a buď pošle upomínku, nebo to dá do přehledu',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Na sběr nepotřebujete nic nového kupovat',
      text:
        'Máte Microsoft 365 — formulář nebo seznam na SharePointu je přesně na tohle: vyplní ho kdokoli, výsledek je tabulka a vidíte, kdo chybí. Claude ji přečte jako každý jiný soubor v nasyncované knihovně. Vlastní aplikaci kvůli tomu nestavte, udržoval by ji jeden člověk a spadla by s ním.',
    },
    { kind: 'h', text: 'Co z toho zvládne Claude a co ne' },
    {
      kind: 'table',
      head: ['Zvládne', 'Nezvládne'],
      rows: [
        ['přečíst odpovědi a srovnat je s tím, co jste rozeslali', 'donutit pobočku, aby vyplnila formulář'],
        ['zapsat schválené řádky do kontrolní tabulky', 'rozhodnout za vás, co schválit'],
        ['vypsat, komu termín utekl, a připravit upomínku', 'spárovat položky, které nemají společný klíč'],
        ['spočítat, kolik řádků přišlo, kolik prošlo a kolik nesedělo', 'nahradit systém, ve kterém data doopravdy žijí'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Ruční párování přiznejte hned',
      text:
        'Když se položky nedají spojit s agendou automaticky, zůstane to ruční — a je to v pořádku, automatizace kolem toho pořád ušetří většinu času. Horší je předstírat, že se spáruje samo, a pak řešit tiché chyby v datech.',
    },
    { kind: 'h', text: 'Zadání, kterým to začíná' },
    {
      kind: 'code',
      text: `Vezmi v data/ nejnovější export odpovědí z formuláře a porovnej ho
se seznamem, který jsem rozeslal. Připrav mi do vystup/ dva soubory:
schvaleni-<RRRR-MM-DD>.xlsx s řádky, které mám odsouhlasit,
a chybi-<RRRR-MM-DD>.xlsx s tím, kdo ještě neodpověděl.
Na konec napiš, kolik řádků přišlo, kolik jich sedí na rozeslaný seznam
a u kolika je rozpor. Když nesedí počet sloupců, zastav se a napiš to.`,
      caption: 'Všimni si, že Claude tady nic neschvaluje ani neodesílá. Připravuje podklad k rozhodnutí.',
    },
    {
      kind: 'p',
      text:
        'Až tohle projde dvakrát bez doříkávání, zabalte to do skillu a teprve pak přidejte naplánovaný běh a upomínky — nejdřív ať to funguje, pak ať to běží samo.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Upomínky posílejte až úplně nakonec',
      text:
        'Odeslaná pošta se nevrací a upomínka na základě špatně přečtené tabulky stojí víc důvěry, než kolik ušetří času. Napište do zadání podmínku, kdy se nemá odeslat nic — třeba když v kontrole sedí míň než všechno.',
    },
    {
      kind: 'task',
      title: 'Cvičení: převeďte jeden svůj e-mailový kolotoč',
      intro:
        'Vyberte si proces, ve kterém čekáte na odpovědi od kolegů nebo poboček.',
      items: [
        'Napište si, co přesně od nich potřebujete — které sloupce, v jakém tvaru.',
        'Založte na to formulář nebo seznam v Microsoft 365 a pošlete ho místo souboru.',
        'Nad exportem odpovědí si nechte připravit oba podklady zadáním výš.',
        'Teprve když to podruhé projde, přidejte hlídání termínů.',
        'Změřte, kolik minut vám to sebralo dřív a kolik teď.',
      ],
      hint:
        'Když někdo formulářem odpovídat nechce, není to důvod to vzdát. Jeho odpovědi přepíšete ručně, zbytek poběží — a po měsíci uvidí, že jeho řádky jsou jediné, které pořád zlobí.',
    },
  ],
}

const L2_CVICNY: Lesson = {
  slug: 'cvicny-projekt-faktury',
  module: 'postav',
  title: 'Cvičný projekt: kontrola faktur ke stažení',
  summary:
    'Hotový projekt i s fakturami, skillem, zábranou a naplánovanou automatizací. Stáhneš, pustíš, porovnáš s referenčním výstupem — a pak přepneš na svoje faktury.',
  minutes: 20,
  kind: 'zadání',
  track: 'potom',
  outcomes: [
    'rozjet hotový projekt a ověřit si, že u tebe dává stejný výsledek',
    'popsat celou cestu faktury od e-mailu po zápis do evidence a žádost o doplnění',
    'přečíst kontrolní protokol a poznat z něj, co je k vyřízení',
    'nastavit naplánovanou automatizaci, která běží samostatně, včetně chování při vypnutém počítači',
    'poznat rozdíl mezi povolením složky v Coworku a v Claude Code',
    'napojit projekt na skutečnou schránku, aniž bys musel cokoli přepisovat',
    'vědět, proč žádost o doplnění jde automaticky a platba účtárně ne',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Projekt hlídá schránku s fakturami: novou PDF přílohu uloží, vytáhne z ní šest povinných údajů a zapíše je do evidence do sešitu podle dodavatele. Když jeden nebo dva údaje chybí, sepíše žádost o doplnění a sám ji dodavateli pošle — to je jediná automatická zpráva, kterou smí poslat; nic neschvaluje, nic neplatí a nic nezapisuje do účetnictví. Krok za krokem je to rozepsané v části „3. Co se stane, když to pustíš“. Ve složce jsou i vzorové faktury, takže si to můžete pustit hned.',
    },
    {
      kind: 'figure',
      name: 'rucne-vs-automat',
      caption:
        'Nejrychlejší způsob, jak pochopit, o čem tahle lekce je. Vlevo jak agenda vypadala, když ji Marie dělala ručně, vpravo co z ní převzala hotová automatizace. Nad řezem tři kroky, které dělá sama. Pod ním tři, které zatím dělá člověk — u dvou z nich je modře napsaný další schod, na který se dají posunout. Jen ten poslední, schválení a platba, se posouvat nebude, a to je rozhodnutí, ne nedodělek.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Proč zrovna faktury',
      text:
        'Faktury jsou dobrá agenda na cvičení, protože výsledek se dá jasně ověřit — buď to najde tu jednu schválně neúplnou fakturu, nebo ne. Kostru (složka s pravidly, skill, zábrana, kontrolní protokol, naplánovaný běh) jste v akademii viděli pořád stejnou — tohle je verze, kterou si stáhneš a rovnou spustíš.',
    },
    {
      kind: 'figure',
      name: 'prvni-beh',
      caption:
        'Pět míst, na kterých po prvním spuštění poznáš, že to proběhlo — a jedno, kde se schválně nic nestane.',
    },
    { kind: 'h', text: 'Zadání, ze kterého projekt vznikl' },
    {
      kind: 'p',
      text:
        'Než se pustíš do stahování, přečti si, čím to začalo. Nejdřív byla mapa procesu z účtárny, z ní sled kroků — rozkreslený je v části „3. Co se stane, když to pustíš" — a teprve pak tohle zadání. Podle něj Claude celou složku vyrobil: skill, zábranu, evidenci i naplánovanou automatizaci. Nic z toho jsem neskládal ručně. Tohle je ten soubor, slovo od slova — leží ve složce jako zadani.md, jen s obecnými adresami:',
    },
    {
      kind: 'code',
      text: `Postav mi v téhle složce kontrolu došlých faktur.

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
   v kopii vedouci-uctarny@dek.cz. Předmět: Doplnění faktury <číslo faktury>.
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
Předmět: Doplnění faktury <číslo faktury>

Dobrý den, <dodavatel>,

děkujeme za zaslanou fakturu. Při kontrole naším účetním oddělením jsme
nenalezli <chybějící údaj/e>, které potřebujeme mít na faktuře. Prosíme
o doplnění a opětovné zaslání faktury zpět.

S pozdravem,
Účtárna DEK
Jméno dodavatele v oslovení ber přesně tak, jak je na faktuře. Když chybí
dva údaje, vyjmenuj oba.

## Až to bude fungovat
Popiš postup a pravidla do CLAUDE.md, README.md, rutina.md a runbook.md,
ať se v tom vyzná i někdo, kdo u toho nebyl.`,
      caption: 'Zadání zůstává ve složce jako zadani.md. Když se agenda změní, mění se nejdřív ono a teprve podle něj soubory.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Čtyři věci, které z toho dělají zadání a ne přání',
      text:
        'Napsat „hlídej mi faktury a když něco chybí, napiš dodavateli" by nestačilo. Za prvé jsou tam jména souborů a sešitů, takže není co hádat. Za druhé je tam rozcestí s čísly — jeden nebo dva údaje se posílají, tři a víc ne — místo „posuď to sám". Za třetí je tam napsané, co se má stát, když se něco nepovede: prázdné pole zůstane prázdné a nedomýšlí se. A za čtvrté je tam odstavec „co nesmíš nikdy", protože tahle automatizace posílá poštu ven z firmy — a hranice se píše dopředu, ne až se něco stane.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Konektor je potřeba, jen aby žádost doopravdy odešla',
      text:
        'Základní běh — přečíst faktury ve vstup/, vytáhnout z nich údaje, zapsat je do evidence a navrhnout odpověď — nic nepřipojuje, Claude si to bere přímo z disku. Jakmile má chybějící údaj poslat dodavateli doopravdy, potřebuje konektor na Microsoft 365 se zapnutými write tools — bez něj text jen navrhne a do sloupce „Žádost odeslána" v evidenci zapíše „připraveno, čeká na konektor". Zapojení konektoru je popsané v rutina.md, včetně textu, který poslat správci.',
    },
    { kind: 'h', text: '1. Stáhni si to' },
    {
      kind: 'links',
      title: 'Cvičný projekt',
      items: [
        {
          label: 'faktury-kontrola.zip (239 kB)',
          href: 'faktury-kontrola.zip',
          note: 'stáhni, rozbal do vlastní složky — třeba do Dokumentů',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Nebo to nech na Claudovi',
      text:
        'Kdo už má Claude Code a nechce nic rozbalovat ručně, může mu říct: „Stáhni mi repozitář github.com/cajpij/dek do Dokumentů. Je v něm složka cviceni/faktury-kontrola — tu si zkopíruj samostatně a zbytek smaž.“ Výsledek je stejný, jen se u toho nekliká.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Rozbaluješ i skrytou složku .claude',
      text:
        'V archivu je složka .claude — jsou v ní skill a zábrana, tedy skript, který se sám spouští při každém zápisu souboru. Než to rozbalíš, koukni se do něj: hlídá jen vstup/ a povolí v ní jedinou věc — přibýt novou PDF fakturu; nic existujícího nepřepíše ani neupraví. Tohle je dobrý zvyk u čehokoli staženého, co se pak spouští samo.',
    },
    { kind: 'h', text: '2. Co v tom je' },
    {
      kind: 'code',
      text: `faktury-kontrola/
├── zadani.md                  ← text, ze kterého celá složka vznikla
├── CLAUDE.md                  ← pravidla a slovník, čtou se pokaždé
├── vstup/                     ← 5 vzorových faktur v PDF, sem se jen čte
├── data/objednavky.xlsx       ← evidence faktur, sešit pro každého dodavatele, poslední sloupec drží stav žádosti
├── vystup/                    ← referenční výstup: tabulka + protokol
├── .claude/skills/kontrola-faktur/SKILL.md
├── .claude/hooks/chran-vstup.sh
├── rutina.md                  ← co vyplnit v naplánované úloze a jaký konektor potřebuje
└── runbook.md                 ← co dělat, když to spadne`,
      caption: 'Pět částí, o kterých byla řeč v předchozích lekcích, pohromadě na jedné agendě.',
    },
    {
      kind: 'p',
      text:
        'Ve vzorových fakturách je schválně jedna neúplná — jinak by nebylo poznat, jestli kontrola vůbec něco dělá. Až si projekt pustíte, musí najít přesně tuhle jednu:',
    },
    {
      kind: 'table',
      head: ['Faktura', 'Kompletní', 'Co (ne)chybí', 'Žádost odeslána'],
      rows: [
        ['Stavebniny Morava', 'ano', '—', '—'],
        ['Nářadí Profi', 'ano', '—', '—'],
        ['Elektro Dvořák', 'ne', 'chybí číslo objednávky', 'připraveno, čeká na konektor'],
        ['VTS Technik', 'ano', '—', '—'],
        ['Barvy Piekarová', 'ano', '—', '—'],
      ],
    },
    { kind: 'h', text: '3. Co se stane, když to pustíš' },
    {
      kind: 'p',
      text:
        'Celý postup je napsaný v .claude/skills/kontrola-faktur/SKILL.md — Claude si ho přečte a jde podle něj bod po bodu. Poprvé to pouštíš nad tím, co je ve složce, bez jakéhokoli připojení; tady je, co se přitom stane.',
    },
    {
      kind: 'figure',
      name: 'kontrola-flow',
      caption:
        'Čtyři kroky za sebou a pak rozcestí, na kterém se rozhoduje všechno podstatné: počet chybějících údajů určuje, jestli se dodavateli píše, nebo jestli to jde na člověka.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Projde PDF ve vstup/',
          body:
            'Pět vzorových faktur. Konektor připojený není, takže se nikam nekouká — bere PDF, která leží ve složce a ještě nemají řádek v evidenci. To na začátku platí o všech pěti, protože data/objednavky.xlsx je zatím prázdné: má jen hlavičky sloupců, aby bylo vidět, co se kam bude zapisovat.',
        },
        {
          title: 'Z každé faktury vytáhne šest údajů, jeden po druhém',
          body:
            'Číslo faktury, dodavatele, IČO, číslo objednávky, základ daně (částku bez DPH, ne částku s DPH) a splatnost. Co na faktuře není nebo se nedá přečíst, zůstane prázdné — nic se nedomýšlí a nic nedopočítává.',
        },
        {
          title: 'Zapíše je do evidence, do sešitu podle dodavatele',
          body:
            'Každý dodavatel má v data/objednavky.xlsx vlastní sešit, pojmenovaný přesně tak, jak je jeho jméno napsané na faktuře; když takový sešit není, skill ho založí. Přibude řádek s fakturou a sloupec Kompletní řekne, jestli se povedlo přečíst všech šest údajů.',
        },
        {
          title: 'Čtyři faktury jsou kompletní a tím pro ně končí',
          body:
            'Stavebniny Morava, Nářadí Profi, VTS Technik a Barvy Piekarová mají všech šest údajů. Žádný výstup, žádná zpráva — jsou zaevidované a čekají na člověka, který rozhodne o proplacení.',
        },
        {
          title: 'U Elektro Dvořák chybí číslo objednávky, takže vznikne výstup',
          body:
            'Založí se vystup/kontrola-<dnešní datum>.xlsx: sešit „Přehled" se stavem všech pěti faktur toho dne a za ním sešit „Elektro Dvořák" s tím, který údaj chybí, a rovnou s navrženým textem odpovědi. Chybí jeden údaj ze šesti, tedy pásmo, ve kterém se dodavateli píše.',
        },
        {
          title: 'E-mail se ale neodešle — nemá odkud',
          body:
            'Bez konektoru na Microsoft 365 Claude poštu odeslat nemůže a nehledá jinou cestu. Text nechá navržený a do sloupce E-mail odeslán i do sloupce Žádost odeslána v evidenci napíše „připraveno, čeká na konektor". Tohle není chyba běhu, je to jeho správný konec.',
        },
        {
          title: 'Napíše protokol',
          body:
            'vystup/protokol-<dnešní datum>.md: kolik faktur prošlo, kolik bylo kompletních, u které co chybělo a jestli se něco poslalo. Na tomhle jednom souboru poznáš výsledek, aniž bys otevřel jedinou fakturu.',
        },
        {
          title: 'Když to pustíš podruhé, neudělá nic',
          body:
            'Všech pět už má řádek v evidenci, takže není co zpracovat — a Claude to řekne. Je to nuda, a přesně tak to má vypadat: automatizace, která běží každých 15 minut, musí umět nedělat nic.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Co se změní, až to napojíš na schránku',
      text:
        'Kroky 2 až 7 zůstanou úplně stejné. Mění se jen začátek a konec: místo procházení vstup/ se automatizace podívá do schránky na e-maily s PDF přílohou, které ještě nejsou uložené, a novou fakturu si do vstup/ sama uloží pod jménem <datum>_<dodavatel>.pdf. A místo „připraveno, čeká na konektor" se navržený text doopravdy odešle — na adresu, ze které faktura přišla, v kopii vedouci-uctarny@dek.cz, s předmětem „Doplnění faktury <číslo faktury>". Čas odeslání se pak zapíše na tři místa: do sešitu dodavatele, do „Přehledu" a do sloupce Žádost odeslána v evidenci.',
    },
    {
      kind: 'p',
      text:
        'Text žádosti je ve skillu jako šablona — chodí tedy pokaždé stejný a opravuje se na jednom místě:',
    },
    {
      kind: 'code',
      text: `Předmět: Doplnění faktury <číslo faktury>

Dobrý den, <dodavatel>,

děkujeme za zaslanou fakturu. Při kontrole naším účetním oddělením jsme
nenalezli <chybějící údaj/e>, které potřebujeme mít na faktuře. Prosíme
o doplnění a opětovné zaslání faktury zpět.

S pozdravem,
Účtárna DEK`,
      caption:
        'Jméno dodavatele se bere přesně tak, jak je napsané na faktuře. Když chybí dva údaje, vyjmenují se oba — „IČO a číslo objednávky".',
    },
    { kind: 'h', text: '4. Otevři složku a pusť to' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Otevři projekt v aplikaci',
          body:
            'Záložka Code, prostředí nech na Local, Select folder, vyber rozbalenou složku faktury-kontrola. Zeptá se, jestli složce věříš — potvrď.',
        },
        {
          title: 'Napiš jednu větu',
          body:
            'Nic víc není potřeba — skill se jmenuje logicky, takže si ho Claude vybere sám i podle věty „zkontroluj mi ty nové faktury“.',
          code: 'Postupuj podle skillu kontrola-faktur.',
        },
        {
          title: 'Porovnej to s referenčním výstupem',
          body:
            'Ve vystup/ už jeden pár souborů je — výsledek, který má vyjít. Tvoje tabulka může mít jiné datum v názvu, ale musí najít tentýž jeden nález. Když ano, projekt funguje a můžeš mu začít věřit.',
        },
        {
          title: 'Vyzkoušej si zábranu',
          body:
            'Řekni Claudovi, ať do vstup/ zapíše obyčejný textový soubor — musí to odmítnout, o to se stará hook (nová PDF faktura smí přibýt, ale nic jiného a nic přepsat). Takhle poznáš, že opravdu běží, aniž bys musel čekat, až se něco pokazí.',
          code: 'Vytvoř soubor vstup/test.txt s textem ahoj.',
        },
      ],
    },
    { kind: 'h', text: '5. Co říká protokol' },
    {
      kind: 'code',
      text: `# Kontrolní protokol — 2026-09-08

Zkontrolováno faktur: 5
Kompletních: 4
Chybí údaj (žádost o doplnění): 1
K ruční kontrole: 0

## Nálezy
- 2026-09-03_elektro-dvorak.pdf: chybí číslo objednávky. Žádost o doplnění
  je navržená ve vystup/kontrola-2026-09-08.xlsx — bez připojeného
  konektoru se e-mail neodesílá doopravdy.`,
      caption: 'Čtyři čísla a jedna věta stačí na to, abys poznal výsledek, aniž bys otevřel jedinou fakturu — a přesně to je smysl protokolu.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Čemu protokol schválně neodpovídá',
      text:
        'Jestli se ta faktura má zaplatit. Kontrola připraví podklad, rozhoduje člověk. Nikdy nedávejte úloze právo fakturu schválit, poslat do účetnictví nebo zadat k platbě — ani když je všechno v pořádku. Chyba v takovém kroku se pozná pozdě a je drahá.',
    },
    { kind: 'h', text: '6. Naplánuj to, ať běží samo' },
    {
      kind: 'p',
      text:
        'Až vám to dvakrát vyjde ručně, udělejte z toho automatizaci: Code → Routines → New routine → Local. Cloudová varianta by nefungovala, nevidí složku na disku. Ať doopravdy odešle žádost o doplnění, potřebuje navíc konektor na Microsoft 365 se zapnutými write tools — bez nich poběží dál, jen bude text jen navrhovat (viz „Co napsat správci“ níž).',
    },
    {
      kind: 'table',
      head: ['Pole', 'Co vyplnit'],
      rows: [
        ['Name', 'kontrola-faktur'],
        ['Description', 'Sleduje schránku a doplňuje chybějící údaje na fakturách'],
        ['Model', 'Sonnet — na tuhle práci stačí a je nejúspornější'],
        ['Permission mode', 'Accept edits, jinak se běh zastaví na dotazu, na který nikdo neodpoví'],
        ['Folder', 'složka faktury-kontrola'],
        ['Schedule', 'Every 15 minutes, v pracovní dny 7:00–18:00'],
      ],
    },
    {
      kind: 'code',
      text: `Postupuj podle skillu kontrola-faktur.

Zkontroluj schránku fakturace@dek.cz na nové e-maily s PDF přílohou, které
ještě nejsou uložené ve vstup/. Když nic nového nepřišlo, nic nedělej a
nic neposílej.

Ke každé nové faktuře udělej celý postup ze skillu — uložení do vstup/,
vytažení šesti údajů, zápis do data/objednavky.xlsx do sešitu podle
dodavatele, a když něco chybí a je toho jeden nebo dva údaje, zapiš to do
vystup/kontrola-<dnešní datum>.xlsx i s navrženým textem a ten text pošli
dodavateli v kopii vedouci-uctarny@dek.cz. Čas odeslání zapiš do
kontrola-<dnešní datum>.xlsx i do sloupce „Žádost odeslána" v evidenci.

Když u některé faktury chybí tři a víc údajů, nebo se PDF nedá přečíst,
nic neposílej — zapiš to do protokolu k ruční kontrole.

Nikdy neposílej nic, co se týká platby, schválení nebo účetnictví.`,
      caption: 'Celé zadání automatizace. Poslední dvě věty jsou pojistky — bez nich je to hezký nápad, ne provoz.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Jak se to chová, když počítač spí',
      text:
        'Místní automatizace běží, jen když je počítač vzhůru a aplikace spuštěná. Když zrovna spí, ten běh se přeskočí a doženou se jen běhy bezprostředně předtím — ne celá zameškaná historie. Po nočním vypnutí se nespustí padesát běhů najednou, jen ten poslední.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Hned po uložení dej Run now',
      text:
        'První běh se bude na pár věcí ptát — u každého dotazu vyberte „always allow“, další běhy pak proběhnou bez ptaní. Jinak se automatizace zastaví na dotazu a bude čekat, až přijdete.',
    },
    { kind: 'h', text: '7. Povolení složky: dvakrát jinak' },
    {
      kind: 'p',
      text:
        'Při připojování složky vyskočí dialog a stojí za to ho číst — vypadá jinak v Coworku a jinak v Claude Code, a ten rozdíl není kosmetický.',
    },
    {
      kind: 'figure',
      name: 'folder-permission',
      caption:
        'Věta o cloudu vlevo je to jediné místo, kde se člověk dozví, že soubory z té složky odejdou z jeho počítače. Vpravo je dialog Claude Code a v něm řádek „Execution allowed by: .claude/settings.json“ — v té složce leží nastavení, které samo spouští příkaz. U tohohle projektu je to ta zábrana nad vstup/ a je to schválně. U složky, kterou dostaneš odjinud, je to důvod se do toho souboru podívat dřív, než klikneš na Trust workspace.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Co v tom settings.json je',
      text:
        'Přesně jeden hook: před každým zápisem se spustí skript .claude/hooks/chran-vstup.sh. Do vstup/ smí přibýt jen nová PDF faktura — nic existujícího se nesmí přepsat, přejmenovat ani upravit. Kvůli němu ten dialog ten soubor jmenuje — složka si nese kód, který se spustí sám. Tady je to zábrana, kterou v lekci rozebíráme. Jinde to být nemusí: složka stažená odjinud může spouštět cokoli, a tohle je jediná chvíle, kdy na to aplikace upozorní. Trust workspace znamená „přečetl jsem si, co v tom je“.',
    },
    { kind: 'h', text: '8. Co ta automatizace (ještě) nedělá' },
    {
      kind: 'p',
      text:
        'Tenhle cvičný projekt už doopravdy dělá víc, než jen tabulku a protokol: sleduje schránku, ukládá přílohy a dodavateli sám pošle žádost o doplnění. Přirozená další otázka je: proč rovnou neověřit v bance, co je zaplacené, a zbytek neposlat účtárně? Jde to, ale ne to samé rozhodnutí — tady je, kde je hranice a proč zrovna tam.',
    },
    {
      kind: 'figure',
      name: 'faktury-smycka',
      caption:
        'Šest kroků od pošty po proplacení. První čtyři už tenhle projekt umí sám — poslední dva schválně ne.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Proč žádost o doplnění jde automaticky, ale platba nepůjde',
      text:
        'Rozdíl není v tom, jestli e-mail „jde ven z firmy“ — obojí by šlo. Je v tom, co se stane, když se Claude spletě. Špatná žádost o doplnění je trapná, dá se omluvit a dodavatel to pozná sám — fakturu už přece poslal. Špatné „k proplacení“ se může doopravdy zaplatit, a to se nevrací. Proto zůstává krok „poslat účtárně, co je k proplacení“ na člověku, i kdyby technicky šel udělat stejně jako ten první.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Než začneš řešit banku',
      text:
        'Otázka „je to zaplacené“ se skoro nikdy nemusí ptát banky — většinou to ví účetní systém a dá se z něj vyexportovat seznam uhrazených faktur. Dej ten export do data/ a nech si Claudem porovnat, co v evidenci ještě nemá zaplaceno. API k bance (přístupy, certifikáty, souhlasy) řeš, až export nebude stačit.',
    },
    { kind: 'h', text: 'Co napsat správci' },
    {
      kind: 'p',
      text:
        'Write tools u konektoru Microsoft 365 nezapneš sám — tohle je text, který můžeš správci poslat, je v něm to, na co se ptá jako první:',
    },
    {
      kind: 'code',
      text: `Ahoj, potřeboval bych u konektoru Microsoft 365 pro Claude povolit
write tools (odesílání pošty) pro schránku fakturace@dek.cz.

K čemu to bude: automatická kontrola došlých faktur. Automatizace zkontroluje
šest povinných údajů a dodavateli automaticky pošle žádost o doplnění,
když jeden nebo dva chybí. Nic k platbě, schválení ani do účetnictví
se automaticky neposílá — to zůstává na nás.

Čtecí přístup už mám a funguje. Práva se dědí z účtu, takže Claude uvidí
přesně to, co já, nic navíc.

Kdyby write tools nešly zapnout, řekni mi to prosím — mám variantu, která
místo odeslání jen navrhne text a s tou vystačím.`,
      caption: 'Poslední věta je důležitá: dává správci možnost říct ne, aniž by tím projekt padl.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Pořadí, ve kterém to stavět',
      text:
        'Nejdřív běh nad tím, co už ve vstup/ je — funguje bez konektoru a je vidět, jestli extrakce a evidence sedí. Až ti to vychází, zapoj konektor a nech doopravdy odesílat žádosti o doplnění. Otázku úhrad a účtárny řeš samostatně, teprve když tohle běží bez překvapení aspoň týden.',
    },
    { kind: 'h', text: '9. Přepni to na svoje faktury' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Přesuň celou složku do nasyncované knihovny',
          body:
            'Projekt je obyčejná složka, uvnitř se nic měnit nemusí. V naplánované úloze jen přepiš pole Folder na nové umístění.',
        },
        {
          title: 'Vyprázdni vstup/ a data/',
          body:
            'Sešity v objednavky.xlsx si skill zakládá sám podle dodavatele — nic tam ručně nepřipravuješ. Vyprázdni vstup/ a nech do ní chodit opravdové faktury. Adresy jsou ve složce na třinácti místech v pěti souborech, takže je nehledej ručně: řekni Claudovi, ať v celé složce nahradí fakturace@dek.cz tvojí schránkou, vedouci-uctarny@dek.cz adresou pro kopii a podpis „Účtárna DEK" tvým jménem — a ať vypíše, co kde změnil.',
        },
        {
          title: 'Prvních deset faktur si projdi řádek po řádku',
          body:
            'Než tomu začnete věřit. Co Claude přečetl špatně, dopište do pravidel a pusťte to na dalších deseti — když je druhá dávka bez nálezu, můžete to nechat běžet.',
        },
        {
          title: 'Napište si vlastní runbook',
          body:
            'Ten v projektu je vzor. Přepište v něm, komu se má psát a co jsou u vás časté příčiny — to za vás nikdo neuhodne.',
        },
      ],
    },
    {
      kind: 'checklist',
      title: 'Hotovo, když',
      items: [
        'projekt u tebe našel tentýž jeden nález jako referenční výstup',
        'zápis textového souboru do vstup/ ti Claude odmítl',
        'automatizace je založená, proběhla přes Run now a všechna oprávnění jsou odsouhlasená',
        'víš, co se stane, když počítač zrovna spí',
        'víš, proč tvoje faktury nebudou v Coworku, ale v Claude Code',
      ],
    },
    {
      kind: 'task',
      title: 'Zadání: přepiš to na svoji agendu',
      intro:
        'Nemusí to být faktury. Cokoli, kde vám do složky chodí cizí dokumenty a někdo z nich vytahuje pár údajů.',
      items: [
        'Vezmi projekt a přejmenuj v něm agendu — dodací listy, potvrzení objednávek, protokoly z reklamací.',
        'Přepiš CLAUDE.md: jaké údaje se z těch dokumentů berou a proti čemu se kontrolují.',
        'Uprav skill, aby vypisoval sloupce, které potřebuješ ty.',
        'Pusť to na deseti skutečných dokumentech a projdi výsledek řádek po řádku.',
        'Teprve pak naplánuj běh.',
      ],
      hint:
        'Zábranu a protokol nechte tak, jak jsou — vyplatí se u každé agendy stejně, a zároveň jsou to první dvě věci, které lidi vynechají.',
    },
  ],
}

const L2_POSTAV: Lesson = {
  slug: 'postav-slozku-sam',
  module: 'postav',
  title: 'Postav si tu složku sám',
  summary:
    'Prázdná složka a šest souborů, jeden po druhém. Stažený vzor máš vedle — na porovnání na konci, ne na kopírování.',
  minutes: 45,
  kind: 'zadání',
  track: 'v sále',
  outcomes: [
    'dojít od prázdné složky k prvnímu běhu, aniž bys cokoli zkopíroval',
    'poznat, kdy věta patří do CLAUDE.md, kdy do skillu a kdy nikam',
    'porovnat svůj výsledek se vzorem a rozhodnout, které rozdíly vadí a které ne',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Předchozí lekci sis stáhl hotovou složku a pustil ji. To je jako přečíst si cizí zápisky — dává to smysl, dokud u toho sedíš. Tahle lekce je o tom postavit tutéž věc znovu, od prázdné složky. Ne proto, že by ten vzor byl špatný, ale proto, že příště ho mít nebudeš: budeš mít svoji agendu a prázdnou složku, a jediné, co se bude hodit, je vědět, v jakém pořadí to vzniká.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Vzor teď zavři',
      text:
        'Stažený projekt nech, kde je, ale nedívej se do něj. Kopírováním se tohle naučit nedá — a hlavně by ti utekla ta zajímavá část, totiž místa, kde tě Claude začne prosit o doříkání. Otevřeš ho až v kroku 6, na porovnání.',
    },
    {
      kind: 'figure',
      name: 'automation-ladder',
      caption:
        'Pořadí, ve kterém to budeš stavět. Každý schod je jeden soubor a každý dává smysl jen tehdy, když ten pod ním už stojí. Zadání se dá napsat bez čehokoli dalšího; skill nemá co zabalit, dokud postup jednou neproběhl; hook nemá co hlídat, dokud není co rozbít.',
    },
    {
      kind: 'h',
      text: '1. Prázdná složka a nic v ní',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Založ si složku',
          body:
            'Kdekoli na disku, jméno je jedno — třeba faktury-cviceni. Uvnitř udělej podsložky vstup/ a data/. Víc zatím ne: .claude/ ani CLAUDE.md neděláš ručně, ty vzniknou samy.',
        },
        {
          title: 'Dej do vstup/ nějaké faktury',
          body:
            'Stačí dvě tři PDF. Můžeš vzít ty ze staženého vzoru — data si půjčit smíš, jde o soubory, které postavíš kolem nich. Když žádné nemáš, řekni Claudovi, ať ti dvě vyrobí; na cvičení to stačí.',
        },
        {
          title: 'Otevři složku v Claude Code',
          body:
            'Záložka Code, prostředí Local, Select folder, potvrď důvěru. Ještě nic nezadávej — složka je zatím prázdná a Claude nemá podle čeho pracovat.',
        },
      ],
    },
    {
      kind: 'h',
      text: '2. Zadání — napiš ho svými slovy',
    },
    {
      kind: 'p',
      text:
        'První soubor je zadani.md a napíšeš ho ty, ne Claude. Je to jediné místo v celé složce, kde se rozhoduje, co má vzniknout — všechno ostatní z toho jen vyplyne. Nemusí být hezké. Musí odpovědět na šest věcí:',
    },
    {
      kind: 'table',
      head: ['Na co odpovědět', 'Co je špatná odpověď'],
      rows: [
        ['Co je na vstupu a kde to leží', '„faktury“ — čí, v jakém formátu, v jaké složce'],
        ['Co se z toho má vytáhnout', '„důležité údaje“ — vyjmenuj je, jeden po druhém'],
        ['Kam se to zapíše a pod jakým jménem', '„do tabulky“ — který soubor, který sešit, jaké sloupce'],
        ['Kdy se má něco poslat ven a kdy ne', '„když je to potřeba“ — musí to jít poznat počítáním'],
        ['Co dělat, když se to nepovede', 'nic — bez tohohle odstavce si Claude domyslí vlastní řešení'],
        ['Co se nesmí nikdy', 'nic — hranice se píše dopředu, ne až se něco stane'],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Rozcestí piš číslem, ne úsudkem',
      text:
        'Nejčastější chyba v zadání je věta „posuď sám, jestli to za to stojí“. Claude ji poslechne a pokaždé se rozhodne trochu jinak. Ve vzoru je proto napsané „chybí jeden nebo dva údaje — pošli; chybí tři a víc — nic neposílej a napiš to do protokolu“. Stejné rozcestí, ale dá se z něj zpětně poznat, proč běh dopadl, jak dopadl.',
    },
    {
      kind: 'h',
      text: '3. Nech to podle zadání postavit',
    },
    {
      kind: 'code',
      caption: 'Tohle je celý příkaz. Odkaz na soubor stačí, číst si ho nahlas nemusíš.',
      text: 'Postav mi v téhle složce to, co je popsané v zadani.md. Pravidla,\nkterá platí pořád, dej do CLAUDE.md. Postup zabal do skillu.\nNa konec napiš runbook.md pro někoho, kdo u toho nebyl.',
    },
    {
      kind: 'p',
      text:
        'A teď to nejdůležitější z celé lekce: bude se ptát. Na jména sloupců, na to, jestli se má sešit zakládat sám, na to, co se stane při druhém běhu. Každá taková otázka je díra v tvém zadání. Nepiš odpověď jen do chatu — dopiš ji do zadani.md a řekni „doplnil jsem to do zadání, pokračuj“. Po pěti takových kolech máš zadání, které by projelo napoprvé.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Otázky si zapisuj',
      text:
        'Nech si vedle otevřený prázdný soubor a piš do něj každou otázku, na kterou jsi musel odpovídat. Je to nejlevnější zpětná vazba na vlastní zadání, jakou dostaneš — a příště, u vlastní agendy, tenhle seznam projdeš dopředu a půlku otázek si ušetříš.',
    },
    {
      kind: 'h',
      text: '4. Projdi, co vzniklo',
    },
    {
      kind: 'p',
      text:
        'Otevři každý soubor a přečti ho. Ne proto, abys hledal chyby v Claudovi, ale proto, že tohle je ta složka, kterou budeš za měsíc předávat kolegovi. Co se v ní nedá přečíst, to nefunguje.',
    },
    {
      kind: 'table',
      head: ['Soubor', 'Co v něm musí být', 'Častá chyba'],
      rows: [
        [
          'CLAUDE.md',
          'slovník pojmů, kde leží data, a pravidla, která platí pořád',
          'je v něm postup krok za krokem — ten patří do skillu, ne sem',
        ],
        [
          '.claude/skills/…/SKILL.md',
          'popis v hlavičce, podle kterého Claude pozná, kdy skill použít, a postup po krocích',
          'description je jednoslovný, takže se skill nikdy sám nespustí',
        ],
        [
          '.claude/hooks/…',
          'jedna zábrana nad tím, co se nesmí přepsat ani smazat',
          'hook nikde nezmíněný v settings.json — leží tam a nespouští se',
        ],
        [
          'rutina.md',
          'co vyplnit ve formuláři, aby to šlo založit znovu bez hádání',
          'chybí — rozvrh pak bydlí jen v aplikaci a s přeinstalovaným počítačem je pryč',
        ],
        [
          'runbook.md',
          'co dělat, když to spadne, a komu to říct',
          'psaný pro tebe, ne pro náhradu — pozná se podle vět typu „jako obvykle“',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Zábranu si vyzkoušej, ne jen přečti',
      text:
        'Řekni Claudovi, ať smaže jednu fakturu ze vstup/. Když se to povede, hook nefunguje — a to je lepší zjistit teď než ve chvíli, kdy ve složce leží jediná kopie účetního dokladu. Ve vzoru tuhle zábranu dělá .claude/hooks/chran-vstup.sh a je zapnutá v .claude/settings.json.',
    },
    {
      kind: 'h',
      text: '5. Pusť to',
    },
    {
      kind: 'figure',
      name: 'prvni-beh',
      caption:
        'Co má po prvním běhu zůstat. Poslední řádek je ten, na kterém se to nejčastěji láme: odeslaná pošta zůstane prázdná, protože bez konektoru není kam poslat — a to je správný konec běhu, ne chyba.',
    },
    {
      kind: 'p',
      text:
        'Pusť to podruhé, hned za sebou. Nemá se stát nic: faktury už jsou zaevidované, takže není co zpracovat. Když se místo toho zapíšou podruhé, chybí v zadání věta o tom, podle čeho se pozná už zpracovaná faktura — a to je přesně ten druh díry, který se v ostrém provozu projeví až po týdnu.',
    },
    {
      kind: 'h',
      text: '6. Teď teprve otevři vzor',
    },
    {
      kind: 'p',
      text:
        'Otevři stažený projekt vedle svého a porovnej je soubor po souboru. Nečekej, že to bude stejné — nebude a nemá. Zajímavé jsou jen dva druhy rozdílů:',
    },
    {
      kind: 'table',
      head: ['Rozdíl', 'Vadí?'],
      rows: [
        ['Jiná jména sloupců, jiné pořadí kroků, jiný sloh', 'ne — je to tvoje složka'],
        ['Máš navíc něco, co vzor nemá', 'ne, pokud víš proč'],
        ['Vzor má odstavec „co se nesmí nikdy“ a ty ne', 'ano — dopiš ho'],
        ['Vzor má rozcestí s čísly a ty „posuď sám“', 'ano — přepiš to na počitatelné'],
        ['Vzor má runbook a ty ne', 'ano — bez něj to nejde předat'],
        ['Vzor má zábranu nad vstup/ a ty ne', 'ano — bez ní se nedá pustit bez dozoru'],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Když ti něco chybí, nedopisuj to ručně',
      text:
        'Dopiš to do zadani.md a nech to postavit znovu. Zvykni si na to hned tady: opravuje se popis, ne výsledek. Jinak se ti za měsíc rozejde složka s tím, co je o ní napsané, a nikdo nepozná, které z toho platí.',
    },
    {
      kind: 'checklist',
      title: 'Hotovo, když',
      items: [
        've složce je zadani.md, CLAUDE.md, skill, hook, rutina.md a runbook.md',
        'nic z toho jsi nezkopíroval ze vzoru',
        'druhý běh za sebou neudělal nic',
        'pokus o smazání faktury ze vstup/ se nepovedl',
        'runbook by stačil někomu, kdo u toho dneska nebyl',
      ],
    },
    {
      kind: 'task',
      title: 'Zadání: tentýž postup na vlastní agendě',
      intro:
        'Tohle sis postavil na fakturách, které nejsou tvoje. Teď totéž na něčem, co doopravdy děláš — a nemusí to být to nejbolestivější, ber krok, který se dá dokončit.',
      items: [
        'vyber si jeden krok ze své práce, kde se data přenášejí odjinud jinam',
        'napiš k němu zadani.md podle tabulky z kroku 2 — šest odpovědí',
        'nech podle něj postavit složku a zapisuj si otázky, na které ses musel doptat',
        'dopiš odpovědi do zadání a nech to postavit znovu',
        'pusť to dvakrát za sebou a přines na příště, co se stalo napodruhé',
      ],
      hint:
        'Když nevíš, který krok vzít: ten, který děláš každý týden, trvá pod hodinu a nikdo kromě tebe neví, jak se dělá. Tam je poměr užitku a rizika nejlepší.',
    },
  ],
}

const LESSON_PROC: Lesson = {
  slug: 'co-je-automatizace',
  module: 'start',
  title: 'Co je automatizace a co z ní budeš mít',
  summary:
    'Dva příklady na začátek. První ukazuje hotovou automatizaci, druhý krok před ní — jak se z rozhovoru s kolegou pozná, co se vlastně dá vzít. Bez klikání, jen abys věděl, kam to celé míří.',
  minutes: 12,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'říct vlastními slovy, co se v téhle akademii myslí automatizací',
    'poznat na svojí práci krok, který je pro ni kandidát',
    'vědět, proč se část procesu schválně neautomatizuje',
    'popsat, jak se z osmnáctiminutového rozhovoru dostaneš k zadání',
  ],
  body: [
    {
      kind: 'sekce',
      id: 'prvni-priklad',
      stitek: 'První příklad',
      titul: 'Kontrola faktur: co z automatizace bude',
      popis:
        'Hotová automatizace, na které stojí celý večer. Co dělal člověk před ní a co z toho dneska dělá počítač.',
    },
    {
      kind: 'p',
      text:
        'Než se něco nastaví, hodí se vědět, co z toho vlastně bude. Celý večer stojí na jednom příkladu: Marie z DEKu dostává do schránky faktury v PDF a musí z nich přepisovat údaje do tabulky. Nikdo ji o to neprosil, prostě to tak vzniklo. Takhle ta práce vypadala předtím a po tom, co se část převzala:',
    },
    {
      kind: 'figure',
      name: 'rucne-vs-automat',
      caption:
        'Vlevo pondělní ráno, jak ho Marie dělala. Vpravo totéž dneska. Nad řezem tři kroky, které dělá počítač sám; pod ním tři, které pořád dělá člověk. U dvou z nich je modře napsané, na co se dají posunout — a ten poslední, schválení a platba, se posouvat nebude. To není nedodělek, to je rozhodnutí.',
    },
    {
      kind: 'p',
      text:
        'Všimni si, co se nezměnilo: faktury pořád chodí mailem, pořád je někdo schvaluje a pořád je za výsledek zodpovědná Marie. Automatizace tu neznamená, že práce zmizí. Znamená, že přepisování mezi dvěma soubory dělá počítač a člověku zůstane to, kde se rozhoduje.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Podle čeho poznáš krok, který se dá vzít',
      text:
        'Děje se to opakovaně, dá se to popsat větami bez „to víš, jak to chodí“, a když se to udělá špatně, pozná se to dřív, než to někam odejde. Když jedna z těch tří věcí neplatí, nech ten krok zatím být — vrátíš se k němu, až budeš mít první hotovou automatizaci a budeš vědět, co obnáší.',
    },
    {
      kind: 'p',
      text:
        'Zbytek prvního kurzu je příprava: co která slova znamenají, za co se u Clauda platí a jak mu napojit složku, ve které ta práce žije. Stavět se začne až v druhém kurzu — nejdřív na hotovém vzoru ke stažení, pak tutéž složku postavíš znovu sám a nakonec ji uděláš nad vlastní agendou.',
    },
    {
      kind: 'p',
      text:
        'Jenže faktury jsou příklad procesu, který už někdo popsal. Tvůj takový nejspíš není — bude žít v hlavě kolegy, který ho dělá tři roky a nikdy ho nikomu nevysvětloval celý. Druhý příklad je právě o tom: jak se z takové hlavy dostane obrázek, ze kterého se dá psát zadání.',
    },
    {
      kind: 'sekce',
      id: 'druhy-priklad',
      stitek: 'Druhý příklad',
      titul: 'Akční regál: jak se pozná, co automatizovat',
      popis:
        'Faktury jsou příklad hotové automatizace. Tenhle je o kroku před ní — jak se vůbec zjistí, co se v cizí agendě dá vzít. Stavět ho nebudeme, je tu jako ukázka toho, co automatizaci předchází.',
    },
    {
      kind: 'p',
      text:
        'Akční regál je stojan na prodejně, do kterého se každých pár týdnů skládá zboží z akčního magazínu. Než v něm něco stojí, projde to rukama jedenácti produkťáků, čtyř divizí, tří datových zdrojů a jedné tabulky, kterou nikdo nevlastní celou. Nikdo ten proces nenavrhl — narostl. Takhle vypadal, když se poprvé nakreslil:',
    },
    {
      kind: 'figure',
      name: 'akcni-regal',
      caption:
        'Tři pruhy podle toho, kdo co dělá: produkťáci s marketingem, logistika, výstupy. Oranžově tři místa, kde se práce zadrhává; číslo u nich není pořadí stavby, ale pořadí bolesti. Zeleně jedno místo, které se automatizovat nemá.',
    },
    {
      kind: 'p',
      text:
        'Všimni si, že nejhorší místo není to největší. Číslo jedna je přepisování odpovědí z e-mailů zpátky do tabulky — pár minut práce, ale opakovaně, ručně a bez jakéhokoli užitku. V nahrávce to má vlastní jméno: „takový vysírací krok".',
    },
    {
      kind: 'table',
      head: ['Místo', 'Jak to chodí teď', 'Kam by se to dalo posunout'],
      rows: [
        [
          '1 — sběr odpovědí od produkťáků',
          'e-mail tam, e-mail zpět, vykopírovat, zkontrolovat, že se řádky neposunuly. Někdo místo tabulky pošle print screen, který se přeťukává ručně.',
          'zrušit e-mail jako přenos. Sdílený list nebo formulář, kam si produkťák výběr zapíše sám — data neopustí tabulku a je vidět, kdo ještě neodpověděl.',
        ],
        [
          '2 — rozpad na čtyři divizní Excely a rozeslání',
          'ručně se skládá list, kopíruje se přes „vložit jinak → hodnoty", pak jedenáct e-mailů.',
          'jeden zdroj na SharePointu, ze kterého se čtyři soubory vygenerují a rozešlou samy. Tenhle návrh zazněl přímo v nahrávce, dřív než ho navrhl kdokoli zvenčí.',
        ],
        [
          '3 — tři finální podklady',
          'Word a Excel pro marketing, Excel pro centrální sklad, Excel pro backoffice. Ručně, z téhož zdroje, třikrát.',
          'jeden schválený zdroj a tři šablony. Návrh min/max podle prodejů za posledních dvanáct měsíců se dá předpočítat, člověk ho jen potvrdí.',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Zelený rámeček je stejně důležitý jako ty oranžové',
      text:
        'Fyzické vzorování — jestli se tři kufry vejdou vedle sebe — se automatizovat nedá a nemá. Měrné jednotky v systému lžou (jednotkou je vrtačka, ne kufr), takže se to musí naskládat a vyfotit; ta fotka je pak důkaz proti datům. Když mapuješ cizí proces, hledej tohle stejně pečlivě jako místa k automatizaci. Bez toho zbyde plán, který se v praxi zasekne o něco, co nikdo nezmínil, protože to všem přišlo samozřejmé.',
    },
    { kind: 'h', text: 'Jak ten obrázek vznikl' },
    {
      kind: 'p',
      text:
        'Za tím diagramem není workshop ani analytik. Je za ním osmnáctiminutový rozhovor nahraný na telefon a čtyři kroky po něm. Celé to zabralo asi hodinu. Stojí za to si ty kroky projít, protože přesně tohle budeš dělat nad vlastní agendou — a bez toho nemáš co zadat.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Nahrát rozhovor, ne dělat si poznámky',
          body:
            'Osmnáct minut u stolu a dvě otázky: co s tím děláš a co tě na tom štve. Poznámky si nedělej — nestíháš psát a ptát se zároveň a ujedou ti právě ty věty, o které jde. Nahrávka taky odstraní tvůj vlastní filtr: nezapíšeš jen to, co ti přišlo důležité.',
        },
        {
          title: 'Přepsat nahrávku na text',
          body:
            'Claude zvuk nepřečte, potřebuje text. Přepis proto udělá jiný nástroj a Claudovi se pošle až výsledek. Tenhle vznikl Whisperem puštěným lokálně na počítači, takže nahrávka nikam neodešla — u rozhovoru o vnitřních procesech to není maličkost.',
        },
        {
          title: 'Nechat z přepisu udělat rozbor',
          body:
            'Přepis se dá Claudovi a řekne se, co z něj chceš: kroky po pořádku, kdo je dělá, kde data mění formu, kde se čeká na člověka a co se v nahrávce označilo za otravné. Tady vznikne ten dokument s označenými místy — druhá karta níž.',
        },
        {
          title: 'Nakreslit to',
          body:
            'Teprve z rozboru diagram. Pruhy podle lidí, ne podle systémů — nakreslené podle systémů z toho vyjdou hezké šipky a žádné předávání. Zajímavá jsou právě místa, kde práce přechází z jednoho člověka na druhého: tam se čeká a tam se přepisuje.',
        },
        {
          title: 'Napsat zadání na jedno místo, ne na celý proces',
          body:
            'Až z obrázku vzniká zadání — a jen pro jeden oranžový rámeček, ten nejlevnější. Jak takové zadání vypadá, je v lekci Postav si tu složku sám.',
        },
      ],
    },
    {
      kind: 'soubor',
      nazev: 'prepis-ukazka.txt',
      popis:
        'Prvních dvacet šest řádků strojového přepisu, jak vylezl. „Google Tabouka" místo tabulky, „produktiák" místo produkťáka — a nevadí to.',
      obsah: `[00:00] Takže od produktiáku dostanu data do Google Tabouky.
[00:06] Z Google Tabouky, vezmu část dena.
[00:10] A ještě si zapoměla jako říct, že ty do té tabouky,
[00:15] ty je nedostáváš jako, že jo, takže.
[00:18] Tam je zapisují produktiáce.
[00:19] Jo, takže do tabouky tam prostě nějaká tabouka, tam ti to zapíše jako produktiák.
[00:24] Ty jsou tom, jak dozvíš.
[00:28] Mám tam, oni to tam zapisují průběžně, takže jako nemám žádný termín.
[00:34] Je to přibližně šestý dnů před začátku magazínu.
[00:39] Magazín je co ještě?
[00:40] Normálně letáček, jaký líd leták, tak vlastně.
[00:44] Akorát co to mene magazín.
[00:46] Takže vlastně to takový akční leták.
[00:49] A oni tam dají jako co obsah toho letáčku?
[00:52] Oni tam dají obsah toho letáčku, co bych chtěli vlastně, co bych chtěli vlastně jako zpropagovat.
[01:02] Já vezmu ty produkt, který tam dali, a dám je do Excelu, na jeden list.
[01:10] A na ostatní listy já dám různý datas agendy.
[01:16] Jednosou, min maxi jednosou, centrální stát, kolik toho má skladem,
[01:22] a kolik toho je na centrální skladu. To jsou tři různých zdroje,
[01:26] které mi udělají takovou jako kontingenčku nebo dovyplnějí mi data k těm položkám konkrétu.
[01:36] A já potom vezmu tu tabulku Excelovskou a rozdělí mý poproduktiák,
[01:48] který dávají některé položky.
[01:52] Jak to vypadá to rozdělování?
[01:54] Udělám vlastně z toho jednoho velkého Excelu, čtyři další Excely.
[01:59] A to děláš růčně?
[02:01] Teď mi to dělá klot.

… (dál dalších 295 řádků, celkem 18 minut)`,
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Rozsekaná čeština není problém',
      text:
        'Přepis nemá být hezký, má být úplný. „Google Tabouku" si Claude z kontextu přeloží sám a v rozboru už je správně. Čas strávený ručním čištěním přepisu je vyhozený — leda by šlo o názvy systémů nebo divizí, u kterých se vyplatí do zadání připsat, jak se doopravdy jmenují.',
    },
    {
      kind: 'soubor',
      nazev: 'user-flow.md',
      popis:
        'Rozbor, který z toho přepisu vznikl: kontext v číslech, deset kroků, tři místa k automatizaci a jedno, které se automatizovat nemá. Podle tohohle souboru je nakreslený obrázek nahoře.',
      obsah: `# Akční regál — user flow (modelový příklad pro workshop)

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
- „Tady už by se to mohlo dělat automaticky." (06:42 — vlastní návrh u rozpadu Excelů)`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Diktování a přepis nahrávky nejsou totéž',
      text:
        'Diktování je jeden hlas do vstupního pole teď; přepis je dvouhlasý rozhovor ze záznamu. Na sběr rozhovoru diktování není. Kde v tomhle postupu pomůže, je krok hned po něm: přijdeš od kolegy a dvě minuty namluvíš, co ti ukázal. Řekneš při tom detaily, které bys do pole nenapsal — a Claude z toho nakreslí první verzi flow, kterou pak opravíš podle přepisu.',
    },
    { kind: 'h', text: 'Co z toho vezme naplánovaná automatizace' },
    {
      kind: 'p',
      text:
        'Obrázek nahoře ukazuje, kde to bolí. Tenhle ukazuje tentýž proces od začátku do konce s odpovědí, kdo který krok dělá potom. Podstatné je, že se to nerozpadne na jednu automatizaci, ale na tři — každá má svůj vlastní vstup, svůj výstup a jde postavit i pustit samostatně.',
    },
    {
      kind: 'figure',
      name: 'akcni-regal-po-rutine',
      caption:
        'Modře to, co přebírá automatizace, a svorky vlevo říkají která. Oranžově jediný ruční krok, který v procesu zůstane, protože bez něj nemá první automatizace odkud brát. Zeleně vzorování v regálu — to zůstává člověku schválně. Šedé kroky jsou beze změny: úsudek a schválení nikdo nepřebírá.',
    },
    {
      kind: 'table',
      head: ['Automatizace', 'Co dělá', 'Co k tomu potřebuje'],
      rows: [
        [
          'A — rozeslat',
          'Ráno se podívá, jestli ve složce přibyl nový složený list. Když ano, rozpadne ho na čtyři soubory podle divize a rozešle jedenáct e-mailů podle sekcí.',
          'složka na SharePointu a konektor na Microsoft 365 se zapnutými write tools — stavebně tatáž věc jako kontrola faktur',
        ],
        [
          'B — posbírat zpátky',
          'Čte odpovědi ze schránky a zapisuje výběr, prioritu a poznámku do hlavní tabulky. Print screen si přečte taky. Páruje podle kódu položky a hlídá, od koho nic nepřišlo.',
          'týž konektor, zábrana nad hlavní tabulkou a seznam jedenácti adres',
        ],
        [
          'C — vygenerovat',
          'Z jednoho schváleného zdroje vyrobí Word a tři Excely podle šablon. Min/max předpočítá z prodejů za dvanáct měsíců.',
          'tři šablony a jasné místo, kde je vidět, že už je schváleno',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Nejužitečnější není ta, kterou stavět první',
      text:
        'Nejvíc práce ušetří B, protože bere ten nejotravnější krok. Začít se ale má A: není v ní žádné rozcestí, výsledek je vidět hned (odešlo jedenáct e-mailů, nebo ne) a když se pokazí, nic se neztratí. B má víc situací, které mohou nastat — nečitelný print screen, kód, který nesedí — a chce zábranu. C běží nejmíň často a až po schválení, takže je poslední.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: '„Bez pevného termínu“ automatizaci nevadí',
      text:
        'V rozboru je napsané, že produkťáci zapisují průběžně a žádný termín není. Naplánovaná automatizace se s tím vyrovná tak, že běží často a většinou neudělá vůbec nic — přesně jako kontrola faktur ve dnech, kdy žádná nepřijde. Běh, po kterém nic nepřibylo, je správný konec, ne planý poplach.',
    },
  ],
}

export const COURSES: Course[] = [
  {
    slug: 'claude-a-firemni-data',
    title: 'Claude a firemní data',
    summary:
      'Napojit Claudovi složku, ve které pracuješ, a ohraničit, co v ní Claude smí. Končí projektem, do kterého se dá začít zadávat.',
    intro:
      'Kurz pro lidi, kteří každý týden přeskládávají tytéž tabulky a chtějí, aby se to dělalo samo. Nejdřív si ujasníš, co která slova znamenají a za co se u Clauda vlastně platí. Pak napojíš složku, ve které ta práce žije, ohraničíš si, co v ní Claude smí a nesmí, a založíš nad ní projekt s pravidly, která se nemusí opakovat každé ráno. Stavět se bude až ve druhém kurzu — tenhle končí ve chvíli, kdy je kam.',
    level: 'Začátečník',
    section: 'Začni tady',
    modules: [
      {
        key: 'start',
        title: 'Orientace',
        summary:
          'Jak večer poběží a na jednom příkladu, co se tím myslí automatizací — to si otevřeme společně. Zbytek jsou tři referenční lekce: co která slova znamenají, kolik to stojí a jak spolu souvisí Cowork a Claude Code.',
      },
      {
        key: 'napojeni',
        title: 'Nastavení: složka a projekt',
        summary:
          'Jediná část večera, kde se něco nastavuje. Děláme ji hned na začátku, aby se případný zádrhel našel teď a ne ve chvíli, kdy máš stavět.',
      },
    ],
    lessons: [
      LESSON_PROGRAM, LESSON_PROC, LESSON_SLOVNICEK, LESSON_TOKENY, LESSON_COWORK,
      LESSON_SHAREPOINT, LESSON_CO_VIDI, LESSON_PROJEKT,
    ],
    learn: [
      'říct vlastními slovy, co se tu myslí automatizací, a poznat pro ni kandidáta',
      'vysvětlit, za co se u Clauda platí, a vybrat model i effort podle úkolu',
      'zkrátit dlouhá sezení a zjistit, kam odtéká příděl',
      'vybrat si mezi chatem, Coworkem a Claude Code podle toho, kde leží data',
      'založit projekt tak, aby se pravidla nemusela opakovat každé ráno',
      'nasyncovat knihovnu ze SharePointu do počítače a otevřít ji v Claude Code',
    ],
    prerequisites: [
      'Nainstalovaný Claude Code',
      'Počítač s aplikací OneDrive přihlášenou firemním účtem',
      'Claude Code — desktopová aplikace, nebo příkaz claude v terminálu',
      'Přístup do knihovny na SharePointu, se kterou pracuješ',
    ],
  },
  {
    slug: 'od-mapy-k-automatu',
    title: 'Od vzoru k vlastní automatizaci',
    summary:
      'Od hotového vzoru přes vlastní stavbu až po vlastní agendu. Cílem je automatizace, která doběhne bez tebe a ty poznáš, jestli dopadla dobře.',
    intro:
      'Kurz jde ve čtyřech krocích a v tomhle pořadí: nejdřív se podíváš, z čeho se automatizace skládá, pak si stáhneš hotový cvičný projekt a pustíš ho, pak tutéž složku postavíš znovu sám od prázdné složky — a teprve potom hledáš, kde se to samé dá udělat ve tvojí práci. Poslední modul jsou tři směry, kterými se dá pokračovat, až to minimum funguje.',
    level: 'Navazující',
    section: 'Pokračuj',
    modules: [
      {
        key: 'postav',
        title: 'Postav to',
        summary:
          'Z čeho se automatizace skládá, hotový projekt ke stažení na vyzkoušení — a pak tatáž složka postavená znovu od prázdné složky, vlastníma rukama.',
      },
      {
        key: 'agenda',
        title: 'Na vlastní agendě',
        summary:
          'Postavit cizí příklad je jedna věc, najít ten svůj druhá. Rozhovor ve dvojici, kresba flow a společné sdílení — konec večera je mapa vlastní práce s označenými místy.',
      },
      {
        key: 'vic',
        title: 'Až budeš chtít víc',
        summary:
          'Tři směry, kterými se dá pokračovat, až minimum funguje. Nic z toho není potřeba k tomu, aby ti běžela vlastní automatizace.',
      },
    ],
    lessons: [
      LESSON_AUTOMATIZACE, L2_CVICNY, L2_POSTAV, L2_PLAN,
      LESSON_CVICENI, LESSON_FLOW, LESSON_SDILENI,
      L2_FORMULAR, L2_MCP, L2_DESIGN,
    ],
    learn: [
      'rozeznat pět schodů automatizace a vědět, který soubor je na kterém z nich',
      'rozjet hotový cvičný projekt a překlopit ho na vlastní dokumenty',
      'postavit tutéž složku od nuly podle vlastního zadání, bez kopírování',
      'poznat na svém zadání díry dřív, než se projeví v ostrém provozu',
      'napsat runbook a předat automatizaci tak, aby ji zvládl i někdo jiný',
      'číst pracovní proces jako tok dat mezi lidmi a soubory',
      'odlišit, co má převzít automatizace a co má zůstat člověku',
    ],
    prerequisites: [
      'Dokončený kurz Claude a firemní data',
      'Složka projektu otevřená v Claude Code, s CLAUDE.md z minulého kurzu',
    ],
  },
]

export const UPCOMING: Upcoming[] = []

/* ------------------------------------------------------------ pomocníci */

export function findCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug)
}

export function findLesson(course: Course, slug: string): Lesson | undefined {
  return course.lessons.find((l) => l.slug === slug)
}

export function courseMinutes(course: Course, track?: Lesson['track']): number {
  return course.lessons
    .filter((l) => (track ? l.track === track : true))
    .reduce((sum, l) => sum + l.minutes, 0)
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
