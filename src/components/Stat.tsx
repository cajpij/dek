import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export type StatTone = 'neutral' | 'ahead' | 'behind'

const COLOR: Record<StatTone, string> = {
  neutral: 'text.primary',
  ahead: 'success.main',
  behind: 'error.main',
}

/** Číslo v hlavičce: velká hodnota, malý popisek pod ní. */
export default function Stat({ value, label, tone = 'neutral' }: { value: string; label: string; tone?: StatTone }) {
  return (
    <Box sx={{ lineHeight: 1.25, whiteSpace: 'nowrap' }}>
      <Typography sx={{ fontSize: 15, fontWeight: 650, fontVariantNumeric: 'tabular-nums', color: COLOR[tone] }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: 'text.disabled' }}>
        {label}
      </Typography>
    </Box>
  )
}
