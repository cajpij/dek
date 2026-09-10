import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { JMENA, nacti, nastaveno, posli, type Zprava } from '../lib/nastenka'

/**
 * Nástěnka — otázky ze sálu, které vidí všichni.
 *
 * Žádné přihlašování: jméno se vybere z nabídky a zapamatuje. Novinky se
 * dotahují po pár vteřinách, ne přes websocket — na deset lidí v sále je to
 * dost a nepřibude tím žádná knihovna.
 */

const OBNOVA_MS = 4000

const cas = (s: string) =>
  new Date(s).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })

function Jmenovka({ jmeno, odpoved }: { jmeno: string; odpoved?: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 11,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: odpoved ? 'success.main' : 'primary.main',
        bgcolor: odpoved ? 'transparent' : 'action.hover',
        px: odpoved ? 0 : 0.75,
        py: odpoved ? 0 : 0.25,
        borderRadius: 0.75,
      }}
    >
      {jmeno}
    </Box>
  )
}

function Hlavicka({ z, odpoved }: { z: Zprava; odpoved?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, flexWrap: 'wrap' }}>
      <Jmenovka jmeno={z.jmeno} odpoved={odpoved} />
      <Typography sx={{ fontSize: 12.5, color: 'text.disabled' }}>{cas(z.cas)}</Typography>
      {z.lekce ? (
        <Typography sx={{ fontSize: 12.5, color: 'text.disabled', fontFamily: 'ui-monospace, Menlo, monospace' }}>
          {z.lekce}
        </Typography>
      ) : null}
    </Box>
  )
}

function Psat({
  jmeno,
  placeholder,
  popisek,
  naOdeslani,
}: {
  jmeno: string
  placeholder: string
  popisek: string
  naOdeslani: (text: string) => Promise<void>
}) {
  const [text, setText] = useState('')
  const [posila, setPosila] = useState(false)

  const odeslat = async () => {
    const t = text.trim()
    if (!t || !jmeno) return
    setPosila(true)
    try {
      await naOdeslani(t)
      setText('')
    } finally {
      setPosila(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void odeslat()
        }}
        placeholder={placeholder}
        multiline
        minRows={2}
        fullWidth
        size="small"
      />
      <Button
        variant="contained"
        size="small"
        disabled={!text.trim() || !jmeno || posila}
        onClick={() => void odeslat()}
      >
        {popisek}
      </Button>
    </Box>
  )
}

