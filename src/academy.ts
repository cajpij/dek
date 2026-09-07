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
  | {
      kind: 'figure'
      name: 'regal-flow' | 'sync-map' | 'project-tree' | 'automation-ladder' | 'routine-form'
      caption: string
    }
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
  track?: 'předem' | 'v sále' | 'potom'
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
  track: 'předem',
  outcomes: [
    'vědět, co si přinést s sebou',
    'vědět, co se bude dít v sále a co si z toho odnesete',
    'vědět, ke kterým lekcím se vrátit potom',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Workshop v sále má čtyři hodiny a víc ne schválně. K tomu je v akademii asi hodina a půl referenčních lekcí na potom — nečtou se dopředu. Předem po vás nechceme skoro nic — nastavení složky i projektu děláme společně hned na začátku večera, takže si nikdo nemusí lámat hlavu doma. Zbytek akademie je referenční materiál, ke kterému se vracíte, až budete stavět.',
    },
    {
      kind: 'table',
      head: ['Štítek', 'Znamená'],
      rows: [
        ['předem', 'dvě věci, které stačí mít s sebou — viz níž.'],
        ['v sále', 'děláme společně. Jsou to hlavně cvičení, ne přednášky.'],
        ['potom', 'referenční materiál. Vracejte se k němu, až budete stavět.'],
      ],
    },
    { kind: 'h', text: 'Předem: dvě věci, deset minut' },
    {
      kind: 'list',
      items: [
        'Nainstalovaný Claude Code a přihlášený firemní účet. Nic víc se instalovat nebude.',
        'Vědět, kterou svoji agendu chcete večer řešit, a mít k ní jeden reálný soubor — tabulku nebo dokument, se kterým každý týden pracujete. Klidně jen v hlavě, soubor najdeme společně.',
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nasyncovanou složku ani nic přečteného předem nechceme',
      text:
        'SharePoint, projekt, CLAUDE.md i videa k tomu jsou první blok v sále — přesunuli jsme je tam schválně. Když někomu nepojede sync, chceme to vidět v 16:20 a vyřešit to na místě, ne aby na to seděl sám doma. Kdo si to udělá dopředu, má první půlhodinu volnou a může pomoct sousedovi.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Minuty u lekcí a časy v programu nejsou totéž',
      text:
        'Číslo u lekce říká, jak dlouho trvá projít si ji samostatně. Program níž má vlastní časy — v sále se nečte, v sále se dělá. Proto je cvičení v programu kratší než lekce, ve které je popsané.',
    },
    { kind: 'h', text: 'V sále: 16:00–20:00' },
    {
      kind: 'table',
      head: ['Čas', 'Co se děje'],
      rows: [
        ['16:00', 'Úvod — proč to děláme a co si odnesete'],
        ['16:10', 'Rozehřívačka — postavíme se a řekneme, co jsme dneska dělali ručně'],
        ['16:20', 'Nastavení: sdílená složka a projekt. U vlastního počítače, s asistencí.'],
        ['16:50', 'Vzor: Od magazínu do regálu. Projdeme spolu jeden reálný proces.'],
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
      tone: 'info',
      title: 'Začíná se po pracovním dni',
      text:
        'Proto je hned po úvodu rozehřívačka: postavíte se, najdete si dvojici z jiného oddělení a každý řekne jednu věc, kterou dneska dělal nebo dělala ručně a štvalo ho to. Ta dvojice s vámi zůstane celé odpoledne — cizí člověk se ptá líp než kolega, který vaši agendu zná a domýšlí si.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nejdůležitější jsou dva bloky',
      text:
        'Cvičení ve dvojicích a stavění první automatizace. Když z programu něco vypadne, vypadne všechno ostatní — tyhle dva a nastavení na začátku zůstanou. Jsou to jediné části, ze kterých si odnesete něco vlastního.',
    },
    { kind: 'h', text: 'Samostudium po školení' },
    {
      kind: 'p',
      text:
        'Do čtyř hodin se toho vejde jen tolik, kolik se dá udělat společně. Všechno ostatní z akademie nezmizelo — je označené štítkem potom a čeká, až na něj dojde řada. Nečtěte to dopředu a nesnažte se to stihnout: vracejte se k tomu ve chvíli, kdy narazíte na to, co ta lekce řeší. Kostra je pořád stejná — pět schodů: zadání, pravidlo, skill, hook, běh bez tebe. První tři jste prošli v sále a poslední dva viděli v živé ukázce; do hloubky si je projdete sami. Když si máte vybrat jednu, vezměte Celý příklad — je to tentýž akční regál, ale dotažený od prázdné složky až po naplánovaný běh, který rozešle maily.',
    },
    {
      kind: 'table',
      head: ['Až budete potřebovat', 'Vraťte se do'],
      rows: [
        ['nevíte, co které slovo znamená', 'Slovníček'],
        ['vidět celou cestu na jednom příkladu', 'Celý příklad: od magazínu po mail produkťákům'],
        ['zabalit postup, který opakujete', 'Jak napsat skill'],
        ['zjistit, co skillu chybí, aby běžel sám', 'Rozbor skutečného skillu'],
        ['zamknout data a dostat notifikaci', 'Jak se v projektu nastaví automatizace'],
        ['založit úlohu, která se spustí sama', 'Naplánovaná úloha v Claude Code'],
        ['pustit to bez sebe a nespálit se', 'Nech to běžet bez sebe'],
        ['poslat z automatu e-mail', 'E-mail z automatu'],
        ['ptát se na katalog vlastními slovy', 'MCP nad katalogem dek.cz'],
        ['předat to kolegovi', 'Pusť to naostro'],
      ],
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
        'Lekce se snaží mluvit česky a bez žargonu, ale pár slov se nedá obejít — jsou to názvy věcí, které v Claude Code skutečně existují a takhle se jmenují i v aplikaci. Tady jsou pohromadě. Nemusíte si je pamatovat, stačí vědět, kde je najít.',
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
        'Zeptejte se Clauda: „co znamená X, řekni mi to jednou větou bez techniky". Odpoví lépe než jakýkoli slovník, protože ví, v jakém kontextu jste na to slovo narazili. A řekněte to lektorovi — doplní se sem.',
    },
  ],
}

