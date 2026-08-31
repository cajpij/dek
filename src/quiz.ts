/**
 * Vstupní kvíz — pár minut při příchodu, aby lektor věděl, kdo kde je,
 * a aby si každý odnesl doporučení, který díl paletové evidence si vzít.
 *
 * Otázky vycházejí z kurzu „Introduction to Claude Cowork“, ale ptají se
 * na rozhodnutí v práci DEK, ne na definice. Nejde o test — jde o to
 * nezdržovat pokročilé a nenechat nikoho utopit.
 *
 * Sbírá se lokálně v prohlížeči účastníka. Nikam se to neodesílá; výsledek
 * se zkopíruje jedním tlačítkem a pošle lektorovi vlastním kanálem.
 */

export interface Choice {
  label: string
  /** Body k úrovni. Otázky bez bodování slouží jen jako podklad pro lektora. */
  points?: number
}

export interface Question {
  id: string
  prompt: string
  /** Víc odpovědí naráz. */
  multi?: boolean
  /** Nebodovaná otázka — sbírá kontext, ne úroveň. */
  survey?: boolean
  choices: Choice[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'slozka',
    prompt: 'Máš na disku složku s exporty ze skladu a chceš z nich týdenní přehled. Co uděláš?',
    choices: [
      { label: 'Udělám to ručně v Excelu jako vždycky', points: 0 },
      { label: 'Zkopíruju kus dat do chatu a zeptám se', points: 1 },
      { label: 'Popíšu úkol a nechám Clauda pracovat přímo s tou složkou', points: 2 },
      { label: 'Napíšu si na to skill, ať to jde příště na jedno zadání', points: 3 },
    ],
  },
  {
    id: 'rozdil',
    prompt: 'Claude Code a Claude Cowork — v čem je mezi nimi rozdíl?',
    choices: [
      { label: 'Nevím, nebo je to podle mě totéž', points: 0 },
      { label: 'Cowork je jen webová verze Codu', points: 0 },
      { label: 'Cowork je pro nekodéry, Code pro programátory', points: 1 },
      { label: 'Code je na práci se zdrojáky, Cowork přebírá celý úkol nad soubory a aplikacemi', points: 3 },
    ],
  },
  {
    id: 'bezpecnost',
    prompt: 'Než pustíš Clauda na firemní data, co nastavíš jako první?',
    choices: [
      { label: 'Nevím, co se u toho dá nastavit', points: 0 },
      { label: 'Nic, prostě to spustím', points: 0 },
      { label: 'Vyberu pracovní složku a projdu, co do ní patří', points: 2 },
      { label: 'Složku, režim oprávnění a ověřím si, kam smí zapisovat', points: 3 },
    ],
  },
  {
    id: 'kontext',
    prompt: 'K čemu jsou globální instrukce a projekty?',
    choices: [
      { label: 'Nevím', points: 0 },
      { label: 'Ukládá se tam historie konverzací', points: 0 },
      { label: 'Je to nastavení vzhledu a jazyka', points: 0 },
      {
        label: 'Trvalý kontext — názvosloví, postupy a co má vypadnout — abych to nepsal pokaždé znovu',
        points: 3,
      },
    ],
  },
  {
    id: 'opakovane',
    prompt:
      'Kontrolu palet děláš každý týden stejně. Jak z toho uděláš věc, kterou spustíš na jedno zadání a předáš kolegovi?',
    choices: [
      { label: 'Nevím, co je skill', points: 0 },
      { label: 'Uložím si prompt do poznámek a kopíruju ho', points: 1 },
      { label: 'Napíšu skill', points: 2 },
      { label: 'Napíšu skill, ověřím ho a zabalím do pluginu pro tým', points: 3 },
    ],
  },
  {
    id: 'kontrola',
    prompt: 'Claude ti vrátí tabulku rozdílů. Co uděláš, než ji pošleš na pobočku?',
    choices: [
      { label: 'Pošlu rovnou, od toho to je', points: 0 },
      { label: 'Přečtu si, co vrátil', points: 1 },
      { label: 'Nechám si výsledek zkontrolovat zase Claudem', points: 1 },
      { label: 'Ověřím pár řádků proti zdroji a projdu, co Claude měnil', points: 3 },
    ],
  },
  {
    id: 'zkusenost',
    prompt: 'Co z tohohle už jsi někdy sám udělal?',
    multi: true,
    choices: [
      { label: 'Napsal prompt a dostal odpověď', points: 1 },
      { label: 'Nechal Clauda pracovat s celou složkou souborů', points: 2 },
      { label: 'Napsal si vlastní skill', points: 3 },
      { label: 'Nainstaloval nebo upravil plugin', points: 3 },
      { label: 'Naplánoval opakovaný úkol, ať běží sám', points: 3 },
    ],
  },
  {
    id: 'chci',
    prompt: 'Na co to chceš hlavně používat? Vyber klidně víc.',
    multi: true,
    survey: true,
    choices: [
      { label: 'Automatizace opakovaných úkolů' },
      { label: 'Objednávky, sklady a evidence zásob' },
      { label: 'Reklamace a reporty' },
      { label: 'Faktury a účetní agenda' },
      { label: 'Nabídky, poptávky a cenové kalkulace' },
      { label: 'Technické listy a dokumentace k materiálům' },
      { label: 'Palety a jejich evidence' },
    ],
  },
]

