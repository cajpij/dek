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
        image?: { src: string; alt: string; caption?: string }
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
        | 'usage-report'
        | 'connector-setup'
        | 'folder-permission'
        | 'faktury-smycka'
        | 'kontrola-flow'
    | 'tri-prikazy'
    | 'faktury-sezeni'
      caption: string
    }
  /** Snímek cizí obrazovky. Kreslené schéma patří do 'figure', tohle je fotka. */
  | { kind: 'image'; src: string; alt: string; caption?: string }
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
        'Cíl: na konci máš vlastní automatizaci, která běží bez tebe, a víš, jak poznáš, že doběhla dobře. Počítej se třemi až čtyřmi hodinami rozloženými do několika dní a pracuj u každého kroku na vlastních datech, ne na cvičných.',
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
          '3. Najít, co automatizovat',
          'Od e-mailu k platbě, pak Cvičení 1, 1b a Sdílení map — všechna v sólo verzi',
          'mapu vlastního procesu s označenými místy ručního přenosu',
        ],
        [
          '4. Naučit se řemeslo',
          'Zadání práce nad tabulkou, Jak poznáš, že je výsledek špatně',
          'umíš napsat zadání, které projde napoprvé, a zkontrolovat výsledek',
        ],
        [
          '5. Postavit to',
          'Jak se v projektu nastaví automatizace, Postav si první automatizaci, Jak napsat skill',
          'skill nad vlastní agendou, který má vlastní kontrolu',
        ],
        [
          '6. Dotáhnout do provozu',
          'Rozbor skutečného skillu, Naplánovaná úloha, E-mail z automatu, Cvičný projekt, Pusť to naostro',
          'úlohu, která proběhla sama a poslala výsledek dál',
        ],
        [
          '7. Zkontrolovat se',
          'Máš to minimum?',
          'jistotu, že ti nic nechybí — a když chybí, víš kam se vrátit',
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
        {
          label: 'Máš to minimum? Kontrola na konci',
          href: '#academy/od-mapy-k-automatu/mas-to-minimum',
          note: 'Osm bodů, u každého věta, kterou si ho ověříš, a odkaz do lekce, kam se vrátit.',
        },
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
        ['16:50', 'Vzor: Od e-mailu k platbě. Projdeme spolu jeden reálný proces.'],
        ['17:10', 'Cvičení ve dvojicích — rozhovory o vlastní práci'],
        ['17:50', 'Kresba flow a označení míst k automatizaci'],
        ['18:05', 'Pauza'],
        ['18:15', 'Sdílení map — každá dvojice dvě minuty'],
        ['18:25', 'Zadání nad tabulkou a kontrola výsledku'],
        ['18:50', 'Pauza'],
        ['19:00', 'Postav si první automatizaci na vlastních datech'],
        ['19:45', 'Živá ukázka: naplánujeme běh na za pět minut a necháme ho proběhnout'],
        ['19:55', 'Doběhlo to samo. Domluva, co do příště.'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nejdůležitější jsou dva bloky',
      text:
        'Cvičení ve dvojicích a stavění první automatizace. Když z programu něco vypadne, tyhle dva a nastavení na začátku zůstanou — jsou to jediné části, ze kterých si odnesete něco vlastního.',
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
        'Úkol na týden je jediný: pustit svoji úlohu na skutečné práci a přinést zpátky, co se stalo. Je popsaný v lekci Pusť to naostro. I „nepustila jsem to a tady je proč“ je platná odpověď.',
    },
  ],
}

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
        ['Naplánovaná úloha (routine)', 'zadání, které se spustí samo v daný čas — v pondělí v šest, každou hodinu. Local běží na vašem počítači, Cloud na serveru.'],
        ['Kontrolní protokol', 'krátký soubor, který úloha zapíše na konec běhu: kolik čeho bylo na vstupu, kolik na výstupu, co nesedělo. Z něj poznáte, jestli to dopadlo, aniž byste otevírali výstupy.'],
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
        ['vystupy/', 'složka v projektu, kam jdou výsledky. Když se něco pokazí, smaže se a udělá znovu.'],
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
    'vybrat model a effort podle toho, co má úloha zač',
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
- vystupy/ — sem jdou výsledky

## Pravidla
- Do data/ nezapisuj. Výsledek ulož jako nový soubor do vystupy/.
- Čísla objednávek jsou text. Nepřevádět, nedoplňovat nuly.
- Když chybí sloupec, napiš to a zastav se. Nedopočítávej.

