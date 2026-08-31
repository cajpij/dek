import { useEffect, useState } from 'react'
import { useRunSheet, type Mode } from './lib/useRunSheet'
import Console from './components/Console'
import DisplayView from './components/DisplayView'

const readMode = (): Mode => (window.location.hash === '#display' ? 'display' : 'console')

export default function App() {
  const [mode, setMode] = useState<Mode>(readMode)

  useEffect(() => {
    const onHash = () => setMode(readMode())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const run = useRunSheet(mode)
  return mode === 'display' ? <DisplayView run={run} /> : <Console run={run} />
}
