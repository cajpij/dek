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
  | { kind: 'figure'; name: 'regal-flow' | 'sync-map'; caption: string }
  | { kind: 'checklist'; title: string; items: string[] }
  | { kind: 'task'; title: string; intro: string; items: string[]; hint?: string }
  | { kind: 'video'; title: string; items: VideoRef[] }
  /** Stejný krok, jiný systém — čtenář si přepne a vidí jen svou variantu. */
  | { kind: 'platform'; mac: Block[]; win: Block[] }

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
  minutes: 30,
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

export const COURSES: Course[] = [
  {
    slug: 'claude-a-firemni-data',
    title: 'Claude a firemní data',
    summary:
      'Napojit Claudovi složku, ve které pracuješ, a naučit se v ní zadávat práci. Končí zadáním nad reálným procesem.',
    intro:
      'Kurz pro lidi, kteří každý týden přeskládávají tytéž tabulky. Nejdřív napojíš Claudovi složku, ve které ta práce žije, pak si ohraničíš, co v ní smí a nesmí — a nakonec si na reálném procesu akčního regálu vyzkoušíš najít místa, kde se dá práce automatizovat.',
    level: 'Začátečník',
    section: 'Začni tady',
    modules: [
      {
        key: 'napojeni',
        title: 'Napojení dat',
        summary: 'Jednorázové nastavení a hranice, ve kterých se pak pracuje.',
      },
      {
        key: 'zadani',
        title: 'Zadání',
        summary: 'Reálný proces z logistiky, na kterém se hledají automatizace.',
      },
    ],
    lessons: [LESSON_SHAREPOINT, LESSON_CO_VIDI, LESSON_REGAL],
    learn: [
      'nasyncovat knihovnu ze SharePointu do Macu a připojit ji Claudovi',
      'poznat, kdy jsou soubory jen zástupci a Claude v nich nic nepřečte',
      'napsat zadání tak, aby nevznikaly přepsané originály',
      'číst pracovní proces jako tok dat mezi lidmi a soubory',
      'najít kroky, ve kterých data mění formu ručně',
      'odlišit, co má převzít automatizace a co má zůstat člověku',
    ],
    prerequisites: [
      'Mac s aplikací OneDrive přihlášenou firemním účtem',
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
