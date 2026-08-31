import { useEffect, useRef, useState } from 'react'
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
import { quizUrl } from '../lib/ui'

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
  const fileRef = useRef<HTMLInputElement>(null)
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

  /**
   * Načte lokální .json — nic se nikam neodesílá. Soubor s `agenda` nahradí celý
   * program; soubor jen s `participants` se přilije ke stávajícímu programu,
   * takže seznam lidí může žít v samostatném souboru mimo repozitář.
   */
  const importFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      let cfg: RunConfig
      try {
        cfg = JSON.parse(String(reader.result)) as RunConfig
      } catch (e) {
        setError(`Chyba v JSONu: ${(e as Error).message}`)
        return
      }
      if (cfg?.agenda?.length) {
        setError('')
        setDraft(String(reader.result))
        run.applyConfig(cfg)
      } else if (cfg?.participants?.length) {
        setError('')
        run.setParticipants(cfg.participants)
      } else {
        setError('Soubor nemá ani „agenda“, ani „participants“.')
      }
    }
    reader.readAsText(file)
  }

  const exportFile = () => {
    const blob = new Blob([serialized], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'run-sheet.json'
    a.click()
    URL.revokeObjectURL(url)
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
              Odkaz pro účastníky
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5, mb: 1 }}>
              Vstupní kvíz. Rozešli ho před začátkem — z výsledku vypadne, který díl paletové
              evidence si má kdo ve cvičeních vzít.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box
                component="code"
                sx={{
                  px: 1,
                  py: 0.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 12,
                  wordBreak: 'break-all',
                }}
              >
                {quizUrl()}
              </Box>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={() => void navigator.clipboard.writeText(quizUrl())}
              >
                Zkopírovat
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={() => window.open(quizUrl(), '_blank')}
              >
                Otevřít
              </Button>
            </Box>
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
              Program a seznam účastníků ve formátu JSON. Po úpravě dej <em>Použít</em> — uloží se do
              prohlížeče, takže to přežije zavření stránky i pád notebooku. Údaje o účastnících zůstávají
              jen tady, do repozitáře ani na plátno se nedostanou.
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
              <Button variant="outlined" color="inherit" onClick={() => fileRef.current?.click()}>
                Načíst ze souboru
              </Button>
              <Button variant="outlined" color="inherit" onClick={exportFile}>
                Uložit do souboru
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) importFile(file)
                  e.target.value = ''
                }}
              />
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
