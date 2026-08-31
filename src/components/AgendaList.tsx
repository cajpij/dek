import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { RunSheet } from '../lib/useRunSheet'
import { clockFromMinutes, minutesLabel, mmss } from '../lib/format'
import { KIND_LABEL, durSec, eventStartMinutes, plannedOffsetSec } from '../lib/run'

export default function AgendaList({ run }: { run: RunSheet }) {
  const { state } = run
  const [open, setOpen] = useState<Record<number, boolean>>({})
  const start = eventStartMinutes(state)

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '62px 1fr auto',
          gap: 1.5,
          px: 2.25,
          py: 1.25,
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 1,
          fontSize: 11,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'text.disabled',
        }}
      >
        <span>Plán</span>
        <span>Blok</span>
        <span>Délka</span>
      </Box>

      {state.agenda.map((block, i) => {
        const isNow = i === state.idx
        const isDone = i < state.idx
        const steps = block.steps ?? []
        const stepsOpen = open[i] ?? isNow
        const spent = state.actualSec[i]
        const diff = isDone && spent ? spent - durSec(state, i) : 0
        const accent = block.kind === 'break' ? 'success.main' : 'primary.main'

        return (
          <Box
            key={i}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              borderLeft: 3,
              borderLeftColor: isNow ? accent : 'transparent',
              bgcolor: isNow
                ? (t) => `color-mix(in srgb, ${t.palette[block.kind === 'break' ? 'success' : 'primary'].main} 9%, transparent)`
                : 'transparent',
            }}
          >
            <Box
              onClick={() => run.goTo(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  run.goTo(i)
                }
              }}
              sx={{
                display: 'grid',
                gridTemplateColumns: '62px 1fr auto',
                gap: 1.5,
                alignItems: 'baseline',
                px: 2.25,
                pl: 1.9,
                py: 1.5,
                cursor: 'pointer',
                color: isDone ? 'text.secondary' : 'text.primary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography sx={{ fontSize: 14, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {start === null ? '—' : clockFromMinutes(start + plannedOffsetSec(state, i) / 60)}
              </Typography>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: '-.01em',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}
                >
                  {block.title}
                </Typography>
                {(block.kind === 'break' || block.kind === 'qna') && (
                  <Chip
                    size="small"
                    label={KIND_LABEL[block.kind]}
                    variant="outlined"
                    color={block.kind === 'break' ? 'success' : 'default'}
                    sx={{ ml: 1, height: 20, fontSize: 11, fontWeight: 650 }}
                  />
                )}
                {steps.length > 0 && (
                  <IconButton
                    size="small"
                    aria-label={stepsOpen ? 'Skrýt program bloku' : 'Zobrazit program bloku'}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpen((o) => ({ ...o, [i]: !stepsOpen }))
                    }}
                    sx={{
                      ml: 0.5,
                      p: 0.25,
                      transform: stepsOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform .15s',
                    }}
                  >
                    <ExpandMoreIcon fontSize="small" />
                  </IconButton>
                )}
                {block.who && (
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{block.who}</Typography>
                )}
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 14, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {minutesLabel(durSec(state, i))}
                </Typography>
                {Math.abs(diff) >= 30 && (
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontVariantNumeric: 'tabular-nums',
                      color: diff > 0 ? 'error.main' : 'success.main',
                    }}
                  >
                    {diff > 0 ? '+' : '−'}
                    {mmss(Math.abs(diff))}
                  </Typography>
                )}
              </Box>
            </Box>

            {steps.length > 0 && (
              <Collapse in={stepsOpen} unmountOnExit>
                <Box sx={{ pb: 1.25, pl: 8.5, pr: 2.25 }}>
                  {steps.map((step, k) => (
                    <Box
                      key={k}
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'baseline',
                        py: 0.4,
                        color: state.stepDone[i]?.[k] ? 'text.disabled' : 'text.secondary',
                      }}
                    >
                      <Typography sx={{ fontSize: 14, flex: 1, minWidth: 0 }}>{step.title}</Typography>
                      {step.min != null && (
                        <Typography
                          sx={{ fontSize: 13, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}
                        >
                          {step.min} min
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Collapse>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
