/**
 * Který systém má čtenář před sebou.
 *
 * Volba se drží v prohlížeči, aby si ji člověk nemusel přepínat v každé lekci
 * znovu. Napoprvé se hádá z user agenta — kdo sedí u Macu, uvidí rovnou Mac.
 */

import { useCallback, useEffect, useState } from 'react'

export type Platform = 'mac' | 'win'

const KEY = 'dek-academy-platform-v1'

function guess(): Platform {
  if (typeof navigator === 'undefined') return 'mac'
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? 'mac' : 'win'
}

export function usePlatform(): [Platform, (next: Platform) => void] {
  const [platform, setPlatform] = useState<Platform>('mac')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY)
      setPlatform(saved === 'mac' || saved === 'win' ? saved : guess())
    } catch {
      setPlatform(guess())
    }
  }, [])

  const choose = useCallback((next: Platform) => {
    setPlatform(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* privátní okno — volba prostě nepřežije reload */
    }
  }, [])

  return [platform, choose]
}
