import type { RunConfig } from './types'

/**
 * Výchozí program — školení podle kurzu „Introduction to Claude Cowork“
 * (academy.claude.com/courses/introduction-to-claude-cowork, 14 lekcí + kvíz).
 * Všech 14 lekcí je v programu, ale pořadí je přeskládané podle toho,
 * co vyšlo z úvodního dotazníku:
 *
 *  - Nikdo není začátečník — všichni respondenti už Claude Code používají,
 *    zhruba půl na půl „používám dost“ a „používám základně“. Úvodní bloky
 *    jsou proto krátké a stojí na rozdílu mezi Code a Coworkem, ne na základech.
 *    Pozor: dotazník byl o Claude Code, kurz je o Coworku — to jsou jiné věci,
 *    takže technická pohoda ještě neznamená znalost Coworku.
 *  - Nejsilnější poptávka je automatizace opakovaných úkolů, pak objednávky,
 *    sklady a evidence zásob, reklamace a reporty. Skills a pluginy proto
 *    dostaly nejvíc času a největší cvičení.
 *  - Sál je logistický: palety, centrální sklad, forecast, autodoprava,
 *    objednávací systém. Cvičení jedou na jejich datech, ne na obecném demu.
 *  - Bezpečná práce s daty je vytažená dopředu, ne na konec dne — firma má
 *    svá pravidla a v týmu je obava ze ztráty dat.
 *  - Všichni jsou na Windows.
 *
 * Workshop je večerní, 16:00–20:00, tvrdě omezený na 240 minut. Aby se to vešlo,
 * odpadlo oproti celodenní verzi tohle:
 *
 *  - Samostatné cvičení na Excel a Chrome. Modul zůstává jako ukázka, ale
 *    hands-on na něj není čas — Excel se dá vzít v cvičení 2 jako vlastní úkol.
 *  - Kvíz a completion badge. Kvíz je online a dá se dodělat po workshopu;
 *    v sále by sežral 15 minut, které jsou potřebnější na cvičení.
 *
 * Poměr vyšel na 115 minut výkladu, 75 minut cvičení, 25 minut pauz a 20 minut
 * na závěr. Žádný blok není delší než 45 minut a pauza je dvakrát, protože jde
 * o večer po pracovní době.
 *
 * Délky bloků jsou odhad k doladění. Program se dá přepsat přímo v aplikaci
 * (Nastavení a program → JSON) a uloží se do prohlížeče; tenhle soubor je stav,
 * ke kterému se lze vždycky vrátit.
 *
 * Seznam účastníků tu schválně není — jsou to údaje o konkrétních lidech
 * a repozitář je veřejný. Načítá se lokálně nebo ze zašifrovaného souboru,
 * viz README.
 */
export const DEFAULT_CONFIG: RunConfig = {
  event: {
    title: 'Claude Cowork — školení',
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
        'Wi-Fi síť a heslo nechat na plátně',
        'Večerní termín — držet tempo, na doháněnost není rezerva',
      ],
    },
    {
      title: 'Úvod: Cowork vedle Claude Code',
      min: 15,
      kind: 'talk',
      who: 'Moderátorka',
      steps: [
        { title: 'What is Claude Cowork', min: 8, detail: 'Chat vs. Code vs. Cowork — kdy sáhnout po čem' },
        { title: 'Setting up Claude Cowork', min: 7, detail: 'Pracovní složka, konektory, režim oprávnění' },
      ],
      notes: [
        'Sál už Claude Code používá — nezdržovat se u toho, co je AI asistent',
        'Těžiště je rozdíl: Code píše kód, Cowork přebírá celý úkol nad soubory',
        'Přiznat, že tohle je jiný produkt než ten, co znají — ne nadstavba',
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
        'Zařazeno hned na začátek schválně — v týmu je obava ze ztráty dat',
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
        'Demo na skladovém exportu nebo objednávce, ne na obecném příkladu',
        'Ukázat na vlastní obrazovce, ne ze slidů',
      ],
    },
    {
      title: 'Cvičení 1 — úkol na vlastní agendě',
      min: 30,
      kind: 'work',
      who: 'Lektor + asistence',
      steps: [
        { title: 'Založit pracovní složku a nastavit oprávnění', min: 8 },
        { title: 'Zadat úkol nad vlastním exportem — sklad, objednávky, forecast', min: 12 },
        { title: 'Zasáhnout do běžícího úkolu a zkontrolovat výstup', min: 10 },
      ],
      notes: [
        'Ať si každý vezme data ze své agendy, ne cvičný soubor',
        'Obejít sál, kdo se zasekl; zadání nechat na plátně po celou dobu',
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
        'Příklady stavět na jejich procesech: objednávky, reklamace, reporty',
        'Držet se stopáže, aby cvičení 2 nezačalo pozdě — je to nejcennější část večera',
      ],
    },
    {
      title: 'Cvičení 2 — skill na opakovaný úkol',
      min: 45,
      kind: 'work',
      who: 'Lektor + asistence',
      steps: [
        { title: 'Vybrat si vlastní opakovaný úkol', min: 8, detail: 'To, co člověk dělá každý týden ručně' },
        { title: 'Napsat globální instrukce a skill', min: 17 },
        { title: 'Vyzkoušet na reálných datech a doladit', min: 12 },
        { title: 'Naplánovat úkol, ať běží sám', min: 8 },
      ],
      notes: [
        'Nejdelší blok večera a hlavní důvod, proč tu lidi jsou',
        'Kdo chce Excel, ať si vezme excelový úkol — samostatné cvičení na Office není',
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
      notes: ['Jen ukázka, hands-on na tohle ve čtyřech hodinách nezbyl čas'],
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
    },
    {
      title: 'Otázky, co si kdo odnese, závěr',
      min: 20,
      kind: 'qna',
      who: 'Moderátorka',
      steps: [{ title: 'Wrap up and next steps', min: 8 }],
      notes: [
        'Nechat každého říct jeden úkol, který zautomatizuje do příště',
        'Kvíz a completion badge zůstávají na doma — poslat odkaz',
        'Mít připravené dvě vlastní otázky, kdyby se sál styděl',
        'Odkaz na materiály a dotazník',
      ],
    },
  ],
}
