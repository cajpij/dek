import type { RunConfig } from './types'

/**
 * Výchozí program — večerní workshop Claude Cowork pro DEK, 16:00–20:00.
 *
 * Obsah stojí na kurzu „Introduction to Claude Cowork“
 * (academy.claude.com/courses/introduction-to-claude-cowork). Všech 14 lekcí
 * v programu je, ale pořadí a váhy jsou přeskládané podle úvodního dotazníku:
 *
 *  - Nikdo není začátečník — všichni respondenti už Claude Code používají,
 *    zhruba půl na půl „používám dost“ a „používám základně“. Úvod je proto
 *    krátký a stojí na rozdílu mezi Code a Coworkem, ne na základech. Pozor:
 *    dotazník byl o Claude Code, kurz je o Coworku — jiné produkty, takže
 *    technická pohoda ještě neznamená znalost Coworku.
 *  - Nejsilnější poptávka je automatizace opakovaných úkolů, pak objednávky,
 *    sklady a evidence zásob, reklamace a reporty.
 *  - Bezpečná práce s daty je vytažená dopředu, ne na konec — firma má svá
 *    pravidla a v týmu je obava ze ztráty dat.
 *  - Všichni jsou na Windows.
 *
 * Cvičení nejsou samostatné úlohy, ale jedna osa: celý večer se staví kontrola
 * paletových převodů mezi pobočkou a třídírnou. Cvičení 1 řeší vstupy, cvičení 2
 * samotné srovnání a co z něj plyne. Každý si bere jeden díl a na konci se
 * skládají dohromady. Nabídka dílů se ukazuje i na plátně, aby si nikdo nemusel
 * úkol vymýšlet.
 *
 * Co večer reálně přinese: skill, který kontrolu udělá nad exportovanými soubory.
 * Ne hotovou webovou aplikaci se čtečkou a čtením mailu — čtečka zatím použitelné
 * API nemá a napojení mailu je samostatná práce. Závěrečný blok to říká nahlas,
 * aby nikdo neodcházel se zkreslenou představou.
 *
 * Do 240 minut se oproti celodenní verzi nevešlo samostatné cvičení na Excel
 * a Chrome (modul zůstal jako ukázka) a kvíz s completion badge (je online,
 * dá se dodělat po workshopu).
 *
 * Délky bloků jsou odhad k doladění. Program se dá přepsat přímo v aplikaci
 * (Nastavení a program → JSON) a uloží se do prohlížeče; tenhle soubor je stav,
 * ke kterému se lze vždycky vrátit.
 *
 * Seznam účastníků tu schválně není — jsou to údaje o konkrétních lidech
 * a repozitář je veřejný. Načítá se lokálně nebo ze zašifrovaného souboru,
 * viz README.
 */

/** Proces, ze kterého se večer krájí. Opakuje se u obou cvičení. */
const PALETY_BRIEF =
  'Pobočka pošle palety s dokladem — až pět set kusů různých druhů. Zásilka jde na třídírnu, ' +
  'ta ji vytřídí a pošle CSV mailem. Teprve pak přijde kontrola: co pobočka poslala navíc a ' +
  'nenapsala na doklad, chceme po ní; co je na dokladu a nedorazilo, vracíme jí. Doklad za ' +
  'pobočku vystavit nejde a tak to zůstane. Dnes večer stavíme právě tuhle kontrolu.'

