import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

const ROWS: { text: string; note?: string; indent: number; accent?: boolean; muted?: boolean }[] = [
  {
    text: 'OneDrive – DEK/Účetnictví/',
    note: 'nasyncovaná knihovna ze SharePointu',
    indent: 0,
    muted: true,
  },
  { text: '└── faktury-kontrola/', note: 'tady otevřeš Claude Code — tohle je projekt', indent: 0, accent: true },
  { text: '├── CLAUDE.md', note: 'pravidla a slovník, čtou se pokaždé', indent: 1, accent: true },
  { text: '├── data/', note: 'vstupy — reálný vzorek, ne celá databáze', indent: 1 },
  { text: '├── vystupy/', note: 'sem jdou výsledky, originály zůstanou celé', indent: 1 },
  { text: '└── .claude/', indent: 1 },
  { text: '└── skills/', note: 'zabalené postupy, které se opakují', indent: 2, accent: true },
  { text: '└── kontrola-faktur/SKILL.md', indent: 3 },
]

/**
 * Jak vypadá složka projektu.
 *
 * Nejde o obrázek pro parádu: netechnickým lidem tenhle strom odpovídá na
 * otázku „a kam to mám vlastně dát“ rychleji než tři odstavce textu.
 */
export default function ProjectTree() {
  const c = useFigureColors()
  const accent = c.primary
  const top = 34
  const step = 34

  return (
    <Box tabIndex={0} sx={{ overflowX: 'auto', color: 'text.secondary', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
      <Box
        component="svg"
        viewBox="0 0 900 324"
        role="img"
        aria-label="Strom složek. Nahoře nasyncovaná knihovna ze SharePointu a v ní složka faktury-kontrola — tu otevřeš v Claude Code a ta je tím projektem. Uvnitř je CLAUDE.md s pravidly a slovníkem, složka data se vstupy, složka vystupy s výsledky a složka .claude/skills se zabalenými postupy. Projekt tedy není nic vedle knihovny, je to podsložka v ní."
        sx={{ display: 'block', width: '100%', minWidth: 700, height: 'auto' }}
      >
        {ROWS.map((row, i) => {
          const y = top + i * step
          return (
            <g key={row.text}>
              <text
                x={24 + row.indent * 26}
                y={y}
                fontFamily="ui-monospace, Menlo, monospace"
                fontSize={14}
                fill={row.accent ? accent : 'currentColor'}
                fontWeight={row.accent ? 600 : 400}
                opacity={row.muted ? 0.7 : 1}
              >
                {row.text}
              </text>
              {row.note ? (
                <>
                  <line
                    x1={420}
                    y1={y - 4}
                    x2={492}
                    y2={y - 4}
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeDasharray="2 4"
                    opacity={0.5}
                  />
                  <text x={504} y={y} fontSize={13.5} fill="currentColor" opacity={0.9}>
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
