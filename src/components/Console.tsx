import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import type { RunSheet } from '../lib/useRunSheet'
import { isTypingTarget, openDisplayWindow, toggleFullscreen } from '../lib/ui'
import TopBar from './TopBar'
import NowPanel from './NowPanel'
import AgendaList from './AgendaList'
import Participants from './Participants'
import SettingsPanel from './SettingsPanel'
import UpdateBanner from './UpdateBanner'

export default function Console({ run }: { run: RunSheet }) {
  const { state } = run
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case ' ':
          e.preventDefault()
          run.toggle()
          break
        case 'ArrowRight':
          e.preventDefault()
          run.goTo(state.idx + 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          run.goTo(state.idx - 1)
          break
        case '+':
        case '=':
          e.preventDefault()
          run.bump(60)
          break
        case '-':
        case '−':
          e.preventDefault()
          run.bump(-60)
          break
        case 'd':
        case 'D':
          openDisplayWindow()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'r':
        case 'R':
          run.resetBlock()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [run, state.idx])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <TopBar state={state} now={run.now} />
      <UpdateBanner run={run} />
      <Box
        component="main"
        sx={{
          flex: '1 1 auto',
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.1fr) minmax(360px, 0.9fr)' },
          overflow: { xs: 'auto', lg: 'hidden' },
        }}
      >
        <NowPanel run={run} />
        <Box sx={{ minHeight: 0, overflow: { lg: 'auto' } }}>
          <Tabs
            value={tab}
            onChange={(_, v: number) => setTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 42, px: 1 }}
          >
            <Tab label="Program" sx={{ minHeight: 42 }} />
            <Tab label={`Účastníci (${state.participants.length})`} sx={{ minHeight: 42 }} />
          </Tabs>
          {tab === 0 ? <AgendaList run={run} /> : <Participants run={run} />}
          <SettingsPanel run={run} />
        </Box>
      </Box>
    </Box>
  )
}
