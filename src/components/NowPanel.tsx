import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import RemoveIcon from '@mui/icons-material/Remove'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import type { RunSheet } from '../lib/useRunSheet'
import { minutesLabel, mmss } from '../lib/format'
import { KIND_LABEL, durSec, paletteFor, remainSec, toneOf } from '../lib/run'

export default function NowPanel({ run }: { run: RunSheet }) {
  const { state, now } = run
  const block = state.agenda[state.idx]
  if (!block) return null

  const remain = remainSec(state, now)
  const duration = durSec(state, state.idx)
  const tone = toneOf(remain)
  const color = paletteFor(tone, block.kind)
  const progress = duration > 0 ? Math.min(100, Math.max(0, (1 - remain / duration) * 100)) : 0
  const next = state.agenda[state.idx + 1]
  const steps = block.steps ?? []
  const done = state.stepDone[state.idx] ?? []

  return (
    <Stack
      spacing={2.5}
      sx={{
        p: 3,
        minWidth: 0,
        minHeight: 0,
        overflow: 'auto',
        borderRight: { lg: 1 },
        borderBottom: { xs: 1, lg: 0 },
        borderColor: { xs: 'divider', lg: 'divider' },
      }}
    >
      <Box>
        <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
          {KIND_LABEL[block.kind]} · blok {state.idx + 1} z {state.agenda.length}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mt: 0.5, lineHeight: 1.15 }}>
          {block.title}
        </Typography>
        {block.who && (
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>{block.who}</Typography>
        )}
        {block.brief && (
          <Typography sx={{ mt: 1.5, color: 'text.secondary', maxWidth: '68ch' }}>{block.brief}</Typography>
        )}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Typography
            component="div"
            sx={{
              fontSize: 'clamp(3.4rem, 10.5vw, 8.5rem)',
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: '-.035em',
              fontVariantNumeric: 'tabular-nums',
              color: `${color}.main`,
            }}
          >
            {mmss(remain)}
          </Typography>
          <Typography sx={{ color: 'text.disabled', fontSize: 15, pb: '.8em' }}>
            {remain < 0 ? `přes plán · blok má ${minutesLabel(duration)}` : `z ${minutesLabel(duration)}`}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} color={color} sx={{ mt: 1.75 }} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color={state.running ? 'inherit' : color}
          startIcon={state.running ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={run.toggle}
        >
          {state.running ? 'Pauza' : 'Spustit'}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<SkipPreviousIcon />}
          disabled={state.idx === 0}
          onClick={() => run.goTo(state.idx - 1)}
        >
          Zpět
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          endIcon={<SkipNextIcon />}
          disabled={state.idx >= state.agenda.length - 1}
          onClick={() => run.goTo(state.idx + 1)}
        >
          Další
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<RemoveIcon />} onClick={() => run.bump(-60)}>
          1 min
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => run.bump(60)}>
          1 min
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<RestartAltIcon />} onClick={run.resetBlock}>
          Vynulovat blok
        </Button>
      </Box>

      {steps.length > 0 && (
        <Box>
          <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
            Program bloku
          </Typography>
          <Stack sx={{ mt: 0.5 }}>
            {steps.map((step, i) => (
              <Box
                key={i}
                component="label"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  py: 0.75,
                  cursor: 'pointer',
                  borderBottom: i < steps.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Checkbox
                  size="small"
                  checked={Boolean(done[i])}
                  onChange={() => run.toggleStep(state.idx, i)}
                  sx={{ p: 0.25, mt: '1px' }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 550,
                      color: done[i] ? 'text.disabled' : 'text.primary',
                      textDecoration: done[i] ? 'line-through' : 'none',
                    }}
                  >
                    {step.title}
                  </Typography>
                  {step.detail && (
                    <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{step.detail}</Typography>
                  )}
                  {step.source && (
                    <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: 0.25 }}>
                      lekce „{step.source}“
                    </Typography>
                  )}
                </Box>
                {step.min != null && (
                  <Typography
                    sx={{ fontSize: 14, color: 'text.disabled', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
                  >
                    {step.min} min
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {block.examples && block.examples.length > 0 && (
        <Box>
          <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
            Zadání k výběru
          </Typography>
          <Stack sx={{ mt: 0.5 }}>
            {block.examples.map((example, i) => (
              <Box
                key={i}
                sx={{
                  py: 1,
                  borderBottom: i < block.examples!.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{example.title}</Typography>
                {example.detail && (
                  <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{example.detail}</Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {block.notes && block.notes.length > 0 && (
        <Box>
          <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
            Nezapomenout
          </Typography>
          <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, mt: 0.75, p: 0 }}>
            {block.notes.map((note, i) => (
              <Box
                key={i}
                component="li"
                sx={{
                  pl: 2.25,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 2,
                    top: '.62em',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'text.disabled',
                  },
                }}
              >
                {note}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Box sx={{ mt: 'auto', pt: 1 }}>
        <Divider sx={{ mb: 1.5 }} />
        <Typography sx={{ color: 'text.secondary' }}>
          {next ? (
            <>
              Další: <Box component="b" sx={{ color: 'text.primary' }}>{next.title}</Box> ·{' '}
              {minutesLabel(durSec(state, state.idx + 1))}
            </>
          ) : (
            'Poslední blok programu.'
          )}
        </Typography>
      </Box>
    </Stack>
  )
}
