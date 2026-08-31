import type { Kind, RunConfig, RunState, Tone } from '../types'

export const KIND_LABEL: Record<Kind, string> = {
  talk: 'Přednáška',
  work: 'Cvičení',
  qna: 'Otázky',
  break: 'Pauza',
}

const KIND_SET = new Set<Kind>(['talk', 'work', 'qna', 'break'])
const asKind = (k: unknown): Kind => (KIND_SET.has(k as Kind) ? (k as Kind) : 'talk')

/** Čerstvý stav běhu ze zadaného programu. */
export function stateFromConfig(cfg: RunConfig): RunState {
  const agenda = (cfg.agenda ?? []).map((b) => ({
    title: b.title || 'Blok',
    min: Number(b.min) || 0,
    kind: asKind(b.kind),
    who: b.who,
    notes: b.notes,
    steps: b.steps,
    deltaSec: 0,
  }))
  return {
    event: cfg.event,
    agenda,
    idx: 0,
    running: false,
    startedAt: null,
    accumulated: 0,
    actualSec: [],
    stepDone: agenda.map((b) => (b.steps ?? []).map(() => false)),
    autoNext: false,
    beep: false,
  }
}

/** Program bez běhového stavu — pro editor a export. */
export function configFromState(s: RunState): RunConfig {
  return {
    event: s.event,
    agenda: s.agenda.map((b) => ({
      title: b.title,
      min: b.min,
      kind: b.kind,
      ...(b.who ? { who: b.who } : {}),
      ...(b.notes?.length ? { notes: b.notes } : {}),
      ...(b.steps?.length ? { steps: b.steps } : {}),
    })),
  }
}

/** Plánovaná délka bloku v sekundách, včetně ručních úprav ±1 min. */
export function durSec(s: RunState, i: number): number {
  const b = s.agenda[i]
  if (!b) return 0
  return Math.max(0, Math.round(b.min * 60) + b.deltaSec)
}

/** Odběhnutý čas v aktuálním bloku (ms). */
export function elapsedMs(s: RunState, now: number): number {
  return s.accumulated + (s.running && s.startedAt !== null ? now - s.startedAt : 0)
}

/** Zbývající čas aktuálního bloku (s). Záporný = blok přetahuje. */
export function remainSec(s: RunState, now: number): number {
  return durSec(s, s.idx) - Math.floor(elapsedMs(s, now) / 1000)
}

/**
 * Skluz proti plánu (s). Kladné číslo = jsme pozadu.
 * Počítá se jen z uzavřených bloků, takže se nemění během běhu
 * a nerozhodí ho pauznutí odpočtu.
 */
export function driftSec(s: RunState): number {
  let d = 0
  for (let i = 0; i < s.idx; i++) d += (s.actualSec[i] ?? 0) - durSec(s, i)
  return d
}

/** Součet plánovaných délek bloků po tom aktuálním (s). */
export function tailSec(s: RunState): number {
  let t = 0
  for (let i = s.idx + 1; i < s.agenda.length; i++) t += durSec(s, i)
  return t
}

/** Plánovaný posun začátku bloku od začátku akce (s). */
export function plannedOffsetSec(s: RunState, i: number): number {
  let t = 0
  for (let k = 0; k < i; k++) t += durSec(s, k)
  return t
}

/** Plánovaný začátek akce v minutách od půlnoci, nebo null když není zadaný. */
export function eventStartMinutes(s: RunState): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec((s.event.startsAt ?? '').trim())
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

/** Odhad konce akce (epoch ms), když od teď všechno poběží podle plánu. */
export function etaMs(s: RunState, now: number): number {
  return now + (Math.max(0, remainSec(s, now)) + tailSec(s)) * 1000
}

export function toneOf(remain: number): Tone {
  if (remain < 0) return 'over'
  if (remain <= 60) return 'warn'
  return 'ok'
}

export type PaletteKey = 'primary' | 'success' | 'warning' | 'error'

/** Barva odpočtu: pauza je zelená, poslední minuta oranžová, přetažení červené. */
export function paletteFor(tone: Tone, kind: Kind): PaletteKey {
  if (tone === 'over') return 'error'
  if (tone === 'warn') return 'warning'
  return kind === 'break' ? 'success' : 'primary'
}