const LESSON_PROJEKT: Lesson = {
  slug: 'projekt-v-claude-code',
  module: 'napojeni',
  title: 'Projekt v Claude Code: co si založit',
  summary:
    'Projekt ti založí Claude sám — jedním zadáním. Co při tom vzniklo a proč: CLAUDE.md, skill, artefakt, konektor, na hotových příkladech z logistiky, dopravy, BI, marketingu a vedení.',
  minutes: 20,
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
        'Claude Code se nespouští „v aplikaci“. Spouští se ve složce — a všechno, co si v něm nastavíš, jsou obyčejné soubory v té složce. To je dobrá zpráva: nastavení se dá číst, poslat kolegovi a verzovat. Ještě lepší zpráva: nic z toho nebudeš vyrábět ručně. Projekt ti založí Claude sám. Tvoje práce je rozumět tomu, co vzniklo — a rozhodnout jedinou věc, kterou za tebe rozhodnout nemůže: kde ta složka bude.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Pro koho to je',
      text:
        'Pro lidi z logistiky, dopravy, BI, marketingu a vedení, kteří nechtějí programovat, ale chtějí, aby se opakovaná práce dělala sama. Nic z toho, co je níž, není kód — jsou to textové soubory a složky.',
    },
    { kind: 'h', text: 'Založení nech na Claudovi' },
    {
      kind: 'p',
      text:
        'První věta v novém projektu není příkaz ani klikání v Průzkumníku. Je to zadání. Otevři Claude Code ve složce, kde má projekt vzniknout — kde přesně, probereme hned pod tím — a vlep tohle:',
    },
    {
      kind: 'code',
      text: `Založ mi tady projekt akcni-regal: složky data a vystupy a soubor
CLAUDE.md. Do CLAUDE.md napiš slovník téhle agendy — na pojmy se mě
zeptej — kde jsou data, a pravidlo, že originály v data/ se nikdy
nepřepisují: všechno nové se ukládá do vystupy/.`,
      caption: 'Dvacet vteřin a struktura stojí. Zbytek lekce vysvětluje, co právě vzniklo a proč — až se něco pokazí, budeš to potřebovat vědět.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Jedno rozhodnutí zůstává na tobě: kde',
      text:
        'Claude založí projekt tam, kde ho spustíš — a vybrat to místo je lidská práce. Když má agendu vidět tým a má nad ní jednou běžet naplánovaná úloha, musí složka ležet v nasyncované knihovně ze SharePointu: naplánovaná úloha má pole Folder a píše se do něj přesně tahle cesta. Projekt „někde na ploše“ funguje taky, ale kolegům se nenasyncuje a za půl roku ho nenajdeš ani ty.',
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
      caption: 'Tohle právě vzniklo. Nic z toho není povinné — a přesto se všechno vyplatí.',
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
      text: `.claude/skills/logisticke-dostupnosti/SKILL.md

---
name: logisticke-dostupnosti
description: Z exportu listu Logistika připraví soubory pro produkťáky
  po divizích (Nářadí, Elektro, VTS, Piekarová). Použij, když je v data/
  nový export magazínu a mají se rozeslat podklady produkťákům.
---

1. Najdi v data/ nejnovější export podle data v názvu.
2. Ověř, že má sloupce Číslo položky, Katalogové číslo, Název, MJ, PM.
3. Pro každou divizi ulož soubor Magazín <MĚSÍC> - <divize>.xlsx do vystupy/.
...`,
      caption: 'Řádek description rozhoduje o tom, kdy se skill sám nabídne. Piš do něj i slova, která se běžně říkají v zadání. Celý skill je rozebraný v lekci Rozbor skutečného skillu.',
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
- „Ulož to jako přehled do vystupy/ a shrň do pěti vět, co je potřeba řešit.“`,
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
          'V desktopové aplikaci Claude Code (záložka Code) klikni na Open folder / Otevřít složku a vyber tu nasyncovanou. Když se zeptá, jestli složce věříš, potvrď. Od téhle chvíle v ní Claude umí číst, hledat a zakládat soubory. Kdo pracuje v terminálu, udělá totéž příkazem níž.',
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
      },
      {
        title: 'Klikni na Přidat zástupce do OneDrivu',
        body:
          'V horní liště knihovny je Synchronizovat a vedle Přidat zástupce do OneDrivu (Add shortcut to OneDrive). Vezmi zástupce — chová se stejně, ale funguje i na jiných počítačích, kde je člověk přihlášený, a dá se snáz odebrat.',
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
        title: 'Otevři složku v Claude Code',
        body:
          'V desktopové aplikaci Claude Code (záložka Code) klikni na Open folder / Otevřít složku a vyber tu nasyncovanou. Když se zeptá, jestli složce věříš, potvrď. Od téhle chvíle v ní Claude umí číst, hledat a zakládat soubory. Kdo pracuje v terminálu, udělá totéž příkazem níž.',
        code: 'cd %UserProfile%\\<firma>\\<knihovna>\nclaude',
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
        'Klikni na ikonu mráčku → ozubené kolo → Nastavení → Účet a zkontroluj, kterým účtem je OneDrive přihlášený',
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
        'Claude se do SharePointu sám nepřihlásí. Umí ale pracovat se složkou, která je fyzicky na tvém počítači — a přesně tím se nasyncovaná knihovna stává. Cíl téhle lekce je jednorázové nastavení: jednou to proklikáš a pak už jen v každém úkolu vybereš složku ze seznamu.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Co k tomu potřebuješ',
      text:
        'Počítač s nainstalovanou aplikací OneDrive přihlášenou firemním účtem, přístup do knihovny na SharePointu a Claude Code. Nic dalšího se neinstaluje.',
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
        'Připojená složka není přístup do počítače. Je to přesně vymezený kus disku — ten, který si vybereš — a všechno ostatní zůstává mimo dosah. Vyplatí se vědět, kde ta hranice vede, protože podle toho se píše zadání.',
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
        'Práce se soubory, když je Claude Code zavřený — nic neběží na pozadí, dokud si to nenaplánuješ (to je až poslední lekce).',
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
  title: 'Od magazínu do regálu',
  summary:
    'Reálný proces akčního regálu rozepsaný na kroky. Úkolem je najít místa, kde se dá práce automatizovat.',
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
        'Tohle je skutečný proces z logistiky, zapsaný podle rozhovoru. Vzniká z něj akční regál na pobočkách — od chvíle, kdy produkťáci nasypou obsah magazínu do sdílené tabulky, až po podklady pro marketing, centrální sklad a backoffice. Přečti si ho celý a teprve pak se pusť do zadání pod diagramem.',
    },
    {
      kind: 'table',
      head: ['Parametr', 'Hodnota'],
      rows: [
        ['Předstih', '~6 týdnů, bez pevného termínu'],
        ['Divize', '4 — Nářadí, Elektro, VTS, Piekarová (podle souborů, které se rozesílají)'],
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
  module: 'potom',
  title: 'Jak se v projektu nastaví automatizace',
  summary:
    'Pět stupňů od ručního zadání po běh bez tebe — na reálném rozpadu divizních Excelů, krok po kroku.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
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
        'Automatizace nevznikne tím, že si řekneš „automatizuj to“. Vzniká po schodech: nejdřív úlohu uděláš ručně a popíšeš výsledek, pak z toho, co bylo potřeba vysvětlit, uděláš pravidlo, pak z celého postupu skill — a teprve když skill několikrát doběhl správně, má smysl ho spouštět bez sebe. Schody se nedají přeskočit. Kdo začne posledním, nastaví automat na postup, který si nikdy neověřil.',
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
        'Bylo potřeba říct, že kódy položek se nesmí měnit na čísla? Že se bere nejnovější soubor podle data v názvu? To nejsou postupy, to jsou fakta o agendě — patří do CLAUDE.md a od té chvíle platí v každém sezení. Tenhle stupeň je nejlevnější a nejvíc se vyplatí: většina „Claude to udělal blbě“ je ve skutečnosti pravidlo, které nikdo nenapsal.',
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
        'V Claude Code napiš `/hooks` — otevře se prohlížeč hooků, kde vidíš všechny události, kolik jich máš nastavených a co přesně který spouští. Je to nejrychlejší způsob, jak zjistit, jestli se hook vůbec zaregistroval. A samotný soubor settings.json ti klidně napíše Claude: řekni mu, co se má stát a při jaké události.',
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
        'Zbytek si nastavíš, až na něj narazíš. Tyhle dva se ale vyplatí mít od začátku: jeden ti dá vědět, že je hotovo, druhý ohlídá, že se nesáhne do dat. Dohromady jsou to přesně ty dvě věci, bez kterých se nedá pustit naplánovaný běh.',
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
        'Zábrana plus notifikace. Zábrana je důvod, proč se dá běh pustit bez dozoru — nemůže se stát to nejhorší. Notifikace je důvod, proč se pozná, že doběhl. Naplánovaná úloha bez těch dvou je jenom rychlejší způsob, jak si nadělat škodu.',
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
        'Poslední stupeň má smysl teprve tehdy, když všechno předchozí běželo několikrát správně a ty víš, jak poznáš, že výsledek je špatně. Claude Code umí běžet i bez rozhovoru — dostane zadání, odpracuje ho a skončí. Takový běh se dá naplánovat na čas a jeho výsledek si ráno jen zkontroluješ.',
    },
    {
      kind: 'code',
      text: `claude -p "Postupuj podle skillu logisticke-dostupnosti a výsledek ulož do vystupy/."`,
      caption: 'Jeden běh bez rozhovoru. Tohle je věta, kterou vložíš do naplánované úlohy — v Claude Code záložka Code → Routines → New routine → Local. Podrobně je to v lekci Nech to běžet bez sebe.',
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
        'Udělej ho jednou se zadáním a zapiš si každé doříkání, které bylo potřeba dodat.',
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
  module: 'potom',
  title: 'Jak napsat skill (a nechat si ho napsat)',
  summary:
    'Z čeho se skill skládá, proč o všem rozhoduje jediný řádek, a co dát Claudovi, aby ti skill napsal sám a dobře.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
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
    {
      kind: 'note',
      tone: 'info',
      title: 'Třetí patro: plugin',
      text:
        'Skill v projektu platí v projektu, skill v domovské složce jen u tebe. Jakmile má stejný postup používat víc týmů, zabalí se skilly do pluginu — balíčku, který se instaluje jedním příkazem a spravuje na jednom místě: když autor postup opraví, oprava dojde všem, kdo mají plugin nainstalovaný, místo aby po firmě žilo pět různě starých kopií. Plugin unese i víc než skilly — hooky i konektory — takže se dá rozdat celá automatizace najednou.',
    },
    {
      kind: 'code',
      text: `/plugin marketplace add dek/claude-pluginy   ← firemní katalog (repozitář na GitHubu)
/plugin install akcni-regal@dek              ← instalace balíčku z katalogu
/akcni-regal:logisticke-dostupnosti          ← skill z pluginu se volá se jménem balíčku`,
      caption:
        'Takhle by to vypadalo s firemním katalogem pluginů. Nezakládej ho kvůli prvnímu skillu — plugin má smysl, až když se postup měsíc osvědčil a chce ho další tým. Katalog pak spravuje jeden člověk, typicky IT; příkaz /plugin bez ničeho otevře přehled, kde se dá katalog procházet i klikáním.',
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
        'Tělo skillu se načte, až když si ho Claude vybere. A vybírá si ho podle jednoho jediného řádku — podle description. Když je vágní, skill se nespustí nikdy, nebo se naopak plete do věcí, kam nepatří. Piš do něj dvě věci: co skill dělá a kdy se má použít. A používej slova, která do zadání běžně píšeš.',
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
        'Nemusíš na to být sám či sama. V Claude Code je skill-creator — napiš lomítko a jeho jméno a provede tě založením nového skillu, úpravou existujícího i tím, jestli se spouští ve správných situacích. Výsledek se ukládá přes kartu, kterou si nejdřív projdeš, ne tak, že by ti někdo psal do souborů za zády.',
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
Chci skill, který mi z nového exportu magazínu udělá čtyři divizní
soubory pro produkťáky.

/skill-creator
Mám skill logisticke-dostupnosti, ale nespustí se, když napíšu
„připrav podklady pro produkťáky". Sprav mi to.

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
      title: 'Cvičení: napiš první skill z toho, co právě proběhlo',
      intro:
        'Vezmi úlohu, kterou máš z cvičení Postav si první automatizaci. Nezakládej nový soubor ručně.',
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
  module: 'potom',
  title: 'Rozbor skutečného skillu',
  summary:
    'Skill logisticke-dostupnosti tak, jak ho napsala logistika: co je na něm dobře, čtyři místa, kde selže potichu, a vylepšená verze, která se dá pustit bez dozoru.',
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
        'Tenhle skill dneska běží u logistiky a rozděluje export magazínu na divizní soubory. Napsala ho paní, která ho používá, a je to dobrý skill — proto se na něm dá ukázat něco cennějšího než na vymyšleném příkladu: kde je hranice mezi „funguje mi to" a „můžu to pustit bez sebe".',
    },
    {
      kind: 'code',
      text: `.claude/skills/logisticke-dostupnosti/SKILL.md — původní verze

---
name: logisticke-dostupnosti
description: Z exportu listu Logistika dotáhne skladová data a připraví
  soubory pro produkťáky po divizích (Nářadí, Elektro, VTS, Piekarová).
  Použij, když je v data/ nový export magazínu a mají se rozeslat
  podklady produkťákům.
---

# Logistické dostupnosti

1. Najdi v data/ nejnovější export listu Logistika a nejnovější trojici
   <RRRRMMDD>_Data_CS_skladem, _SD_CS a _minmax. Když nemají stejné
   datum, napiš to a zastav se.
2. Ověř, že export má sloupce Číslo položky, Katalogové číslo, Název, MJ,
   PM a Určení barvy. Když některý chybí, zastav se a řekni který.
3. Ke každé položce dotáhni počet kusů na CS, SD na pobočce a min/max.
   Kde údaj chybí, nech prázdno — nedopočítávej.
4. Rozděl položky podle divize a pro každou založ soubor
   vystupy/Magazín <MĚSÍC> - <divize>.xlsx, uvnitř list na každého PM.
5. Přidej prázdné sloupce AKČNÍ REGÁL (ANO/NE), POZNÁMKA
   (všechny sestavy/největší/velké), PRIORITA (1=nejvyšší, 2=nízká,
   3=nejnižší) a Opakuje se.
6. Na konci vypiš počet položek po divizích a seznam položek, u kterých
   chyběla data.

## Na co si dát pozor
- Čísla položek jsou text. Excel je rád převádí na čísla a ukusuje nuly.
- Barva se nepřepočítává, přebírá se z exportu.`,
      caption: 'Původní verze, tak jak vznikla. Nic na ní neopravuj, dokud si nepřečteš, co je na ní dobře.',
    },
    { kind: 'h', text: 'Co je na něm dobře' },
    {
      kind: 'list',
      items: [
        'Description říká co i kdy, a obsahuje slova, která u toho člověk skutečně použije — „nový export", „rozeslat podklady produkťákům". Přesně tak se má psát.',
        'Kroky 1 a 2 mají zastavovací pravidla. Většina skillů první verze žádné nemá.',
        '„Kde údaj chybí, nech prázdno — nedopočítávej." Jedna věta, která brání tomu nejhoršímu: vymyšleným číslům, která vypadají jako opravdová.',
        'Sekce „Na co si dát pozor" pojmenovává past, o které se nikde nedočteš — že Excel ukusuje úvodní nuly z čísel položek.',
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Osmdesát procent práce je hotových',
      text:
        'Tohle není ukázka špatného skillu. Je to ukázka skillu, se kterým se dá pracovat po boku — a který ještě nesnese, aby běžel v šest ráno, když u toho nikdo není. Rozdíl mezi tím dvojím jsou čtyři věci.',
    },
    { kind: 'h', text: 'Čtyři místa, která ho drží u země' },
    {
      kind: 'table',
      head: ['Co chybí', 'Co se stane', 'Jak se to pozná'],
      rows: [
        [
          'Výstup kontroly jde do chatu, ne do souboru',
          'krok 6 vypíše počty do rozhovoru, kde se za hodinu ztratí',
          'nijak. Ráno po naplánovaném běhu není co otevřít.',
        ],
        [
          'Nikdo neporovná počet řádků na vstupu a na výstupu',
          'když se při rozdělení část položek ztratí, soubory přesto vzniknou',
          'až za tři týdny, když produkťák řekne, že mu něco chybí',
        ],
        [
          'Neřeší se položky bez divize',
          'krok 4 rozdělí „podle divize" — co je prázdné nebo cizí, tiše vypadne',
          'nijak. Zmizelá položka po sobě nenechá stopu.',
        ],
        [
          '„Nejnovější" není definované',
          'jednou se vezme podle data v názvu, podruhé podle data změny souboru',
          'když někdo soubor jen otevře a uloží, posune se pořadí',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Všechny čtyři mají stejný podpis',
      text:
        'Selžou potichu. Skill doběhne, soubory vzniknou, nikde není červená hláška — a přesto je výsledek špatně. Tohle je jediný druh chyby, který stojí za to řešit dopředu; toho, že něco spadne s chybou, se bát nemusíš, to poznáš hned.',
    },
    { kind: 'h', text: 'Vylepšená verze' },
    {
      kind: 'code',
      text: `---
name: logisticke-dostupnosti
description: Z exportu listu Logistika dotáhne skladová data, připraví
  soubory pro produkťáky po divizích (Nářadí, Elektro, VTS, Piekarová)
  a vyrobí kontrolní protokol. Použij, když je v data/ nový export
  magazínu a mají se rozeslat podklady produkťákům.
---

# Logistické dostupnosti

## Vstup
Nejnovější trojice v data/ podle data v NÁZVU souboru (RRRRMMDD_), ne
podle data poslední změny: _Data_CS_skladem, _SD_CS, _minmax, a k nim
nejnovější export listu Logistika. Když nemají stejné datum, zastav se
a napiš která.

Číslo položky a Katalogové číslo načítej jako text, nikdy jako číslo —
useknou se úvodní nuly.

Do data/ se nezapisuje. Všechno nové jde do vystupy/.

## Postup
1. Ověř sloupce: Číslo položky, Katalogové číslo, Název, MJ, PM,
   Určení barvy. Když některý chybí, zastav se a řekni který.
2. Ke každé položce dotáhni počet kusů na CS, SD na pobočce a min/max.
   Kde údaj chybí, nech prázdno — nedopočítávej.
3. Rozděl položky podle divize. Položky s prázdnou nebo neznámou divizí
   NEZAHAZUJ: ulož je do vystupy/Magazín <MĚSÍC> - nezarazene.xlsx.
4. Pro každou divizi ulož vystupy/Magazín <MĚSÍC> - <divize>.xlsx,
   uvnitř list na každého PM. <MĚSÍC> ber z data exportu.
5. Přidej prázdné sloupce AKČNÍ REGÁL (ANO/NE), POZNÁMKA
   (všechny sestavy/největší/velké), PRIORITA (1=nejvyšší, 2=nízká,
   3=nejnižší) a Opakuje se — na konec, za stávající sloupce.
6. Ulož vystupy/protokol-<RRRRMMDD>.md podle šablony níž.

## Kontrolní protokol
- které čtyři soubory se použily, i s datem v názvu
- počet řádků na vstupu
- počet řádků v součtu všech výstupů včetně nezařazených
- rozdíl mezi těmi dvěma čísly — musí být nula
- počty položek po divizích a po PM
- kolik položek nemá kusy na CS, kolik nemá SD, kolik nemá min/max
- seznam nezařazených položek i s tím, co měly ve sloupci divize

## Zastav se, když
- vstupní a výstupní počet řádků nesedí
- vyjde divize, která není v seznamu čtyř
- víc než 5 % položek nemá dotažená skladová data
- nezařazených položek je víc než deset

## Na co si dát pozor
- Barva se nepřepočítává, přebírá se z exportu.
- Prázdný sloupec neznamená nulu. Nulu nikdy nedoplňuj.`,
      caption: 'Delší o dvě sekce. Obě jsou o tom, jak poznat, že výsledek je špatně — ne o tom, jak ho vyrobit.',
    },
    { kind: 'h', text: 'Co to způsobí' },
    {
      kind: 'table',
      head: ['', 'Původní', 'Vylepšený'],
      rows: [
        [
          'Ranní kontrola',
          'projít čtyři soubory očima',
          'otevřít protokol a podívat se na jedno číslo: rozdíl musí být nula',
        ],
        [
          'Ztracená položka',
          'zjistí se od produkťáka za tři týdny',
          'skill se sám zastaví, protože počty nesedí',
        ],
        [
          'Nová divize v exportu',
          'vznikne pátý soubor, kterého si nikdo nevšimne',
          'skill se zastaví a napíše, jakou hodnotu našel',
        ],
        [
          'Dva běhy nad stejnými daty',
          'můžou dopadnout jinak podle toho, co kdo otevřel',
          'dopadnou stejně — vstup je určený datem v názvu',
        ],
        [
          'Naplánovaný běh',
          'nedá se — po běhu nezůstane nic ke kontrole',
          'dá se. Protokol je ta stopa, kterou naplánovaný běh potřebuje.',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Vzorec, který platí na každý skill',
      text:
        'Přidali jsme jen dvě věci: ať po sobě nechá zapsanou kontrolu, a ať se zastaví, když něco nesedí. Nic z toho nemění, co skill dělá. Mění to, jestli mu můžeš věřit i ve chvíli, kdy se nedíváš — a to je ten jediný rozdíl mezi pomocníkem a automatem.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Co jsme naopak nepřidali',
      text:
        'Žádná pravidla navíc o formátování, žádné „buď důkladný", žádné vysvětlování, co je divize. Skill má být krátký; každá věta, která nezmění výsledek, jenom zvyšuje šanci, že se přehlédne ta, která ho změní. Když je ti skill dlouhý, škrtej v postupu, ne v kontrolách.',
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
      hint: 'Když u některé odpovíš „nevím", je to ta, kterou máš opravit jako první.',
    },
  ],
}

const LESSON_CVICENI: Lesson = {
  slug: 'zmapuj-kolegovi-workflow',
  module: 'zadani',
  title: 'Cvičení ve dvojicích: zmapuj kolegovi workflow',
  summary:
    'Ve dvojici si navzájem vyzpovídáte kus vlastní práce, nakreslíte z toho flow a označíte místa k automatizaci. Rozhovor nahrajete na telefon a přepis i reálné soubory skončí v projektu.',
  minutes: 65,
  kind: 'zadání',
  track: 'v sále',
  outcomes: [
    'vést rozhovor o práci tak, aby vyšlo najevo i to, co je pro majitele agendy neviditelné',
    'zapsat cizí proces jako tok dat mezi lidmi a soubory',
    'nakreslit flow do tří pruhů podle toho, kdo co drží',
    'označit místa, kde se data přenášejí ručně',
    'dostat nahrávku, přepis i reálné soubory do projektu, aby se s nimi dalo dál pracovat',
    'odlišit, co má převzít automatizace a co má zůstat člověku',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Předchozí lekce byla vzor — hotový proces akčního regálu, na kterém jste si vyzkoušeli hledat automatizace. Teď to samé uděláte na vlastní agendě. Ve dvojicích, protože sám sobě proces nikdo nepopíše dobře: to, co děláte každý týden, se vám dávno slilo do jednoho kroku, a ten se rozpadne na pět, teprve když se někdo zeptá.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Co si vybrat',
      text:
        'Kus práce, který děláte pravidelně a ve kterém někde vstupuje e-mail nebo tabulka a někam něco posíláte dál. Nemusí to být celá agenda — stačí výsek od „přijde mi to“ po „pošlu to dál“. Nezačínejte tím nejsložitějším, co máte.',
    },
    { kind: 'h', text: 'Jak to poběží' },
    {
      kind: 'table',
      head: ['Čas', 'Co se děje', 'Kdo mluví'],
      rows: [
        ['5 min', 'Každý si vybere svůj výsek a napíše ho jednou větou', 'oba'],
        ['15 min', 'Rozhovor: A se ptá, B popisuje svoji práci. A si zapisuje.', 'B'],
        ['15 min', 'Prohodíte se. B se ptá, A popisuje.', 'A'],
        ['10 min', 'Každý nakreslí flow toho druhého', 'oba, mlčky'],
        ['10 min', 'Ukážete si kresby a společně označíte místa k automatizaci', 'oba'],
        ['5 min', 'Každá dvojice řekne ostatním jeden krok, který je nejhorší', 'oba'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Kreslí ten, kdo se ptal',
      text:
        'Ne majitel agendy. Je to schválně: co tazatel nedokáže nakreslit, to se v rozhovoru nedozvěděl — a to je přesně ta informace, která v procesu chybí i všem ostatním.',
    },
    { kind: 'h', text: 'Technika: kontextové dotazování' },
    {
      kind: 'p',
      text:
        'V UX se tomuhle typu rozhovoru říká kontextové dotazování a stojí na jednom rozdílu: lidé popisují svoji práci jinak, než ji dělají. Když se zeptáte „jak to děláš“, dostanete uklizenou verzi bez výjimek. Když se zeptáte „ukaž mi, jak to bylo naposledy“, dostanete tu skutečnou — i s tím, že jeden člověk posílá print screeny a jedna položka se musí přeťukat ručně.',
    },
    {
      kind: 'list',
      items: [
        'Ptej se na poslední konkrétní případ, ne na to, jak se to dělá obecně.',
        'Nech ho otevřít ten soubor. Papír zapomíná, obrazovka ne.',
        'Po každém kroku se zeptej: „a co se stane pak?“ Dokud nedojdete na konec.',
        'Když někdo přeskočí dva kroky najednou, vrať se: „a to se stane kde?“',
        'Během rozhovoru nenavrhuj řešení. Jakmile začneš radit, druhý přestane popisovat a začne se obhajovat.',
        'Nahraj si to na telefon — ale zeptej se, jestli může. Zapíšeš vždycky míň, než zazní.',
      ],
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
      caption: 'Poslední dvě otázky bývají nejcennější. Odhalí to, co v žádném manuálu není.',
    },
    { kind: 'h', text: 'Slova, na která nastražit uši' },
    {
      kind: 'p',
      text:
        'Lidé zmiňují ruční práci mimochodem, jako by to byla samozřejmost. Když některé z těchhle slov padne, zapiš si celý krok — skoro vždycky je to místo k automatizaci.',
    },
    {
      kind: 'table',
      head: ['Když zazní', 'Znamená to'],
      rows: [
        ['„to si pak vykopíruju“', 'data se přenášejí ručně mezi dvěma soubory'],
        ['„to si vždycky musím zkontrolovat“', 'nikdo nevěří vstupu — chybí pravidlo nebo validace'],
        ['„to mi pošle print screenem“', 'odpověď přichází ve formátu, ze kterého se musí přeťukávat'],
        ['„to mám v hlavě“', 'pravidlo, které není nikde zapsané a odejde s člověkem'],
        ['„to už dělám tak dlouho, že…“', 'krok, který si nikdo nepamatuje proč'],
        ['„a pak čekám, až mi odpoví“', 'proces stojí na e-mailu jako na frontě'],
        ['„občas se stane, že…“', 'výjimka, na kterou se v návrhu zapomene'],
      ],
    },
    { kind: 'h', text: 'Kresba: tři pruhy' },
    {
      kind: 'p',
      text:
        'Vezmi papír na šířku a rozděl ho třemi vodorovnými pruhy: nahoře kdo dodává vstup, uprostřed člověk, o kterém je řeč, dole kdo dostává výstup. Kroky piš zleva doprava. Nad každou šipku napiš, čím se to přenáší — e-mail, sdílená tabulka, print screen, telefon. Ten popis šipky je důležitější než samotné boxy: automatizuje se přenos, ne práce.',
    },
    {
      kind: 'figure',
      name: 'regal-flow',
      caption:
        'Vzor z předchozí lekce, jak to má vypadat. Vaše kresba nemusí být hezká — musí být čitelná pro někoho, kdo tu agendu nedělá.',
    },
    { kind: 'h', text: 'Označení míst' },
    {
      kind: 'p',
      text:
        'Až je flow nakreslené, projděte ho spolu a označte každý krok jednou ze tří značek. Použijte tři barvy fixů nebo tři značky, na kterých se domluvíte.',
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
        'Spousta kroků vypadá jako rozhodování, ale ve skutečnosti se počítá — jen to pravidlo nikdo nikdy nenapsal. Když u kroku umíte říct „dělám to tak, že když je tohle větší než tamto, tak…“, není to rozhodnutí. Je to vzorec.',
    },
    { kind: 'h', text: 'Nahrajte si to a dejte do projektu' },
    {
      kind: 'p',
      text:
        'Rozhovor si nahrajte na telefon — stačí diktafon, který v něm máte. Zápisky z rozhovoru jsou dobré na kreslení, ale nahrávka drží to, co jste nestihli zapsat: přesné názvy souborů, poznámky mimochodem, věty typu „to mi vždycky pošle print screenem“. Z nahrávky pak vznikne přepis a z přepisu podklad, ke kterému se dá vrátit za měsíc.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Zeptejte se, než zmáčknete nahrávání',
      text:
        'Nahráváte kolegu při práci. Řekněte, k čemu to bude a kde to skončí, a nechte ho říct ne. Když nahrávat nechce, cvičení funguje i bez toho — jen si víc zapisujte.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Na začátku nahrávky řekněte, o co jde',
          body:
            'Jedna věta do mikrofonu: kdo mluví, jaká agenda, jaké datum. Za tři týdny, až budete mít nahrávek pět, to bude jediné, podle čeho je rozeznáte.',
          code: 'Šestého října, logistika, akční regál. Ptá se Martin, popisuje Katka.',
        },
        {
          title: 'Přesuňte nahrávku do projektu',
          body:
            'Pošlete si ji z telefonu do počítače a uložte do složky projektu, do podsložky podklady/. Ne na plochu — projekt je to, co Claude vidí.',
        },
        {
          title: 'Nechte ji přepsat — ale ne Claudem',
          body:
            'Claude Code zvuk neslyší. Přepis udělá jiná věc a Claude pak pracuje s textem. Nejjednodušší je nechat si nahrávku přepsat rovnou v telefonu: Hlasové záznamy na iPhonu (od iOS 18) i Rekordér na Androidu mají přepis vestavěný — text zkopírujte do souboru vedle nahrávky, stejný název, přípona .txt. Kdo to v telefonu nemá, použije skript na přepis, který dostanete od lektora; položí .txt vedle nahrávky sám. Teprve pak přijde na řadu skill níž — ten přepis uklidí, doplní časy a vytáhne z něj pojmy.',
          code: 'V podklady/ je nahrávka a vedle ní přepis. Postupuj podle skillu prepis-rozhovoru.',
        },
        {
          title: 'Doplňte reálné soubory, ne screenshoty',
          body:
            'Screenshot ukáže, jak to vypadá. Soubor ukáže, co v tom je — a s tím se dá pracovat. Vezměte kopii exportu, se kterým kolega pracuje, jeden e-mail, kterým mu přijde zadání, a jeden hotový výstup z minula. Když je zdrojem sdílená tabulka ze SharePointu, stáhněte si její kopii do podklady/ a nechte originál na pokoji.',
        },
        {
          title: 'Nechte si udělat flow z přepisu',
          body:
            'Až máte přepis i soubory pohromadě, zadání zní takhle. Výsledek porovnejte s tím, co jste nakreslili na papír — rozdíly jsou zajímavější než shody.',
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
        'Podklady zůstávají pohromadě u nahrávky, ze které vznikly. Sdílený soubor ze SharePointu se sem kopíruje — originál zůstává tam, kde je, a nikdo ho omylem nepřepíše.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Kopie, ne originál',
      text:
        'Když projekt leží uvnitř nasyncované knihovny, všechno, co do něj dáte, uvidí celý tým. Kopie exportu je v pořádku. Cokoli, co do sdílené složky nepatří — osobní údaje, ceny, které nemají být venku — tam nedávejte a v přepisu to smažte.',
    },
    {
      kind: 'h', text: 'Skill na přepis',
    },
    {
      kind: 'p',
      text:
        'Tenhle skill napíšete jednou a použijete ho na každý další rozhovor. Je to přesně ten případ z lekce Projekt v Claude Code: postup, který se opakuje, a stačí ho popsat jednou. Jak se skill zakládá, nemusíte teď vědět — stačí vytvořit v projektu složku .claude/skills/prepis-rozhovoru/ a do ní uložit soubor SKILL.md s textem níž. Nebo to celé řekněte Claudovi: „založ mi skill prepis-rozhovoru s tímhle obsahem".',
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
        'Poslední bod výpisu je ten důležitý — věty o ručním přenosu dat jsou seznam kandidátů na automatizaci ještě předtím, než někdo něco nakreslí.',
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
        'Nahrávka a její přepis ve složce projektu, vedle kopií reálných souborů, o kterých byla řeč.',
      ],
      hint:
        'U posledního bodu nebuďte skromní. Krok, který vypadá jako administrativa, ale ve skutečnosti opravuje data, která lžou, je ten nejcennější kus práce v celém procesu.',
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
          'Držte časy. Nedopovězený detail je lepší než nedokreslené flow.',
        ],
        [
          'Majitel agendy se začne obhajovat',
          'Tazatel se ptá, ne hodnotí. Vrať se k „ukaž mi, jak to bylo naposledy“.',
        ],
        [
          'Proces se větví do tří variant',
          'Nakresli tu nejčastější a větve si poznač stranou. Výjimky řešte až u návrhu.',
        ],
        [
          'Kresba nejde dokončit',
          'To je taky výsledek. Označ místo, kde to drhlo — tam informace chybí i v reálu.',
        ],
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
  minutes: 15,
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
        'Claude s tabulkami umí. Problém nejsou tabulky, ale to, že o nich obě strany předpokládají něco jiného. Ty víš, že hlavička je na třetím řádku a že prázdné pole znamená „nezjištěno“, ne nulu. On to neví, dokud mu to neřekneš — a když mu to neřekneš, tak si to domyslí. Tahle lekce je o tom, jak předejít domýšlení.',
    },
    { kind: 'h', text: 'Nech si nejdřív popsat, co v tom je' },
    {
      kind: 'p',
      text:
        'Než zadáš první výpočet, nech si popsat strukturu. Trvá to třicet vteřin a ušetří to celé kolo. Navíc hned uvidíš, jestli si soubor přečetl tak, jak čekáš.',
    },
    {
      kind: 'code',
      text: `Než začneš cokoli počítat, popiš mi strukturu tohohle souboru:
kolik má listů a jak se jmenují, na kterém řádku začíná hlavička,
kolik je řádků dat, jaké typy jsou v jednotlivých sloupcích
a kde jsou prázdná pole.`,
      caption: 'Když v odpovědi něco nesedí, nesedí to i ve všem, co by následovalo.',
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
          '„Ve sloupci Divize jsou sloučené buňky. Hodnota platí až do dalšího vyplněného řádku.“',
        ],
        [
          'Víc listů se stejnými sloupci',
          'spočítá se jen ten první, nebo se sečtou dohromady',
          '„Každý list je jeden produkťák. Zpracuj je zvlášť a výsledky nesčítej.“',
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
    { kind: 'h', text: 'Na vzoru: co nastraží list Logistika' },
    {
      kind: 'p',
      text:
        'Vezmi si tabulku pastí a projdi s ní ten soubor, který znáte ze zadání o akčním regálu. Vyjde jich pět — a všech pět je důvod, proč se ruční kontrola nikdy nedala vynechat.',
    },
    {
      kind: 'table',
      head: ['V listu Logistika', 'Co se stane bez pravidla'],
      rows: [
        ['Přes 5 500 řádků seskupených po měsících', 'zpracuje se i to, co patří do jiného vydání'],
        ['Čísla položek jako 4400828065', 'převede se na číslo, položka se nespáruje s min/max'],
        ['Barva se počítá podle klíče v prvních dvou řádcích', 'první dva řádky se vezmou jako data'],
        ['Pomlčka místo prázdna ve sloupcích SD', 'pomlčka se počítá jako text a součet spadne'],
        ['Data se do listu tahají přes QUERY', 'to, co je vidět, se může lišit od toho, co je uložené'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nejdřív na vzoru, pak na svém',
      text:
        'Celý tenhle kurz jede ve dvou krocích: každou věc si ukážeme na akčním regálu, který už znáte, a pak ji uděláte na vlastní agendě. Vzor je tu proto, aby bylo s čím porovnávat, když vám vlastní proces vyjde jinak.',
    },
    { kind: 'h', text: 'Struktura zadání, které projde napoprvé' },
    {
      kind: 'p',
      text:
        'Čtyři části: co vzít, co s tím udělat, kam to uložit, co dělat s výjimkou. Ta poslední je ta, na kterou se zapomíná, a přitom rozhoduje o tom, jestli výsledku budeš moct věřit.',
    },
    {
      kind: 'code',
      text: `Vezmi nejnovější Magazin2026_Logistika_export.csv z data/.

Ke každé položce dotáhni min/max z <RRRRMMDD>_minmax a počet kusů
na CS z <RRRRMMDD>_Data_CS_skladem, spáruj přes číslo položky.

Ulož jako vystupy/regal-podklad-<RRRR-MM-DD>.xlsx, sloupce v pořadí
Číslo položky, Název, Divize, Min, Max, Kusů na CS.

Kde údaj chybí, nech prázdno. Na konci mi napiš, kolika položek
se to týkalo a vypiš jejich čísla.`,
      caption: 'Poslední odstavec je ten, který dělá rozdíl. Bez něj dostaneš tabulku, ve které nepoznáš, co je změřené a co dopočítané.',
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
        'Tahle lekce je nudná a je nejdůležitější v celém kurzu. Důvod je jednoduchý: dokud neumíš rychle ověřit, že je výsledek v pořádku, budeš kontrolovat všechno ručně — a pak je jedno, jak dobře to Claude spočítal, protože se neušetřilo nic. Automatizace začíná fungovat ve chvíli, kdy kontrola trvá minutu místo hodiny.',
    },
    { kind: 'h', text: 'Tři otázky na každý výstup' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Sedí počty?',
          body:
            'Kolik řádků šlo dovnitř a kolik vyšlo ven? Když se to liší, musí být důvod, který umíš pojmenovat — filtr, deduplikace, rozpad na víc souborů. Když ho neumíš pojmenovat, něco se ztratilo.',
          code: 'Kolik řádků měl vstup, kolik má výstup a čím se ten rozdíl vysvětluje?',
        },
        {
          title: 'Sedí součty?',
          body:
            'Sečti jeden číselný sloupec před a po. U rozpadu na víc souborů sečti součty všech dílů. Tohle chytí většinu chyb v párování a duplicitách.',
          code: 'Sečti sloupec Kusů na CS ve vstupu a ve všech výstupních souborech. Sedí to?',
        },
        {
          title: 'Sedí vzorek?',
          body:
            'Vyber pět řádků — dva náhodné, jeden nejmenší, jeden největší a jeden, u kterého něco chybělo — a projdi je ručně proti originálu. Pět řádků zabere dvě minuty a chytí to, co součty přehlédnou.',
          code: 'Vyber pět položek podle klíče výš a ukaž mi u každé, odkud se každá hodnota vzala.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Neptej se, jestli je to správně',
      text:
        'Odpověď „ano, zkontroloval jsem to“ nemá žádnou hodnotu — je to tvrzení o tvrzení. Ptej se na čísla, která se dají porovnat s originálem: počty, součty, konkrétní hodnoty u konkrétních řádků. Kontrola je porovnání, ne ujištění.',
    },
    { kind: 'h', text: 'Nech si vyrobit kontrolní protokol' },
    {
      kind: 'p',
      text:
        'Místo opakování kontroly pokaždé znovu, udělej z ní součást úlohy. Ke každému výstupu ať vznikne krátký soubor, ve kterém je všechno, co potřebuješ k rozhodnutí „můžu to poslat“.',
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
    { kind: 'h', text: 'Na vzoru: tři čísla u akčního regálu' },
    {
      kind: 'p',
      text:
        'U divizních souborů z magazínu vypadají ty tři otázky takhle. Všimni si, že žádná z nich nevyžaduje otevřít soubor a číst ho.',
    },
    {
      kind: 'code',
      text: `kontrola-2026-10-06.md

Vstup:  Magazin2026_Logistika_export.csv — 1 284 řádků (jen ŘÍJEN)
Výstup: 4 soubory, dohromady 1 284 řádků
        Nářadí 612 · Elektro 341 · VTS 208 · Piekarová 123
Rozdíl: 0

Součet Kusů na CS: vstup 84 512 / výstup 84 512

Bez dat: 37 položek (chybí min/max)
         4400828065, 4400828059, 4400828061 … (celý seznam níž)

Vzorek:
  4400821760  min/max z 20260901_minmax ř. 412, CS z 20260902 ř. 88
  3260001964  min/max chybí, ponecháno prázdné
  …

Divné:  Použité soubory nemají stejné datum (0901 vs 0902).
        Podle pravidla jsem se měl zastavit — ptám se: pokračovat?`,
      caption: 'Poslední odstavec je ten, kvůli kterému to celé má smysl. Automat, který si všimne, že něco nesedí, a zeptá se, je použitelný. Ten, který to spočítá potichu, není.',
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
        'Většina agend se měsíc od měsíce mění málo. Když ti počet položek skočí o třetinu nebo zmizí celá divize, je to vidět na první pohled — ale jen když se podíváš. Nech si porovnat nový výstup s tím minulým a vypsat, co se výrazně změnilo.',
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
        'Máš mapu svého procesu a v ní označená místa, kde se přenáší data ručně. Teď z jednoho z nich uděláš skill. Celé to trvá tři čtvrtě hodiny a na konci máš něco, co příště spustíš jednou větou.',
    },
    { kind: 'h', text: 'Vyber ten správný první krok' },
    {
      kind: 'p',
      text:
        'Neber ten nejbolestivější. Ber ten, který se dá dokončit. První automatizace má hlavně dokázat, že to jde — bolestivé kroky přijdou, až budeš vědět, jak to celé funguje.',
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
            'Pusť si celý postup jednou na datech akčního regálu — tam víš, jak má výsledek vypadat, protože ho máte v předchozím kurzu rozebraný krok po kroku. Až tenhle průchod vyjde, jdi na svoje.',
        },
        {
          title: 'Připrav si materiál',
          body:
            'Do data/ dej reálný vstup a do vystupy/ dej výsledek z minula — ten, který je správně. Bez něj nepoznáš, jestli to vyšlo.',
        },
        {
          title: 'Udělej to jednou zadáním',
          body:
            'Napiš zadání podle struktury z lekce Zadání nad tabulkou: co vzít, co udělat, kam uložit, co s výjimkou. A pak si všímej, kolikrát musíš něco doříct.',
        },
        {
          title: 'Porovnej s tím, co je správně',
          body:
            'Použij tři otázky z lekce Jak poznáš, že je to špatně — počty, součty, vzorek. Tady se skoro vždycky ukáže první chybějící pravidlo.',
        },
        {
          title: 'Doříkání přepiš do CLAUDE.md',
          body:
            'Všechno, co bylo potřeba vysvětlit a co platí i mimo tuhle úlohu, je pravidlo. Do skillu to nepatří.',
        },
        {
          title: 'Nech si napsat skill',
          body:
            'Hned po tom, co úloha doběhla správně, vlep do chatu zadání níž. Claude z právě proběhlého rozhovoru vyrobí soubor SKILL.md. Pak ho přečti a oprav řádek description tak, aby se trefil do slov, kterými bys tu úlohu zadával příště. Jak skill funguje uvnitř, je v lekci Jak napsat skill — teď to nepotřebuješ.',
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
            'Poslední krok skillu ať vyrobí kontrolní protokol. Tohle je ta věc, kvůli které se to jednou bude dát pustit bez tebe.',
        },
        {
          title: 'Spusť to na jiných datech',
          body:
            'Na jiném měsíci. Když vyjde něco jiného než minule, není to chyba skillu — je to chybějící pravidlo. Doplň ho a zkus to znovu.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Hotovo je, když',
      text:
        'Skill projde dvakrát po sobě na různých datech bez jediné opravy, a kontrolní protokol ti dá dost na to, abys výsledek poslala dál bez otevírání souboru. Nic víc od prvního skillu nechtěj.',
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


const L2_CELY_PRIKLAD: Lesson = {
  slug: 'cely-priklad-magazin',
  module: 'potom',
  title: 'Celý příklad: od magazínu po mail produkťákům',
  summary:
    'Jeden reálný proces dotažený od složky až po úlohu, která v pondělí v šest ráno rozešle divizní soubory. Vyplněný formulář, konektory, hooky, kontrola.',
  minutes: 15,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'vidět celou cestu od ručního rozpadu po naplánovaný běh na jednom příkladu',
    'vědět, co přesně vyplnit do formuláře naplánované úlohy',
    'vědět, které konektory připojit a co bez nich nepůjde',
    'poznat, co musí být hotové dřív, než se úloha vůbec založí',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Všechny ostatní lekce ukazují jeden kus. Tahle skládá celý příklad dohromady: bereme druhé ze tří míst k automatizaci z akčního regálu — rozpad složeného listu na divizní soubory a jejich rozeslání produkťákům — a dotáhneme ho od prázdné složky až k úloze, která běží v pondělí v šest ráno. Je to reference, ne cvičení. Otevři si ji ve chvíli, kdy budeš stavět svoje, a ber to jako vzor, na kterém si ověříš, že ti nic nechybí.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Proč zrovna tenhle krok',
      text:
        'Z mapy procesu vyšly tři místa. Sběr odpovědí od produkťáků je největší bolest, ale řeší se změnou formuláře, ne Claudem. Finální podklady jsou na konec. Rozpad a rozeslání je uprostřed: opakuje se každý cyklus, je celý o přeskládávání dat a paní z logistiky ho sama označila slovy „tady už by se to mohlo dělat automaticky".',
    },
    { kind: 'h', text: 'Výchozí stav: co se dnes dělá rukama' },
    {
      kind: 'table',
      head: ['Krok', 'Dnes', 'Trvá'],
      rows: [
        ['Vzít složený list z velkého Excelu', 'vložit jinak → hodnoty, celý soubor je moc velký', 'pár minut'],
        ['Rozdělit položky na čtyři divize', 'filtrovat, kopírovat, ukládat pod čtyřmi názvy', 'desítky minut'],
        ['Napsat jedenáct e-mailů', 'ke každému přiložit ten správný soubor', 'desítky minut'],
        ['Ohlídat, že nikdo nedostal cizí divizi', 'kontrola očima', 'nedá se odhadnout'],
      ],
    },
    {
      kind: 'p',
      text:
        'Cíl je, aby z toho zbyly dvě věci: přečíst kontrolní protokol a odkliknout. Zbytek udělá úloha.',
    },
    { kind: 'h', text: '1. Složka a projekt' },
    {
      kind: 'figure',
      name: 'project-tree',
      caption: 'Takhle vypadá projekt, nad kterým to celé poběží. Leží v nasyncované knihovně, takže výstupy vidí tým bez posílání.',
    },
    {
      kind: 'checklist',
      title: 'Než se dá pokračovat',
      items: [
        'Knihovna ze SharePointu je nasyncovaná a soubory jsou opravdu na disku, ne jen zástupci',
        'Ve složce je CLAUDE.md se slovníkem: co je divize, co je složený list, co je vzorování',
        'V data/ leží skutečný export z minulého cyklu, ne vymyšlený vzorek',
        'Ve vystupy/ je prázdno — sem půjdou výsledky',
      ],
    },
    {
      kind: 'code',
      text: `CLAUDE.md — výňatek

## Slovník
Složený list = jeden list, do kterého se slily položky magazínu ze
všech divizí. Vstup pro rozpad.
Divize = Nářadí, Elektro, VTS, Piekarová. Podle nich se dělí soubory.
Produkťák (PM) = vlastník značky. Každý má svoje položky, nikdy ne cizí.

## Pravidla
Do data/ se nikdy nezapisuje. Výstupy jdou do vystupy/.
Divizní soubor obsahuje jen položky té jedné divize. Nikdy nesmí
obsahovat sloupce, které patří marketingu.
Když v exportu chybí sloupec, zastav se a zeptej se. Nedomýšlej.`,
      caption: 'Slovník je důležitější než pravidla. Bez něj Claude nepozná, že „složený list" je název kroku, ne popis souboru.',
    },
    { kind: 'h', text: '2. Skill, který ten rozpad umí' },
    {
      kind: 'p',
      text:
        'Postup se opakuje každý cyklus, takže patří do skillu, ne do chatu. Používáme skill logisticke-dostupnosti — ten skutečný z logistiky, ve vylepšené verzi z lekce Rozbor skutečného skillu. Tady je jen hlavička a dvě sekce, na kterých stojí to, že se dá pustit bez dozoru.',
    },
    {
      kind: 'code',
      text: `.claude/skills/logisticke-dostupnosti/SKILL.md — výňatek

---
name: logisticke-dostupnosti
description: Z exportu listu Logistika dotáhne skladová data, připraví
  soubory pro produkťáky po divizích (Nářadí, Elektro, VTS, Piekarová)
  a vyrobí kontrolní protokol. Použij, když je v data/ nový export
  magazínu a mají se rozeslat podklady produkťákům.
---

## Kontrolní protokol → vystupy/protokol-<RRRRMMDD>.md
- které soubory se použily, i s datem v názvu
- počet řádků na vstupu a v součtu všech výstupů — rozdíl musí být nula
- počty položek po divizích a po PM
- seznam nezařazených položek

## Zastav se, když
- vstupní a výstupní počet řádků nesedí
- vyjde divize, která není v seznamu čtyř
- víc než 5 % položek nemá dotažená skladová data`,
      caption:
        'Polovina skillu je o kontrole. Není to opatrnictví — bez protokolu a zastavovacích pravidel se skill nedá pustit v šest ráno bez dozoru. Celé znění včetně postupu je v lekci Rozbor skutečného skillu.',
    },
    { kind: 'h', text: '3. Dva hooky: zábrana a notifikace' },
    {
      kind: 'p',
      text:
        'Než se cokoli plánuje, musí platit dvě věci: že se nemůže stát to nejhorší, a že se pozná, že to doběhlo. Obojí zařídí hook — příkaz, který Claude Code spustí sám při určité události, ať si zrovna myslí cokoli. Konkrétně tady jde o zápis do data/ a o zprávu na konci běhu.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Originál exportu je jediná kopie, kterou máš',
      text:
        'Kdyby skill omylem přepsal soubor v data/, přijdeš o vstup celého cyklu — a nikdo si toho nevšimne, dokud nesedí čísla. Proto je zábrana hook, ne věta v CLAUDE.md: hook nemá úsudek a nedá se přemluvit ani přeřečnit.',
    },
    {
      kind: 'code',
      text: `.claude/hooks/chran-data.sh

#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
FILE_PATH="\${FILE_PATH//\\//}"

if [[ "$FILE_PATH" == *"/data/"* ]]; then
  echo "Blokováno: do data/ se nezapisuje. Export magazínu je jediná kopie, divizní soubory patří do vystupy/." >&2
  exit 2
fi
exit 0`,
      caption:
        'Zpráva v chybovém výstupu se vrací Claudovi jako vysvětlení, proč to nešlo — takže se místo hádání rovnou opraví a uloží jinam. Návratový kód 2 je to, co zápis zastaví.',
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
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \\"Rozpad divizí doběhl\\" with title \\"Akční regál\\"'"
          }
        ]
      }
    ]
  }
}`,
      caption:
        'Oba hooky v jednom souboru. PreToolUse hlídá každý zápis, Stop se ozve na konci běhu. Na Windows se místo osascript použije powershell.exe — celé znění je v lekci Jak se v projektu nastaví automatizace.',
    },
    {
      kind: 'table',
      head: ['Co má platit', 'Kam to patří', 'Proč zrovna tam'],
      rows: [
        [
          'Do data/ se nikdy nezapisuje',
          'hook PreToolUse',
          'je to zámek. Nesmí záviset na tom, jestli si na to Claude vzpomene.',
        ],
        [
          'Divizní soubor se jmenuje Magazín <MĚSÍC> - <divize>.xlsx',
          'CLAUDE.md',
          'je to konvence, ne bezpečnost. Když ji jednou poruší, nic se nestane.',
        ],
        [
          'Když chybí sloupec, zastav se',
          'skill',
          'vyžaduje to posouzení — hook neumí poznat, který sloupec je který.',
        ],
        [
          'Dej vědět, až je hotovo',
          'hook Stop',
          'nemá to co dělat s obsahem práce, má se to stát pokaždé.',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Otestuj zábranu dřív, než ji budeš potřebovat',
      text:
        'Řekni Claudovi „přidej řádek do souboru v data/" a chtěj vidět, že to odmítne. Zábrana, kterou nikdo neviděl zafungovat, je jenom soubor na disku. Trvá to patnáct vteřin a je to jediný způsob, jak si být jistá, že se hook vůbec zaregistroval — druhý je napsat v Claude Code /hooks a podívat se do seznamu.',
    },
    { kind: 'h', text: '4. Konektory: co připojit a proč' },
    {
      kind: 'p',
      text:
        'Konektor je napojení na službu mimo tvůj disk. U tohohle příkladu potřebuješ přesně jeden, a ten se neobejde bez správce.',
    },
    {
      kind: 'table',
      head: ['Konektor', 'K čemu tady je', 'Nutný?'],
      rows: [
        [
          'Microsoft 365 — čtení',
          'dohledat adresy produkťáků a ověřit, že soubor v knihovně opravdu je',
          'ne, ale hodí se',
        ],
        [
          'Microsoft 365 — odesílání (write tools)',
          'tohle je ten konektor, kvůli kterému mail vůbec odejde',
          'ano, jinak se dá jen otevřít rozepsaný mail',
        ],
        [
          'Žádný konektor na Excel',
          'soubory bere přímo z disku — složka je nasyncovaná',
          'ne. Konektor na tabulky neexistuje a nepotřebuješ ho.',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Na .xlsx konektor není',
      text:
        'Tohle se ptá skoro každý. Konektor je přípojka na službu na internetu — na poštu, na Teams, na SharePoint jako web. Soubor, který máš nasyncovaný na disku, žádnou přípojku nepotřebuje: Claude Code ho otevře stejně jako kterýkoli jiný soubor ve složce. Konektor by přišel na řadu jedině tehdy, kdyby ten export v knihovně zůstal jen online a ty sis ho nikdy nestáhla — a i pak je jednodušší zapnout sync než řešit oprávnění.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Excel ale není text — Claude si na něj napíše skript',
      text:
        'Nečeká tě u toho nic navíc, jen ať tě to nepřekvapí: .xlsx je zabalený balík, ne text, takže Claude na jeho čtení a zápis napíše a spustí kratičký skript v Pythonu (openpyxl nebo pandas). Poprvé si může chtít knihovnu doinstalovat. Proto se ve skillu vyplatí napsat, na kterém listu vstup je a jak se jmenují sloupce — ušetří to jedno kolo hádání a skript pak vypadá pokaždé stejně.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Odkaz, ne příloha',
      text:
        'Odesílání přes konektor neumí přílohy. Pro nás to znamená, že produkťák nedostane .xlsx do schránky — dostane odkaz do knihovny na svůj soubor. Vyjde to nakonec líp: když se soubor druhý den opraví, všichni čtou opravenou verzi, ne tu, kterou mají ve své poště od pondělí.',
    },
    { kind: 'h', text: '5. Vyplněná úloha' },
    {
      kind: 'p',
      text:
        'Teď teprve Code → Routines → New routine → Local. Takhle vyplněné to vypadá — hodnoty jsou z tohohle příkladu, ne ilustrační.',
    },
    {
      kind: 'figure',
      name: 'routine-form',
      caption: 'Dvě pole rozhodují o všem: instrukce (a v nich podmínka, kdy neodesílat) a režim povolování.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Instructions — celé zadání',
          body:
            'Píše se to jako zpráva do chatu, ne jako příkaz. Odkazuje se na skill, aby se postup neopakoval v zadání.',
          code: `Postupuj podle skillu logisticke-dostupnosti.
Vstup je nejnovější export v data/.
Když protokol hlásí nesrovnalost, nic neodesílej a jenom mi napiš.
Jinak pošli každému produkťákovi mail s předmětem
„Magazín <datum> — tvoje položky", v těle tři čísla z protokolu
a odkaz do knihovny na jeho divizní soubor. Přílohu nepřikládej.`,
        },
        {
          title: 'Folder — nasyncovaná složka',
          body:
            'Bez složky se úloha neuloží. Vyber projektovou složku akčního regálu, ne knihovnu jako celek. Když ji Claude Code ještě nezná, zeptá se, jestli jí věříš.',
        },
        {
          title: 'Permission mode — Accept edits',
          body:
            'V přísnějším režimu se běh zastaví na dotazu, na který v šest ráno nikdo neodpoví. Úloha pak vypadá, že spadla, přitom jenom čeká.',
        },
        {
          title: 'Schedule — Weekly, pondělí 6:00',
          body:
            'Export chodí v neděli večer, ať je hotovo dřív, než někdo přijde do práce. Kdyby to mělo být jinak — třeba prvního v měsíci — řekni si o to Claudovi v chatu vlastními slovy.',
        },
        {
          title: 'Create, a hned Run now',
          body:
            'Tohle nepřeskakuj. Při prvním běhu si odklikáš oprávnění a u každého dáš „always allow", ať se ostrý běh nezasekne. Zároveň uvidíš, jestli skill projde na skutečných datech.',
        },
      ],
    },
    { kind: 'h', text: '6. Co po sobě nechá' },
    {
      kind: 'table',
      head: ['Kde', 'Co tam přibude'],
      rows: [
        ['vystupy/', 'čtyři divizní soubory s dnešním datem'],
        ['vystupy/protokol-<RRRRMMDD>.md', 'počty řádků, nezařazené položky, položky bez skladových dat'],
        ['knihovna na SharePointu', 'totéž, samo, protože složka je nasyncovaná'],
        ['plocha', 'notifikace, že běh skončil'],
        ['schránky produkťáků', 'jedenáct mailů s odkazem na jejich soubor — nebo nic, když protokol nesedí'],
        ['Routines → detail úlohy', 'záznam běhu; přeskočené běhy i s důvodem'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Ranní rutina se scvrkne na jednu stránku',
      text:
        'V pondělí ráno otevřeš protokol, ne čtyři soubory. Sedí počty, je seznam položek bez produkťáka krátký? Hotovo. Tohle je celý ten posun: rozhoduješ se z jedné stránky místo z tisíce řádků.',
    },
    { kind: 'h', text: '7. Když to nevyjde' },
    {
      kind: 'table',
      head: ['Příznak', 'Co se nejspíš stalo'],
      rows: [
        ['Nic se nestalo, žádný soubor ani mail', 'počítač spal nebo byla zavřená aplikace — Local běží jen při puštěné appce'],
        ['Soubory jsou, maily ne', 'nejsou zapnuté write tools u konektoru, nebo protokol našel nesrovnalost'],
        ['Běh visí a nic nedělá', 'čeká na povolení nástroje. Otevři sezení v postranním panelu a odklikni.'],
        ['Vyšla pátá divize', 'v exportu je hodnota, kterou slovník nezná. Skill se správně zastavil.'],
        ['Běh doběhl v jedenáct večer', 'dohnaný zmeškaný běh. Proto do zadání patří pojistka na čas.'],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Runbook',
      text:
        'Až tohle pojede měsíc, napiš k tomu jednu stránku podle šablony v lekci Nech to běžet bez sebe. Ne pro sebe — pro toho, kdo to bude řešit ve chvíli, kdy jsi na dovolené a produkťákům nic nepřišlo.',
    },
    {
      kind: 'task',
      title: 'Cvičení: projdi to na svém',
      intro: 'Nekopíruj tenhle příklad. Použij ho jako kontrolní seznam nad svojí agendou.',
      items: [
        'Napiš jednou větou, který krok ze své mapy chceš takhle dotáhnout.',
        'Doplň si do CLAUDE.md slovník — tři pojmy, kterým by cizí člověk nerozuměl.',
        'Napiš skill a v něm sekci „zastav se, když". Bez ní dál nechoď.',
        'Nastav zábranu a notifikaci.',
        'Založ úlohu na Manual a pusť ji přes Run now aspoň třikrát na různých datech.',
        'Teprve pak jí dej rozvrh — a jako první ať jen ukládá soubory, bez odesílání.',
      ],
      hint: 'Odesílání zapínej jako poslední, ideálně po měsíci, kdy se maily odklikávaly ručně a nic nepřekvapilo.',
    },
  ],
}

const L2_PLAN: Lesson = {
  slug: 'naplanovana-uloha',
  module: 'potom',
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
        'Tohle je technická část posledního schodu: samotné založení úlohy, která se spustí sama. Kdy ji pustit a co k tomu musí platit, řeší lekce Nech to běžet bez sebe. Tady jen jak.',
    },
    { kind: 'h', text: 'Naplánovaná úloha v Claude Code' },
    {
      kind: 'p',
      text:
        'V desktopové aplikaci Claude Code je v záložce Code v levém panelu položka Routines. Tam se zakládají úlohy, které se spustí samy. Hned u zakládání se ale rozhoduje jedna věc, na které to buď stojí, nebo padá: jestli má úloha běžet na tvém počítači, nebo v cloudu.',
    },
    {
      kind: 'table',
      head: ['Vlastnost', 'Local — na tvém počítači', 'Cloud — na serveru'],
      rows: [
        [
          'Vidí soubory na tvém disku',
          'ano, pracuje přímo v tvojí složce',
          'ne. Naklonuje si repozitář z GitHubu a pracuje v něm.',
        ],
        ['Potřebuje zapnutý počítač', 'ano, a puštěnou aplikaci', 'ne, běží i když máš zavřený notebook'],
        ['Nejkratší interval', 'minuta', 'hodina'],
        ['Povolování nástrojů', 'nastavíš si režim, může se doptat', 'běží samo, na nic se neptá'],
        ['Kdy ji zvolit', 'skoro vždycky u nás — data máme ve složce', 'když je práce nad repozitářem a nesmí čekat na notebook'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Pro naši práci je správně Local — a to je ta nepříjemná zpráva',
      text:
        'Cloudová varianta zní líp: běží, i když máš zavřený notebook. Jenže tvoje data leží v nasyncované knihovně na disku a cloudová úloha si místo toho klonuje repozitář z GitHubu — do tvojí složky se nedostane vůbec. Takže pro nás platí Local, a ten běží jen tehdy, když je počítač zapnutý a aplikace puštěná. Ve chvíli, kdy má běh vyjít i přes zavřený notebook, musí data přestat žít jen na disku: buď přes konektor, nebo tokem v Power Automate.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Routines → New routine → Local',
          body:
            'Volba Cloud udělá tu druhou věc z tabulky. Pro práci nad vlastní složkou chceš Local.',
        },
        {
          title: 'Vyplnit název, popis a instrukce',
          body:
            'Instrukce píšeš úplně stejně, jako když píšeš Claudovi do chatu. Tady vybereš i model a režim povolování.',
        },
        {
          title: 'Vybrat pracovní složku',
          body:
            'Bez složky se úloha nedá uložit. Vyber tu svoji projektovou — tu, ve které máš CLAUDE.md, data/ a vystupy/. Když ji ještě nemáš označenou jako důvěryhodnou, aplikace se na to zeptá.',
        },
        {
          title: 'Nastavit rozvrh',
          body:
            'Na výběr je Manual (spustí se jen na kliknutí), Hourly, Daily, Weekdays a Weekly. Cokoli jinačího — třeba každých patnáct minut nebo prvního v měsíci — řekni Claudovi v chatu vlastními slovy.',
        },
        {
          title: 'Hned kliknout na Run now',
          body:
            'Tohle nepřeskakuj. První běh si odklikáš oprávnění a u každého dáš „always allow". Bez toho se úloha při ostrém běhu zastaví na dotazu, na který nikdo neodpoví, a ty si budeš myslet, že spadla.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nemusíš to klikat — stačí si o to říct',
      text:
        'Úlohu založíš i tím, že ji v běžném sezení popíšeš. „Založ mi úlohu, která každé pondělí v šest ráno projede export a připraví divizní soubory" udělá opakovanou úlohu. „Připomeň mi zítra ve tři, ať zkontroluju ten běh" udělá jednorázovou, která se po odpálení sama vypne. Stejně tak se dá říct „pozastav mi úlohu logisticke-dostupnosti" nebo „ukaž mi moje naplánované úlohy".',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Zadání úlohy je obyčejný SKILL.md',
      text:
        'Text úlohy leží na disku v ~/.claude/scheduled-tasks/<název>/SKILL.md — tedy přesně ten formát, který znáš z lekce o skillech: YAML hlavička s name a description a pod tím zadání. Dá se editovat ručně a projeví se to při dalším běhu. Rozvrh, složka a model v tom souboru nejsou, ty se mění ve formuláři.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Když počítač spal, běh se přeskočí',
      text:
        'Úloha běží jen při puštěné aplikaci a probuzeném počítači. Zaspaný běh se zahodí a při probuzení se dohání jenom ten poslední zmeškaný — úloha, která nešla šest dní, doběhne jednou. To znamená, že se ranní úloha může spustit v jedenáct večer. Piš proto zadání tak, aby s tím počítalo: „Pracuj jenom s dnešním exportem. Když je po páté odpoledne, nic nepočítej a jenom mi napiš, že se to nestihlo." V Nastavení → Aplikace → Obecné se dá zapnout Keep computer awake, ale zavřené víko uspí počítač tak jako tak.',
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

const L2_UKAZKA: Lesson = {
  slug: 'ziva-ukazka',
  module: 'postav',
  title: 'Živá ukázka: za pět minut to doběhne samo',
  summary:
    'Poslední čtvrthodina workshopu. Naplánujeme úlohu na čas za pět minut, odejdeme od počítače a vrátíme se k hotovému souboru a zprávě kolegovi.',
  minutes: 10,
  kind: 'lekce',
  track: 'v sále',
  outcomes: [
    'založit úlohu jednou větou v chatu',
    'zažít, že běh proběhne bez toho, aby u něj někdo seděl',
    'poznat výsledek z jedné stránky kontroly, ne z výstupů',
  ],
  body: [
    { kind: 'h', text: 'Živá ukázka: nastav to na za pět minut' },
    {
      kind: 'p',
      text:
        'Nic z téhle lekce nedocvakne, dokud to člověk jednou neuvidí. Tak si to udělejte hned: naplánujte běh na čas za pět minut, nechte počítač otevřený a odejděte od něj. Když se vrátíte, bude ve vystupy/ soubor, který jste nevyrobili — a kolegovi ve schránce zpráva, kterou jste neposlali.',
    },
    { kind: 'h', text: 'Co si na to dát za úlohu' },
    {
      kind: 'p',
      text:
        'Na první běh nebeř nic z ostré práce. Chceš úlohu, která je hotová do minuty, nemůže nic pokazit a jejíž výsledek je vidět i z poslední řady. Nejlíp funguje tahle: ať spočítá, co má ve složce, zapíše to do souboru a dá o tom vědět kolegovi vedle sebe. Adresát je člověk z dvojice, se kterou se mapovalo workflow — ten pak nahlas potvrdí, že mu něco přišlo, i když u toho nikdo neseděl.',
    },
    {
      kind: 'tabs',
      items: [
        {
          label: 'Když konektor odesílat umí',
          blocks: [
            {
              kind: 'code',
              text: `Založ mi naplánovanou úlohu, která se spustí za pět minut.

Zadání: spočítej, kolik souborů leží ve složce data/ a jaká je
jejich celková velikost. Zapiš to do vystupy/kontrola-<dnešní datum>.md.
Pak pošli e-mail na petra.novakova@dek.cz s předmětem
„Automat doběhl — <datum a čas>". Do těla dej ta dvě čísla a větu,
že tohle psal automat a nikdo u toho neseděl. Přílohu nepřikládej.
Když ve složce data/ nic není, e-mail neposílej a jenom mi to napiš.`,
              caption:
                'Poslední řádek tam patří i u nevinné ukázky. Zvyk psát podmínku „kdy neodesílat" se buduje od první úlohy, ne až u té ostré.',
            },
          ],
        },
        {
          label: 'Když konektor odesílat neumí',
          blocks: [
            {
              kind: 'p',
              text:
                'Tohle je pravděpodobnější stav a na plátně vypadá skoro stejně dobře: e-mail neodejde sám, ale sám se otevře rozepsaný v Outlooku. Vidí to celý sál a nepotřebuješ k tomu vůbec nikoho z IT.',
            },
            {
              kind: 'code',
              text: `Založ mi naplánovanou úlohu, která se spustí za pět minut.

Zadání: spočítej, kolik souborů leží ve složce data/ a jaká je
jejich celková velikost. Zapiš to do vystupy/kontrola-<dnešní datum>.md.
Pak mi otevři rozepsaný e-mail pro petra.novakova@dek.cz — na Macu
příkazem open, na Windows příkazem start, přes odkaz mailto:
s vyplněným předmětem a tělem. Předmět „Automat doběhl", v těle ta
dvě čísla. Neodesílej ho, jenom ho otevři.`,
              caption:
                'Za pět minut se sama od sebe otevře Outlook s hotovým e-mailem. Odeslání zůstává na člověku — což je stejně ten režim, ve kterém má každý první měsíc jet.',
            },
          ],
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Proč zrovna počítání souborů',
      text:
        'Protože to nemůže dopadnout špatně, doběhne to za vteřinu a každý si výsledek ověří vlastníma očima. Až tenhle běh proběhne, vyměníš zadání za svoji skutečnou úlohu — všechno ostatní kolem zůstane stejné.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Naplánuj to na za pět minut — větou, ne formulářem',
          body:
            'Formulář si otevřeš jindy. Teď prostě vlep do chatu zadání z předchozí kartičky. Claude si sám doplní čas, složku i rozvrh a úlohu ti založí. Odpoví ti, kdy poběží — a to je celé.',
        },
        {
          title: 'Nedívej se na to',
          body:
            'Vážně. Zavři okno a dělej něco jiného. Půlka smyslu téhle ukázky je v tom, že u toho nesedíte.',
        },
        {
          title: 'Za pět minut se podívej, co přibylo',
          body:
            'Notifikace na ploše, ve vystupy/ soubor s dnešním datem — a kolega vedle tebe ať nahlas řekne, jestli mu něco přišlo. Nikdo u toho nebyl.',
        },
        {
          title: 'Otevři jen kontrola-<datum>.md',
          body:
            'Ne výstupy, jen ten jeden soubor. Sedí počet souborů s tím, co vidíš ve složce? Pak to funguje. Tohle je celý ten trik, který se pak opakuje u každé skutečné úlohy: rozhoduješ se z jedné stránky místo z tisíce řádků.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Věta je lepší než formulář',
      text:
        'Formulář úlohy má sedm polí — název, popis, instrukce, model, režim povolování, složku a rozvrh. Napsaná věta je jeden řádek a dělá totéž. A ukazuje mimochodem to podstatné: s Claudem se mluví jako s člověkem, kterému něco zadáváš, ne jako s aplikací, kterou musíš umět ovládat. Formulář si otevři, až budeš chtít úlohu upravit.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Tohle je ta chvíle',
      text:
        'Když se lidem po pěti minutách objeví hotový soubor, na kterém nikdo nepracoval, dojde jim to rychleji než z jakéhokoli vysvětlování. Proto je tahle ukázka na konci workshopu — ne jako látka, ale jako důkaz, že těch pět schodů někam vede.',
    },
  ],
}

const L2_EMAIL: Lesson = {
  slug: 'email-z-automatu',
  module: 'potom',
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
        'Odeslat e-mail je věc, na kterou se ptá každý hned po první naplánované úloze. Jde to — ale ne samo od sebe a ne bez správce. Tahle lekce říká, co přesně k tomu musí platit, aby to v pondělí v šest ráno nezůstalo jen u souboru ve složce.',
    },
    { kind: 'h', text: 'Čím se ten e-mail vlastně odešle' },
    {
      kind: 'p',
      text:
        'Claude sám od sebe do pošty nevidí ani do ní nepíše. Musí mu to někdo umožnit — a tomu napojení se říká konektor: přípojka na službu, přes kterou Claude umí něco udělat mimo tvůj disk. Cesty jsou čtyři a liší se hlavně tím, kdo je musí povolit a jestli přenesou přílohu.',
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
        'Konektor umí obojí — jenže každé se zapíná zvlášť a odesílání je vypnuté, dokud ho někdo nepovolí. Když se v seznamu nástrojů konektoru díváš na samá „search", vidíš první sloupec téhle tabulky. Odesílat se z něj tím pádem nedá, i když je konektor připojený.',
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
        'Tohle je u nás ta nejdůležitější věta z celé lekce. Odesílání přes konektor zatím neumí přílohy — Claude nepošle, nepřepošle ani nerozepíše e-mail s připojeným souborem. Pro naši práci to znamená, že „pošli produkťákům divizní soubory" takhle neuděláš. Uděláš to jinak: výstup se uloží do sdílené knihovny (nasyncuje se sám) a e-mail nese odkaz, ne přílohu. Což je stejně lepší — všichni pak čtou tu samou verzi.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Konektor si nezapneš sám — a jak si o to říct',
      text:
        'Souhlas dává správce Microsoft 365 a přihlašuje se pracovním účtem; osobní outlook.com nebo hotmail.com nefungují. Pokud konektor ve svém Claudovi nevidíš, není to chyba nastavení — nikdo ho pro firmu nepovolil. Napiš správci rovnou konkrétně: „potřebujeme u konektoru Claude na Microsoft 365 zapnout write tools pro odesílání pošty, vyžaduje to druhý souhlas v Entra". Bez té věty se ptáš na něco, co zní jako obecná otázka, a odpověď přijde za měsíc.',
    },
    { kind: 'h', text: 'Takže ano — úloha, která ráno pošle kolegovi mail' },
    {
      kind: 'p',
      text:
        'Když je odesílání zapnuté, jde založit naplánovanou úlohu, která se v šest ráno spustí sama, něco spočítá, uloží výstup do knihovny a pošle kolegovi e-mail z tvojí adresy tvým jménem. Zadání úlohy vypadá takhle:',
    },
    {
      kind: 'code',
      text: `Postupuj podle skillu logisticke-dostupnosti.
Výstupy ulož do vystupy/ a kontrolní protokol vedle nich.
Pak pošli e-mail na jan.novak@dek.cz s předmětem
„Divizní dostupnosti — <dnešní datum>". Do těla dej tři čísla
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
        'Zapnuté write tools v konektoru. Žádná příloha — v mailu je odkaz. A protože úloha sahá do složky na tvém disku, běží jako Local: zapnutý počítač a puštěná aplikace. Když jedna z těch tří chybí, mail neodejde — a ty se to dozvíš až od kolegy, že mu nic nepřišlo.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'S e-mailem opatrně: první měsíc jen koncepty',
      text:
        'Odeslaná pošta se nevrací. Než necháš cokoli odesílat samo, nech to nejdřív měsíc připravovat rozepsaný e-mail, který odklikneš ty. Teprve až budeš mít měsíc bez překvapení, přemýšlej o odesílání bez potvrzení — a i pak jenom tam, kde nejhorší možný následek je, že někdo dostane zprávu navíc.',
    },
  ],
}

const L2_BEH: Lesson = {
  slug: 'nech-to-bezet-bez-sebe',
  module: 'potom',
  title: 'Nech to běžet bez sebe',
  summary:
    'Poslední schod. Co musí platit, než něco pustíš na plán, co po sobě má běh nechat a co si napsat pro chvíli, kdy spadne.',
  minutes: 10,
  kind: 'lekce',
  track: 'potom',
  outcomes: [
    'ověřit na checklistu, že je úloha připravená běžet bez dozoru',
    'spustit úlohu bez rozhovoru jedním příkazem',
    'napsat runbook, kterému bude rozumět i kolega',
    'vědět, co dělat, když naplánovaný běh selže',
  ],
  body: [
    {
      kind: 'p',
      text:
        'Sem směřovalo všechno předtím. Naplánovaný běh není odměna za odvahu — je to důsledek toho, že postup několikrát doběhl správně a že máš čím poznat, kdy nedoběhl. Když jedna z těch dvou věcí chybí, nepouštěj to.',
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
    { kind: 'h', text: 'Spuštění bez rozhovoru' },
    {
      kind: 'p',
      text:
        'Claude Code umí dostat zadání, odpracovat ho a skončit — bez toho, aby u toho někdo seděl. Ta jedna věta je pak to, co se dá naplánovat.',
    },
    {
      kind: 'code',
      text: `cd <složka projektu — ta nasyncovaná z lekce Sdílená složka>
claude -p "Postupuj podle skillu logisticke-dostupnosti. Na konec ulož
kontrolní protokol do vystupy/."`,
      caption: 'Spusť si to nejdřív ručně přesně takhle. Když to takhle nedoběhne, na plánu to nedoběhne taky.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Jak se úloha zakládá, je v samostatné lekci',
      text:
        'Klikání ve formuláři, rozdíl mezi Local a Cloud a to, co se stane, když počítač spal — to všechno je v lekci Naplánovaná úloha v Claude Code. Tady zůstává to, co platí bez ohledu na formulář: kdy to pustit a co po sobě má běh nechat.',
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
      text: `# Runbook: logistické dostupnosti

## Co to dělá
Z exportu listu Logistika připraví divizní soubory pro produkťáky.

## Kdy to běží
Každé pondělí v 6:00. Trvá to zhruba čtyři minuty.

## Kde je výsledek
vystupy/Magazín <MĚSÍC> - <divize>.xlsx
a vedle toho kontrola-<datum>.md

## Jak poznám, že je něco špatně
- v kontrole nesedí počet řádků vstupu a výstupu
- chybí některý ze čtyř divizních souborů
- v kontrole je víc než 20 položek bez dat

## Co dělat, když to spadne
1. Podívej se, jestli jsou v data/ soubory z aktuálního týdne.
2. Pusť to ručně: v terminálu ve složce projektu claude -p "..."
3. Když to spadne i ručně, běh vypni a napiš Petře (logistika, l. 123).

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
        'Nejhorší varianta není běh, který spadne. Je to běh, který měsíc tiše nedělá nic a nikomu to nedojde, protože nikdo nečeká, že by měl něco přijít. Proto ať po každém běhu zůstane soubor s datem — i když se nic nezměnilo.',
    },
    {
      kind: 'task',
      title: 'Cvičení: pusť to ručně jako automat',
      intro: 'Ještě to neplánuj. Nejdřív si to zkus.',
      items: [
        'Projdi checklist a čestně si odškrtej, co platí.',
        'Spusť svůj skill jedním příkazem bez rozhovoru.',
        'Přečti kontrolní protokol a rozhodni se, jestli by se výsledek dal poslat bez otevření souboru.',
        'Napiš runbook podle šablony — všech šest nadpisů.',
        'Teprve pak to naplánuj, a to zatím na den, kdy jsi u počítače.',
      ],
    },
  ],
}


const L2_MCP: Lesson = {
  slug: 'mcp-nad-katalogem',
  module: 'potom',
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
        'Konektor je přípojka na službu mimo tvůj disk — to už znáš. MCP je způsob, jak se taková přípojka píše: server nabídne pár nástrojů, Claude si mezi nimi sám vybere a použije je, když je potřeba. U nás jde o katalog dek.cz. Ty se zeptáš normální větou a Claude si sám dojde pro produkt, kategorii nebo návod.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Proč to není totéž jako otevřít web',
      text:
        'Ve webu hledáš jeden produkt a klikáš. Přes MCP se dá ptát na to, co se klikáním dělá špatně: porovnej mi tyhle tři, projdi tenhle seznam kódů a řekni, které už nevedeme, nebo vezmi kategorii a udělej z ní tabulku. Claude si tam sáhne kolikrát potřebuje a odpověď složí sám.',
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
        'Tabulky jsou tu proto, aby bylo poznat, co se děje, když Claude odpovídá — ne k učení nazpaměť. Nástroje si vybírá sám podle toho, na co se ptáš. Ptej se jako člověka, ne jako vyhledávače.',
    },
    { kind: 'h', text: 'Jak ho rozjet lokálně' },
    {
      kind: 'p',
      text:
        'Tohle je celé. Server je jeden soubor a nemá žádnou závislost kromě oficiálního SDK — proto se dá rozjet dřív, než se stihneš někoho zeptat, jestli smíš. Jediné, co musíš mít, je Node: napiš v terminálu node --version a musí něco vypsat. Když ne, stáhni si ho z nodejs.org.',
    },
    {
      kind: 'p',
      text:
        'Stahuješ si to k sobě na počítač, do vlastní složky — třeba do Dokumentů. Server pak běží u tebe a je jedno, na kterém projektu zrovna pracuješ: připojuje se jednou pro všechny.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Jenom ne do nasyncované knihovny',
      text:
        'Instalace vyrobí složku node_modules s tisícovkami drobných souborů. Kdyby ležela ve sdílené knihovně, OneDrive by je začal syncovat kolegům a zbytečně by se s tím trápil celé odpoledne. Dej mcp-dek někam na svůj disk mimo nasyncované složky. Do projektu nepatří a nic tím neztratíš — díky přepínači --scope user ho Claude vidí ve všech projektech včetně toho na SharePointu.',
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
                  body: 'V terminálu, s tou cestou místo té naší.',
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
        'V příkazu claude mcp add oddělují nastavení Clauda od příkazu, který se má spustit. Bez nich to skončí hláškou, které nebudeš rozumět. A cestu k server.js piš vždycky celou, ne relativní — server se spouští odjinud než ze složky, ve které zrovna stojíš.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Ověř /mcp, než se začneš ptát',
      text:
        'Napiš v Claude Code /mcp. U serveru dek musí svítit Connected. Dokud tam nesvítí, Claude odpovídá z hlavy a tváří se přitom stejně jistě — což je ten nejhorší možný stav. Failed to connect u lokálního serveru znamená skoro vždycky špatnou cestu k server.js nebo neproběhlé npm install.',
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
        'Leží v ~/.cache/mcp-dek/index.json a platí týden, pak se postaví znovu. Když se katalog výrazně změní dřív, řekni Claudovi, ať rejstřík obnoví — nástroj stav_rejstriku to umí a nemusíš kvůli tomu do terminálu.',
    },
    { kind: 'h', text: 'Sdílet ho s kolegy' },
    {
      kind: 'p',
      text:
        'Když ho má používat celé oddělení, nepatří do osobního nastavení, ale do projektu. Soubor .mcp.json leží v kořeni projektové složky a nese se s ní — kdo si složku otevře, dostane při prvním spuštění dotaz, jestli serveru věří.',
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
        'Než na tom něco postavíš, projdi si tyhle čtyři dotazy. Nejsou to ukázky, je to přejímka: u každého víš dopředu, jak má odpověď vypadat, takže hned poznáš, jestli si server sáhl do katalogu, nebo si vymýšlí.',
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
        'Vyřazený kód je zkouška poctivosti. Server, který místo „nenašel jsem" vrátí něco podobného, se nedá použít na kontrolu seznamů — a přitom je to ta práce, kvůli které by člověk katalog v Claudovi nejvíc chtěl. Zkus to na třech kódech, ne na jednom.',
    },
    { kind: 'h', text: 'Na co se ho ptát' },
    {
      kind: 'table',
      head: ['Kdo', 'Dotaz, který se klikáním dělá špatně'],
      rows: [
        ['Logistika', 'Projdi tenhle seznam kódů z loňského magazínu a řekni, které už v katalogu nejsou.'],
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
        'Katalog sám o sobě je hezký, ale ty ho potřebuješ propojit se svými daty. Když máš připojenou složku i tenhle server, jde napsat zadání, které sáhne do obojího: „vezmi divizní soubor z vystupy/, ke každé položce dohledej v katalogu aktuální název a zařazení a rozdíly zapiš do nového sloupce". Tohle je ten okamžik, kdy MCP přestane být hračka.',
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
        'Je to veřejná cena bez přihlášení a od té zákaznické se liší. Na porovnávání a orientaci je dobrá, do dokumentu, který někomu pošleš, nepatří. Napiš si to rovnou do CLAUDE.md, ať to nemusíš hlídat hlavou.',
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
  module: 'potom',
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
        'Když má vzniknout nový banner, leták nebo návrh stránky, obvykle se najde stará verze, zkopíruje se a přebarvuje, dokud to nevypadá „nějak jako DEK“. Pokaždé trochu jinak. Design system je opak: jednou se sepíše, jaké barvy, písma a dílky značka používá, a všechno další se skládá z nich. Tahle lekce ukazuje design system DEKu, který vznikl stejně jako všechno ostatní v kurzu — člověk řekl co, Claude Code to postavil.',
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
        'Web existuje, ale jeho vzhled žije jen v něm. Kdo chce udělat interní nástroj, prezentaci nebo návrh nové stránky ve stylu DEKu, začíná od nuly. Design system ten vzhled vytahuje ven jako stavebnici — a změna na jednom místě (jiná červená, jiné písmo) se propíše do všech dílků najednou.',
    },
    { kind: 'h', text: 'Kde bydlí a jak se na něj podívat' },
    {
      kind: 'p',
      text:
        'Design system je repozitář na GitHubu a prohlíží se přes Storybook — katalog komponent, který běží v prohlížeči. Nemusíš nic instalovat: nasazená verze je na webu. V levém sloupci jsou jednotlivé komponenty, každá s pojmenovanými ukázkami (říká se jim stories) a záložkou Docs. Sekce Pages DEK jsou celé stránky poskládané z těch komponent — úvodní stránka, výpis kategorie a detail produktu, se skutečnými produkty, cenami a fotkami z webu.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Nic z toho není odhad',
      text:
        'Každá barva a každý rozměr má v kódu poznámku, ze které třídy skutečného CSS webu pochází. A v sekci Reference je vedle sebe originální kousek webu (jeho vlastní HTML a CSS) a tatáž věc postavená z design systemu — takže je hned vidět, kdyby se stavebnice od webu rozjela.',
    },
    { kind: 'h', text: 'Jak vznikl' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Stáhnout produkční CSS z www.dek.cz',
          body: 'Jeden velký soubor, ve kterém je celý vzhled webu. Leží v repozitáři ve složce vendor, aby se dalo kdykoli ověřit, z čeho se vycházelo.',
        },
        {
          title: 'Vytáhnout z něj tokeny',
          body: 'Web má barvy pojmenované jako proměnné (--brand-primary, --gray-lightest…). Ty se přepsaly do souboru tokenů se stejnými jmény, aby se dalo hledat oběma směry.',
        },
        {
          title: 'Postavit z tokenů téma',
          body: 'Téma říká hotovým komponentám z knihovny MUI, jak mají vypadat: červené tlačítko, které při najetí ztmavne přesně jako na webu, stejná písma, stejné zaoblení.',
        },
        {
          title: 'Poskládat komponenty a srovnat s originálem',
          body: 'Karta produktu, cenovka s cenou za balení, štítek dostupnosti, hlavička s vyhledáváním… Ke každé vzniklo referenční srovnání s originálem z webu.',
        },
        {
          title: 'Složit z komponent celé stránky',
          body: 'Sekce Pages DEK — stránky se stejným pořadím bloků jako skutečný web a s reálným obsahem: fotky a loga se berou přímo z fotobanky webu, takže zůstávají aktuální.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Celé to psal Claude Code',
      text:
        'Lidská práce byla: říct, kde je CSS, kontrolovat referenční srovnání a vracet, co nesedí. Stejným postupem se dá vytáhnout design system z libovolného webu — třeba z toho vašeho divizního.',
    },
    { kind: 'h', text: 'Spusť si ho u sebe' },
    {
      kind: 'p',
      text:
        'Nasazená verze stačí na prohlížení. Jakmile chceš něco přidávat, potřebuješ ho mít u sebe. Platí totéž co u MCP serveru: potřebuješ Node (node --version musí něco vypsat) a složku mimo nasyncovanou knihovnu — instalace vyrobí tisíce drobných souborů, které do OneDrivu nepatří.',
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
        'Kompozice je nová story, která skládá hotové komponenty do vlastního celku — třeba akční nabídka: banner a pod ním mřížka produktových karet. Je to jeden malý soubor; Storybook si nové story všímá sám a hned ji ukáže v levém sloupci.',
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
        'A samozřejmě to nemusíš psát sám. Otevři složku dek-design-system v Claude Code a řekni: „Přidej do Pages DEK story Akční nabídka — banner Mega akce a pod ním mřížka pěti produktů z FEATURED.“ Kód komponent už zná, tak se trefí do stejného stylu.',
    },
    { kind: 'h', text: 'A teď Claude Design' },
    {
      kind: 'p',
      text:
        'Storybook je pravda o tom, co existuje. Claude Design je skicák: plátno na claude.com, kde návrhy vznikají povídáním — řekneš, co potřebuješ, Claude nakreslí návrh a ty ho upravuješ přímo na plátně: komentářem u konkrétního prvku, přepsáním textu, posuvníkem nebo tažením. Je součástí předplatného Pro, Max, Team i Enterprise (tam ho musí zapnout správce).',
    },
    {
      kind: 'p',
      text:
        'To podstatné pro nás: Claude Design si umí načíst design system — z GitHub repozitáře, z kódu nebo z design souborů. Když mu při zakládání ukážeš repozitář dek-design-system, každý další návrh staví z barev, písem a komponent DEKu a sám si ho proti nim kontroluje. Banner, leták, návrh nové stránky — nic z toho už nezačíná od bílého plátna a „nějaké červené“.',
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
          body: '„Leták na akční regál pro divizi Nářadí.“ „Banner pro kategorii hydroizolace.“ „Návrh stránky výprodeje.“ Vznikají rovnou ve stylu DEKu.',
        },
        {
          title: 'Uprav přímo na plátně',
          body: 'Komentář k prvku, přepsání textu, posunutí, posuvníky na barvu a odsazení. Bez grafického editoru.',
        },
        {
          title: 'Výsledek exportuj, nebo vrať do stavebnice',
          body: 'Export do PDF, PowerPointu nebo HTML. A když z návrhu má být trvalý dílek, předej ho Claude Code — udělá z něj novou story ve Storybooku a stavebnice se rozroste.',
        },
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Claude Design se rychle mění',
      text:
        'Je to čerstvá věc v režimu náhledu — obrazovky a tlačítka můžou příští měsíc vypadat jinak než dnes. Princip ale platí: design system je zdroj pravdy, skicuje se nad ním, a co se osvědčí, vrací se do Storybooku.',
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

const L2_NAOSTRO: Lesson = {
  slug: 'pust-to-naostro',
  module: 'potom',
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
        'Všechno předchozí byla příprava. Teď to pustíš na práci, kterou bys stejně musela udělat — a příští setkání začneme tím, co se stalo. Nejde o to, aby to vyšlo. Jde o to, aby bylo z čeho se poučit.',
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
        'Automatizace, kterou umí spustit jediný člověk, je riziko, ne úspora. Test je jednoduchý a trvá deset minut: posaď kolegu k počítači, dej mu projekt a nic neříkej. Každá otázka, kterou položí, je řádek, který v projektu chybí — a chybí tam i tobě, jenom ty to nepoznáš, protože si to pamatuješ.',
    },
    {
      kind: 'list',
      items: [
        'Nech ho úlohu spustit bez nápovědy. Když neví, kde začít, chybí runbook.',
        'Nech ho výsledek zkontrolovat. Když neví, co znamená „nesedí počty“, chybí věta o tom, jak vypadá výsledek v pořádku.',
        'Zeptej se ho, co by musel dohledávat, kdybys tam nebyla. Ne „bylo to jasné?“.',
        'Doplň to a nech ho to zkusit znovu. Podruhé už by měl projít bez otázky.',
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
        'Když to nepustíš — nebyl čas, přišel jiný formát dat, nebo se do toho nechtělo — přijď to říct. Tyhle důvody jsou přesně to, co potřebujeme vědět, a bývají užitečnější než tři úspěšné běhy.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Kam to zapsat',
      text:
        'Krátce, do souboru v projektu — třeba vystupy/poznamky-<datum>.md. Nemusí to být hezké. Musí to existovat, až se na to za týden budeme ptát.',
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
      'Kurz pro lidi, kteří každý týden přeskládávají tytéž tabulky a chtějí, aby se to dělalo samo. Nejdřív napojíš Claudovi složku, ve které ta práce žije, ohraničíš si, co v ní smí a nesmí, a založíš nad ní projekt s pravidly, která se nemusí opakovat každé ráno. Pak si na reálném procesu akčního regálu vyzkoušíš najít místa, kde se dá práce automatizovat — a totéž uděláš na vlastní agendě.',
    level: 'Začátečník',
    section: 'Začni tady',
    modules: [
      {
        key: 'start',
        title: 'Než začneš',
        summary: 'Jak večer poběží a co si stačí přinést.',
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
          'Nejdřív hotový proces z logistiky jako vzor, pak totéž ve dvojicích na vlastní agendě.',
      },
    ],
    lessons: [LESSON_PROGRAM, LESSON_SLOVNICEK, LESSON_SHAREPOINT, LESSON_CO_VIDI, LESSON_PROJEKT, LESSON_REGAL, LESSON_CVICENI],
    learn: [
      'založit projekt tak, aby se pravidla nemusela opakovat každé ráno',
      'poznat, co patří do CLAUDE.md, co do skillu a co do artefaktu',
      'nasyncovat knihovnu ze SharePointu do počítače a otevřít ji v Claude Code',
      'poznat, kdy jsou soubory jen zástupci a Claude v nich nic nepřečte',
      'napsat zadání tak, aby nevznikaly přepsané originály',
      'číst pracovní proces jako tok dat mezi lidmi a soubory',
      'najít kroky, ve kterých data mění formu ručně',
      'odlišit, co má převzít automatizace a co má zůstat člověku',
      'vyzpovídat kolegu tak, aby jeho proces šel nakreslit',
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
      'Mapu procesu už máš a víš, kde se přepisuje ručně. Tenhle kurz vede od ní až na poslední schod: k úloze, která se spustí sama a po které zůstane kontrola, ze které poznáš, jestli je výsledek v pořádku. Každou věc si nejdřív ukážeme na akčním regálu, který znáš ze vzoru, a pak ji uděláš na vlastní agendě.',
    level: 'Navazující',
    section: 'Pokračuj',
    modules: [
      {
        key: 'remeslo',
        title: 'Řemeslo',
        summary: 'Dvě dovednosti, bez kterých se nedá pustit nic bez dozoru.',
      },
      {
        key: 'postav',
        title: 'Postav to',
        summary: 'Vezmi jedno místo z mapy a dotáhni ho do skillu.',
      },
      {
        key: 'potom',
        title: 'Potom, až budeš stavět',
        summary: 'Referenční část. Vracej se sem, až narazíš na to, co lekce řeší.',
      },
    ],
    lessons: [L2_TABULKY, L2_KONTROLA, L2_POSTAV, L2_UKAZKA, LESSON_SKILL, L2_ROZBOR, LESSON_AUTOMATIZACE, L2_PLAN, L2_BEH, L2_EMAIL, L2_CELY_PRIKLAD, L2_MCP, L2_DESIGN, L2_NAOSTRO],
    learn: [
      'napsat zadání nad tabulkou, které projde napoprvé',
      'zkontrolovat výstup třemi čísly místo čtení řádek po řádku',
      'dotáhnout jedno místo z mapy až do skillu s vlastní kontrolou',
      'spustit úlohu bez rozhovoru a naplánovat ji',
      'zabalit opakovaný postup do skillu a trefit se v description',
      'napsat runbook a předat automatizaci tak, aby ji zvládl i někdo jiný',
      'projít si celý příklad od složky po rozeslané maily a ověřit si, že ti nic nechybí',
      'připojit MCP server nad katalogem dek.cz a ověřit si, že opravdu odpovídá z katalogu',
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
