import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { RunSheet } from '../lib/useRunSheet'
import { clockFromMinutes, minutesLabel, mmss } from '../lib/format'
import { KIND_LABEL, durSec, eventStartMinutes, plannedOffsetSec } from '../lib/run'
import { blockLessons, stepLessons, type LessonLink } from '../lib/runLessons'

/**
 * Odkazy do akademie u bloku a u kroku. Nový panel schválně: program běží dál
 * a lektor se k němu nemusí proklikávat zpátky.
 */
function LessonLinks({ items, label }: { items: LessonLink[]; label?: string }) {
  if (items.length === 0) return null
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1.75, rowGap: 0, mt: 0.25 }}>
      {label && (
        <Typography component="span" sx={{ fontSize: 12, color: 'text.disabled' }}>
          {label}
        </Typography>
      )}
      {items.map((lesson) => (
        <Link
          key={lesson.href}
          href={lesson.href}
          target="_blank"
          rel="noopener"
          underline="hover"
          onClick={(e) => e.stopPropagation()}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3, fontSize: 12.5, py: 0.5 }}
        >
          {lesson.title}
          <OpenInNewIcon sx={{ fontSize: 13, opacity: 0.7 }} aria-label="otevře se v novém panelu" />
        </Link>
      ))}
    </Box>
  )
}

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
        // Lekce k bloku se vypíšou jednou nahoře; u kroků pak jen to, co přidávají navíc.
        const blockLesson = blockLessons(block)
        const blockHrefs = new Set(blockLesson.map((l) => l.href))

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
                <Box
                  component="button"
                  type="button"
                  onClick={() => run.goTo(i)}
                  aria-current={isNow ? 'true' : undefined}
                  sx={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontWeight: 600,
                    letterSpacing: '-.01em',
                    textDecoration: isDone ? 'line-through' : 'none',
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                      borderRadius: 1,
                    },
                  }}
                >
                  {block.title}
                </Box>
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
                  <LessonLinks items={blockLesson} label="Lekce:" />
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
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14 }}>{step.title}</Typography>
                        <LessonLinks
                          items={stepLessons(block, step).filter((l) => !blockHrefs.has(l.href))}
                        />
                      </Box>
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
