import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeIcon from '@mui/icons-material/LightModeOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { RunState } from '../types'
import { clockFromDate, mmss } from '../lib/format'
import { driftSec, etaMs } from '../lib/run'
import { openDisplayWindow } from '../lib/ui'
import Stat from './Stat'

export default function TopBar({ state, now }: { state: RunState; now: number }) {
  const { mode, setMode } = useColorScheme()
  const drift = driftSec(state)
  const kind = state.agenda[state.idx]?.kind

  const driftText =
    Math.abs(drift) < 30 ? 'podle plánu' : drift > 0 ? `skluz ${mmss(drift)}` : `náskok ${mmss(-drift)}`
  const driftTone = Math.abs(drift) < 30 ? 'neutral' : drift > 0 ? 'behind' : 'ahead'

  const running = state.running
  const statusLabel = running ? (kind === 'break' ? 'Pauza běží' : 'Běží') : 'Stop'

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        px: 2.25,
        py: 1.25,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Chip
        size="small"
        label={statusLabel}
        color={running ? (kind === 'break' ? 'success' : 'primary') : 'default'}
        variant={running ? 'filled' : 'outlined'}
        sx={{ fontWeight: 650, letterSpacing: '.04em', textTransform: 'uppercase', fontSize: 11 }}
      />

      <Box sx={{ minWidth: 0 }}>
        <Typography component="span" sx={{ fontWeight: 650, letterSpacing: '-.01em' }}>
          {state.event.title}
        </Typography>{' '}
        <Typography component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>
          {[state.event.date, state.event.venue].filter(Boolean).join(' · ')}
        </Typography>
      </Box>

      <Box sx={{ flex: '1 1 auto' }} />

      <Stat value={clockFromDate(new Date(now))} label="teď" />
      <Stat value={driftText} label="oproti plánu" tone={driftTone} />
      <Stat value={clockFromDate(new Date(etaMs(state, now)))} label="konec ≈" />

      <Tooltip title="Otevřít okno pro plátno (D)">
        <Button variant="outlined" color="inherit" startIcon={<OpenInNewIcon />} onClick={openDisplayWindow}>
          Plátno
        </Button>
      </Tooltip>

      <Tooltip title={mode === 'dark' ? 'Přepnout na světlý motiv' : 'Přepnout na tmavý motiv'}>
        <IconButton
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          aria-label="Přepnout světlý a tmavý motiv"
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  )
}
