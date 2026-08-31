import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import type { Level, Participant } from '../types'
import type { RunSheet } from '../lib/useRunSheet'
import { type Envelope, fetchEnvelope } from '../lib/crypto'
import { LEVEL_LABEL } from '../lib/run'
import UnlockParticipants from './UnlockParticipants'

const LEVEL_COLOR: Record<Level, 'primary' | 'success' | 'warning' | 'default'> = {
  advanced: 'primary',
  intermediate: 'success',
  beginner: 'warning',
  unknown: 'default',
}

/** Pořadí od nejzkušenějšího — v seznamu se řadí sestupně. */
const LEVEL_RANK: Record<Level, number> = { advanced: 0, intermediate: 1, beginner: 2, unknown: 3 }

function EmptyState() {
  return (
    <Box sx={{ px: 2.25, py: 4, color: 'text.secondary' }}>
      <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
        Seznam účastníků není načtený
      </Typography>
      <Typography sx={{ fontSize: 14, maxWidth: '52ch' }}>
        Jsou to údaje o konkrétních lidech, takže ve zdrojáku nejsou — repozitář je veřejný. Načti je
        v <b>Nastavení a program → Načíst ze souboru</b>, nebo do JSONu přidej klíč <code>participants</code>.
        Zůstanou jen v tomhle prohlížeči a na plátno se nikdy nedostanou.
      </Typography>
    </Box>
  )
}

function Person({ p }: { p: Participant }) {
  const level = p.level ?? 'unknown'
  return (
    <Box sx={{ px: 2.25, py: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontWeight: 650, letterSpacing: '-.01em' }}>{p.name}</Typography>
        {p.role && <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{p.role}</Typography>}
        <Box sx={{ flex: '1 1 auto' }} />
        <Chip
          size="small"
          label={LEVEL_LABEL[level]}
          variant="outlined"
          color={LEVEL_COLOR[level]}
          sx={{ height: 20, fontSize: 11, fontWeight: 650 }}
        />
      </Box>

      {p.work && (
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.75 }}>{p.work}</Typography>
      )}

      {p.claudeCode && (
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
          <Box component="span" sx={{ color: 'text.disabled' }}>Claude Code: </Box>
          {p.claudeCode}
        </Typography>
      )}

      {p.wants && p.wants.length > 0 && (
        <Box sx={{ mt: 1.25 }}>
          <Typography
            variant="overline"
            sx={{ color: 'text.disabled', fontSize: 11, display: 'block', lineHeight: 1.6 }}
          >
            Chce použít na
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 0.25 }}>
            {p.wants.map((w) => (
              <Chip key={w} size="small" variant="outlined" label={w} sx={{ height: 22, fontSize: 12 }} />
            ))}
          </Box>
        </Box>
      )}

      {p.knows && p.knows.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1 }}>
          {p.knows.map((k) => (
            <Chip key={k} size="small" label={k} sx={{ height: 22, fontSize: 12 }} />
          ))}
        </Box>
      )}

      {p.needs && p.needs.length > 0 && (
        <Box sx={{ mt: 1.25 }}>
          <Typography
            variant="overline"
            sx={{ color: 'text.disabled', fontSize: 11, display: 'block', lineHeight: 1.6 }}
          >
            Potřebuje
          </Typography>
          {p.needs.map((n) => (
            <Box
              key={n}
              sx={{
                pl: 2,
                position: 'relative',
                fontSize: 14,
                color: 'text.secondary',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 2,
                  top: '.6em',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                },
              }}
            >
              {n}
            </Box>
          ))}
        </Box>
      )}

      {p.note && (
        <Typography sx={{ mt: 1.25, fontSize: 14, color: 'text.secondary', fontStyle: 'italic' }}>
          {p.note}
        </Typography>
      )}
    </Box>
  )
}

export default function Participants({ run }: { run: RunSheet }) {
  const people = run.state.participants
  // undefined = ještě se zjišťuje, null = zašifrovaný soubor v nasazení není
  const [envelope, setEnvelope] = useState<Envelope | null | undefined>(undefined)

  useEffect(() => {
    if (people.length > 0) return
    let alive = true
    void fetchEnvelope().then((e) => {
      if (alive) setEnvelope(e)
    })
    return () => {
      alive = false
    }
  }, [people.length])

  if (people.length === 0) {
    if (envelope === undefined) return null
    if (envelope) return <UnlockParticipants envelope={envelope} onUnlocked={run.setParticipants} />
    return <EmptyState />
  }

  const byLevel = people.reduce<Record<string, number>>((acc, p) => {
    const l = p.level ?? 'unknown'
    acc[l] = (acc[l] ?? 0) + 1
    return acc
  }, {})
  const sorted = [...people].sort(
    (a, b) => LEVEL_RANK[a.level ?? 'unknown'] - LEVEL_RANK[b.level ?? 'unknown'],
  )

  return (
    <Box>
      <Box
        sx={{
          px: 2.25,
          py: 1.25,
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 1,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'text.disabled',
          }}
        >
          {people.length} účastníků
        </Typography>
        <Button
          size="small"
          color="inherit"
          onClick={() => run.setParticipants([])}
          sx={{ minWidth: 0, px: 0.75, fontSize: 12, color: 'text.disabled' }}
        >
          Zapomenout
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {(['advanced', 'intermediate', 'beginner', 'unknown'] as Level[])
          .filter((l) => byLevel[l])
          .map((l) => (
            <Chip
              key={l}
              size="small"
              variant="outlined"
              color={LEVEL_COLOR[l]}
              label={`${byLevel[l]} ${LEVEL_LABEL[l]}`}
              sx={{ height: 20, fontSize: 11 }}
            />
          ))}
      </Box>

      {sorted.map((p) => (
        <Person key={p.name} p={p} />
      ))}
    </Box>
  )
}
