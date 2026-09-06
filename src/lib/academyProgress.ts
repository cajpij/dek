/**
 * Postup v kurzu se drží v prohlížeči.
 *
 * Žádné účty, žádný server — akademie je statická stránka a odškrtnuté lekce
 * jsou osobní poznámka, ne firemní evidence. Když si někdo vyčistí prohlížeč,
 * přijde o fajfky a o nic jiného.
 */

import { useCallback, useEffect, useState } from 'react'

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

export function useProgress() {
  const [store, setStore] = useState<Store>({})

  // Čte se až po připojení komponenty, aby build nespadl na chybějícím window.
  useEffect(() => setStore(read()), [])

  const isDone = useCallback(
    (course: string, lesson: string) => store[lessonKey(course, lesson)] === true,
    [store],
  )

  const toggle = useCallback((course: string, lesson: string) => {
    setStore((prev) => {
      const key = lessonKey(course, lesson)
      const next = { ...prev }
      if (next[key]) delete next[key]
      else next[key] = true
      write(next)
      return next
    })
  }, [])

  const doneCount = useCallback(
    (course: string, lessons: { slug: string }[]) =>
      lessons.filter((l) => store[lessonKey(course, l.slug)] === true).length,
    [store],
  )

  return { isDone, toggle, doneCount }
}
