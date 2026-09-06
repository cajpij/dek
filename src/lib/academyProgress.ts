/**
 * Postup v kurzu se drží v prohlížeči.
 *
 * Žádné účty, žádný server — akademie je statická stránka a odškrtnuté lekce
 * jsou osobní poznámka, ne firemní evidence. Když si někdo vyčistí prohlížeč,
 * přijde o fajfky a o nic jiného.
 *
 * Stav je jeden pro celou stránku (malý externí store), aby se fajfka po
 * odškrtnutí objevila hned i v postranním panelu, ne až po obnovení stránky.
 */

import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'dek-academy-progress-v1'

type Store = Record<string, true>

function lessonKey(course: string, lesson: string): string {
  return `${course}/${lesson}`
}

function read(): Store {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Store) : {}
  } catch {
    return {}
  }
}

function write(store: Store): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* privátní okno nebo zakázané úložiště — fajfky prostě nepřežijí reload */
  }
}

const EMPTY: Store = {}
let snapshot: Store | null = null
const listeners = new Set<() => void>()

function getSnapshot(): Store {
  if (snapshot === null) snapshot = typeof window === 'undefined' ? EMPTY : read()
  return snapshot
}

function getServerSnapshot(): Store {
  return EMPTY
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      snapshot = read()
      cb()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

function set(next: Store): void {
  snapshot = next
  write(next)
  listeners.forEach((l) => l())
}

export function useProgress() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const isDone = useCallback(
    (course: string, lesson: string) => store[lessonKey(course, lesson)] === true,
    [store],
  )

  const toggle = useCallback((course: string, lesson: string) => {
    const key = lessonKey(course, lesson)
    const next = { ...getSnapshot() }
    if (next[key]) delete next[key]
    else next[key] = true
    set(next)
  }, [])

  const doneCount = useCallback(
    (course: string, lessons: { slug: string }[]) =>
      lessons.filter((l) => store[lessonKey(course, l.slug)] === true).length,
    [store],
  )

  return { isDone, toggle, doneCount }
}
