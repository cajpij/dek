import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/**
 * Předěl mezi částmi jedné lekce.
 *
 * Lekce, která se dělí na dvě varianty téhož (Local a Cloud), potřebuje
 * hlasitější řez než obyčejný nadpis — jinak čtenář nepozná, že přešel
 * do druhé půlky. Id slouží zároveň jako cíl odrážky v postranní nabídce.
 */
export default function SekceHlavicka({
  id,
  stitek,
  titul,
  popis,
}: {
  id: string
  stitek: string
  titul: string
  popis: string
}) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        mt: 6,
        mb: 3,
        pt: 3,
        pl: 2.5,
        borderTop: 2,
        borderLeft: 3,
        borderColor: 'primary.main',
        borderTopColor: 'divider',
        scrollMarginTop: 96,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'primary.main',
          mb: 0.75,
        }}
      >
        {stitek}
      </Typography>
      <Typography component="h2" sx={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
        {titul}
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 15.5, maxWidth: '62ch' }}>{popis}</Typography>
    </Box>
  )
}
