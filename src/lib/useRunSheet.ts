import { useCallback, useEffect, useRef, useState } from 'react'
import type { Participant, RunConfig, RunState } from '../types'
import { DEFAULT_CONFIG } from '../config'
import { elapsedMs, remainSec, stateFromConfig } from './run'
import { playBeep } from './beep'

const KEY = 'runsheet.v1'
const CHANNEL = 'runsheet.v1'

/** Konzole ovládá běh, plátno ho jen zrcadlí. */
export type Mode = 'console' | 'display'

type Msg = { type: 'state'; state: RunState } | { type: 'hello' }

function loadState(): RunState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as RunState
    if (!s || !Array.isArray(s.agenda) || s.agenda.length === 0) return null
    // Starší uložený stav nemusí mít všechna pole.
    s.actualSec ??= []
    s.participants ??= []
    s.stepDone ??= s.agenda.map((b) => (b.steps ?? []).map(() => false))
    return s
  } catch {
    return null
  }
}

/** Zapíše odběhnutý čas do uzavíraného bloku, aby se z něj dal spočítat skluz. */
function commitElapsed(s: RunState, at: number): RunState {
  const spent = Math.round(elapsedMs(s, at) / 1000)
  if (spent <= 0) return s
  const actualSec = s.actualSec.slice()
  actualSec[s.idx] = (actualSec[s.idx] ?? 0) + spent
  return { ...s, actualSec }
}

export interface RunSheet {
  state: RunState
  /** Tiká 4× za sekundu, aby se přepočítal odpočet. */
  now: number
  toggle: () => void
  goTo: (i: number) => void
  resetBlock: () => void
  bump: (sec: number) => void
  toggleStep: (block: number, step: number) => void
  applyConfig: (cfg: RunConfig) => void
  setParticipants: (people: Participant[]) => void
  loadDefaults: () => void
  setOption: <K extends 'autoNext' | 'beep'>(key: K, value: RunState[K]) => void
}

export function useRunSheet(mode: Mode): RunSheet {
  const [state, setState] = useState<RunState>(() => loadState() ?? stateFromConfig(DEFAULT_CONFIG))
  const [now, setNow] = useState(() => Date.now())

  const channelRef = useRef<BroadcastChannel | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  /** Hlídá, aby pípnutí a automatický přechod padly na doběhnutí bloku jen jednou. */
  const armedRef = useRef(true)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  // Spojení konzole ↔ plátno. Posílá se celý stav, plátno si odpočet dopočítá samo,
  // takže po drátě nic netiká.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const ch = new BroadcastChannel(CHANNEL)
    channelRef.current = ch
    ch.onmessage = (e: MessageEvent<Msg>) => {
      const msg = e.data
      if (!msg) return
      if (msg.type === 'state' && mode === 'display') setState(msg.state)
      if (msg.type === 'hello' && mode === 'console') ch.postMessage({ type: 'state', state: stateRef.current })
    }
    if (mode === 'display') ch.postMessage({ type: 'hello' })
    return () => {
      ch.close()
      channelRef.current = null
    }
  }, [mode])

  // Konzole ukládá a rozesílá každou změnu.
  useEffect(() => {
    if (mode !== 'console') return
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* plný nebo zakázaný storage běh nesmí shodit */
    }
    channelRef.current?.postMessage({ type: 'state', state })
  }, [state, mode])

  // Záloha pro prohlížeče bez BroadcastChannel.
  useEffect(() => {
    if (mode !== 'display') return
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return
      try {
        setState(JSON.parse(e.newValue) as RunState)
      } catch {
        /* rozbitý zápis se ignoruje */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [mode])

  const toggle = useCallback(() => {
    setState((s) => {
      const at = Date.now()
      return s.running
        ? { ...s, running: false, startedAt: null, accumulated: elapsedMs(s, at) }
        : { ...s, running: true, startedAt: at }
    })
  }, [])

  const goTo = useCallback((i: number) => {
    setState((s) => {
      if (i < 0 || i >= s.agenda.length || i === s.idx) return s
      const at = Date.now()
      armedRef.current = true
      return { ...commitElapsed(s, at), idx: i, accumulated: 0, startedAt: s.running ? at : null }
    })
  }, [])

  const resetBlock = useCallback(() => {
    setState((s) => {
      armedRef.current = true
      return { ...s, accumulated: 0, startedAt: s.running ? Date.now() : null }
    })
  }, [])

  const bump = useCallback((sec: number) => {
    setState((s) => {
      const block = s.agenda[s.idx]
      if (!block) return s
      const deltaSec = block.deltaSec + sec
      if (block.min * 60 + deltaSec < 0) return s
      const agenda = s.agenda.slice()
      agenda[s.idx] = { ...block, deltaSec }
      armedRef.current = true
      return { ...s, agenda }
    })
  }, [])

  const toggleStep = useCallback((block: number, step: number) => {
    setState((s) => {
      const stepDone = s.stepDone.map((row) => row.slice())
      while (stepDone.length <= block) stepDone.push([])
      const row = stepDone[block]!
      row[step] = !row[step]
      return { ...s, stepDone }
    })
  }, [])

  const applyConfig = useCallback((cfg: RunConfig) => {
    setState((s) => {
      armedRef.current = true
      return { ...stateFromConfig(cfg), autoNext: s.autoNext, beep: s.beep }
    })
  }, [])

  const setParticipants = useCallback((people: Participant[]) => {
    setState((s) => ({ ...s, participants: people }))
  }, [])

  const loadDefaults = useCallback(() => applyConfig(DEFAULT_CONFIG), [applyConfig])

  const setOption = useCallback(<K extends 'autoNext' | 'beep'>(key: K, value: RunState[K]) => {
    setState((s) => ({ ...s, [key]: value }))
  }, [])

  // Doběhnutí bloku: pípnout, případně přeskočit dál.
  useEffect(() => {
    if (mode !== 'console' || !state.running) return
    if (remainSec(state, now) > 0) {
      armedRef.current = true
      return
    }
    if (!armedRef.current) return
    armedRef.current = false
    if (state.beep) playBeep()
    if (state.autoNext && state.idx < state.agenda.length - 1) goTo(state.idx + 1)
  }, [mode, now, state, goTo])

  return {
    state,
    now,
    toggle,
    goTo,
    resetBlock,
    bump,
    toggleStep,
    applyConfig,
    setParticipants,
    loadDefaults,
    setOption,
  }
}
