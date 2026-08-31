import type { RunConfig } from './types'

/**
 * Výchozí program — školení podle kurzu „Introduction to Claude Cowork“
 * (academy.claude.com/courses/introduction-to-claude-cowork, 14 lekcí + kvíz, 2,5 h výuky).
 * Moduly a názvy lekcí jsou z kurzu, délky bloků a cvičení jsou odhad k doladění.
 *
 * Program se dá přepsat rovnou v aplikaci (Nastavení a program → JSON) a uloží se
 * do prohlížeče; tenhle soubor je stav, ke kterému se lze vždycky vrátit.
 */
export const DEFAULT_CONFIG: RunConfig = {
  event: {
    title: 'Claude Cowork — školení',
    date: '31. 8. 2026',
    venue: 'Místo konání',
    startsAt: '09:00',
  },
  // Údaje o konkrétních lidech tady záměrně nejsou — repozitář je veřejný.
  // Seznam se načítá v aplikaci (Nastavení a program → Načíst ze souboru)
  // z lokálního ucastnici.json, který je v .gitignore. Tvar viz ucastnici.example.json.
  participants: [],
  agenda: [
    {
      title: 'Příchod, káva, kontrola nastavení',
      min: 15,
      kind: 'break',
      notes: [
        'Ověřit, že každý má desktopovou appku a placený plán (Pro / Max / Team / Enterprise)',
        'Všichni na Windows — cesty a příkazy ukazovat ve windowsové podobě',
        'Projít firemní pravidla pro data: co Claude smí vidět a jaký režim oprávnění nastavit',
        'Wi-Fi síť a heslo nechat na plátně',
      ],
    },
    {
      title: 'Úvod a program dne',
      min: 10,
      kind: 'talk',
      who: 'Moderátorka',
      notes: [
        'Přivítat, představit lektory',
        'Projít program a kdy jsou pauzy',
        'Cowork = Claude pracující s tvými soubory, ne konverzace',
        'Upozornit, že se fotí a natáčí',
      ],
    },
    {
      title: 'Modul 1 — Meet Claude Cowork',
      min: 35,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'What is Claude Cowork', min: 8, detail: 'Čím se liší od Chatu a od Code' },
        { title: 'Setting up Claude Cowork', min: 9, detail: 'Pracovní složka, konektory, režim oprávnění' },
        { title: 'What Claude Cowork can do for you', min: 9 },
        { title: 'Hand Claude Cowork your first task', min: 9, detail: 'Zadání, doplňující otázky, řízení za běhu' },
      ],
      notes: ['Nechat prostor na dotazy až na konci modulu', 'Ukázat na vlastní obrazovce, ne jen ze slidů'],
    },
    {
      title: 'Cvičení 1 — první úkol od začátku do konce',
      min: 30,
      kind: 'work',
      who: 'Lektor + asistence',
      steps: [
        { title: 'Založit pracovní složku a pustit guided setup', min: 8 },
        { title: 'Zadat vlastní víckrokový úkol', min: 12 },
        { title: 'Zasáhnout do běžícího úkolu a zkontrolovat výstup', min: 10 },
      ],
      notes: ['Obejít sál, kdo se zasekl', 'Zadání nechat na plátně po celou dobu'],
    },
    {
      title: 'Pauza',
      min: 15,
      kind: 'break',
      notes: ['Odpočet nechat na plátně', 'Zkontrolovat kávu a vodu'],
    },
    {
      title: 'Modul 2 — Make Claude Cowork yours',
      min: 40,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Get better results faster', min: 9 },
        { title: 'Standing context: Global instructions and projects', min: 10 },
        { title: 'Skills: Teach Claude Cowork your way', min: 10 },
        { title: "Plugins: Encode your team's expertise", min: 11 },
      ],
    },
    {
      title: 'Cvičení 2 — vlastní skill a projekt',
      min: 35,
      kind: 'work',
      who: 'Lektor + asistence',
      steps: [
        { title: 'Napsat globální instrukce pro svůj tým', min: 10 },
        { title: 'Postavit skill na vlastní opakovaný postup', min: 15 },
        { title: 'Nainstalovat a upravit plugin', min: 10 },
      ],
    },
    {
      title: 'Oběd',
      min: 45,
      kind: 'break',
    },
    {
      title: 'Modul 3 — Use Claude wherever you work',
      min: 20,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Claude in Chrome', min: 10 },
        { title: 'Claude for Microsoft 365', min: 10, detail: 'Word, Excel, PowerPoint, Outlook' },
      ],
    },
    {
      title: 'Cvičení 3 — Chrome a Office',
      min: 25,
      kind: 'work',
      who: 'Lektor + asistence',
      steps: [
        { title: 'Proklikat webovou aplikaci přes Claude in Chrome', min: 13 },
        { title: 'Nechat si přepsat dokument nebo tabulku', min: 12 },
      ],
    },
    {
      title: 'Modul 4 — Sharing and safety',
      min: 30,
      kind: 'talk',
      who: 'Lektor',
      steps: [
        { title: 'Best practices for working safely', min: 8 },
        { title: 'Validating skills for plugins', min: 8, detail: 'Evals před tím, než se na skill spolehneš' },
        { title: 'Share what you build with your team', min: 7, detail: 'Marketplace organizace' },
        { title: 'Wrap up and next steps', min: 7 },
      ],
    },
    {
      title: 'Kvíz a completion badge',
      min: 15,
      kind: 'qna',
      notes: ['Kvíz je součástí kurzu — nechat čas i na badge'],
    },
    {
      title: 'Otázky, zpětná vazba, závěr',
      min: 20,
      kind: 'qna',
      who: 'Moderátorka',
      notes: [
        'Mít připravené dvě vlastní otázky, kdyby se sál styděl',
        'Mikrofon do publika',
        'Odkaz na materiály a dotazník',
      ],
    },
  ],
}
