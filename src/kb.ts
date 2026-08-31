/**
 * Knowledge base pro DEK — co si tým odnese z workshopu a k čemu se bude vracet.
 *
 * Forma je vzatá z Claude Academy (rozcestník, kartičky „začni tady“, úlohy
 * po agendách), obsah je z DEK: prodejny, centrální sklad, palety, rozvoz,
 * objednávky, reklamace, technické listy, zákaznické centrum.
 *
 * Úlohy jsou psané tak, aby šly zadat rovnou — co Claude dostane na vstupu
 * a co má vypadnout. Odhad času je pro člověka, který to dělá poprvé.
 */

export type Level = 'zaklad' | 'stredni' | 'pokrocile'

export const LEVEL_LABEL: Record<Level, string> = {
  zaklad: 'základ',
  stredni: 'středně pokročilé',
  pokrocile: 'pokročilé',
}

export interface Card {
  title: string
  summary: string
  /** Co k tomu člověk potřebuje mít po ruce. */
  needs?: string[]
  /** Co z toho vypadne. */
  gives?: string[]
  minutes?: number
  level?: Level
}

export interface Category {
  id: string
  label: string
  cards: Card[]
}

export interface Link {
  label: string
  href: string
  note?: string
}

export const START_HERE: Card[] = [
  {
    title: 'Než pustíš Clauda na firemní data',
    summary:
      'Pracovní složka, režim oprávnění a co do složky vůbec patří. Projít dřív než cokoli jiného — jednou, pořádně, a pak už na to nemyslet.',
    gives: ['Nastavené prostředí, ve kterém nemůžeš nic rozbít omylem'],
    minutes: 15,
    level: 'zaklad',
  },
  {
    title: 'Tvůj první úkol od začátku do konce',
    summary:
      'Vezmi jeden svůj export, popiš, co z něj chceš, a nech Clauda pracovat. Nauč se do běžícího úkolu zasáhnout a výsledek zkontrolovat proti zdroji.',
    needs: ['Jeden vlastní soubor — doklad, CSV, tabulka'],
    gives: ['Hotový výstup a představa, kde je hranice mezi zadáním a doladěním'],
    minutes: 20,
    level: 'zaklad',
  },
  {
    title: 'Z opakovaného úkolu udělat skill',
    summary:
      'To, co děláš každý týden stejně, popsat jednou a pak spouštět na jedno zadání. Skill si pamatuje postup, názvosloví i to, jak má vypadat výstup.',
    needs: ['Úkol, který jsi udělal aspoň třikrát ručně'],
    gives: ['Skill, který spustíš i předáš kolegovi'],
    minutes: 30,
    level: 'stredni',
  },
]

