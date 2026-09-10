import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { ODPOVEDI, type Odpoved } from '../odpovedi'

/**
 * Zodpovězené otázky z nástěnky.
 *
 * Nástěnka je živá a otázky v ní zapadnou. Sem je dopisuje automatizace i
 * s odpovědí, takže po workshopu zůstane něco, co se dá číst po pořádku.
 *
 * Odpovědi píše Claude z lekcí akademie, ne z hlavy — u každé jsou vidět
 * lekce, ze kterých vyšla. Když je seznam zdrojů prázdný, znamená to, že
 * odpověď v lekcích není a patří na lektora; stránka to říká nahlas.
 */

const datum = (iso: string) =>
  new Date(iso).toLocaleString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

/** Odstavce oddělené prázdným řádkem. Žádné HTML — text jde z automatizace. */
function Odstavce({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .map((o) => o.trim())
        .filter(Boolean)
        .map((o, i) => (
          <Typography key={i} sx={{ mt: i === 0 ? 1 : 1.5, whiteSpace: 'pre-wrap' }}>
            {o}
          </Typography>
        ))}
    </>
  )
}

function Zaznam({ z }: { z: Odpoved }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, flexWrap: 'wrap' }}>
        <Box
          component="span"
          sx={{
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'primary.main',
            bgcolor: 'action.hover',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.75,
          }}
        >
          {z.jmeno}
        </Box>
        <Typography sx={{ fontSize: 12.5, color: 'text.disabled' }}>{datum(z.cas)}</Typography>
        {z.lekce ? (
          <Typography
            sx={{ fontSize: 12.5, color: 'text.disabled', fontFamily: 'ui-monospace, Menlo, monospace' }}
          >
            {z.lekce}
          </Typography>
        ) : null}
      </Box>

      <Typography sx={{ mt: 1, fontWeight: 660, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
        {z.otazka}
      </Typography>

      <Box sx={{ mt: 1.5, pl: 1.75, borderLeft: 2, borderColor: 'divider' }}>
        <Odstavce text={z.odpoved} />

        {z.zdroje.length > 0 ? (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>Z lekcí:</Typography>
            {z.zdroje.map((s) => (
              <Link key={s.href} href={s.href} sx={{ fontSize: 13 }}>
                {s.label}
              </Link>
            ))}
          </Box>
        ) : (
          <Typography sx={{ mt: 1.5, fontSize: 13, color: 'warning.dark' }}>
            V lekcích tohle není — ber odpověď jako návrh a ověř si ji u lektora.
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default function Odpovedi() {
  const razeno = [...ODPOVEDI].sort((a, b) => b.cas.localeCompare(a.cas))

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 2.5, md: 4 }, pt: 4, pb: 8 }}>
      <Typography variant="h4" component="h1" tabIndex={-1} sx={{ outline: 'none' }}>
        Zodpovězené otázky
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1, maxWidth: '62ch' }}>
        Co se kdo zeptal na <Link href="#academy?nastenka">nástěnce</Link> a co na to lekce
        akademie. Odpovědi sem dopisuje Claude sám, z lekcí — u každé je vidět, ze kterých.
        Nikdo je předtím nečte, takže když ti něco nesedí, řekni to lektorovi.
      </Typography>

      {razeno.length === 0 ? (
        <Typography sx={{ color: 'text.disabled', textAlign: 'center', py: 6 }}>
          Zatím tu nic není. První otázka z nástěnky se sem propíše sama, do pár minut.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, mt: 3 }}>
          {razeno.map((z) => (
            <Zaznam key={z.id} z={z} />
          ))}
        </Box>
      )}

      <Typography sx={{ fontSize: 13, color: 'text.disabled', mt: 5 }}>
        Otázky se sem berou z nástěnky — <Link href="#academy">zpátky na kurzy</Link>.
      </Typography>
    </Box>
  )
}
