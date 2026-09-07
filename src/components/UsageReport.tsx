import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Panel, který vypíše /usage — a co v něm hledat.
 *
 * Kreslené podle skutečné obrazovky aplikace. Anglické popisky zůstávají tak,
 * jak je aplikace vypíše, česky je vysvětlení vedle. Tři věci, kvůli kterým
 * obrázek v lekci je:
 *
 *  - příděl má tři pruhy, ne jeden (pětihodinové okno a dvě týdenní),
 *  - Cache hit 99 % a rozpad tokenů ukazují celou pointu lekce v číslech,
 *  - období se přepíná dvěma rozbalovátky u „What's using your limits?",
 *    ne klávesou; to je v terminálu, ne tady.
 *
 * Čísla jsou z jednoho reálného sezení. Jde o poměry, ne o hodnoty.
 */

const LIMITS = [
  { label: '5-hour limit', right: 'Resets in 52 min', pct: 6, note: 'pětihodinové okno' },
  { label: 'Weekly · all models', right: 'Resets Sun 12:00 PM', pct: 23, note: 'týden přes všechny modely' },
  { label: 'Weekly · Fable', right: 'Resets Sun 12:00 PM', pct: 23, note: 'týden pro jeden model zvlášť' },
]

const BREAKDOWN = [
  { label: 'Input', value: '1.4k', note: 'nový vstup — to, co jsi opravdu napsal' },
  { label: 'Output', value: '152.8k', note: 'co Claude napsal' },
  { label: 'Cache read', value: '291.4M', note: 'opakované čtení historie — tady je to celé' },
  { label: 'Cache write', value: '3.1M', note: 'stavění cache' },
]

const USING = [
  { label: 'general-purpose', kind: 'Subagent', pct: 15 },
  { label: '/anthropic-skills:skill-creator', kind: 'Skill', pct: 5 },
  { label: '/run-skill-generator', kind: 'Skill', pct: 3 },
]