function Vlakno({
  koren,
  odpovedi,
  jmeno,
  naOdpoved,
}: {
  koren: Zprava
  odpovedi: Zprava[]
  jmeno: string
  naOdpoved: (text: string, vlakno: string) => Promise<void>
}) {
  const [pise, setPise] = useState(false)
  return (
    <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 2 }}>
      <Hlavicka z={koren} />
      <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
        {koren.text}
      </Typography>

      {odpovedi.length > 0 ? (
        <Box
          sx={{
            mt: 1.75,
            pl: 1.75,
            borderLeft: 2,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {odpovedi.map((o) => (
            <Box key={o.id}>
              <Hlavicka z={o} odpoved />
              <Typography sx={{ mt: 0.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                {o.text}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null}

      <Box sx={{ mt: 1.5 }}>
        {pise ? (
          <Psat
            jmeno={jmeno}
            placeholder="Odpověď…"
            popisek="Odpovědět"
            naOdeslani={async (t) => {
              await naOdpoved(t, koren.id)
              setPise(false)
            }}
          />
        ) : (
          <Button size="small" onClick={() => setPise(true)} disabled={!jmeno}>
            Odpovědět
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default function Nastenka({ lekce }: { lekce?: string }) {
  const [jmeno, setJmeno] = useState(() => {
    try {
      return localStorage.getItem('nastenka.jmeno') ?? ''
    } catch {
      return ''
    }
  })
  const [zpravy, setZpravy] = useState<Zprava[]>([])
  const [chyba, setChyba] = useState('')
  const bezi = useRef(true)

  const obnov = useCallback(async () => {
    try {
      const d = await nacti()
      if (bezi.current) {
        setZpravy(d)
        setChyba('')
      }
    } catch (e) {
      if (bezi.current) setChyba(e instanceof Error ? e.message : 'nedaří se spojit')
    }
  }, [])

  useEffect(() => {
    if (!nastaveno()) return
    bezi.current = true
    void obnov()
    const id = window.setInterval(() => void obnov(), OBNOVA_MS)
    return () => {
      bezi.current = false
      window.clearInterval(id)
    }
  }, [obnov])

  const vlakna = useMemo(() => {
    const koreny = zpravy.filter((z) => !z.vlakno).reverse()
    return koreny.map((k) => ({ koren: k, odpovedi: zpravy.filter((z) => z.vlakno === k.id) }))
  }, [zpravy])

  const vyberJmeno = (v: string) => {
    setJmeno(v)
    try {
      localStorage.setItem('nastenka.jmeno', v)
    } catch {}
  }

  const pridej = async (text: string, vlakno: string | null) => {
    await posli({ jmeno, text, vlakno, lekce: vlakno ? null : (lekce ?? null) })
    await obnov()
  }

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 2.5, md: 4 }, pt: 4, pb: 8 }}>
      <Typography variant="h4" component="h1" tabIndex={-1} sx={{ outline: 'none' }}>
        Nástěnka
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1, maxWidth: '62ch' }}>
        Otázky ze sálu. Vyber jméno, zeptej se — uvidí to všichni a kdokoli může odpovědět.
        Nic se nepřihlašuje.
      </Typography>

      {!nastaveno() ? (
        <Paper variant="outlined" sx={{ p: 2.5, mt: 3, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 660 }}>Nástěnka ještě není napojená</Typography>
          <Typography sx={{ fontSize: 15, color: 'text.secondary', mt: 0.75 }}>
            Chybí adresa projektu a veřejný klíč v <code>src/lib/nastenka.ts</code>. Doplní se
            jednou a pak už to jede.
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mt: 3, flexWrap: 'wrap' }}>
            <TextField
              select
              size="small"
              value={jmeno}
              onChange={(e) => vyberJmeno(e.target.value)}
              label="Kdo se ptá"
              sx={{ minWidth: 190 }}
            >
              {JMENA.map((j) => (
                <MenuItem key={j} value={j}>
                  {j}
                </MenuItem>
              ))}
            </TextField>
            {lekce ? (
              <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>
                ptáš se z lekce {lekce}
              </Typography>
            ) : null}
            {chyba ? (
              <Typography sx={{ fontSize: 13, color: 'error.main' }}>{chyba}</Typography>
            ) : null}
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
            <Psat
              jmeno={jmeno}
              placeholder={
                jmeno ? 'Na co ses zasekl?' : 'Nejdřív vyber nahoře jméno…'
              }
              popisek="Zeptat se"
              naOdeslani={(t) => pridej(t, null)}
            />
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, mt: 3 }}>
            {vlakna.length === 0 ? (
              <Typography sx={{ color: 'text.disabled', textAlign: 'center', py: 5 }}>
                Zatím se nikdo nezeptal. První otázka bývá ta, kterou má v hlavě půlka sálu.
              </Typography>
            ) : (
              vlakna.map(({ koren, odpovedi }) => (
                <Vlakno
                  key={koren.id}
                  koren={koren}
                  odpovedi={odpovedi}
                  jmeno={jmeno}
                  naOdpoved={(t, v) => pridej(t, v)}
                />
              ))
            )}
          </Box>
        </>
      )}

      <Typography sx={{ fontSize: 13, color: 'text.disabled', mt: 5 }}>
        Zprávy se nemažou a nepřepisují — <Link href="#academy">zpátky na kurzy</Link>.
      </Typography>
    </Box>
  )
}
