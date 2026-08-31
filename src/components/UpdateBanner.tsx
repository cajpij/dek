import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { RunSheet } from '../lib/useRunSheet'

/**
 * Program i rozběhnutý stav se drží v prohlížeči, aby nasazení nové verze
 * nepřepsalo probíhající akci. Tenhle pruh je opačná strana téže mince —
 * dá vědět, že venku je novější program, a nechá rozhodnout.
 */
export default function UpdateBanner({ run }: { run: RunSheet }) {
  if (!run.defaultChanged) return null

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
        px: 2.25,
        py: 1.25,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: (t) => `color-mix(in srgb, ${t.palette.primary.main} 9%, transparent)`,
      }}
    >
      <Typography sx={{ fontSize: 14, flex: '1 1 auto', minWidth: '20ch' }}>
        <Box component="b" sx={{ fontWeight: 650 }}>
          Nasazený program se změnil.
        </Box>{' '}
        Tenhle prohlížeč má uloženou starší verzi.
      </Typography>
      <Button size="small" variant="contained" onClick={run.loadDefaults}>
        Načíst nový
      </Button>
      <Button size="small" variant="outlined" color="inherit" onClick={run.keepMine}>
        Nechat můj
      </Button>
    </Box>
  )
}
