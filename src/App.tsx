import { useEffect, useState } from 'react'
import { useRunSheet, type Mode } from './lib/useRunSheet'
import Console from './components/Console'
import DisplayView from './components/DisplayView'
import KnowledgeBase from './components/KnowledgeBase'
import McpPage from './components/McpPage'
import Quiz from './components/Quiz'

/**
 * Pět pohledů na jedné adrese: konzole pro lektora, plátno pro sál, kvíz pro
 * účastníky, knowledge base pro tým a stránka o MCP serveru nad katalogem.
 */
type View = Mode | 'quiz' | 'kb' | 'mcp'

const readView = (): View => {
  switch (window.location.hash) {
    case '#display':
      return 'display'
    case '#quiz':
      return 'quiz'
    case '#kb':
      return 'kb'
    case '#mcp':
      return 'mcp'
    default:
      return 'console'
  }
}

/** Kvíz ani knowledge base běh workshopu nesledují, takže si run-sheet neberou. */
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

  if (view === 'quiz') return <Quiz />
  if (view === 'kb') return <KnowledgeBase />
  if (view === 'mcp') return <McpPage />
  return <RunSheet mode={view} />
}
