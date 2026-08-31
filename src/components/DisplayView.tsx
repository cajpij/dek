import { useEffect } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import type { RunSheet } from '../lib/useRunSheet'
import { mmss } from '../lib/format'
import { KIND_LABEL, durSec, paletteFor, remainSec, toneOf } from '../lib/run'
import { toggleFullscreen } from '../lib/ui'

/**
 * Druhá obrazovka pro sál. Jen to, co má být vidět přes celý sál:
 * o co jde, kolik zbývá, co bude pak.
 */
export default function DisplayView({ run }: { run: RunSheet }) {
  const { state, now } = run
  const block = state.agenda[state.idx]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!block) return null

  const remain = remainSec(state, now)
  const duration = durSec(state, state.idx)
  const color = paletteFor(toneOf(remain), block.kind)
  const progress = duration > 0 ? Math.min(100, Math.max(0, (1 - remain / duration) * 100)) : 0
  const next = state.agenda[state.idx + 1]

  return (
    <Box
      onDoubleClick={toggleFullscreen}
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '2.5vh',
        px: '5vw',
        py: '5vh',
      }}
    >
      <Typography
        sx={{
          fontSize: 'clamp(.9rem, 2vw, 1.6rem)',
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'text.disabled',
        }}
      >
        {block.kind === 'break' ? KIND_LABEL.break : state.event.title}
      </Typography>

      <Typography
        component="h1"
        sx={{
          fontSize: 'clamp(1.6rem, 5.2vw, 4.5rem)',
          fontWeight: 640,
          letterSpacing: '-.02em',
          lineHeight: 1.1,
          m: 0,
          maxWidth: '22ch',
        }}
      >
        {block.title}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontSize: 'clamp(5rem, 25vw, 26rem)',
          fontWeight: 700,
          lineHeight: 0.82,
          letterSpacing: '-.045em',
          fontVariantNumeric: 'tabular-nums',
          color: `${color}.main`,
        }}
      >
        {mmss(remain)}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        color={color}
        sx={{ width: 'min(70vw, 900px)', height: 8 }}
      />

      {next && (
        <Typography sx={{ fontSize: 'clamp(.95rem, 1.8vw, 1.4rem)', color: 'text.secondary' }}>
          Pak: {next.title}
        </Typography>
      )}
    </Box>
  )
}
