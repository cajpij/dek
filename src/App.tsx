import { useEffect, useState } from 'react'
import { useRunSheet, type Mode } from './lib/useRunSheet'
import Console from './components/Console'
import DisplayView from './components/DisplayView'
import Quiz from './components/Quiz'

/** Tři pohledy na jedné adrese: konzole pro lektora, plátno pro sál, kvíz pro účastníky. */
type View = Mode | 'quiz'

const readView = (): View => {
  if (window.location.hash === '#display') return 'display'
  if (window.location.hash === '#quiz') return 'quiz'
  return 'console'
}

/** Kvíz běh workshopu nesleduje, takže si run-sheet vůbec nebere. */
function RunSheet({ mode }: { mode: Mode }) {
  const run = useRunSheet(mode)
  return mode === 'display' ? <DisplayView run={run} /> : <Console run={run} />
}

export default function App() {
  const [view, setView] = useState<View>(readView)

  useEffect(() => {
    const onHash = () => setView(readView())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return view === 'quiz' ? <Quiz /> : <RunSheet mode={view} />
}
