/** Typ bloku — ovlivňuje štítek v programu a barvu odpočtu. */
export type Kind = 'talk' | 'work' | 'qna' | 'break'

/** Krok uvnitř bloku — cvičení, kapitola lekce, bod programu. */
export interface Step {
  title: string
  /** Orientační délka v minutách. Odpočet běží na celý blok, ne na krok. */
  min?: number
  /** Doplňující věta ke kroku (zadání cvičení, odkaz, poznámka). */
  detail?: string
}

/** Jeden blok programu tak, jak ho zadává moderátor. */
export interface Block {
  title: string
  /** Plánovaná délka v minutách. */
  min: number
  kind: Kind
  /** Kdo blok vede. */
  who?: string
  /** Odrážky pro moderátora — co říct, na co nezapomenout. */
  notes?: string[]
  /** Vnitřní program bloku — jednotlivá cvičení a kapitoly, dají se odškrtávat. */
  steps?: Step[]
}

export interface EventInfo {
  title: string
  date: string
  venue: string
  /** Plánovaný začátek ve tvaru HH:MM — z něj se dopočítají časy v programu. */
  startsAt: string
}

/** To, co se dá vyexportovat a znovu naimportovat v editoru programu. */
/** Odhad úrovně účastníka — řídí štítek v seznamu, nic víc. */
export type Level = 'unknown' | 'beginner' | 'intermediate' | 'advanced'

/**
 * Účastník školení. Drží se jen to, co lektorovi pomůže vést hodinu:
 * co člověk umí, co od školení potřebuje a jak s ním pracovat.
 */
export interface Participant {
  name: string
  /** Pozice ve firmě. */
  role?: string
  level?: Level
  /** Na čem hlavně pracuje — z úvodního dotazníku. */
  work?: string
  /** Jak je na tom s Claude Code, vlastními slovy z dotazníku. */
  claudeCode?: string
  /** Na co chce Claude Code hlavně použít — z dotazníku. */
  wants?: string[]
  /** Co už používá nebo zvládl. */
  knows?: string[]
  /** Co od školení potřebuje. */
  needs?: string[]
  /** Poznámka pro lektora — jak s ním pracovat. */
  note?: string
}

export interface RunConfig {
  event: EventInfo
  agenda: Block[]
  /**
   * Seznam účastníků. Ve zdrojáku zůstává prázdný — jsou to údaje o konkrétních
   * lidech a repozitář je veřejný. Skutečný seznam se načítá ze souboru
   * v aplikaci a zůstává v prohlížeči.
   */
  participants?: Participant[]
}

/** Blok obohacený o ruční úpravu délky (tlačítka ±1 min). */
export interface RunBlock extends Block {
  deltaSec: number
}

/** Kompletní stav běhu — tohle se ukládá i posílá na plátno. */
export interface RunState {
  event: EventInfo
  agenda: RunBlock[]
  /** Index právě běžícího bloku. */
  idx: number
  running: boolean
  /** Kdy naposledy odstartoval odpočet (epoch ms), nebo null když stojí. */
  startedAt: number | null
  /** Naspaný čas v aktuálním bloku z předchozích spuštění (ms). */
  accumulated: number
  /** Skutečně strávený čas v už uzavřených blocích (s). */
  actualSec: number[]
  participants: Participant[]
  /** Odškrtnuté kroky, indexováno [blok][krok]. */
  stepDone: boolean[][]
  autoNext: boolean
  beep: boolean
}

export type Tone = 'ok' | 'warn' | 'over'