# ⬇ TOHLE UŽ NE — patří do skillu, ne sem
# ## Jak porovnat fakturu s objednávkou
# 1. Najdi v data/ nejnovější export…
# 2. Ověř sloupce Číslo objednávky, Základ daně…
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
            'Příkaz /usage ukáže vyčerpání přídělu a žebříček toho, co ho bere — podagenti, skilly, konektory, naplánované úlohy.',
          code: '/usage',
        },
        {
          title: 'Nech si udělat rozbor návyků',
          body: 'Příkaz /insights jednou za měsíc projde poslední sezení a napíše, co dělat jinak.',
          code: '/insights',
        },
      ],
    },
    {
      kind: 'figure',
      name: 'usage-report',
      caption:
        'Panel po /usage. Příděl má tři pruhy. Cache hit 99 % dole ukazuje, že skoro všechno bylo opakované čtení historie, ne nový vstup.',
    },
    {
      kind: 'checklist',
      title: 'Šest návyků, které stačí',
      items: [
        '/clear při přechodu na jinou úlohu — největší efekt ze všeho',
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
        'Nejčastější důvod, proč limit mizí rychle: jedno sezení otevřené celý den, ve kterém se vystřídalo pět nesouvisejících úloh. Každá další zpráva táhne s sebou všechny předchozí.',
    },
    {
      kind: 'figure',
      name: 'context-growth',
      caption:
        'Táž práce, tytéž otázky — vlevo jedno sezení celý den, vpravo tři sezení s /clear mezi úlohami.',
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
          note: 'Hotový projekt i s fakturami, skillem a naplánovanou úlohou — stáhneš a pustíš.',
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
        'U velkých úloh si nech nejdřív napsat plán (Shift+Tab, plan mode) — levnější než dvakrát dělat špatnou věc.',
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
      title: 'Naplánované úlohy nespí',
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
    'poznat úlohy, u kterých se Cowork hodí víc než Claude Code',
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
        'Dlouhá úloha, u které nechcete sedět a nevadí, že poběží ve vlastním prostředí.',
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
    { kind: 'h', text: 'Založení nech na Claudovi' },
    {
      kind: 'p',
      text: 'První věta v novém projektu je zadání, ne klikání v Průzkumníku. Nejdřív ale otevři Clauda ve správné složce:',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Založ prázdnou složku agendy',
          body:
            'V Průzkumníku nebo Finderu, uvnitř nasyncované knihovny — třeba faktury-kontrola. Musí existovat dřív, než ji vybereš; Claude si ji sám nevytvoří, protože neví kam.',
        },
        {
          title: 'Otevři ji v aplikaci Claude',
          body:
            'Záložka Code, prostředí nech na Local (to znamená „na mém počítači, s mými soubory"), klikni na Select folder a vyber tu složku. Když se zeptá, jestli jí věříš, potvrď. Ve Windows musí být nainstalovaný Git, jinak se místní sezení nespustí — na Macu to řešit nemusíš.',
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
      ],
    },
    {
      kind: 'p',
      text: 'Teď jsi uvnitř. Vlep tohle:',
    },
    {
      kind: 'code',
      text: `Založ mi tady projekt faktury-kontrola: složky data a vystupy a soubor
CLAUDE.md. Do CLAUDE.md napiš slovník téhle agendy — na pojmy se mě
zeptej — kde jsou data, a pravidlo, že originály v data/ se nikdy
nepřepisují: všechno nové se ukládá do vystupy/.`,
      caption: 'Dvacet vteřin a struktura stojí. Zbytek lekce vysvětluje, co vzniklo a proč — až se něco pokazí, budeš to potřebovat vědět.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Projekt a nasyncovaná složka nestojí vedle sebe',
      text:
        'Projekt v Claude Code není nic zvláštního — je to prostě složka, kterou otevřeš. „Projekt v nasyncované knihovně“ tak znamená obyčejnou podsložku v ní. Claude přitom vidí jen otevřenou složku a to, co je pod ní.',
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
      caption: 'Tohle právě vzniklo. Nic z toho není povinné — a přesto se to vyplatí.',
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
    ├── vystupy/
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
          'Většinou výhoda — pravidla jsou týmová. Zároveň do nich nepiš nic osobního.',
        ],
        [
          'Všechno ve vystupy/ uvidí ostatní',
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
- faktura = PDF od dodavatele
- objednávka = řádek ve schváleném seznamu, na který se faktura odkazuje
- základ daně = částka bez DPH; kontroluje se právě ta, ne částka s DPH

## Kde jsou data
- data/ — faktury a seznam objednávek, vždy nejnovější podle data v názvu
- vystupy/ — sem ukládej všechno, co vytvoříš

## Pravidla
- Nikdy nepřepisuj soubory v data/. Výsledek ulož jako nový soubor do vystupy/.
- Názvy výstupů: kontrola-<RRRR-MM-DD>.xlsx
- Když chybí údaj, nech pole prázdné a napiš to — nedomýšlej si ho.`,
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
        'Nový rozhovor nezná ten předchozí — kromě CLAUDE.md a poznámek, které si Claude zapsal sám. Je to ochrana: dlouhé sezení s pěti různými úlohami dává horší výsledky než pět krátkých. Jedna úloha = jedno sezení, mezi nimi /clear.',
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
description: Projde faktury ve složce, vytáhne z nich povinné údaje
  a porovná je se seznamem schválených objednávek. Použij, když přibyly
  nové faktury nebo když se ptám, co je k vyřízení.
---

1. Najdi v data/ faktury, které ještě nemají řádek v poslední kontrole.
2. Z každé vytáhni číslo faktury, dodavatele, číslo objednávky a částku.
3. Porovnej se seznamem objednávek a ulož výsledek do vystupy/.
...`,
      caption: 'Řádek description rozhoduje, kdy se skill sám nabídne — piš do něj slova, která se běžně říkají v zadání. Celý skill je rozebraný v lekci Rozbor skutečného skillu.',
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
        ['soubor, který někomu pošleš mailem', 'obyčejný výstup do vystupy/'],
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
        'Takhle to vypadá u agendy, kterou v akademii rozebíráme do hloubky — kontrola faktur. Projekt přečte PDF faktury, porovná je se schválenými objednávkami a připraví podklad ke schválení; neschvaluje a neplatí, to zůstává na člověku. Stáhneš si ho hotový v lekci Cvičný projekt: kontrola faktur — tady je jen vidět, z čeho se skládá.',
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

Cvičný projekt z workshopu DEK Academy. Každé ráno projde faktury, které
přes noc přibyly ve vstup/, srovná je se seznamem schválených objednávek
a připraví podklad ke schválení. Neschvaluje a neplatí — to dělá člověk.

## Slovník
- faktura = PDF od dodavatele ve složce vstup/
- objednávka = řádek v data/objednavky.xlsx, na který se faktura odkazuje
- základ daně = částka bez DPH; kontroluje se právě ta, ne částka s DPH
- protokol = krátký soubor na konci běhu; z něj poznám výsledek bez otevírání faktur

## Kde jsou data
- vstup/ — faktury v PDF. Sem se jen čte.
- data/objednavky.xlsx — schválené objednávky: číslo, dodavatel, částka, středisko
- vystup/ — kontrolní tabulka a protokol, jeden pár souborů na každý běh

## Pravidla
- Do vstup/ nikdy nezapisuj, nic v ní nepřejmenovávej ani nemaž. Originály jsou důkaz.
- Když údaj ve faktuře není, nech pole prázdné a napiš ho do sloupce CHYBÍ. Nedomýšlej si.
- Prázdno není nula. Chybějící částku nikdy nenahrazuj nulou ani odhadem z jiného pole.
- Porovnávej vždy základ daně proti schválené částce, ne celkovou částku s DPH.
- Názvy výstupů: kontrola-<RRRR-MM-DD>.xlsx a protokol-<RRRR-MM-DD>.md
- Faktury neschvaluj, neposílej do účetnictví a nezadávej k platbě. Ani když je všechno v pořádku.
- Když je nesouladů víc než tři, nic nerozesílej a napiš mi to.`,
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
          '„Projdi PDF ve vstup/, porovnej je se schválenými objednávkami v data/objednavky.xlsx a ulož výsledek do vystup/.“',
          'Pojmenuj vstup, operaci i místo výsledku — jinak hádá všechno tři.',
        ],
        [
          '„Uprav to, ať je to přehlednější.“',
          '„Sloupce Faktura, Dodavatel, Základ daně, SEDÍ, CHYBÍ v tomhle pořadí, řádky s nálezem podbarvi červeně.“',
          'Ověřitelné zadání se dá zkontrolovat, „přehlednější“ ne.',
        ],
        [
          '„Doplň, co ve faktuře chybí.“',
          '„Kde údaj chybí, nech pole prázdné a napiš ho do sloupce CHYBÍ.“',
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
└── vystupy/       # týdenní přehledy

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
└── vystupy/       # zadání pro realizaci, datové slovníky

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
└── vystupy/       # texty pro web a leták

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
└── vystupy/       # zápisy a přehledy

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
        'Rozhodni, kde projekt bude: v nasyncované knihovně (týmová agenda), nebo u sebe na disku (tvoje pokusy).',
        'Otevři tam Claude Code a nech ho projekt založit — zadáním jako výš, jen s názvem tvojí agendy. Na otázky ke slovníku odpovídej konkrétně, píše se to rovnou do CLAUDE.md.',
        'Do data/ dej jeden reálný soubor, se kterým běžně pracuješ.',
        'Nech Clauda popsat vlastními slovy, čemu ta agenda slouží. Co nesedí, dopiš do CLAUDE.md.',
        'Zadej mu první úlohu a všímej si, kolikrát mu musíš něco vysvětlit. Každé takové vysvětlení je kandidát na řádek v CLAUDE.md.',
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
    note: 'Naplánované úlohy v Claude Code od nuly. Nejblíž tomu, co budeme dělat.',
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
    note: 'Až budeš mít první úlohu a začneš přemýšlet, co dál.',
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

const LESSON_REGAL: Lesson = {
  slug: 'od-emailu-k-platbe',
  module: 'zadani',
  title: 'Od e-mailu k platbě',
  summary:
    'Typický ruční proces kontroly faktur rozepsaný na kroky. Úkolem je najít místa, kde se dá práce automatizovat.',
  minutes: 25,
  kind: 'zadání',
  track: 'v sále',
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
        'Obvyklý tvar kontroly faktur bez automatizace: od e-mailu s PDF fakturou po fakturu zadanou k platbě. Přečti si ho celý, zadání je pod diagramem.',
    },
    {
      kind: 'table',
      head: ['Parametr', 'Hodnota'],
      rows: [
        ['Kanál příjmu', 'e-mail, PDF příloha do sdílené schránky'],
        ['Kdo kontroluje', '1–2 lidé v účtárně'],
        ['Povinné údaje', '6 — číslo faktury, dodavatel, IČO, číslo objednávky, základ daně, splatnost'],
        ['Zdroj k porovnání', 'export schválených objednávek, tabulka'],
        ['Kdo schvaluje k platbě', 'vedoucí střediska'],
        ['Objem', 'desítky faktur týdně'],
      ],
    },
    {
      kind: 'figure',
      name: 'regal-flow',
      caption:
        'Tři účastníci, dvě kolečka přes e-mail. Oranžově místa, kde se údaje přepisují ručně.',
    },
    { kind: 'h', text: 'Proces krok za krokem' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Faktura přijde e-mailem od dodavatele',
          body:
            'PDF příloha do sdílené schránky, mezi desítkami dalších zpráv. Nic ji netřídí — kdo se nepodívá, fakturu nenajde.',
        },
        {
          title: 'Účetní fakturu otevře a ručně přepíše údaje',
          body:
            'Číslo faktury, dodavatele, IČO, číslo objednávky, základ daně a splatnost — z PDF do kontrolní tabulky.',
        },
        {
          title: 'Paralelně dohledá odpovídající objednávku',
          body:
            'Otevře export schválených objednávek a hledá řádek se stejným číslem — často v jiném formátu, než má faktura.',
        },
        {
          title: 'Porovná základ daně se schválenou částkou',
          body: 'Ručně, řádek po řádku. Sedí-li, jde faktura dál; nesedí-li, začíná další kolo.',
        },
        {
          title: 'Když něco nesedí, píše se středisku nebo dodavateli',
          body:
            'Chybějící číslo objednávky, jiná částka, objednávka, která v seznamu není — na každé se ptá zvlášť a čeká.',
        },
        {
          title: 'Faktury, u kterých vše sedí, jdou ke schválení',
          body: 'Přeposlané e-mailem vedoucímu střediska, s poznámkou, na co se má podívat.',
        },
        {
          title: 'Schválení se vrátí a zapíše se ručně zpátky',
          body: 'Účetní odpověď vykopíruje do tabulky a zkontroluje, že se v ní nic neposunulo.',
        },
        {
          title: 'Schválená faktura se zadá do účetního systému k platbě',
          body:
            'Ručně, jedna po druhé. Tohle je krok, který rozhoduje — proto zůstává na člověku, i když se všechno předchozí zautomatizuje.',
        },
      ],
    },
    { kind: 'h', text: 'Soubory, o kterých je řeč' },
    {
      kind: 'table',
      head: ['Soubor', 'Co v něm je', 'Kdo ho vlastní'],
      rows: [
        [
          'Sdílená schránka fakturace@dek.cz',
          'PDF faktury tak, jak přijdou od dodavatelů — netříděné, mezi ostatní poštou.',
          'Účtárna',
        ],
        [
          'Kontrolní tabulka',
          'Jeden řádek na fakturu: číslo, dodavatel, částka, SEDÍ, CHYBÍ, poznámka. Vede se ručně.',
          'Účetní',
        ],
        [
          'Export schválených objednávek',
          'Periodicky stažený z objednávkového systému. Číslo objednávky, dodavatel, částka, středisko.',
          'Nákup',
        ],
        [
          'E-mailová vlákna se schválením',
          'Jediný záznam o tom, kdo co odsouhlasil. Rozeseté mezi desítkami jiných zpráv.',
          'Střediska',
        ],
      ],
    },
    { kind: 'h', text: 'Co se u faktury vlastně porovnává' },
    {
      kind: 'table',
      head: ['Sloupec', 'Odkud se bere'],
      rows: [
        ['Základ daně na faktuře', 'z PDF, ručně přečtený'],
        ['Schválená částka', 'z exportu objednávek podle čísla objednávky'],
        ['SEDÍ', 'porovnání dvou čísel — ano / ne / nenalezeno'],
        ['CHYBÍ', 'ručně: název údaje, který na faktuře chybí'],
        ['Rozhodnutí o schválení k platbě', 'posouzení člověka — dodací list, telefonát, výjimka'],
      ],
    },
    { kind: 'h', text: 'Co vyplňuje účetní' },
    {
      kind: 'p',
      text: 'Čtyři věci, které dnes vznikají ručně.',
    },
    {
      kind: 'table',
      head: ['Sloupec', 'Co do něj patří'],
      rows: [
        ['SEDÍ', 'ano / ne / nenalezeno'],
        ['CHYBÍ', 'název chybějícího údaje'],
        ['Schváleno', 'kdo a kdy fakturu odklikl'],
        ['Poznámka', 'ručně: „čeká na dodací list“, „výjimka schválená telefonicky“'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Není to nedotčený proces',
      text:
        'Účtárna dnes obvykle používá aspoň tabulku se vzorci, která hlídá součty — to je ten kousek, co se dá automatizovat jako první.',
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
        'Podívej se na čtyři sloupce, které vyplňuje účetní. Který z nich by šel předvyplnit z dat, a proč zbylé ne?',
        'V tabulce porovnání rozděl sloupce na dvě hromádky: co je čistý výpočet a co ne. U té první napiš, co by se muselo zajistit, aby se počítala sama.',
        'Napiš jednu změnu, kterou by šlo zkusit do týdne bez souhlasu IT.',
      ],
      hint:
        'Nápověda k bodu 3: e-mail není nástroj na sběr dat, je to přenos. Otázka nezní „jak rychleji přepsat odpověď z e-mailu“, ale „proč ta odpověď vůbec opouští tabulku“.',
    },
    { kind: 'h', text: 'Kam se to obvykle sejde' },
    {
      kind: 'p',
      text: 'Tři místa, kam skupiny skoro vždy dojdou. Nedívej se, dokud nemáš vlastní odpovědi.',
    },
    {
      kind: 'table',
      head: ['Místo', 'Jak to je teď', 'Kam to posunout'],
      rows: [
        [
          'Přepis údajů z PDF do tabulky',
          'Účetní čte fakturu a šest údajů přepisuje ručně',
          'Vytáhnout údaje přímo z PDF a jen je ověřit — ne přepisovat od nuly',
        ],
        [
          'Zjištění, že na faktuře něco chybí, a vyžádání doplnění',
          'Účetní si všimne chybějícího údaje sama a píše dodavateli ručně, kdy má čas',
          'Automatická kontrola úplnosti; když něco chybí, systém sám požádá dodavatele o doplnění',
        ],
        [
          'Zápis schválení zpět do tabulky',
          'Schválení chodí e-mailem a ručně se přepisuje zpátky',
          'Schválení rovnou v tabulce, ne přes e-mail jako mezikrok navíc',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Co nechat člověku',
      text:
        'Rozhodnutí, že se faktura zaplatí, zůstává na člověku — i když všechna čísla sedí, může se čekat na dodací list nebo výjimku, kterou nikdo nezapsal. Automatizace má připravit podklad, ne rozhodnutí udělat za něj.',
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
    'ověřit na checklistu, že je úloha připravená běžet bez dozoru, a napsat k ní runbook',
    'poznat, kdy je na další stupeň brzo — a co nikdy neautomatizovat',
    'projít si celou cestu na jednom hotovém příkladu a ověřit si, že nic nechybí',
    'vědět, co vyplnit do formuláře naplánované úlohy a které konektory připojit',
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
      caption: 'Každý stupeň staví na tom předchozím. Na další jdeš, až když ten současný funguje bez oprav.',
    },
    { kind: 'h', text: '1. Zadání — udělej to jednou ručně' },
    {
      kind: 'p',
      text:
        'Otevři Clauda ve složce projektu a popiš, co má vzniknout — ne jak na to. Všímej si, kolikrát mu musíš něco doříct: každé doříkání je informace, která v projektu zatím chybí.',
    },
    {
      kind: 'code',
      text: `Projdi nové faktury ve vstup/, porovnej je s objednávkami v data/objednavky.xlsx
a ulož kontrolní tabulku do vystup/ podle pojmenování z CLAUDE.md.
Kde chybí povinný údaj, nech pole prázdné a napiš to do sloupce CHYBÍ.`,
      caption: 'Zadání, ze kterého se dá poznat, jestli výsledek sedí. To je celý rozdíl proti „zpracuj mi to“.',
    },
    { kind: 'h', text: '2. Pravidlo — ať to nemusíš vysvětlovat podruhé' },
    {
      kind: 'p',
      text:
        'Musela jsi říct, že kódy položek se nesmí měnit na čísla, nebo že se bere nejnovější soubor podle data v názvu? To nejsou postupy, ale fakta o agendě — patří do CLAUDE.md a platí od té chvíle v každém sezení. Tenhle stupeň je nejlevnější: většina „Claude to udělal blbě“ je ve skutečnosti nenapsané pravidlo.',
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
description: Projde faktury v PDF ve složce vstup/ a porovná je se
  seznamem schválených objednávek. Použij, když přibyly nové faktury.
---

1. Najdi ve vstup/ faktury, které ještě nemají řádek v poslední kontrole.
2. Z každé vytáhni číslo faktury, dodavatele, číslo objednávky a základ daně.
   Co ve faktuře není, nech prázdné.
3. Ke každé najdi v data/objednavky.xlsx řádek se stejným číslem objednávky
   a porovnej základ daně se schválenou částkou.
4. Ulož výsledek do vystup/kontrola-<RRRR-MM-DD>.xlsx.
5. Na konci vypiš počet zpracovaných faktur a seznam těch,
   u kterých něco nesedělo nebo chybělo.`,
      caption: 'Řádek description rozhoduje o tom, kdy si skill Claude vybere sám. Piš do něj i slova, která do zadání píšeš ty.',
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
        'Skill se pořád musí vyvolat. Hook ne — spustí se vždycky, když nastane daná událost, bez ohledu na to, co si Claude zrovna myslí. Hodí se na kontroly a zábrany, ne na složité úvahy: zálohuj před zápisem, odmítni sáhnout do data/, dej vědět, že je hotovo.',
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
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs -I{} cp {} ~/zalohy/"
          }
        ]
      }
    ]
  }
}`,
      caption:
        'Po každém zápisu souboru se udělá kopie. Hook je shellový příkaz — na vstup dostane JSON s tím, co se právě dělo, a `jq` z něj vytáhne cestu k souboru.',
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
        'Druhý hook je zábrana. Zapisuje se do `vystupy/`, do `data/` nikdy — jenže „nikdy" napsané v CLAUDE.md je doporučení, ne zámek. Tohle je zámek: skript, který se spustí před každým zápisem a nepovolený zápis rovnou odmítne.',
    },
    {
      kind: 'code',
      text: `.claude/hooks/chran-data.sh

#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
FILE_PATH="\${FILE_PATH//\\//}"

if [[ "$FILE_PATH" == *"/data/"* ]]; then
  echo "Blokováno: do data/ se nezapisuje, výstupy patří do vystupy/" >&2
  exit 2
fi
exit 0`,
      caption: 'Návratový kód 2 zápis zastaví a text z chybového výstupu se vrátí Claudovi jako vysvětlení, proč to nešlo.',
    },
    {
      kind: 'code',
      text: `chmod +x .claude/hooks/chran-data.sh

.claude/settings.json