/** Nejvyšší dosažitelný počet bodů z bodovaných otázek. */
export const MAX_POINTS = QUESTIONS.filter((q) => !q.survey).reduce(
  (sum, q) =>
    sum +
    (q.multi
      ? q.choices.reduce((s, c) => s + (c.points ?? 0), 0)
      : Math.max(...q.choices.map((c) => c.points ?? 0))),
  0,
)

export interface Outcome {
  level: string
  /** Doporučený díl paletové evidence pro cvičení. */
  slice: string
  advice: string
}

/**
 * Body → úroveň a doporučený díl. Hranice jsou nastavené tak, aby nikdo
 * neskončil bez práce a aby zkušení nedělali znovu to, co už umí.
 */
export function outcomeFor(points: number): Outcome {
  if (points <= 8) {
    return {
      level: 'Začínám',
      slice: 'Doklad z pobočky ze čtečky',
      advice:
        'Ve cvičeních si vezmi vstup — převod exportu do čisté tabulky. Je to celý postup od začátku do konce a nepotřebuje nic, co dneska ještě neznáš.',
    }
  }
  if (points <= 15) {
    return {
      level: 'Něco už umím',
      slice: 'CSV z třídírny a srovnání s dokladem',
      advice:
        'Vezmi si porovnání dvou zdrojů. Nejtěžší na tom není Claude, ale rozhodnout, co dělat, když se druh palety v obou souborech nejmenuje stejně.',
    }
  }
  if (points <= 22) {
    return {
      level: 'Používám to běžně',
      slice: 'Zpráva pobočce a měsíční přehled rozdílů',
      advice:
        'Postav z kontroly skill, který rovnou vyrobí i výstup pro pobočku. Pozor na pravidlo, že doklad za pobočku vystavit nesmíme — jen jí popsat, co opravit.',
    }
  }
  return {
    level: 'Jsem dál než většina sálu',
    slice: 'Naplánovaná kontrola a plugin pro tým',
    advice:
      'Neopakuj si základy. Vezmi si nejtěžší díl — ať kontrola běží sama, jakmile dorazí CSV, a zabal ji do pluginu, který spustí i kolega. Počítej s tím, že tě lektor požádá o pomoc ostatním.',
  }
}

export interface QuizAnswers {
  name: string
  /** id otázky → indexy vybraných odpovědí */
  picks: Record<string, number[]>
}

export function scoreOf(answers: QuizAnswers): number {
  let total = 0
  for (const question of QUESTIONS) {
    if (question.survey) continue
    for (const index of answers.picks[question.id] ?? []) {
      total += question.choices[index]?.points ?? 0
    }
  }
  return total
}

/** Jednořádkové shrnutí, které účastník pošle lektorovi. */
export function summaryOf(answers: QuizAnswers): string {
  const points = scoreOf(answers)
  const outcome = outcomeFor(points)
  const wants = (answers.picks['chci'] ?? [])
    .map((i) => QUESTIONS.find((q) => q.id === 'chci')?.choices[i]?.label)
    .filter(Boolean)
  const done = (answers.picks['zkusenost'] ?? [])
    .map((i) => QUESTIONS.find((q) => q.id === 'zkusenost')?.choices[i]?.label)
    .filter(Boolean)

  return [
    `${answers.name || 'Bez jména'} — ${outcome.level} (${points}/${MAX_POINTS} b.)`,
    `Díl pro cvičení: ${outcome.slice}`,
    done.length ? `Už zkusil: ${done.join(', ')}` : 'Zatím nic z nabídnutého nezkoušel',
    wants.length ? `Chce používat na: ${wants.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
