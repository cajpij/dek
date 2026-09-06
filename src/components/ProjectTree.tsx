import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

const ROWS: { text: string; note?: string; indent: number; accent?: boolean }[] = [
  { text: 'akcni-regal/', note: 'jedna složka = jedna agenda', indent: 0, accent: true },
  { text: '├── CLAUDE.md', note: 'pravidla a slovník, čtou se pokaždé', indent: 0, accent: true },
  { text: '├── data/', note: 'vstupy — reálný vzorek, ne celá databáze', indent: 0 },
  { text: '├── vystupy/', note: 'sem jdou výsledky, originály zůstanou celé', indent: 0 },
  { text: '└── .claude/', indent: 0 },
  { text: '└── skills/', note: 'zabalené postupy, které se opakují', indent: 1, accent: true },
  { text: '└── logisticke-dostupnosti/SKILL.md', indent: 2 },
]

/**
 * Jak vypadá složka projektu.
 *
 * Nejde o obrázek pro parádu: netechnickým lidem tenhle strom odpovídá na
 * otázku „a kam to mám vlastně dát“ rychleji než tři odstavce textu.
 */
export default function ProjectTree() {
  const theme = useTheme()
  const accent = theme.palette.primary.main
  const top = 34
  const step = 34

  return (
    <Box sx={{ overflowX: 'auto', color: 'text.secondary' }}>
      <Box
        component="svg"
        viewBox="0 0 900 290"
        role="img"
        aria-label="Strom složky projektu: akcni-regal obsahuje CLAUDE.md s pravidly a slovníkem, složku data se vstupy, složku vystupy s výsledky a složku .claude/skills se zabalenými postupy."
        sx={{ display: 'block', width: '100%', minWidth: 640, height: 'auto' }}
      >
        {ROWS.map((row, i) => {
          const y = top + i * step
          return (
            <g key={row.text}>
              <text
                x={24 + row.indent * 30}
                y={y}
                fontFamily="ui-monospace, Menlo, monospace"
                fontSize={14}
                fill={row.accent ? accent : 'currentColor'}
                fontWeight={row.accent ? 600 : 400}
              >
                {row.text}
              </text>
              {row.note ? (
                <>
                  <line
                    x1={380}
                    y1={y - 4}
                    x2={452}
                    y2={y - 4}
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeDasharray="2 4"
                    opacity={0.5}
                  />
                  <text x={464} y={y} fontSize={13.5} fill="currentColor" opacity={0.9}>
                    {row.note}
                  </text>
                </>
              ) : null}
            </g>
          )
        })}
      </Box>
    </Box>
  )
}
