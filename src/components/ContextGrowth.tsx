import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

/**
 * Proč dlouhé sezení stojí víc než několik krátkých.
 *
 * Levý sloupec: jedno sezení, ve kterém se vystřídají tři úlohy. Každá další
 * zpráva s sebou táhne všechny předchozí, takže roste to, co se posílá znovu.
 * Pravý: totéž rozdělené na tři sezení — po každé úloze /clear a začíná se
 * odznova.
 *
 * Čísla jsou schválně bezrozměrná (dílky, ne tokeny): pointa je tvar křivky,
 * ne konkrétní hodnota, která by za měsíc stejně neplatila.
 */

/** Kolik toho každá zpráva přidá. Tři úlohy po pěti zprávách. */
const ADDED = [4, 3, 5, 3, 4, 5, 3, 4, 4, 3, 4, 5, 3, 4, 4]
const TASK_AT = [0, 5, 10]

function bars(reset: boolean): number[] {
  const out: number[] = []
  let acc = 0
  ADDED.forEach((add, i) => {
    if (reset && TASK_AT.includes(i)) acc = 0
    acc += add
    out.push(acc)
  })
  return out
}

export default function ContextGrowth() {
  const theme = useTheme()
  const accent = theme.palette.primary.main
  const ok = theme.palette.success.main
  const long = bars(false)
  const short = bars(true)
  const max = Math.max(...long)
  const colW = 20
  const gap = 4
  const chartH = 150
  const baseY = 210
  const sumLong = long.reduce((a, b) => a + b, 0)
  const sumShort = short.reduce((a, b) => a + b, 0)

  const chart = (values: number[], x0: number, color: string, title: string, sum: number) => (
    <g>
      <text x={x0} y={40} fontSize={14} fontWeight={650} fill={color}>
        {title}
      </text>
      {values.map((v, i) => {
        const h = (v / max) * chartH
        return (
          <rect
            key={i}
            x={x0 + i * (colW + gap)}
            y={baseY - h}
            width={colW}
            height={h}
            rx={2}
            fill={color}
            opacity={0.28 + (v / max) * 0.62}
          />
        )
      })}
      <line
        x1={x0 - 4}
        y1={baseY}
        x2={x0 + values.length * (colW + gap)}
        y2={baseY}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.35}
      />
      <text x={x0} y={baseY + 22} fontSize={12.5} fill="currentColor" opacity={0.8}>
        15 zpráv, tři úlohy
      </text>
      <text x={x0} y={baseY + 44} fontSize={13.5} fontWeight={650} fill={color}>
        celkem {sum} dílků
      </text>
    </g>
  )

  return (
    <Box
      tabIndex={0}
      sx={{
        overflowX: 'auto',
        color: 'text.secondary',
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 900 280"
        role="img"
        aria-label={`Dva sloupcové grafy vedle sebe. Vlevo jedno dlouhé sezení: každá další zpráva posílá znovu všechny předchozí, sloupce rostou až do konce a dohromady dají ${sumLong} dílků. Vpravo totéž rozdělené na tři sezení s příkazem lomítko clear mezi úlohami: sloupce třikrát spadnou na začátek a dohromady dají ${sumShort} dílků, tedy zhruba polovinu.`}
        sx={{ display: 'block', width: '100%', minWidth: 760, height: 'auto' }}
      >
        <text x={20} y={20} fontSize={12.5} fill="currentColor" opacity={0.75}>
          Kolik se posílá znovu při každé zprávě
        </text>
        {chart(long, 20, accent, 'Jedno sezení celý den', sumLong)}
        {chart(short, 480, ok, 'Tři sezení, mezi nimi /clear', sumShort)}
        <line
          x1={455}
          y1={30}
          x2={455}
          y2={260}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="3 5"
          opacity={0.3}
        />
      </Box>
    </Box>
  )
}