export default function UsageReport() {
  const c = useFigureColors()
  const accent = c.primary
  const warn = c.warning
  const mono = 'ui-monospace, Menlo, monospace'

  const panelX = 20
  const panelW = 520
  const barX = panelX + 18
  const barW = panelW - 36
  const noteX = panelX + panelW + 46

  /** Čárkovaná spojnice z panelu k českému vysvětlení vpravo. */
  const link = (y: number, color?: string) => (
    <line
      x1={panelX + panelW}
      y1={y - 4}
      x2={noteX - 12}
      y2={y - 4}
      stroke={color ?? 'currentColor'}
      strokeWidth={1}
      strokeDasharray="2 4"
      opacity={color ? 0.7 : 0.35}
    />
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
        viewBox="0 0 900 610"
        role="img"
        aria-label="Panel Usage v aplikaci. Nahoře tři pruhy přídělu: pětihodinový limit vyčerpaný ze šesti procent s obnovou za 52 minut, týdenní přes všechny modely na třiadvaceti procentech a týdenní pro jeden model také na třiadvaceti. Pak řádek o sezení: cena 115 dolarů, což je jen odhad pro API a na firemním plánu se neúčtuje, a Cache hit 99 procent. Rozpad tokenů: input 1,4 tisíce, output 152,8 tisíce, cache read 291,4 milionu a cache write 3,1 milionu — tedy skoro všechno bylo opakované čtení historie. Dole sekce What's using your limits s dvěma rozbalovátky, kterými se přepíná období a rozsah; pod nimi žebříček, co příděl bere: podagent 15 procent a dva skilly. Úplně dole tip od aplikace, že každý podagent posílá vlastní požadavky."
        sx={{ display: 'block', width: '100%', minWidth: 780, height: 'auto' }}
      >
        {/* rám panelu */}
        <rect
          x={panelX}
          y={16}
          width={panelW}
          height={578}
          rx={12}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.3}
        />
        <text x={barX} y={46} fontSize={15} fontWeight={700} fill="currentColor">
          Usage
        </text>

        {/* příděl */}
        {LIMITS.map((l, i) => {
          const y = 84 + i * 52
          return (
            <g key={l.label}>
              <text x={barX} y={y} fontSize={13.5} fill="currentColor">
                {l.label}
              </text>
              <text x={barX + barW - 34} y={y} fontSize={12} textAnchor="end" fill="currentColor" opacity={0.65}>
                {l.right}
              </text>
              <text x={barX + barW} y={y} fontSize={13.5} textAnchor="end" fontWeight={700} fill="currentColor">
                {l.pct}%
              </text>
              <rect x={barX} y={y + 8} width={barW} height={9} rx={4.5} fill={accent} opacity={0.18} />
              <rect x={barX} y={y + 8} width={(l.pct / 100) * barW} height={9} rx={4.5} fill={accent} />
              {link(y, i === 0 ? accent : undefined)}
              <text x={noteX} y={y} fontSize={12.5} fill="currentColor" opacity={0.9}>
                {l.note}
              </text>
            </g>
          )
        })}
        <text x={noteX} y={84 + 2 * 52 + 20} fontSize={12.5} fill="currentColor" opacity={0.7}>
          tři okna, ne jedno
        </text>

        {/* sezení */}
        <text x={barX} y={252} fontSize={14} fontWeight={650} fill="currentColor">
          This session
        </text>
        <text x={barX} y={278} fontSize={13} fontFamily={mono} fill="currentColor" opacity={0.85}>
          Cost $115.57 · API 2h 7m · Active 3m 48s
        </text>
        <text x={barX} y={302} fontSize={13} fontFamily={mono} fill="currentColor" opacity={0.85}>
          Opus 100% · Haiku 0% ·{' '}
        </text>
        <text x={barX + 232} y={302} fontSize={13} fontFamily={mono} fontWeight={700} fill={accent}>
          Cache hit 99%
        </text>
        {link(278, warn)}
        <text x={noteX} y={272} fontSize={12.5} fill={warn} fontWeight={650}>
          Cena je odhad pro API.
        </text>
        <text x={noteX} y={290} fontSize={12.5} fill={warn}>
          Na firemním plánu se neúčtuje.
        </text>
        {link(306, accent)}
        <text x={noteX} y={312} fontSize={12.5} fill={accent} fontWeight={650}>
          99 % vstupu přišlo z cache —
        </text>
        <text x={noteX} y={330} fontSize={12.5} fill={accent} fontWeight={650}>
          takhle vypadá zdravé sezení.
        </text>

        {/* rozpad */}
        <text x={barX} y={344} fontSize={14} fontWeight={650} fill="currentColor">
          Breakdown
        </text>
        {BREAKDOWN.map((b, i) => {
          const y = 372 + i * 26
          const hot = b.label === 'Cache read'
          return (
            <g key={b.label}>
              <text x={barX} y={y} fontSize={13} fill="currentColor" opacity={hot ? 1 : 0.75}>
                {b.label}
              </text>
              <text
                x={barX + barW}
                y={y}
                fontSize={13}
                textAnchor="end"
                fontFamily={mono}
                fontWeight={hot ? 700 : 400}
                fill={hot ? accent : 'currentColor'}
              >
                {b.value}
              </text>
              {hot ? link(y, accent) : null}
              {hot ? (
                <text x={noteX} y={y} fontSize={12.5} fill={accent} fontWeight={650}>
                  {b.note}
                </text>
              ) : null}
            </g>
          )
        })}

        {/* co bere příděl */}
        <text x={barX} y={506} fontSize={14} fontWeight={650} fill="currentColor">
          What&rsquo;s using your limits?
        </text>
        <rect x={barX + 258} y={492} width={112} height={20} rx={4} fill="currentColor" opacity={0.14} />
        <text x={barX + 266} y={506} fontSize={12} fill="currentColor">
          This session ⌄
        </text>
        <rect x={barX + 380} y={492} width={62} height={20} rx={4} fill="currentColor" opacity={0.14} />
        <text x={barX + 388} y={506} fontSize={12} fill="currentColor">
          All ⌄
        </text>
        {link(506, warn)}
        <text x={noteX} y={500} fontSize={12.5} fill={warn} fontWeight={650}>
          Tady se přepíná období a rozsah.
        </text>
        <text x={noteX} y={518} fontSize={12.5} fill={warn}>
          Klikni na to — písmena d a w
        </text>
        <text x={noteX} y={536} fontSize={12.5} fill={warn}>
          fungují jen v terminálu.
        </text>

        {USING.map((u, i) => {
          const y = 536 + i * 22
          return (
            <g key={u.label}>
              <text x={barX} y={y} fontSize={12.5} fill="currentColor" opacity={0.9}>
                {u.label}
              </text>
              <text x={barX + 232} y={y} fontSize={12.5} fill="currentColor" opacity={0.55}>
                {u.kind}
              </text>
              <rect x={barX + 300} y={y - 8} width={130} height={7} rx={3.5} fill={accent} opacity={0.18} />
              <rect x={barX + 300} y={y - 8} width={(u.pct / 15) * 130} height={7} rx={3.5} fill={accent} />
              <text x={barX + barW} y={y} fontSize={12.5} textAnchor="end" fontFamily={mono} fill="currentColor">
                {u.pct}%
              </text>
            </g>
          )
        })}
      </Box>
    </Box>
  )
}