export const CATEGORIES: Category[] = [
  {
    id: 'palety',
    label: 'Palety',
    cards: [
      {
        title: 'Kontrola dokladu proti CSV z třídírny',
        summary:
          'Srovnat, co pobočka napsala na doklad, s tím, co třídírna skutečně přijala. Vypadnou dva seznamy: co chceme po pobočce a co jí vracíme.',
        needs: ['Doklad z pobočky', 'CSV z třídírny'],
        gives: ['Seznam „posláno navíc“', 'Seznam „na dokladu, nedorazilo“'],
        minutes: 30,
        level: 'stredni',
      },
      {
        title: 'Sjednocení názvů druhů palet',
        summary:
          'Doklad a CSV pojmenovávají tentýž druh palety pokaždé trochu jinak. Postavit převodník, který obojí srovná na společné názvosloví.',
        needs: ['Oba zdroje s reálnými nesrovnalostmi v názvech'],
        gives: ['Číselník, na který se dá spolehnout i příště'],
        minutes: 25,
        level: 'stredni',
      },
      {
        title: 'Zpráva pobočce o rozdílech',
        summary:
          'Z rozdílů udělat srozumitelný text, který pobočka pochopí. Doklad za ni nevystavujeme — jen popisujeme, co má opravit.',
        needs: ['Výstup kontroly'],
        gives: ['Text k odeslání, bez ručního přepisování čísel'],
        minutes: 15,
        level: 'zaklad',
      },
      {
        title: 'Evidence USZ dokladů',
        summary:
          'Přehled, co je vystavené, co už vrácené a co visí déle, než by mělo. Včetně žádostí, které chodí mailem.',
        needs: ['Dosavadní doklady', 'Mailové žádosti o USZ'],
        gives: ['Jeden přehled místo hledání v poště'],
        minutes: 25,
        level: 'stredni',
      },
      {
        title: 'Naplánovaná kontrola',
        summary:
          'Ať se kontrola spustí sama, jakmile do složky přistane nové CSV, a výsledek přijde mailem. Bez čekání, až si na to někdo vzpomene.',
        needs: ['Hotový skill na kontrolu'],
        gives: ['Kontrola, která běží bez tebe'],
        minutes: 20,
        level: 'pokrocile',
      },
    ],
  },
  {
    id: 'sklad',
    label: 'Sklad a zásoby',
    cards: [
      {
        title: 'Položky pod minimem před sezónou',
        summary:
          'Z exportu vybrat, co je pod minimální zásobou, a seřadit podle toho, co se v nadcházejícím měsíci nejvíc prodává.',
        needs: ['Export zásob', 'Prodeje za srovnatelné období loni'],
        gives: ['Tabulka k objednání a pár vět na poradu'],
        minutes: 20,
        level: 'zaklad',
      },
      {
        title: 'Forecast proti skutečnosti',
        summary:
          'Najít položky s největší odchylkou a dopsat, čím to nejspíš bylo — sezóna, akce v magazínu, jednorázová velká objednávka.',
        needs: ['Forecast', 'Skutečný odběr'],
        gives: ['Seznam odchylek s vysvětlením, ne jen čísla'],
        minutes: 25,
        level: 'stredni',
      },
      {
        title: 'Týdenní report centrálního skladu',
        summary:
          'Z několika exportů složit jednu stránku: obrátka, nejpohyblivější položky, odchylky. Ke každému číslu tři věty, co se změnilo.',
        needs: ['Exporty za týden'],
        gives: ['Report, který nikdo nemusí skládat ručně'],
        minutes: 35,
        level: 'stredni',
      },
    ],
  },
  {
    id: 'objednavky',
    label: 'Objednávky',
    cards: [
      {
        title: 'Ranní přehled nevyřízených objednávek',
        summary:
          'Co je po termínu, u koho urgovat a co ohrožuje dnešní rozvoz. Naplánovat na každý pracovní den před sedmou.',
        needs: ['Export z objednávacího systému'],
        gives: ['Krátký mail dispečinku, každé ráno stejně'],
        minutes: 30,
        level: 'stredni',
      },
      {
        title: 'Kontrola cen proti ceníku',
        summary:
          'Projít nové objednávky a najít řádky, kde se cena liší od platného ceníku nebo od rámcové smlouvy.',
        needs: ['Objednávky', 'Platný ceník nebo smlouva'],
        gives: ['Seznam rozdílů k odsouhlasení'],
        minutes: 25,
        level: 'stredni',
      },
    ],
  },
  {
    id: 'doprava',
    label: 'Autodoprava',
    cards: [
      {
        title: 'Prázdné kilometry a spojitelné trasy',
        summary:
          'Z přehledu jízd spočítat prázdné kilometry po trasách a najít ty, které se opakují a daly by se spojit.',
        needs: ['Přehled jízd za období'],
        gives: ['Podklad pro dispečink, kde se dá ušetřit'],
        minutes: 30,
        level: 'stredni',
      },
      {
        title: 'Kontrola dokladů k jízdám',
        summary: 'Projít složku s doklady a vypsat, co chybí nebo je nečitelné, než to začne chybět v účtárně.',
        needs: ['Složka s doklady'],
        gives: ['Seznam k doplnění'],
        minutes: 20,
        level: 'zaklad',
      },
    ],
  },
  {
    id: 'reklamace',
    label: 'Reklamace a reporty',
    cards: [
      {
        title: 'Reklamace podle příčiny',
        summary:
          'Roztřídit reklamace za měsíc — doprava, výrobní vada, špatně zadaná objednávka, poškození na stavbě — a spočítat podíly.',
        needs: ['Export nebo mailová složka reklamací'],
        gives: ['Rozpad podle příčin a návrhy, kde zasáhnout'],
        minutes: 30,
        level: 'stredni',
      },
      {
        title: 'Měsíční report pro vedení',
        summary: 'Z několika zdrojů jedna stránka: čísla, tři věty ke každému, a co se změnilo proti minulému měsíci.',
        needs: ['Exporty za měsíc'],
        gives: ['Report bez nočního skládání v Excelu'],
        minutes: 35,
        level: 'stredni',
      },
    ],
  },
  {
    id: 'faktury',
    label: 'Faktury',
    cards: [
      {
        title: 'Párování faktur s dodacími listy',
        summary: 'Najít faktury bez odpovídajícího dodacího listu nebo s jinou částkou a seřadit je podle částky.',
        needs: ['Faktury', 'Dodací listy'],
        gives: ['Seznam k došetření'],
        minutes: 30,
        level: 'stredni',
      },
    ],
  },
  {
    id: 'materialy',
    label: 'Technické listy',
    cards: [
      {
        title: 'Parametry z PDF do jedné tabulky',
        summary:
          'Ze složky technických listů od dodavatelů vytáhnout klíčové parametry — rozměr, hmotnost, balení na paletě, technické hodnoty — do jedné srovnávací tabulky.',
        needs: ['Složka PDF od dodavatelů'],
        gives: ['Srovnávací tabulka místo otevírání dvaceti souborů'],
        minutes: 30,
        level: 'stredni',
      },
      {
        title: 'Odpověď na dotaz k materiálu',
        summary:
          'Z technických listů a katalogů sestavit odpověď na konkrétní dotaz zákazníka, včetně odkazu na zdroj, aby šla ověřit.',
        needs: ['Technické listy', 'Znění dotazu'],
        gives: ['Odpověď s dohledatelným zdrojem'],
        minutes: 20,
        level: 'zaklad',
      },
    ],
  },
  {
    id: 'cs',
    label: 'Zákaznické centrum',
    cards: [
      {
        title: 'Opakované dotazy za měsíc',
        summary:
          'Najít nejčastější typy dotazů a navrhnout, co doplnit do FAQ nebo na produktové stránky, aby jich chodilo míň.',
        needs: ['Dotazy za období'],
        gives: ['Žebříček témat a návrh, co dopsat'],
        minutes: 30,
        level: 'stredni',
      },
    ],
  },
]

