import { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { RunConfig } from '../types'
import type { RunSheet } from '../lib/useRunSheet'
import { configFromState } from '../lib/run'

const SHORTCUTS: [string, string][] = [
  ['mezerník', 'spustit / pauza'],
  ['→ ←', 'další / předchozí blok'],
  ['+ −', 'prodloužit / zkrátit blok o minutu'],
  ['D', 'okno na plátno'],
  ['F', 'celá obrazovka'],
  ['R', 'vynulovat odpočet bloku'],
]

function Kbd({ children }: { children: string }) {
  return (
    <Box
      component="kbd"
      sx={{
        border: 1,
        borderBottomWidth: 2,
        borderColor: 'divider',
        borderRadius: 1,
        px: 0.75,
        py: '1px',
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 12,
        bgcolor: 'action.hover',
      }}
    >
      {children}
    </Box>
  )
}

export default function SettingsPanel({ run }: { run: RunSheet }) {
  const { state } = run
  const serialized = JSON.stringify(configFromState(state), null, 2)
  const [draft, setDraft] = useState(serialized)
  const [error, setError] = useState('')

  // Když se program změní jinudy (výchozí, jiné okno), narovnat editor.
  useEffect(() => {
    setDraft(serialized)
    setError('')
  }, [serialized])

  const apply = () => {
    let cfg: RunConfig
    try {
      cfg = JSON.parse(draft) as RunConfig
    } catch (e) {
      setError(`Chyba v JSONu: ${(e as Error).message}`)
      return
    }
    if (!cfg?.agenda?.length) {
      setError('Chybí pole „agenda“ s aspoň jedním blokem.')
      return
    }
    setError('')
    run.applyConfig(cfg)
  }

  return (
    <Accordion disableGutters square sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'transparent' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Nastavení a program</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state.autoNext}
                  onChange={(e) => run.setOption('autoNext', e.target.checked)}
                />
              }
              label="Automaticky přejít na další blok"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state.beep}
                  onChange={(e) => run.setOption('beep', e.target.checked)}
                />
              }
              label="Pípnout na konci bloku"
            />
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 12 }}>
              Klávesové zkratky
            </Typography>
            <Stack spacing={0.75} sx={{ mt: 0.75 }}>
              {SHORTCUTS.map(([keys, what]) => (
                <Box key={keys} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {keys.split(' ').map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                  <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{what}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>
              Program ve formátu JSON. Po úpravě dej <em>Použít</em> — uloží se do prohlížeče, takže přežije
              zavření stránky i pád notebooku.
            </Typography>
            <TextField
              multiline
              minRows={10}
              fullWidth
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              error={Boolean(error)}
              helperText={error || ' '}
              spellCheck={false}
              slotProps={{
                htmlInput: {
                  style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: 1.55 },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={apply}>
                Použít
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => setDraft(serialized)}>
                Zahodit změny
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  if (window.confirm('Zahodit program i průběh a načíst výchozí ze zdrojáku?')) run.loadDefaults()
                }}
              >
                Obnovit výchozí program
              </Button>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