export const DEFAULT_CONFIG: RunConfig = {
  event: {
    title: 'Claude Cowork — workshop pro DEK',
    date: '31. 8. 2026',
    venue: 'Místo konání',
    startsAt: '16:00',
  },
  participants: [],
  agenda: [
    {
      title: 'Příchod a kontrola nastavení',
      min: 10,
      kind: 'break',
      notes: [
        'Ověřit, že každý má desktopovou appku a placený plán (Pro / Max / Team / Enterprise)',
        'Všichni na Windows — cesty a příkazy ukazovat ve windowsové podobě',
        'Ať má každý po ruce nějaký svůj export: doklad, CSV, tabulku',
        'Kdo nevyplnil vstupní kvíz, ať ho udělá teď — odkaz je v Nastavení a program',
        'Z kvízu vypadne, který díl paletové evidence si má kdo ve cvičeních vzít',
        'Wi-Fi síť a heslo nechat na plátně',
        'Večerní termín — držet tempo, na doháněnost není rezerva',
      ],
    },
    {
      title: 'Úvod: Cowork vedle Claude Code',
      min: 15,
      kind: 'talk',
      who: 'Martin',
      steps: [
        { title: 'What is Claude Cowork', min: 8, detail: 'Chat vs. Code vs. Cowork — kdy sáhnout po čem' },
        { title: 'Setting up Claude Cowork', min: 7, detail: 'Pracovní složka, konektory, režim oprávnění' },
      ],
      notes: [
        'Sál už Claude Code používá — nezdržovat se u toho, co je AI asistent',
        'Těžiště je rozdíl: Code píše kód, Cowork přebírá celý úkol nad soubory',
        'Říct rovnou, k čemu večer směřuje: kontrola paletových převodů',
        'Přiznat, že Cowork je jiný produkt než ten, co znají — ne nadstavba',
      ],
    },
    {
      title: 'Bezpečně s firemními daty',
      min: 15,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Best practices for working safely', min: 8, detail: 'Kontrola plánu i výstupu, než se na něj spolehnu' },
        { title: 'Co pustit do pracovní složky', min: 7, detail: 'Firemní pravidla pro data a nastavení oprávnění' },
      ],
      notes: [
        'Zařazeno na začátek schválně — v týmu je obava ze ztráty dat',
        'Ukázat náhled na to, co Claude mění, a jak se změna vezme zpět',
        'Zmínit zálohu a verzování dřív, než se kdokoli pustí do většího úkolu',
      ],
    },
    {
      title: 'Co Cowork zvládne a první úkol',
      min: 20,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'What Claude Cowork can do for you', min: 7, detail: 'Včetně naplánovaných úkolů a běhu v cloudu' },
        { title: 'Hand Claude Cowork your first task', min: 7, detail: 'Zadání, doplňující otázky, zásah za běhu' },
        { title: 'Get better results faster', min: 6 },
      ],
      notes: [
        'Demo rovnou na paletovém dokladu, ať na to navazuje cvičení',
        'Ukázat na vlastní obrazovce, ne ze slidů',
      ],
    },
    {
      title: 'Cvičení 1 — vstupy do evidence palet',
      min: 30,
      kind: 'work',
      who: 'Lektor + asistence',
      brief: PALETY_BRIEF + ' V tomhle bloku jde o vstupy: dostat každý zdroj do stejného tvaru, aby se pak daly porovnat.',
      steps: [
        { title: 'Založit pracovní složku a nastavit oprávnění', min: 7 },
        { title: 'Vzít si jeden díl a nechat Clauda převést ho do tabulky', min: 15 },
        { title: 'Zkontrolovat výstup a doladit, co se rozsypalo', min: 8 },
      ],
      examples: [
        {
          title: 'Doklad z pobočky ze čtečky',
          detail:
            'Z exportu ze čtečky udělat čistou tabulku: druh palety, počet, pobočka, datum, číslo dokladu. Ošetřit, že se druhy palet píšou pokaždé trochu jinak.',
        },
        {
          title: 'CSV z třídírny',
          detail:
            'Načíst přílohu, kterou posílá třídírna, a převést ji do stejného tvaru jako doklad z pobočky — jinak se srovnávat nedá.',
        },
        {
          title: 'Evidence USZ dokladů',
          detail:
            'Z dosavadních dokladů udělat přehled: co je vystavené, co už vrácené a co visí déle, než by mělo.',
        },
        {
          title: 'Žádost o USZ z mailu',
          detail:
            'Z e-mailové žádosti vytáhnout údaje a založit záznam ve stejné struktuře jako zbytek evidence.',
        },
      ],
      notes: [
        'Zadání jsou na plátně — ať si každý vezme jeden díl, ne všechny',
        'Domluvit se na společných názvech sloupců, jinak to po pauze nepůjde slepit',
        'Obejít sál, kdo se zasekl',
      ],
    },
    {
      title: 'Pauza',
      min: 15,
      kind: 'break',
      notes: ['Odpočet nechat na plátně', 'Zkontrolovat kávu a vodu'],
    },
    {
      title: 'Kontext, skills a pluginy',
      min: 30,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Standing context: Global instructions and projects', min: 9 },
        { title: 'Skills: Teach Claude Cowork your way', min: 11, detail: 'Jádro večera — tady je poptávka největší' },
        { title: "Plugins: Encode your team's expertise", min: 10 },
      ],
      notes: [
        'Automatizace opakovaných úkolů byla v dotazníku skoro u všech — tohle je ten blok',
        'Příklady stavět na paletách, ať to drží linku k druhému cvičení',
        'Držet stopáž, aby cvičení 2 nezačalo pozdě — je to nejcennější část večera',
      ],
    },
    {
      title: 'Cvičení 2 — kontrola palet jako skill',
      min: 45,
      kind: 'work',
      who: 'Lektor + asistence',
      brief:
        'Vstupy máte z prvního cvičení. Teď z kontroly uděláme skill, který ji zvládne sám: na vstupu ' +
        'doklad pobočky a CSV z třídírny, na výstupu dva seznamy — co chceme po pobočce a co jí vracíme.',
      steps: [
        { title: 'Vzít si jeden díl a napsat k němu skill', min: 20 },
        { title: 'Pustit ho na reálných datech a doladit', min: 15 },
        { title: 'Naplánovat, ať běží sám', min: 10 },
      ],
      examples: [
        {
          title: 'Samotné srovnání dokladu a CSV',
          detail:
            'Dva seznamy: posláno navíc a nenapsáno na dokladu, a naopak na dokladu a nedorazilo. Vyřešit, když se druh palety v obou zdrojích nejmenuje stejně.',
        },
        {
          title: 'Zpráva pobočce o rozdílech',
          detail:
            'Z rozdílů vygenerovat srozumitelný text pro pobočku. Doklad za ni nevystavovat — jen popsat, co má opravit.',
        },
        {
          title: 'Měsíční přehled rozdílů',
          detail:
            'Které pobočky mají nejvíc rozdílů, u kterých druhů palet a kolik to dělá kusů. Podklad k tomu, kde zasáhnout.',
        },
        {
          title: 'Naplánovaná kontrola',
          detail:
            'Ať kontrola proběhne sama, jakmile dorazí nové CSV, a výsledek přijde mailem. Zatím nad složkou, kam se soubor uloží.',
        },
        {
          title: 'Zabalit do pluginu pro tým',
          detail:
            'Aby to nespustil jen ten, kdo to napsal, a aby se to dalo předat dál i s postupem a názvoslovím.',
        },
      ],
      notes: [
        'Nejdelší blok večera a hlavní důvod, proč tu lidi jsou',
        'Kdo si vzal v prvním cvičení vstup, ať tady bere navazující díl',
        'Kdo chce Excel, ať si vezme excelový výstup — samostatné cvičení na Office není',
      ],
    },
    {
      title: 'Krátká pauza',
      min: 10,
      kind: 'break',
    },
    {
      title: 'Claude v Chrome a v Office',
      min: 20,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Claude in Chrome', min: 10, detail: 'Objednávací systém a další webové nástroje' },
        { title: 'Claude for Microsoft 365', min: 10, detail: 'Excel je tu hodně používaný — začít jím' },
      ],
      notes: [
        'Napojit na palety: čtečka zatím použitelné API nemá, takže import a export je realita',
        'Jen ukázka, hands-on na tohle ve čtyřech hodinách nezbyl čas',
      ],
    },
    {
      title: 'Sdílení v týmu a validace skillů',
      min: 10,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Validating skills for plugins', min: 5, detail: 'Evals — ověřit skill, než se na něj tým spolehne' },
        { title: 'Share what you build with your team', min: 5, detail: 'Marketplace organizace' },
      ],
      notes: ['Rovnou na dnešních skillech — co z nich udělat sdílený plugin'],
    },
    {
      title: 'Poskládat díly a co dál',
      min: 20,
      kind: 'qna',
      who: 'Martin',
      steps: [{ title: 'Wrap up and next steps', min: 8 }],
      notes: [
        'Projít, co dnes vzniklo, a ukázat, jak díly zapadají do sebe',
        'Říct nahlas, co dnes NEvzniklo: napojení na čtečku a čtení mailu je samostatná práce',
        'Nechat každého říct jeden úkol, který zautomatizuje do příště',
        'Kvíz a completion badge zůstávají na doma — poslat odkaz',
        'Odkaz na materiály a dotazník',
      ],
    },
  ],
}