/** Pravidla, která platí bez ohledu na to, co zrovna člověk dělá. */
export const RULES: { title: string; body: string }[] = [
  {
    title: 'Výstup se kontroluje proti zdroji',
    body:
      'Než výsledek pošleš dál, ověř pár řádků proti původnímu souboru a projdi, co Claude měnil. Ne proto, že by se to obvykle pletlo, ale proto, že podepsaný jsi ty.',
  },
  {
    title: 'Doklad za pobočku nevystavujeme',
    body:
      'U palet platí, že rozdíly pobočce popíšeme, ale doklad za ni nevyrobíme. Změna se plánuje, do té doby to tak zůstává — a skill to musí respektovat.',
  },
  {
    title: 'Do pracovní složky patří jen to, co tam patří',
    body:
      'Claude vidí, co mu ukážeš. Než složku otevřeš, projdi, co v ní je, a řiď se firemními pravidly pro nakládání s daty.',
  },
  {
    title: 'Zálohuj, než pustíš něco velkého',
    body:
      'U prvních běhů pracuj na kopii. Až budeš postupu věřit, pusť ho na ostrá data — ne naopak.',
  },
  {
    title: 'Cloud je rozhodnutí, ne detail',
    body:
      'Nahrát firemní data do externí služby není technická drobnost. Když to začneš potřebovat, ptej se dřív, než to uděláš.',
  },
]

export const LINKS: Link[] = [
  {
    label: 'Introduction to Claude Cowork',
    href: 'https://academy.claude.com/courses/introduction-to-claude-cowork',
    note: 'Kurz, ze kterého workshop vychází — 14 lekcí a kvíz, dá se dodělat po svém',
  },
  {
    label: 'Claude Cowork na Claude Academy',
    href: 'https://academy.claude.com/products/cowork',
    note: 'Rozcestník: tutoriály, use cases, materiály pro správce',
  },
  {
    label: 'Nápověda ke Claude',
    href: 'https://support.claude.com',
    note: 'Bezpečná práce, naplánované úkoly, živé artefakty',
  },
]