{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/chran-data.sh"
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
        'Zábrana plus notifikace: zábrana je důvod, proč se dá běh pustit bez dozoru — nemůže se stát to nejhorší; notifikace je důvod, proč se pozná, že doběhl. Bez nich je naplánovaná úloha jen rychlejší způsob, jak si nadělat škodu.',
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
      caption: 'Spusť si to nejdřív ručně přesně takhle. Tahle věta pak jde do naplánované úlohy — v Claude Code záložka Code → Routines → New routine → Local. Když to takhle nedoběhne, na plánu to nedoběhne taky.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Vždycky nech po sobě stopu',
      text:
        'Naplánovaný běh nikdo nesleduje. Ať proto vždycky vzniká krátký zápis toho, co se udělalo a co nesedělo — soubor ve vystupy/ nebo zpráva do chatu. Automat, po kterém nezůstane nic, se pozná až ve chvíli, kdy měsíc mlčky nedělá nic.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Jak se úloha zakládá, je v samostatné lekci',
      text:
        'Klikání ve formuláři, rozdíl mezi Local a Cloud a to, co se stane, když počítač spal, je v lekci Naplánovaná úloha v Claude Code. Tady zůstává jen to, co platí bez ohledu na formulář: kdy to pustit a co po sobě má běh nechat.',
    },
    {
      kind: 'checklist',
      title: 'Než to pustíš na plán',
      items: [
        'Skill proběhl třikrát po sobě na různých datech bez opravy',
        'Poslední krok skillu vyrábí kontrolní protokol',
        'Ve skillu jsou zastavovací pravidla — ví, kdy se má zastavit místo hádání',
        'Výstupy jdou do vystupy/, do dat se nezapisuje (a hlídá to hook)',
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
          'poslední krok skillu zapíše shrnutí do vystupy/',
        ],
        [
          'E-mail příjemcům',
          'podklad dorazí bez tvého zásahu',
          'konektor Microsoft 365 — má vlastní lekci E-mail z automatu',
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
Projde faktury ve vstup/, porovná je s objednávkami a připraví podklad ke schválení.

## Kdy to běží
Každé ráno v 7:00. Trvá to pár minut.

## Kde je výsledek
vystup/kontrola-<datum>.xlsx
a vedle toho protokol-<datum>.md

## Jak poznám, že je něco špatně
- protokol hlásí víc nesouladů než obvykle
- chybí protokol za dnešek, i když ve vstup/ faktury jsou
- ve vstup/ je faktura, kterou skill přeskočil

## Co dělat, když to spadne
1. Podívej se, jestli jsou ve vstup/ soubory z posledních dnů.
2. Pusť to ručně: v terminálu ve složce projektu claude -p "..."
3. Když to spadne i ručně, běh vypni a napiš tomu, kdo úlohu nastavil.

## Jak to vypnout
Claude Code → Code → Routines → u úlohy přepnout Status na Paused.`,
      caption: 'Šest nadpisů. Kratší runbook nikdo nenapíše, delší nikdo nepřečte.',
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
          'notifikace na Stop hooku, nebo se prostě podívej do vystupy/ na datum',
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
          note: 'Folder, CLAUDE.md, skill, hook, vyplněná naplánovaná úloha — všechno pohromadě.',
        },
      ],
    },
    {
      kind: 'figure',
      name: 'routine-form',
      caption: 'Takhle vypadá vyplněný formulář naplánované úlohy v tom cvičném projektu. Hodnoty jsou reálné, ne ilustrační.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Když tvoje agenda potřebuje odeslat mail bez potvrzení',
      text:
        'Kontrola faktur si vystačí s mailto — otevře rozepsanou zprávu a odeslání zůstává na tobě. Když má úloha poslat mail bez toho, aby ses na to dívala, potřebuješ konektor a druhý souhlas správce — čtení a odesílání jsou dvě různá povolení. Celý postup, včetně toho, kdy se nemá poslat vůbec, je v lekci E-mail z automatu.',
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
        'Založ úlohu na Manual a pusť ji přes Run now aspoň třikrát na různých datech. Teprve pak jí dej rozvrh, nejdřív na den, kdy jsi u počítače — a jako první ať jen ukládá soubory, bez odesílání.',
      ],
      hint:
        'Když ti u druhého běhu skill vyjde jinak než u prvního, není to chyba skillu — je to chybějící pravidlo. Odesílání zapínej úplně nakonec, ideálně po měsíci, kdy se maily odklikávaly ručně a nic nepřekvapilo.',
    },
  ],
}

const LESSON_SKILL: Lesson = {
  slug: 'jak-napsat-skill',
  module: 'postav',
  title: 'Jak napsat skill (a nechat si ho napsat)',
  summary:
    'Z čeho se skill skládá, proč o všem rozhoduje jediný řádek, a co dát Claudovi, aby ti skill napsal sám a dobře.',
  minutes: 10,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'poznat, kdy je čas udělat ze zadání skill',
    'napsat description tak, aby se skill spouštěl ve správnou chvíli',
    'rozdělit obsah mezi SKILL.md a přílohy',
    'dát Claudovi podklady, ze kterých ti skill napíše sám',
    'ověřit, že skill funguje i na jiných datech než na těch, ze kterých vznikl',
    'vědět, kdy skill povýšit na plugin, aby ho měl celý tým',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Skill je zabalený postup: složka se souborem SKILL.md, nahoře pár řádků o tom, co dělá a kdy se má použít, pod tím samotný postup. Nic víc. Celá dovednost je napsat ty dvě části tak, aby si je Claude vybral ve správnou chvíli a odpracoval je pokaždé stejně.',
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
        'Není to místo na fakta o agendě — ta patří do CLAUDE.md a platí pořád. Skill je postup, který se spustí, jen když je potřeba. Test: platí to i ve chvíli, kdy tenhle úkol nedělám? Když ano, je to pravidlo, ne skill.',
    },
    { kind: 'h', text: 'Kam skill patří' },
    {
      kind: 'code',
      text: `.claude/skills/<jmeno-skillu>/SKILL.md     ← platí jen v tomhle projektu
~/.claude/skills/<jmeno-skillu>/SKILL.md   ← platí ve všech tvých projektech`,
      caption: 'Začni v projektu. Když se skill osvědčí a používáš ho i jinde, přesuň složku do domovské.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Třetí patro: plugin',
      text:
        'Skill v projektu platí v projektu, skill v domovské složce jen u tebe. Jakmile má stejný postup používat víc týmů, zabalí se skilly do pluginu — balíčku, který se instaluje jedním příkazem a spravuje na jednom místě: autor opraví postup jednou a oprava dojde všem, místo aby po firmě žilo pět různě starých kopií. Plugin unese i hooky a konektory, takže se dá rozdat celá automatizace najednou.',
    },
    {
      kind: 'code',
      text: `/plugin marketplace add dek/claude-pluginy   ← firemní katalog (repozitář na GitHubu)
/plugin install kontrola-faktur@dek          ← instalace balíčku z katalogu
/kontrola-faktur:kontrola-faktur             ← skill z pluginu se volá se jménem balíčku`,
      caption:
        'Takhle by to vypadalo s firemním katalogem pluginů. Nezakládej ho kvůli prvnímu skillu — plugin má smysl, až když se postup měsíc osvědčil a chce ho další tým. Katalog pak spravuje jeden člověk, typicky IT; příkaz /plugin bez ničeho otevře přehled, kde se dá katalog procházet i klikáním.',
    },
    { kind: 'h', text: 'Anatomie souboru' },
    {
      kind: 'code',
      text: `---
name: kontrola-faktur
description: Projde faktury v PDF ve složce vstup/ a porovná je se
  seznamem schválených objednávek. Použij, když přibyly nové faktury.
---

# Kontrola faktur

1. Najdi ve vstup/ faktury, které ještě nemají řádek v poslední kontrole.
   Když nejdou přečíst, napiš to a pokračuj u ostatních.
2. Z každé vytáhni číslo faktury, dodavatele, číslo objednávky a základ daně.
3. …

## Na co si dát pozor
- Porovnávej základ daně, ne částku s DPH.`,
      caption: 'Otevírací --- musí být úplně první řádek souboru, jinak se hlavička nenačte.',
    },
    { kind: 'h', text: 'Description rozhoduje o všem' },
    {
      kind: 'p',
      text:
        'Tělo skillu se načte, až když si ho Claude vybere — a vybírá si ho podle jednoho jediného řádku, description. Vágní description znamená, že se skill nespustí nikdy, nebo se naopak plete do věcí, kam nepatří. Piš do něj dvě věci: co skill dělá a kdy se má použít, slovy, která do zadání běžně píšeš.',
    },
    {
      kind: 'table',
      head: ['Špatně', 'Dobře', 'V čem je rozdíl'],
      rows: [
        [
          'description: Zpracuje faktury',
          'description: Zkontroluje faktury ve vstup/ proti objednávkám v data/objednavky.xlsx. Použij, když přibyly nové faktury.',
          'Vágní popis se netrefí do žádného zadání. Konkrétní se trefí do toho svého.',
        ],
        [
          'description: Skill na PDF',
          'description: Vytáhne z faktury povinné údaje a porovná je se schválenou objednávkou. Použij před přeposláním ke schválení.',
          'Nástroj není spouštěč. Spouštěč je situace.',
        ],
        [
          'description: Pro účtárnu',
          'description: Připraví podklad ke schválení ze seznamu nových faktur.',
          'Claude nezná účtárnu jako oddělení lidí. Zná úlohu.',
        ],
      ],
    },
    { kind: 'h', text: 'Jak psát tělo' },
    {
      kind: 'list',
      items: [
        'Kroky, ne esej — číslovaný seznam, jedna akce na krok.',
        'Ověřitelně: „Sloupce v pořadí Kód, Název, Divize“ místo „správně naformátovat“.',
        'Se zastavovacími pravidly — kdy se má zastavit a zeptat, místo aby hádal.',
        'S pastmi. Sekce „na co si dát pozor“ ušetří víc než tři kroky navíc.',
        'Krátce. Když SKILL.md přeroste pár set řádků, přesuň detaily do souboru vedle a odkaž na něj.',
      ],
    },
    {
      kind: 'code',
      text: `.claude/skills/kontrola-faktur/
├── SKILL.md          ← postup, krátký
├── references/
│   └── sloupce.md    ← úplný popis povinných údajů, načte se až když je potřeba
└── scripts/
    └── kontrola.py   ← pokud postup potřebuje něco spustit`,
      caption: 'Přílohy jsou volitelné. Většina užitečných skillů je jen SKILL.md.',
    },
    { kind: 'h', text: 'Nech si ho napsat' },
    {
      kind: 'p',
      text:
        'Nejrychlejší cesta k prvnímu skillu není psát ho na prázdno, ale udělat tu úlohu jednou ručně se zadáním a pak říct Claudovi, ať z toho, co se právě stalo, udělá skill. On zná celý průběh — včetně toho, co jsi mu musela doříct.',
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
        'Nemusíš na to být sám či sama. V Claude Code je skill-creator — napiš lomítko a jeho jméno a provede tě založením skillu, úpravou existujícího i ověřením, jestli se spouští ve správných situacích. Výsledek si vždycky nejdřív projdeš na kartě, ne že by ti někdo psal do souborů za zády.',
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
      kind: 'p',
      text:
        'Nemusíš vědět, co po něm chceš technicky. Řekni mu to vlastními slovy — umí skill založit, opravit i vyzkoušet, jestli se vůbec spouští.',
    },
    {
      kind: 'code',
      text: `/skill-creator
Chci skill, který mi z nových faktur ve vstup/ udělá kontrolní
tabulku proti objednávkám.

/skill-creator
Mám skill kontrola-faktur, ale nespustí se, když napíšu
„zkontroluj mi ty nové faktury". Sprav mi to.

/skill-creator
Z toho, co jsme právě udělali, udělej skill. Pak mi řekni, jestli
se spustí, když stejnou úlohu zadám jinými slovy.`,
      caption: 'Tři věci, na které se hodí: založit nový, opravit spouštění existujícího, a zabalit něco, co jsi právě odpracovala.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Tři věci, které rozhodují o kvalitě',
      text:
        'Jméno složky = jméno skillu. Description říká co to dělá i kdy to použít, slovy, která uživatel opravdu napíše. A tělo drž krátké — každý řádek navíc soutěží o pozornost s tím podstatným.',
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
            'Napiš úlohu vlastními slovy, jméno skillu nezmiňuj. Když se nespustí, problém je v description, ne v postupu.',
        },
        {
          title: 'Nech ho spustit někoho jiného',
          body:
            'Co je pro tebe samozřejmé, v postupu chybí — pozná se to jen tak, že to zkusí člověk, který agendu nedělá.',
        },
        {
          title: 'Když vyjde jinak než minule, doplň pravidlo',
          body:
            'Rozdíl mezi dvěma běhy je skoro vždycky chybějící informace, ne chyba postupu.',
        },
      ],
    },
    {
      kind: 'table',
      head: ['Častá chyba', 'Jak se projeví', 'Oprava'],
      rows: [
        ['Postup jako souvislý text', 'kroky se přeskakují', 'rozepiš na číslovaný seznam'],
        ['Skill napsaný na jeden soubor', 'příští měsíc nefunguje', 'popiš vzor názvu, ne konkrétní jméno'],
        ['Žádné zastavovací pravidlo', 'dopočítá si, co nemá', 'napiš, kdy se má zastavit a zeptat'],
        ['Příliš dlouhý SKILL.md', 'kroky se ztrácejí', 'detaily do souboru vedle, odkaz v postupu'],
      ],
    },
    {
      kind: 'task',
      title: 'Cvičení: napiš první skill z toho, co právě proběhlo',
      intro:
        'Vezmi úlohu z cvičení Postav si první automatizaci. Nezakládej nový soubor ručně.',
      items: [
        'Nech Clauda napsat skill promptem výš a přečti si, co vygeneroval.',
        'Zkontroluj description: trefil by se do zadání, jaké napíšeš příště? Když ne, přepiš ho.',
        'Projdi kroky a doplň jedno zastavovací pravidlo, které tam chybí.',
        'Spusť skill na datech z jiného měsíce.',
        'Vyvolej ho podruhé bez toho, aby zaznělo jeho jméno — jen popiš úlohu.',
      ],
      hint:
        'Když se skill nespustí sám, nepiš delší postup. Přepiš description. Devět z deseti případů je tam.',
    },
  ],
}

const L2_ROZBOR: Lesson = {
  slug: 'rozbor-skillu',
  module: 'provoz',
  title: 'Rozbor skutečného skillu',
  summary:
    'Skill kontrola-faktur tak, jak vzniká první verze: co je na něm dobře, čtyři místa, kde selže potichu, a vylepšená verze, která se dá pustit bez dozoru.',
  minutes: 8,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'poznat na hotovém skillu, co mu chybí, aby mohl běžet bez dozoru',
    'odlišit chybu, která spadne nahlas, od chyby, která projde potichu',
    'použít čtyři otázky z rozboru na vlastní skill',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Tenhle skill dneska běží v účtárně a kontroluje faktury proti objednávkám. Napsal ho člověk, který ho používá, a je dobrý — proto se na něm dá ukázat něco cennějšího než na vymyšleném příkladu: kde je hranice mezi „funguje mi to" a „můžu to pustit bez sebe".',
    },
    {
      kind: 'code',
      text: `.claude/skills/kontrola-faktur/SKILL.md — původní verze

---
name: kontrola-faktur
description: Zkontroluje faktury ve vstup/ proti objednávkám v
  data/objednavky.xlsx. Použij, když přibyly nové faktury.
---

# Kontrola faktur

1. Otevři PDF faktury ve vstup/ a vytáhni z každé číslo faktury,
   dodavatele, číslo objednávky a částku.
2. Najdi v data/objednavky.xlsx řádek se stejným číslem objednávky
   a porovnej částku.
3. Napiš mi, které faktury sedí a které ne.

## Na co si dát pozor
- Porovnávej základ daně, ne částku s DPH.`,
      caption: 'Původní verze, tak jak vznikla. Nic na ní neopravuj, dokud si nepřečteš, co je na ní dobře.',
    },
    { kind: 'h', text: 'Co je na něm dobře' },
    {
      kind: 'list',
      items: [
        'Description říká, kdy se má použít, a obsahuje slova, která u toho člověk skutečně použije — „nové faktury". Přesně tak se má psát.',
        'Krok 2 pojmenovává přesně to porovnání, o které jde — ne „zkontroluj to", ale „stejné číslo objednávky, porovnej částku".',
        '„Porovnávej základ daně, ne částku s DPH" — jedna věta, která brání chybě, na kterou by se jinak přišlo až omylem.',
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Osmdesát procent práce je hotových',
      text:
        'Tohle není ukázka špatného skillu, ale skillu, se kterým se dá pracovat po boku — a který ještě nesnese, aby běžel v šest ráno bez dozoru. Rozdíl jsou čtyři věci.',
    },
    { kind: 'h', text: 'Čtyři místa, která ho drží u země' },
    {
      kind: 'table',
      head: ['Co chybí', 'Co se stane', 'Jak se to pozná'],
      rows: [
        [
          'Výstup jde do chatu, ne do souboru',
          'krok 3 napíše výsledek do rozhovoru, kde se za hodinu ztratí',
          'nijak — ráno po naplánovaném běhu není co otevřít',
        ],
        [
          'Nikdo neporovná počet faktur na vstupu s počtem zpracovaných',
          'přeskočená faktura (nečitelný text, chyba) — zbytek doběhne, jako by nechyběla',
          'až za pár dní, když si dodavatel řekne o zaplacení',
        ],
        [
          'Faktury bez rozpoznaného čísla objednávky se tiše přeskočí',
          'krok 2 hledá „stejné číslo" — co nenajde, prostě nezmíní',
          'nijak — chybějící nález po sobě nenechá stopu',
        ],
        [
          '„Nové faktury" není definované',
          'jednou všechny soubory ve vstup/, podruhé jen ty za dnešek — podle znění zadání',
          'faktura se zkontroluje dvakrát, nebo naopak žádná',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Všechny čtyři mají stejný podpis',
      text:
        'Selžou potichu — skill doběhne, soubory vzniknou, nikde není červená hláška, a přesto je výsledek špatně. To je jediný druh chyby, který stojí za to řešit dopředu; toho, co spadne s chybou, se bát nemusíš, to poznáš hned.',
    },
    { kind: 'h', text: 'Vylepšená verze' },
    {
      kind: 'code',
      text: `---
name: kontrola-faktur
description: Projde faktury v PDF ve složce vstup/, vytáhne z nich povinné údaje
  a porovná je se seznamem schválených objednávek. Výsledkem je kontrolní tabulka
  a protokol ve vystup/. Použij, když přibyly nové faktury, když se má udělat ranní
  kontrola faktur, nebo když se ptám, co je s fakturami k vyřízení.
---

# Kontrola faktur

## Kdy to spustit
Když ve vstup/ jsou faktury, pro které ještě není řádek v poslední kontrolní
tabulce ve vystup/. Když nic nového nepřibylo, nic nedělej a napiš to.

## Postup

1. Najdi ve vystup/ nejnovější kontrola-*.xlsx a zapamatuj si, které soubory
   už v ní mají řádek.
2. Projdi PDF ve vstup/, která tam ještě nejsou, a z každé vytáhni:
   soubor, číslo faktury, dodavatele, IČO, číslo objednávky, základ daně
   (částku bez DPH) a datum splatnosti.
3. Co ve faktuře není, nech prázdné a název toho údaje připiš do sloupce CHYBÍ.
   Nic nedomýšlej a nic nedopočítávej.
4. Ke každé faktuře najdi v data/objednavky.xlsx řádek se stejným číslem
   objednávky a doplň sloupec SEDÍ:
   - ano — základ daně se shoduje se schválenou částkou
   - ne — číslo objednávky sedí, ale částka ne
   - nenalezeno — faktura číslo objednávky nemá, nebo takové číslo v seznamu není
5. Ulož vystup/kontrola-<RRRR-MM-DD>.xlsx. Řádky, kde něco chybí, podbarvi
   žlutě; řádky s ne nebo nenalezeno červeně. První řádek zmraz.
6. Napiš vystup/protokol-<RRRR-MM-DD>.md: kolik faktur zpracováno, kolik má
   chybějící údaj, u kolika částka nesedí a u kolika objednávka nebyla nalezena.
   Pod to seznam konkrétních nálezů, jeden řádek na fakturu.

## Kdy se zastavit a nic neposílat
- ve vstup/ je faktura, ze které se nedá přečíst text (sken bez OCR) — napiš to a pokračuj u ostatních
- data/objednavky.xlsx nejde otevřít nebo nemá čekané sloupce
- nesouladů je víc než tři — to obvykle neznamená pět špatných faktur, ale změnu na vstupu

## Co do skillu nepatří
Rozhodnutí, jestli fakturu zaplatit. Skill připraví podklad, schvaluje člověk.`,
      caption: 'Delší o dvě sekce — obě jsou o tom, jak poznat, že výsledek je špatně, ne o tom, jak ho vyrobit. Je to ten samý soubor, který je v cvičném projektu ke stažení.',
    },
    { kind: 'h', text: 'Co to způsobí' },
    {
      kind: 'table',
      head: ['', 'Původní', 'Vylepšený'],
      rows: [
        [
          'Ranní kontrola',
          'projít celý chat a hledat, co bylo řečeno',
          'otevřít protokol a podívat se na čtyři čísla',
        ],
        [
          'Ztracená faktura',
          'zjistí se, až se dodavatel zeptá, kdy zaplatíme',
          'protokol napíše přesně, kolik faktur bylo zpracováno — chybějící je vidět hned',
        ],
        [
          'Faktura bez rozpoznané objednávky',
          'zmizí beze stopy',
          'protokol ji uvede jako nenalezeno',
        ],
        [
          'Dva běhy nad stejnými daty',
          'můžou dopadnout jinak podle toho, co se zrovna myslelo „nové"',
          'dopadnou stejně — skill sám pozná, co už má řádek v poslední kontrole',
        ],
        [
          'Naplánovaný běh',
          'nedá se — po běhu nezůstane nic ke kontrole',
          'dá se — protokol je ta stopa, kterou potřebuje',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Vzorec, který platí na každý skill',
      text:
        'Přidali jsme jen dvě věci: ať po sobě nechá zapsanou kontrolu a ať se zastaví, když něco nesedí. Nic z toho nemění, co skill dělá — mění to, jestli mu můžeš věřit i ve chvíli, kdy se nedíváš. To je ten jediný rozdíl mezi pomocníkem a automatem.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Co jsme naopak nepřidali',
      text:
        'Žádná pravidla navíc o formátování, žádné „buď důkladný", žádné vysvětlování, co je objednávka. Skill má být krátký — každá věta navíc jen zvyšuje šanci, že se přehlédne ta, která výsledek doopravdy mění. Když je ti skill dlouhý, škrtej v postupu, ne v kontrolách.',
    },
    {
      kind: 'task',
      title: 'Cvičení: udělej totéž se svým',
      intro: 'Vezmi svůj první skill a projdi ho čtyřmi otázkami.',
      items: [
        'Zůstane po běhu na disku něco, z čeho poznám, jestli dopadl dobře?',
        'Existuje číslo, které musí sedět — a porovnává ho skill sám?',
        'Co se stane s tím, co do žádné z mých škatulek nepatří? Zahodí se to potichu?',
        'Kdybych to pustila dvakrát nad stejnými daty, dostanu dvakrát totéž?',
      ],
      hint: 'Odpověď „nevím" u kterékoli otázky říká, co opravit jako první.',
    },
  ],
}

const LESSON_CVICENI: Lesson = {
  slug: 'zmapuj-kolegovi-workflow',
  module: 'zadani',
  title: 'Cvičení 1: rozhovor o kolegově práci',
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
        'Stejné cvičení jako v lekci Od e-mailu k platbě, tentokrát na vaší agendě. Ve dvojicích — sami sobě proces nikdo nepopíše dobře, protože se vám dávno slil do jednoho kroku. Vyberte kus práce, který děláte pravidelně a kde vám vstupuje e-mail nebo tabulka a někam posíláte výstup — stačí výsek, ne celá agenda, a ne ten nejsložitější.',
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
├── vystupy/
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
          label: 'Cvičení 1b: kresba flow a označení míst',
          href: '#academy/claude-a-firemni-data/nakresli-flow',
          note: 'Druhá část cvičení — z rozhovoru vznikne obrázek a v něm se označí místa k automatizaci.',
        },
      ],
    },
  ],
}

const LESSON_FLOW: Lesson = {
  slug: 'nakresli-flow',
  module: 'zadani',
  title: 'Cvičení 1b: kresba flow a označení míst',
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
      caption: 'Vzor z lekce Od e-mailu k platbě. Vaše kresba nemusí být hezká, musí být čitelná.',
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
          href: '#academy/claude-a-firemni-data/sdileni-map',
          note: 'Třetí část — dvě minuty na dvojici a hledání toho, co se opakuje napříč odděleními.',
        },
      ],
    },
  ],
}

const LESSON_SDILENI: Lesson = {
  slug: 'sdileni-map',
  module: 'zadani',
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
          'ruční přenos mezi dvěma soubory — stejný tvar úlohy má logistika i marketing',
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
          'kandidát na naplánovanou úlohu — přesně to, co se staví po pauze',
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
            'Otevři mapu kontroly faktur z lekce Od e-mailu k platbě a polož ji vedle svojí. Jde o tvar, ne obsah: tři pruhy, popsané šipky, vidět hranici odpovědností? Rozdíly v tvaru bývají místa, kde jsi něco přeskočil.',
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
        'Hodící se mapu jako vzor pro Cvičení 2 zmínit hned nahlas.',
        'Nekomentovat řešení. Sál je teď sběrač problémů, ne návrhář.',
      ],
    },
    {
      kind: 'links',
      title: 'Odkud to sem vede',
      items: [
        {
          label: 'Cvičení 1: rozhovor o kolegově práci',
          href: '#academy/claude-a-firemni-data/zmapuj-kolegovi-workflow',
          note: 'První část cvičení.',
        },
        {
          label: 'Cvičení 1b: kresba flow a označení míst',
          href: '#academy/claude-a-firemni-data/nakresli-flow',
          note: 'Druhá část — mapa, kterou tady představujete.',
        },
      ],
    },
  ],
}

/* ---------------------------------------------- kurz 2: Od mapy k automatu */

const L2_TABULKY: Lesson = {
  slug: 'zadani-nad-tabulkou',
  module: 'remeslo',
  title: 'Zadání práce nad tabulkou',
  summary:
    'Devadesát procent téhle práce jsou tabulky. Čím se v nich dá splést a jak napsat zadání, které projde napoprvé.',
  minutes: 12,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'nechat si nejdřív popsat strukturu souboru, než se začne počítat',
    'napsat zadání nad tabulkou tak, aby šlo zkontrolovat',
    'poznat past, kterou tabulka nastraží — kódy, prázdná pole, hlavičku na třetím řádku',
    'rozhodnout, kdy chceš hodnoty a kdy vzorce',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Claude s tabulkami umí — problém je, že obě strany o nich mlčky předpokládají něco jiného. Ty víš, že hlavička je na třetím řádku a prázdné pole znamená „nezjištěno“, ne nulu. On to neví, dokud mu to neřekneš, a bez toho si to domyslí.',
    },
    { kind: 'h', text: 'Struktura zadání, které projde napoprvé' },
    {
      kind: 'p',
      text:
        'Čtyři části: co vzít, co s tím udělat, kam to uložit, co dělat s výjimkou. Poslední se nejčastěji vynechává, a přitom rozhoduje o tom, jestli výsledku půjde věřit.',
    },
    {
      kind: 'code',
      text: `Vezmi nové faktury ze vstup/.

Ke každé dohledej v data/objednavky.xlsx objednávku se stejným číslem
a porovnej základ daně se schválenou částkou.

Ulož jako vystup/kontrola-<RRRR-MM-DD>.xlsx, sloupce v pořadí
Faktura, Dodavatel, Základ daně, SEDÍ, CHYBÍ.

Kde údaj chybí, nech prázdno. Na konci mi napiš, kolika faktur
se to týkalo a vypiš jejich čísla.`,
      caption: 'Poslední odstavec dělá rozdíl. Bez něj dostaneš tabulku, ve které nepoznáš, co je změřené a co dopočítané.',
    },
    { kind: 'h', text: 'Nech si nejdřív popsat, co v tom je' },
    {
      kind: 'p',
      text:
        'Než zadáš první výpočet, nech si popsat strukturu: kolik listů, kde je hlavička, jaké typy má který sloupec, kde jsou prázdná pole. Trvá to třicet vteřin a hned uvidíš, jestli si soubor přečetl tak, jak čekáš.',
    },
    {
      kind: 'code',
      text: `Než začneš cokoli počítat, popiš mi strukturu tohohle souboru:
kolik má listů a jak se jmenují, na kterém řádku začíná hlavička,
kolik je řádků dat, jaké typy jsou v jednotlivých sloupcích
a kde jsou prázdná pole.`,
      caption: 'Když tu něco nesedí, nesedí to ani ve všem, co by následovalo.',
    },
    { kind: 'h', text: 'Čím se v tabulce dá splést' },
    {
      kind: 'table',
      head: ['Past', 'Jak se projeví', 'Co napsat do zadání'],
      rows: [
        [
          'Kódy položek jako čísla',
          'z 0041220 se stane 41220, položka se pak nespáruje',
          '„Čísla položek a katalogová čísla jsou text. Nepřeváděj je na čísla a nedoplňuj nuly.“',
        ],
        [
          'Hlavička není na prvním řádku',
          'sloupce se posunou, všechno je o řádek vedle',
          '„Hlavička je na třetím řádku, nad ní je nadpis a prázdný řádek.“',
        ],
        [
          'Prázdné pole vs. nula',
          'chybějící údaj se počítá jako nula a průměry lžou',
          '„Prázdné pole znamená nezjištěno. Nenahrazuj ho nulou a do průměru ho nezapočítávej.“',
        ],
        [
          'Sloučené buňky',
          'hodnota patří jen prvnímu řádku skupiny, zbytek je prázdný',
          '„Ve sloupci Středisko jsou sloučené buňky. Hodnota platí až do dalšího vyplněného řádku.“',
        ],
        [
          'Víc listů se stejnými sloupci',
          'spočítá se jen ten první, nebo se sečtou dohromady',
          '„Každý list je jedno středisko. Zpracuj je zvlášť a výsledky nesčítej.“',
        ],
        [
          'Filtr nebo skryté řádky',
          'to, co vidíš na obrazovce, není to, co je v souboru',
          '„V souboru jsou skryté řádky. Ber všechny, ne jen viditelné.“',
        ],
        [
          'Čísla uložená jako text',
          'nedá se sečíst a nikdo neví proč',
          '„Sloupec Množství může být uložený jako text. Před počítáním ho převeď a řekni mi, u kolika řádků to bylo potřeba.“',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Pasti patří do CLAUDE.md',
      text:
        'Tohle jsou fakta o agendě, ne o jedné úloze. Jakmile na past narazíš podruhé, přesuň ji do CLAUDE.md a přestaň ji psát do zadání. Za měsíc bude tvoje CLAUDE.md z poloviny složené právě z těchhle vět — a to je dobře.',
    },
    { kind: 'h', text: 'Na vzoru: co nastraží export objednávek' },
    {
      kind: 'p',
      text:
        'Stejná tabulka pastí na exportu objednávek z cvičného projektu vyjde na čtyři věci — a všechny čtyři jsou důvod, proč se ruční kontrola nikdy nedala vynechat.',
    },
    {
      kind: 'table',
      head: ['V exportu objednávek', 'Co se stane bez pravidla'],
      rows: [
        ['Řádky za všechna období, ne jen aktuální měsíc', 'porovná se s objednávkou z úplně jiného měsíce, protože sedí jen číslo'],
        ['Čísla objednávek jako 2026-00043', 'převede se na datum nebo na číslo, ztratí se úvodní nuly a faktura se nespáruje'],
        ['Prázdná buňka místo nuly, nebo pomlčka', 'pomlčka se počítá jako text, ne jako částka'],
        ['Stejné číslo objednávky na dvou řádcích (oprava, duplicitní export)', 'najde se první řádek, ne ten platný'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nejdřív na vzoru, pak na svém',
      text:
        'Celý kurz jede ve dvou krocích: každou věc si ukážeme na kontrole faktur, kterou už znáš, a pak ji uděláš na vlastní agendě.',
    },
    { kind: 'h', text: 'Hodnoty, nebo vzorce?' },
    {
      kind: 'table',
      head: ['Chceš', 'Řekni si o', 'Protože'],
      rows: [
        ['Podklad, který někomu pošleš', 'hodnoty', 'vzorce se u příjemce rozbijí o chybějící odkazy'],
        ['Soubor, se kterým budeš dál pracovat ty', 'vzorce', 'uvidíš, jak se k číslu došlo, a půjde přepočítat'],
        ['Kontrolu, jestli to sedí', 'obojí vedle sebe', 'porovnáš spočítané s tím, co bylo v původním souboru'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Nikdy nenechávej přepsat originál',
      text:
        'Ani když je to „jen doplnění sloupce“. Výsledek patří do vystupy/ jako nový soubor. Když se ukáže, že je něco špatně, chceš mít pořád po ruce to, z čeho se vycházelo.',
    },
    {
      kind: 'task',
      title: 'Cvičení: projdi si vlastní tabulku',
      intro: 'Vezmi soubor, se kterým pracuješ každý týden.',
      items: [
        'Nech si popsat jeho strukturu a porovnej odpověď s tím, co o něm víš. Co nesedí?',
        'Projdi tabulku pastí a najdi ty, které se týkají tvého souboru.',
        'Napiš zadání na jednu operaci podle struktury výš, včetně poslední části o výjimkách.',
        'Spusť ho a zkontroluj počet řádků na výstupu proti vstupu.',
        'Věty o pastech, které platí pořád, přepiš do CLAUDE.md.',
      ],
    },
  ],
}

const L2_KONTROLA: Lesson = {
  slug: 'jak-poznas-ze-je-to-spatne',
  module: 'remeslo',
  title: 'Jak poznáš, že je výsledek špatně',
  summary:
    'Dovednost, na které stojí všechno ostatní. Bez ní nikdo nikdy nepustí nic bez dozoru — a pak se nic neušetří.',
  minutes: 15,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'zkontrolovat výstup třemi otázkami místo čtení řádek po řádku',
    'nechat si vyrobit kontrolní protokol jako součást úlohy',
    'poznat, které chyby se samy neprojeví',
    'vědět, co porovnávat, aby kontrola nebyla jen dojem',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Nudná lekce, nejdůležitější v kurzu. Dokud neumíš rychle ověřit výsledek, budeš kontrolovat všechno ručně — a pak je jedno, jak dobře to Claude spočítal, protože se neušetřilo nic. Automatizace začne fungovat ve chvíli, kdy kontrola trvá minutu místo hodiny.',
    },
    { kind: 'h', text: 'Tři otázky na každý výstup' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Sedí počty?',
          body:
            'Kolik řádků šlo dovnitř a kolik vyšlo ven? Rozdíl musí mít důvod, který umíš pojmenovat — filtr, deduplikace, rozpad na víc souborů. Když ho neumíš pojmenovat, něco se ztratilo.',
          code: 'Kolik řádků měl vstup, kolik má výstup a čím se ten rozdíl vysvětluje?',
        },
        {
          title: 'Sedí součty?',
          body:
            'Sečti jeden číselný sloupec před a po (u rozpadu na víc souborů součty všech dílů). Tohle chytí většinu chyb v párování a duplicitách.',
          code: 'Sečti sloupec Kusů na CS ve vstupu a ve všech výstupních souborech. Sedí to?',
        },
        {
          title: 'Sedí vzorek?',
          body:
            'Vyber pět řádků — dva náhodné, nejmenší, největší a jeden, u kterého něco chybělo — a projdi je ručně proti originálu. Zabere to dvě minuty a chytí to, co součty přehlédnou.',
          code: 'Vyber pět položek podle klíče výš a ukaž mi u každé, odkud se každá hodnota vzala.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Neptej se, jestli je to správně',
      text:
        'Odpověď „ano, zkontroloval jsem to“ nemá žádnou hodnotu — je to tvrzení o tvrzení. Ptej se na čísla srovnatelná s originálem: počty, součty, konkrétní hodnoty u konkrétních řádků. Kontrola je porovnání, ne ujištění.',
    },
    { kind: 'h', text: 'Nech si vyrobit kontrolní protokol' },
    {
      kind: 'p',
      text:
        'Místo opakování kontroly pokaždé znovu z ní udělej součást úlohy: ke každému výstupu ať vznikne krátký soubor se vším, co potřebuješ k rozhodnutí „můžu to poslat“.',
    },
    {
      kind: 'code',
      text: `Ke každému výstupu ulož vedle něj kontrolu jako .md soubor:

- počet řádků vstupu a výstupu, a rozdíl s vysvětlením
- součet číselných sloupců před a po
- počet položek, u kterých něco chybělo, a jejich čísla
- pět namátkových řádků s tím, odkud se hodnoty vzaly
- cokoli, co ti přišlo divné a rozhodl ses to nechat být`,
      caption: 'Poslední bod bývá nejužitečnější. Věci, které „vypadaly divně“, jsou obvykle první stopa k chybě v datech, ne ve výpočtu.',
    },
    { kind: 'h', text: 'Na vzoru: tři čísla u kontroly faktur' },
    {
      kind: 'p',
      text:
        'U kontroly faktur vypadají ty tři otázky takhle — a žádná z nich nevyžaduje otevřít jedinou fakturu.',
    },
    {
      kind: 'code',
      text: `protokol-2026-09-08.md

Vstup:  5 PDF ve vstup/
Výstup: 5 řádků v kontrolní tabulce
Rozdíl: 0

Součet základů daně: vstup 187 430 Kč / výstup 187 430 Kč

Nálezy: 3 faktury (chybí údaj, nebo částka/objednávka nesedí)
        elektro-dvorak, vts-technik, barvy-piekarova … (celý seznam níž)

Vzorek:
  vts-technik       základ daně 33 100 Kč, schváleno 31 900 Kč
  barvy-piekarova   objednávka OBJ-9999-0001 není v seznamu schválených
  …

Divné:  U vts-technik je rozdíl přesně 1 200 Kč, což odpovídá ceně
        montáže navíc. Podle pravidla jsem se měl zastavit — ptám se: pokračovat?`,
      caption: 'Poslední odstavec je ten, kvůli kterému to celé má smysl. Automat, který si všimne, že něco nesedí, a zeptá se, je použitelný — ten, který to spočítá potichu, není.',
    },
    { kind: 'h', text: 'Chyby, které se samy neprojeví' },
    {
      kind: 'table',
      head: ['Chyba', 'Proč ji nevidíš', 'Čím ji chytíš'],
      rows: [
        [
          'Nespárované položky vypadly',
          'výstup je čitelný a hezký, jen kratší',
          'porovnání počtu řádků',
        ],
        [
          'Prázdné pole se počítalo jako nula',
          'čísla vypadají věrohodně',
          'počet prázdných polí ve vstupu vs. počet nul ve výstupu',
        ],
        [
          'Vzal starší soubor',
          'všechno sedí, jen data jsou z minulého měsíce',
          'zkontroluj datum v názvu použitého souboru — nech si ho vypsat',
        ],
        [
          'Kód se změnil na číslo',
          'v tabulce to vypadá stejně',
          'porovnej pár konkrétních kódů znak po znaku',
        ],
        [
          'Duplicity po spojení',
          'součty jsou vyšší, ale kdo je zpaměti zná',
          'součet číselného sloupce před a po',
        ],
        [
          'Ztratilo se pořadí nebo řazení',
          'nikdo se na to nedívá',
          'zkontroluj první a poslední řádek',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Porovnání s minulým měsícem je nejlevnější kontrola',
      text:
        'Většina agend se měsíc od měsíce mění málo. Skočí-li počet faktur o třetinu nebo zmizí celé středisko, je to vidět na první pohled — jen když se podíváš. Nech si porovnat nový výstup s minulým a vypsat, co se výrazně změnilo.',
    },
    {
      kind: 'task',
      title: 'Cvičení: napiš si kontrolu pro svoji úlohu',
      intro: 'Vezmi výstup, který někomu pravidelně posíláš.',
      items: [
        'Napiš tři čísla, která musí sedět, aby se dal s klidem poslat.',
        'Nech si k poslednímu výstupu vyrobit kontrolní protokol podle šablony výš.',
        'Porovnej ho s výstupem z minulého měsíce a najdi největší rozdíl.',
        'Ten rozdíl vysvětli. Když ho vysvětlit neumíš, máš první nález.',
        'Kontrolu přidej jako poslední krok do svého zadání — a až budeš mít skill, do něj.',
      ],
      hint:
        'Když ti kontrola trvá dýl než samotná úloha, je moc podrobná. Cílem není jistota, ale to, abys chybu chytila dřív než příjemce.',
    },
  ],
}

const L2_POSTAV: Lesson = {
  slug: 'postav-si-prvni-automatizaci',
  module: 'postav',
  title: 'Postav si první automatizaci',
  summary:
    'Vezmi jedno místo z mapy vlastního procesu a dotáhni ho až do skillu, který má vlastní kontrolu.',
  minutes: 40,
  kind: 'zadání',
  track: 'v sále',
  outcomes: [
    'vybrat první krok tak, aby se dal dokončit a nikoho nepoložil',
    'projít cestu zadání → pravidlo → skill na vlastních datech',
    'přidat ke skillu kontrolu, aby se dal pustit bez dozoru',
    'poznat, kdy je hotovo',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Máš mapu procesu s označenými místy, kde se data přenáší ručně. Z jednoho z nich teď uděláš skill — tři čtvrtě hodiny a na konci máš něco, co příště spustíš jednou větou.',
    },
    { kind: 'h', text: 'Vyber ten správný první krok' },
    {
      kind: 'p',
      text:
        'Neber ten nejbolestivější, ber ten, který se dá dokončit. První automatizace má hlavně dokázat, že to jde — bolestivé kroky přijdou, až budeš vědět, jak to celé funguje.',
    },
    {
      kind: 'table',
      head: ['Dobrý první krok', 'Špatný první krok'],
      rows: [
        ['Děláš ho aspoň jednou týdně', 'Děláš ho dvakrát do roka'],
        ['Vstup i výstup je soubor', 'Vstup je něco, co si pamatuješ z hlavy'],
        ['Chyba se pozná do minuty', 'Chyba se projeví až na pobočce'],
        ['Nikdo jiný na tom nestojí', 'Čeká na to půlka oddělení'],
        ['Umíš ho popsat na pět kroků', 'Má patnáct výjimek'],
      ],
    },
    { kind: 'h', text: 'Postup' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Nejdřív si to projdi na vzoru',
          body:
            'Pusť si celý postup jednou na datech z cvičného projektu s fakturami, kde víš, jak má výsledek vypadat. Až tenhle průchod vyjde, jdi na svoje.',
        },
        {
          title: 'Připrav si materiál',
          body:
            'Do data/ dej reálný vstup a do vystupy/ výsledek z minula, ten správný — bez něj nepoznáš, jestli to vyšlo.',
        },
        {
          title: 'Udělej to jednou zadáním',
          body:
            'Napiš zadání podle struktury z lekce Zadání nad tabulkou: co vzít, co udělat, kam uložit, co s výjimkou. Všímej si, kolikrát musíš něco doříct.',
        },
        {
          title: 'Porovnej s tím, co je správně',
          body:
            'Použij tři otázky z lekce Jak poznáš, že je to špatně — počty, součty, vzorek. Skoro vždycky se tu ukáže první chybějící pravidlo.',
        },
        {
          title: 'Doříkání přepiš do CLAUDE.md',
          body:
            'Všechno, co jsi musela vysvětlit a co platí i mimo tuhle úlohu, je pravidlo — do skillu nepatří.',
        },
        {
          title: 'Nech si napsat skill',
          body:
            'Hned po správném doběhnutí vlep do chatu zadání níž. Claude z proběhlého rozhovoru vyrobí SKILL.md — přečti ho a uprav description na slova, kterými bys úlohu zadával příště.',
          code: `Z toho, co jsme teď udělali, napiš skill do .claude/skills/.
Dej mu jméno podle úlohy a do description napiš, co dělá a kdy se má
použít — takovými slovy, jaká bych do zadání napsal já. V postupu drž
pořadí kroků, které jsme prošli, a z míst, kde jsi se ptal nebo kde jsem
tě opravoval, udělej krok navíc nebo zastavovací pravidlo. Na konec
přidej sekci "Na co si dát pozor". Pak mi ho ukaž, než ho uložíš.`,
        },
        {
          title: 'Přidej na konec kontrolu',
          body:
            'Poslední krok skillu ať vyrobí kontrolní protokol — díky tomu se to jednou bude dát pustit bez tebe.',
        },
        {
          title: 'Spusť to na jiných datech',
          body:
            'Na jiném měsíci. Vyjde-li něco jiného než minule, není to chyba skillu, ale chybějící pravidlo. Doplň ho a zkus to znovu.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Hotovo je, když',
      text:
        'Skill projde dvakrát po sobě na různých datech bez jediné opravy a kontrolní protokol ti dá dost na to, abys výsledek poslala dál bez otevírání souboru. Nic víc od prvního skillu nechtěj.',
    },
    {
      kind: 'task',
      title: 'Co si odnést',
      intro: 'Na konci bloku ukaž ostatním tři věci.',
      items: [
        'Jméno skillu a jeho description — jednou větou, co dělá a kdy se použije.',
        'Kolik doříkání bylo potřeba, než to vyšlo. To číslo je zajímavější než výsledek.',
        'Jedno pravidlo, které přibylo do CLAUDE.md a které předtím existovalo jenom v tvojí hlavě.',
      ],
    },
  ],
}


const L2_PLAN: Lesson = {
  slug: 'naplanovana-uloha',
  module: 'provoz',
  title: 'Naplánovaná úloha v Claude Code',
  summary:
    'Kde se úloha zakládá, proč pro nás platí Local a ne Cloud, co vyplnit, a co se stane, když počítač spal.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'založit naplánovanou úlohu v Claude Code — klikáním i větou',
    'rozhodnout mezi Local a Cloud a vědět, proč je pro nás skoro vždycky Local',
    'vědět, co se stane se zmeškaným během a jak na to napsat zadání',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Technická část posledního schodu: samotné založení úlohy, která se spustí sama. V desktopové aplikaci Claude Code je to záložka Code → Routines.',
    },
    { kind: 'h', text: 'Postup' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Routines → New routine → Local',
          body:
            'Cloud si na úlohu klonuje repozitář z GitHubu a do tvojí složky se nedostane — pro práci nad vlastní složkou proto chceš Local (víc v tabulce níž).',
        },
        {
          title: 'Vyplnit název, popis a instrukce',
          body:
            'Instrukce píšeš stejně, jako když píšeš Claudovi do chatu. Tady vybereš i model a režim povolování.',
        },
        {
          title: 'Vybrat pracovní složku',
          body:
            'Bez složky se úloha nedá uložit. Vyber projektovou — tu s CLAUDE.md, data/ a vystupy/. Bez označení jako důvěryhodná se na to aplikace zeptá.',
        },
        {
          title: 'Nastavit rozvrh',
          body:
            'Na výběr Manual, Hourly, Daily, Weekdays, Weekly. Cokoli jinačího — každých patnáct minut, prvního v měsíci — řekni Claudovi v chatu vlastními slovy.',
        },
        {
          title: 'Hned kliknout na Run now',
          body:
            'Nepřeskakuj. První běh si odklikáš oprávnění a u každého dáš „always allow" — jinak se úloha při ostrém běhu zastaví na dotazu, na který nikdo neodpoví, a bude to vypadat, že spadla.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nemusíš to klikat — stačí si o to říct',
      text:
        'Úlohu založíš i popsáním v běžném sezení. „Založ mi úlohu, která každé ráno v sedm zkontroluje nové faktury" udělá opakovanou; „připomeň mi zítra ve tři, ať zkontroluju ten běh" jednorázovou, která se po odpálení sama vypne. Stejně tak „pozastav mi úlohu kontrola-faktur" nebo „ukaž mi moje naplánované úlohy".',
    },
    { kind: 'h', text: 'Proč Local, ne Cloud' },
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
        'Cloud zní líp, protože běží i se zavřeným notebookem — jenže data leží jen v nasyncované knihovně na disku, kam se cloudová úloha nedostane. Takže platí Local: zapnutý počítač, puštěná aplikace. Má-li běh vyjít i přes zavřený notebook, musí data přestat žít jen na disku — přes konektor, nebo tokem v Power Automate.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Zadání úlohy je obyčejný SKILL.md',
      text:
        'Text úlohy leží na disku v ~/.claude/scheduled-tasks/<název>/SKILL.md — stejný formát jako u skillů, YAML hlavička s name a description a pod tím zadání. Dá se editovat ručně, projeví se to při dalším běhu. Rozvrh, složka a model se mění ve formuláři, ne v souboru.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Když počítač spal, běh se přeskočí',
      text:
        'Úloha běží jen při puštěné aplikaci a probuzeném počítači. Zaspaný běh se zahodí, po probuzení se dohání jen ten poslední zmeškaný — úloha, která nešla šest dní, doběhne jednou. Ranní úloha se tak může spustit v jedenáct večer. Piš proto zadání s tím, že počítá: „Pracuj jenom s dnešním exportem. Po páté odpoledne nic nepočítej, jen napiš, že se to nestihlo." V Nastavení → Aplikace → Obecné jde zapnout Keep computer awake, ale zavřené víko uspí počítač tak jako tak.',
    },
    {
      kind: 'video',
      title: 'Jak naplánovaná úloha vypadá',
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

const L2_EMAIL: Lesson = {
  slug: 'email-z-automatu',
  module: 'provoz',
  title: 'E-mail z automatu',
  summary:
    'Čím se z naplánovaného běhu odešle e-mail, co k tomu musí povolit správce, proč neodejde příloha, a jak napsat zadání, které pošle mail kolegovi.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'vybrat cestu, kterou má e-mail odejít, a vědět, kdo ji musí povolit',
    'rozlišit čtení a odesílání u konektoru Microsoft 365',
    'napsat zadání úlohy, která pošle mail — včetně podmínky, kdy ho neposlat',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Odeslat e-mail se ptá každý hned po první naplánované úloze. Jde to — ale ne samo od sebe a ne bez správce. Tahle lekce říká, co přesně k tomu musí platit, aby to v pondělí v šest ráno nezůstalo jen u souboru ve složce.',
    },
    { kind: 'h', text: 'Čím se ten e-mail vlastně odešle' },
    {
      kind: 'p',
      text:
        'Claude sám od sebe do pošty nevidí ani do ní nepíše — musí mu to někdo umožnit, tomu napojení se říká konektor: přípojka na službu, přes kterou umí něco udělat mimo tvůj disk. Cesty jsou čtyři, liší se hlavně tím, kdo je musí povolit a jestli přenesou přílohu.',
    },
    {
      kind: 'table',
      head: ['Cesta', 'Co je k tomu potřeba', 'Kdy ji zvolit'],
      rows: [
        [
          'Nechat rozepsaný koncept',
          'nic navíc — Claude napíše text do souboru nebo do konceptu, ty ho odklikneš',
          'vždycky napoprvé. Devadesát procent užitku a nulové riziko.',
        ],
        [
          'Konektor Microsoft 365',
          'zapnuté write tools — správce Entra k tomu musí dát druhý souhlas',
          'když má mail odejít z tvojí adresy tvým jménem, i když u toho nejsi. Bez přílohy.',
        ],
        [
          'Outlook na tvém počítači',
          'skript, který Claude spustí — na Macu AppleScript, na Windows PowerShell',
          'když musí odejít příloha a Outlook stejně máš puštěný',
        ],
        [
          'Tok v Power Automate',
          'nastaví IT, jednou. Claude jen položí soubor do knihovny.',
          'když to má běžet nezávisle na tvém počítači a firma je na M365',
        ],
      ],
    },
    { kind: 'h', text: 'Konektor na Microsoft 365: čtení a odesílání jsou dvě různá povolení' },
    {
      kind: 'p',
      text:
        'Konektor umí obojí, ale každé se zapíná zvlášť a odesílání je vypnuté, dokud ho někdo nepovolí. Samé „search" v seznamu nástrojů konektoru znamená první sloupec téhle tabulky — odesílat se z něj nedá, i když je konektor připojený.',
    },
    {
      kind: 'table',
      head: ['Vlastnost', 'Čtení (read tools)', 'Odesílání (write tools)'],
      rows: [
        [
          'Co to umí',
          'hledat v poště, kalendáři, Teamsech a na SharePointu a číst, co najde',
          'napsat koncept, odeslat i přeposlat poštu, zakládat schůzky, ukládat soubory',
        ],
        [
          'Jak se to zapíná',
          'souhlas správce Entra pro celou firmu, pak se každý přihlásí pracovním účtem',
          'druhý, samostatný souhlas správce k rozšířeným oprávněním',
        ],
        ['Ve výchozím stavu', 'k dispozici', 'zablokované — je potřeba si o to říct'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Přes konektor neodejde příloha',
      text:
        'Nejdůležitější věta z celé lekce. Odesílání přes konektor zatím neumí přílohy — Claude nepošle, nepřepošle ani nerozepíše e-mail s připojeným souborem. „Pošli kolegům výstupní soubory" takhle neuděláš. Uděláš to jinak: výstup ulož do sdílené knihovny (nasyncuje se sama) a e-mail ať nese odkaz, ne přílohu — stejně lepší, všichni pak čtou tu samou verzi.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Konektor si nezapneš sám — a jak si o to říct',
      text:
        'Souhlas dává správce Microsoft 365, přihlašuje se pracovním účtem — osobní outlook.com nebo hotmail.com nefungují. Nevidíš-li konektor ve svém Claudovi, není to chyba nastavení, nikdo ho pro firmu nepovolil. Napiš správci konkrétně: „potřebujeme u konektoru Claude na Microsoft 365 zapnout write tools pro odesílání pošty, vyžaduje to druhý souhlas v Entra" — bez té věty se ptáš na něco, co zní jako obecná otázka, a odpověď přijde za měsíc.',
    },
    { kind: 'h', text: 'Takže ano — úloha, která ráno pošle kolegovi mail' },
    {
      kind: 'p',
      text:
        'Když je odesílání zapnuté, jde založit naplánovanou úlohu, která se v šest ráno spustí sama, něco spočítá, uloží výstup do knihovny a pošle e-mail z tvojí adresy tvým jménem. Zadání vypadá takhle:',
    },
    {
      kind: 'code',
      text: `Postupuj podle skillu tydenni-prehled.
Výstupy ulož do vystupy/ a kontrolní protokol vedle nich.
Pak pošli e-mail na jan.novak@dek.cz s předmětem
„Týdenní přehled — <dnešní datum>". Do těla dej tři čísla
z protokolu a odkaz do knihovny na SharePointu. Přílohu nepřikládej.
Když protokol hlásí nesrovnalost, e-mail neposílej a jenom mi to napiš.`,
      caption:
        'Všimni si poslední věty. Zadání, které umí odeslat poštu, musí vždycky obsahovat i podmínku, kdy ji neodeslat.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Musí platit tři věci najednou',
      text:
        'Zapnuté write tools v konektoru. Žádná příloha — v mailu jen odkaz. A protože úloha sahá do složky na disku, běží jako Local: zapnutý počítač, puštěná aplikace. Chybí-li jedna z těch tří, mail neodejde — a dozvíš se to až od kolegy, že mu nic nepřišlo.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'S e-mailem opatrně: první měsíc jen koncepty',
      text:
        'Odeslaná pošta se nevrací. Než necháš cokoli odesílat samo, nech to měsíc jen připravovat rozepsaný e-mail, který odklikneš ty. Teprve po měsíci bez překvapení přemýšlej o odesílání bez potvrzení — a i pak jen tam, kde nejhorší možný následek je, že někdo dostane zprávu navíc.',
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
        'Katalog sám o sobě je hezký, ale sílu dostane až propojený s tvými daty: „vezmi exportovaný soubor z vystupy/, ke každé položce dohledej v katalogu aktuální název a zařazení a rozdíly zapiš do nového sloupce". Tohle je ten okamžik, kdy MCP přestane být hračka.',
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

const L2_MINIMUM: Lesson = {
  slug: 'mas-to-minimum',
  module: 'provoz',
  title: 'Máš to minimum? Kontrola na konci',
  summary:
    'Osm bodů, které mají po projití kurzů platit. U každého je věta, kterou si to ověříš na svém počítači, a odkaz do lekce, kam se vrátit, když nesedí.',
  minutes: 10,
  kind: 'zadání',
  track: 'potom',
  outcomes: [
    'ověřit na vlastním projektu, že máš hotové všechno, co k běžící automatizaci patří',
    'poznat u každého chybějícího bodu, do které lekce se vrátit',
    'odlišit „mám to nastavené" od „viděl jsem to fungovat"',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Poslední lekce minima — nic nového, jen kontrola. Projdi osm bodů níž na svém vlastním projektu, ne na cvičném: u každého je věta, kterou ověříš, že to opravdu platí, a odkaz do lekce, kam se vrátit, když ne. Chybějící kus se sám neozve, jen tiše nefunguje — proto se to jinak nepozná.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Odškrtávej jen to, co jsi viděl fungovat',
      text:
        'Zábrana, kterou nikdo neviděl odmítnout zápis, je soubor na disku. Úloha, která ještě nikdy neproběhla, je řádek ve formuláři. Odškrtávej podle toho, co se ti opravdu stalo na obrazovce, ne podle toho, co máš nastavené.',
    },
    { kind: 'h', text: 'Osm bodů' },
    {
      kind: 'checklist',
      title: 'Minimum, se kterým se dá pracovat dál',
      items: [
        'Mám složku s daty, ve které Claude umí číst i psát.',
        'Mám projekt a v něm CLAUDE.md se slovníkem svojí agendy.',
        'Mám mapu jednoho svého procesu a v ní označená místa ručního přenosu.',
        'Mám skill, který jeden z těch kroků udělá celý.',
        'Skill má sekci „zastav se, když" a po každém běhu nechá kontrolní protokol.',
        'Mám zábranu, která nepustí zápis tam, kam nemá.',
        'Mám naplánovanou úlohu, která proběhla aspoň třikrát na různých datech.',
        'Aspoň jednou to proběhlo na skutečné práci a vím, co se ušetřilo.',
      ],
    },
    { kind: 'h', text: 'Jak si každý bod ověřit' },
    {
      kind: 'table',
      head: ['Bod', 'Ověříš tím, že', 'Když nesedí, vrať se do'],
      rows: [
        [
          'Složka',
          'napíšeš Claudovi „vypiš, co je ve složce s daty" a dostaneš skutečné názvy souborů, ne prázdný seznam ani placeholdery.',
          'Sdílená složka ze SharePointu',
        ],
        [
          'Projekt a CLAUDE.md',
          'otevřeš CLAUDE.md a najdeš v něm aspoň tři pojmy ze své agendy, kterým by cizí člověk nerozuměl. Když jsou tam jen obecné věty, slovník chybí.',
          'Projekt v Claude Code',
        ],
        [
          'Mapa procesu',
          'ukážeš kresbu někomu z jiného oddělení a on ti dokáže říct, kde se v ní přepisuje ručně. Když to nepozná, mapa popisuje kroky, ne tok dat.',
          'Cvičení 1b: kresba flow',
        ],
        [
          'Skill',
          'spustíš ho jednou větou nad daty z jiného měsíce než z těch, ze kterých vznikl, a vyjde totéž co poprvé.',
          'Jak napsat skill',
        ],
        [
          'Kontrola',
          'otevřeš poslední protokol a rozhodneš z něj, jestli je výsledek v pořádku — bez otevírání samotného výstupu.',
          'Jak poznáš, že je výsledek špatně',
        ],
        [
          'Zábrana',
          'řekneš Claudovi „přidej řádek do souboru ve složce s originály" a uvidíš, že to odmítne. Patnáct vteřin.',
          'Jak se v projektu nastaví automatizace',
        ],
        [
          'Naplánovaná úloha',
          'najdeš v Routines tři záznamy o proběhlých bězích na různých datech, ne jeden zkušební.',
          'Naplánovaná úloha v Claude Code',
        ],
        [
          'Reálný běh',
          'umíš říct jedno číslo: kolik minut to dřív trvalo a kolik teď. A jednu věc, která se přitom pokazila.',
          'Pusť to naostro',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Když ti chybí víc než dva body',
      text:
        'Nedoháněj to najednou — vezmi ten nejvýš v tabulce, který nesedí, jsou seřazené tak, jak na sobě stojí. Skill bez CLAUDE.md se bude každý týden chovat trochu jinak. Naplánovaná úloha bez kontroly je jen rychlejší způsob, jak si nadělat škodu.',
    },
    { kind: 'h', text: 'Co když jeden krok prostě nejde' },
    {
      kind: 'table',
      head: ['Zádrhel', 'Co s tím'],
      rows: [
        [
          'Nemám co automatizovat — moje práce je pokaždé jiná',
          'Skoro nikdy to není pravda celé. Hledej ne celou agendu, ale jeden opakovaný přenos: export, který někam vkládáš, nebo sestavu, kterou skládáš každé pondělí.',
        ],
        [
          'Skill funguje, ale kontrolu psát neumím',
          'Začni jedním číslem. Kolik řádků přišlo na vstupu a kolik jich je na výstupu. Když to nesedí, něco se ztratilo — a to je kontrola, která odhalí většinu chyb.',
        ],
        [
          'Zábranu mi nejde nastavit',
          'Zeptej se Clauda: „napiš mi hook, který odmítne zápis do složky s originály, a zaregistruj ho". Napíše ho i zaregistruje. Pak si ho otestuj.',
        ],
        [
          'Naplánovaná úloha se nespustila',
          'Místní úloha běží jen se zapnutým počítačem a spuštěnou aplikací. Nejdřív ověř tohle, teprve pak hledej chybu v zadání.',
        ],
        [
          'Bojím se to pustit na ostrá data',
          'Nepouštěj. Nech ji zatím jen ukládat soubory a maily odklikávej ručně. Měsíc takového provozu je lepší podklad než jakákoli úvaha předem.',
        ],
      ],
    },
    {
      kind: 'task',
      title: 'Zadání: napiš si to na jednu stránku',
      intro:
        'Až je osm bodů odškrtaných, zbývá poslední věc: aby to uměl převzít někdo jiný. Bez toho je to tvoje osobní zkratka, ne firemní nástroj.',
      items: [
        'Napiš runbook: co to dělá, kdy to běží, kde jsou vstupy a výstupy, jak se pozná, že je výsledek dobře, co dělat, když spadne, a koho se zeptat.',
        'Dej ho přečíst kolegovi, který tvoji agendu nedělá, a nech ho podle něj úlohu jednou pustit.',
        'Co se ho musel zeptat, doplň do runbooku.',
      ],
      hint:
        'Otázka, kterou ti položí, je přesně ta věc, kterou máš v hlavě a nikde jinde. Právě kvůli ní se runbook píše.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'A odsud dál',
      text:
        'Když osm bodů sedí, minimum máš. Modul „Až budeš chtít víc" jsou tři směry k pokračování — žádný z nich nepotřebuješ k tomu, aby ti běželo to, co už máš. Ber je jako inspiraci, ne jako zbytek úkolu.',
    },
    {
      kind: 'links',
      title: 'Kudy dál',
      items: [
        {
          label: 'Formulář místo pinkání e-mailů',
          href: '#academy/od-mapy-k-automatu/formular-misto-emailu',
          note: 'Když ti data mají posílat kolegové a e-mail je ten problém, ne to, co se v něm posílá.',
        },
        {
          label: 'MCP nad katalogem dek.cz',
          href: '#academy/od-mapy-k-automatu/mcp-nad-katalogem',
          note: 'Ptát se na sortiment vlastními slovy a kombinovat katalog s vlastní složkou v jednom zadání.',
        },
        {
          label: 'Design system DEK ve Storybooku',
          href: '#academy/od-mapy-k-automatu/dek-design-system',
          note: 'Když si stavíš vlastní aplikace a chceš, aby vypadaly jako dek.cz.',
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
se seznamem, který jsem rozeslal. Připrav mi do vystupy/ dva soubory:
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
  module: 'provoz',
  title: 'Cvičný projekt: kontrola faktur ke stažení',
  summary:
    'Hotový projekt i s fakturami, skillem, zábranou a naplánovanou úlohou. Stáhneš, pustíš, porovnáš s referenčním výstupem — a pak přepneš na svoje faktury.',
  minutes: 20,
  kind: 'zadání',
  track: 'potom',
  outcomes: [
    'rozjet hotový projekt a ověřit si, že u tebe dává stejný výsledek',
    'popsat celou cestu faktury od e-mailu po zápis do evidence a žádost o doplnění',
    'přečíst kontrolní protokol a poznat z něj, co je k vyřízení',
    'nastavit naplánovanou úlohu, která běží samostatně, včetně chování při vypnutém počítači',
    'poznat rozdíl mezi povolením složky v Coworku a v Claude Code',
    'napojit projekt na skutečnou schránku, aniž bys musel cokoli přepisovat',
    'vědět, proč žádost o doplnění jde automaticky a platba účtárně ne',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Všechno, co jste v akademii četli, je tady dohromady na jedné agendě, ke stažení, takže si nemusíte nic vyrábět. Projekt hlídá schránku s fakturami: novou PDF přílohu uloží, vytáhne z ní šest povinných údajů a zapíše je do evidence do sešitu podle dodavatele. Když jeden nebo dva údaje chybí, sepíše žádost o doplnění a sám ji dodavateli pošle — to je jediná automatická zpráva, kterou smí poslat; nic neschvaluje, nic neplatí a nic nezapisuje do účetnictví. Krok za krokem je to rozepsané v části „3. Co se stane, když to pustíš“. Ve složce jsou i vzorové faktury, takže si to můžete pustit hned.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Konektor je potřeba, jen aby žádost doopravdy odešla',
      text:
        'Základní běh — přečíst faktury ve vstup/, vytáhnout z nich údaje, zapsat je do evidence a navrhnout odpověď — nic nepřipojuje, Claude si to bere přímo z disku. Jakmile má chybějící údaj poslat dodavateli doopravdy, potřebuje konektor na Microsoft 365 se zapnutými write tools — bez něj text jen navrhne a do sloupce „Žádost odeslána" v evidenci zapíše „připraveno, čeká na konektor". Zapojení konektoru je popsané v rutina.md, včetně textu, který poslat správci.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Proč zrovna faktury',
      text:
        'Faktury jsou dobrá agenda na cvičení, protože výsledek se dá jasně ověřit — buď to najde tu jednu schválně neúplnou fakturu, nebo ne. Kostru (složka s pravidly, skill, zábrana, kontrolní protokol, naplánovaný běh) jste v akademii viděli pořád stejnou — tohle je verze, kterou si stáhneš a rovnou spustíš.',
    },
    { kind: 'h', text: '1. Stáhni si to' },
    {
      kind: 'links',
      title: 'Cvičný projekt',
      items: [
        {
          label: 'faktury-kontrola.zip (235 kB)',
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
            'Všech pět už má řádek v evidenci, takže není co zpracovat — a Claude to řekne. Je to nuda, a přesně tak to má vypadat: úloha, která běží každých 15 minut, musí umět nedělat nic.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Co se změní, až to napojíš na schránku',
      text:
        'Kroky 2 až 7 zůstanou úplně stejné. Mění se jen začátek a konec: místo procházení vstup/ se úloha podívá do schránky na e-maily s PDF přílohou, které ještě nejsou uložené, a novou fakturu si do vstup/ sama uloží pod jménem <datum>_<dodavatel>.pdf. A místo „připraveno, čeká na konektor" se navržený text doopravdy odešle — na adresu, ze které faktura přišla, v kopii vedouci-uctarny@dek.cz, s předmětem „Doplnění faktury <číslo faktury>". Čas odeslání se pak zapíše na tři místa: do sešitu dodavatele, do „Přehledu" a do sloupce Žádost odeslána v evidenci.',
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
        'Až vám to dvakrát vyjde ručně, udělejte z toho úlohu: Code → Routines → New routine → Local. Cloudová varianta by nefungovala, nevidí složku na disku. Ať doopravdy odešle žádost o doplnění, potřebuje navíc konektor na Microsoft 365 se zapnutými write tools — bez nich poběží dál, jen bude text jen navrhovat (viz „Co napsat správci“ níž).',
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
      caption: 'Celé zadání úlohy. Poslední dvě věty jsou pojistky — bez nich je to hezký nápad, ne provoz.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Jak se to chová, když počítač spí',
      text:
        'Místní úloha běží, jen když je počítač vzhůru a aplikace spuštěná. Když zrovna spí, ten běh se přeskočí a doženou se jen běhy bezprostředně předtím — ne celá zameškaná historie. Po nočním vypnutí se nespustí padesát běhů najednou, jen ten poslední.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Hned po uložení dej Run now',
      text:
        'První běh se bude na pár věcí ptát — u každého dotazu vyberte „always allow“, další běhy pak proběhnou bez ptaní. Jinak se úloha zastaví na dotazu a bude čekat, až přijdete.',
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

K čemu to bude: automatická kontrola došlých faktur. Úloha zkontroluje
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
            'Sešity v objednavky.xlsx si skill zakládá sám podle dodavatele — nic tam ručně nepřipravuješ. Vyprázdni vstup/ a nech do ní chodit opravdové faktury; adresu schránky a kopii uprav v CLAUDE.md a rutina.md.',
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
        'úloha je založená, proběhla přes Run now a všechna oprávnění jsou odsouhlasená',
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

const L2_NAOSTRO: Lesson = {
  slug: 'pust-to-naostro',
  module: 'provoz',
  title: 'Pusť to naostro',
  summary:
    'Úkol na týden mezi setkáními. Nechat to běžet na skutečné práci a přinést zpátky, co se stalo.',
  minutes: 5,
  kind: 'zadání',
  track: 'potom',
  outcomes: [
    'pustit automatizaci na skutečné práci, ne na cvičných datech',
    'změřit, co se ušetřilo a co se pokazilo',
    'přinést zpátky nález, ze kterého se dá poučit celý tým',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Všechno předchozí byla příprava. Teď to pustíš na práci, kterou bys stejně musela udělat — a příští setkání začneme tím, co se stalo. Nejde o to, aby to vyšlo, ale aby bylo z čeho se poučit.',
    },
    {
      kind: 'task',
      title: 'Zadání na týden',
      intro: 'Vezmi svůj skill a použij ho na skutečné kolo své agendy.',
      items: [
        'Před spuštěním si zapiš, jak dlouho ti to obvykle trvá ručně. Odhad stačí.',
        'Pusť to. Když se to zasekne, oprav to a zapiš si, co chybělo.',
        'Zkontroluj výsledek podle kontrolního protokolu a rozhodni se, jestli ho pošleš.',
        'Když jsi ho poslala, zapiš si, jestli se někdo ozval s chybou.',
        'Změř, jak dlouho to trvalo celé — včetně oprav a kontroly.',
        'Když jsi to nepustila vůbec, zapiš proč. To je nejcennější odpověď z celého úkolu.',
      ],
    },
    { kind: 'h', text: 'A ještě jedna věc: předej to' },
    {
      kind: 'p',
      text:
        'Automatizace, kterou umí spustit jediný člověk, je riziko, ne úspora. Deset minut na test: posaď kolegu k počítači, dej mu projekt a nic neříkej. Každá otázka, kterou položí, je řádek, který v projektu chybí — a chybí i tobě, jen si to pamatuješ, takže to nepoznáš.',
    },
    {
      kind: 'list',
      items: [
        'Nech ho úlohu spustit bez nápovědy. Když neví, kde začít, chybí runbook.',
        'Nech ho výsledek zkontrolovat. Když neví, co znamená „nesedí počty“, chybí věta o tom, jak vypadá výsledek v pořádku.',
        'Zeptej se ho, co by musel dohledávat, kdybys tam nebyla — ne „bylo to jasné?“.',
        'Doplň to a nech ho zkusit znovu. Podruhé už by měl projít bez otázky.',
      ],
    },
    { kind: 'h', text: 'Co přinést zpátky' },
    {
      kind: 'table',
      head: ['Otázka', 'Proč se ptáme'],
      rows: [
        ['Kolikrát to doběhlo bez zásahu?', 'ukáže, jestli je postup hotový, nebo pořád hledá pravidla'],
        ['Co bylo potřeba doplnit?', 'chybějící pravidla se u různých lidí opakují — z toho vznikne společná část'],
        ['Kolik času to zabralo proti ručnímu?', 'první kolo bývá pomalejší. To je v pořádku a je dobré to říct nahlas'],
        ['Šel výsledek dál, ke kolegům?', 'jestli ne, chybí důvěra — a ta se buduje kontrolou, ne přesvědčováním'],
        ['Co tě na tom naštvalo?', 'obvykle nejlepší nápad na to, co udělat příště'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Neúspěch je taky výsledek',
      text:
        'Když to nepustíš — nebyl čas, přišel jiný formát dat, nechtělo se do toho — přijď to říct. Tyhle důvody jsou přesně to, co potřebujeme vědět, a bývají užitečnější než tři úspěšné běhy.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Kam to zapsat',
      text:
        'Krátce, do souboru v projektu — třeba vystupy/poznamky-<datum>.md. Nemusí to být hezké, musí to existovat, až se na to za týden budeme ptát.',
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
      'Kurz pro lidi, kteří každý týden přeskládávají tytéž tabulky a chtějí, aby se to dělalo samo. Nejdřív napojíš Claudovi složku, ve které ta práce žije, ohraničíš si, co v ní smí a nesmí, a založíš nad ní projekt s pravidly, která se nemusí opakovat každé ráno. Pak si na reálném procesu kontroly faktur vyzkoušíš najít místa, kde se dá práce automatizovat — a totéž uděláš na vlastní agendě.',
    level: 'Začátečník',
    section: 'Začni tady',
    modules: [
      {
        key: 'start',
        title: 'Orientace',
        summary:
          'Jak večer poběží — to si otevřeme společně. Zbytek jsou tři referenční lekce: co která slova znamenají, kolik to stojí a jak spolu souvisí Cowork a Claude Code.',
      },
      {
        key: 'napojeni',
        title: 'Nastavení: složka a projekt',
        summary:
          'Jediná část večera, kde se něco nastavuje. Děláme ji hned na začátku, aby se případný zádrhel našel teď a ne ve chvíli, kdy máš stavět.',
      },
      {
        key: 'zadani',
        title: 'Zadání a cvičení',
        summary:
          'Nejdřív hotový proces z účtárny jako vzor, pak totéž ve dvojicích na vlastní agendě.',
      },
    ],
    lessons: [LESSON_PROGRAM, LESSON_SLOVNICEK, LESSON_TOKENY, LESSON_COWORK, LESSON_SHAREPOINT, LESSON_CO_VIDI, LESSON_PROJEKT, LESSON_REGAL, LESSON_CVICENI, LESSON_FLOW, LESSON_SDILENI],
    learn: [
      'vysvětlit, za co se u Clauda platí, a vybrat model i effort podle úlohy',
      'zkrátit dlouhá sezení a zjistit, kam odtéká příděl',
      'vybrat si mezi chatem, Coworkem a Claude Code podle toho, kde leží data',
      'založit projekt tak, aby se pravidla nemusela opakovat každé ráno',
      'nasyncovat knihovnu ze SharePointu do počítače a otevřít ji v Claude Code',
      'číst pracovní proces jako tok dat mezi lidmi a soubory',
      'odlišit, co má převzít automatizace a co má zůstat člověku',
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
    title: 'Od mapy k automatu',
    summary:
      'Navazuje tam, kde první kurz skončil mapou procesu. Cílem je úloha, která doběhne bez tebe a ty poznáš, jestli dopadla dobře.',
    intro:
      'Mapu procesu už máš a víš, kde se přepisuje ručně. Tenhle kurz vede od ní až na poslední schod: k úloze, která se spustí sama a po které zůstane kontrola, ze které poznáš, jestli je výsledek v pořádku. Každou věc si nejdřív ukážeme na kontrole faktur, kterou znáš ze vzoru, a pak ji uděláš na vlastní agendě.',
    level: 'Navazující',
    section: 'Pokračuj',
    modules: [
      {
        key: 'remeslo',
        title: 'Řemeslo',
        summary:
          'Dvě dovednosti, bez kterých se nedá pustit nic bez dozoru: napsat zadání nad tabulkou a poznat, že je výsledek špatně.',
      },
      {
        key: 'postav',
        title: 'Postav to',
        summary:
          'Jedno místo z vlastní mapy dotažené do skillu, který má vlastní kontrolu a spustí se sám.',
      },
      {
        key: 'provoz',
        title: 'Dotáhni to do provozu',
        summary:
          'Zbytek minima: naplánovat, dát vědět mailem, projít si to na hotovém projektu a pustit to naostro. Na konci si na checklistu ověříš, že máš všechno.',
      },
      {
        key: 'vic',
        title: 'Až budeš chtít víc',
        summary:
          'Tři směry, kterými se dá pokračovat, až minimum funguje. Nic z toho není potřeba k tomu, aby ti běžela vlastní automatizace.',
      },
    ],
    lessons: [
      L2_TABULKY, L2_KONTROLA,
      LESSON_AUTOMATIZACE, L2_POSTAV, LESSON_SKILL,
      L2_ROZBOR, L2_PLAN, L2_EMAIL, L2_CVICNY, L2_NAOSTRO, L2_MINIMUM,
      L2_FORMULAR, L2_MCP, L2_DESIGN,
    ],
    learn: [
      'napsat zadání nad tabulkou, které projde napoprvé',
      'zkontrolovat výstup třemi čísly místo čtení řádek po řádku',
      'dotáhnout jedno místo z mapy až do skillu s vlastní kontrolou',
      'spustit úlohu bez rozhovoru a naplánovat ji',
      'zabalit opakovaný postup do skillu a trefit se v description',
      'napsat runbook a předat automatizaci tak, aby ji zvládl i někdo jiný',
      'projít si celý příklad od složky po rozeslané maily a ověřit si, že ti nic nechybí',
      'připojit MCP server nad katalogem dek.cz a ověřit si, že opravdu odpovídá z katalogu',
      'nahradit pinkání e-mailů formulářem a nechat si hlídat termíny',
      'rozjet hotový cvičný projekt a překlopit ho na vlastní dokumenty',
      'projít si design system DEKu ve Storybooku a přidat do něj kompozici z hotových komponent',
    ],
    prerequisites: [
      'Dokončený kurz Claude a firemní data',
      'Vlastní projekt se složkou dat a aspoň jedním hotovým zadáním',
      'Mapa procesu z cvičení ve dvojicích',
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
