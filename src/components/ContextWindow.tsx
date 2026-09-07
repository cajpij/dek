import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Jak se čte výpis /context.
 *
 * Kreslené podle skutečné obrazovky, ale s českým vysvětlením u každého řádku:
 * názvy položek zůstávají anglicky, protože přesně tak je aplikace vypíše,
 * a účastník je má poznat, ne přeložit.
 *
 * Čísla jsou z jednoho reálného sezení. Pointa obrázku je poměr, ne hodnoty:
 * Messages je skoro dvě třetiny, takže úklid startu je vedlejší proti tomu
 * zavřít sezení, které běží od rána.
 */

type Row = {
  label: string
  note: string
  value: string
  pct: string
  key: 'messages' | 'system' | 'mcp' | 'skills' | 'prompt' | 'memory' | 'free' | 'deferred'
}

const ROWS: Row[] = [
  {
    label: 'Messages',
    note: 'tvoje zprávy, odpovědi a všechno, co Claude přečetl',
    value: '647,3k',
    pct: '64,7 %',
    key: 'messages',
  },
  { label: 'System tools', note: 'nástroje, které má Claude vždycky', value: '23,5k', pct: '2,4 %', key: 'system' },
  { label: 'MCP tools', note: 'připojené konektory', value: '11,7k', pct: '1,2 %', key: 'mcp' },
  { label: 'Skills', note: 'tvoje zabalené postupy', value: '6,9k', pct: '0,7 %', key: 'skills' },
  { label: 'System prompt', note: 'základní instrukce aplikace', value: '5,6k', pct: '0,6 %', key: 'prompt' },
  { label: 'Memory files', note: 'CLAUDE.md a poznámky projektu', value: '4,1k', pct: '0,4 %', key: 'memory' },
  { label: 'Free space', note: 'kolik se ještě vejde, než dojde na /compact', value: '300,9k', pct: '30,1 %', key: 'free' },
  {
    label: 'MCP tools (deferred)',
    note: 'konektory připravené stranou — načtou se, až budou potřeba',
    value: '183,3k',
    pct: '—',
    key: 'deferred',
  },
]

/** Podíl na pruhu nahoře. Deferred se do pruhu nepočítá, proto tu není. */
const BAR = [
  { key: 'messages', pct: 64.7 },
  { key: 'system', pct: 2.4 },
  { key: 'mcp', pct: 1.2 },
  { key: 'skills', pct: 0.7 },
  { key: 'prompt', pct: 0.6 },
  { key: 'memory', pct: 0.4 },
  { key: 'free', pct: 30.1 },
] as const

export default function ContextWindow() {
  const c = useFigureColors()
  const color: Record<Row['key'], string> = {
    messages: c.primary,
    system: c.warning,
    mcp: c.success,
    skills: c.warningLight,
    prompt: c.errorLight,
    memory: c.successDark,
    free: c.textDisabled,
    deferred: c.textDisabled,
  }

  const barX = 24
  const barW = 852
  const rowTop = 112
  const rowH = 34

  let acc = 0

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
        viewBox={`0 0 900 ${rowTop + ROWS.length * rowH - 8}`}
        role="img"
        aria-label="Výpis příkazu /context z jednoho sezení. Okno kontextu je zaplněné ze 70 procent, 699,1 tisíce z jednoho milionu. Messages, tedy zprávy a přečtené soubory, zabírají 647,3 tisíce a 64,7 procenta. System tools 23,5 tisíce a 2,4 procenta. MCP tools, tedy konektory, 11,7 tisíce a 1,2 procenta. Skills 6,9 tisíce a 0,7 procenta. System prompt 5,6 tisíce a 0,6 procenta. Memory files, tedy CLAUDE.md, 4,1 tisíce a 0,4 procenta. Volného místa zbývá 300,9 tisíce, tedy 30,1 procenta. Zbytek konektorů čeká stranou a do okna se nepočítá. Ponaučení: úklid startu je vedlejší proti tomu, zavřít sezení, které běží od rána."
        sx={{ display: 'block', width: '100%', minWidth: 720, height: 'auto' }}
      >
        {/* hlavička */}
        <text x={barX} y={34} fontSize={16} fontWeight={700} fill="currentColor">
          Context window
        </text>
        <text x={barX + barW} y={34} fontSize={15} textAnchor="end" fill="currentColor" opacity={0.8}>
          699,1k / 1M (70 %)
        </text>

        {/* pruh */}
        <rect x={barX} y={56} width={barW} height={12} rx={6} fill="currentColor" opacity={0.12} />
        {BAR.map((seg) => {
          const w = (seg.pct / 100) * barW
          const x = barX + acc
          acc += w
          return (
            <rect
              key={seg.key}
              x={x}
              y={56}
              width={Math.max(w - 1.5, 1)}
              height={12}
              rx={3}
              fill={color[seg.key]}
              opacity={seg.key === 'free' ? 0.22 : 0.95}
            />
          )
        })}

        {ROWS.map((row, i) => {
          const y = rowTop + i * rowH
          const muted = row.key === 'free' || row.key === 'deferred'
          return (
            <g key={row.label}>
              <rect x={barX} y={y - 12} width={12} height={12} rx={3} fill={color[row.key]} opacity={muted ? 0.35 : 0.95} />
              <text x={barX + 24} y={y - 1} fontSize={14} fontWeight={600} fill="currentColor" opacity={muted ? 0.7 : 1}>
                {row.label}
              </text>
              <text x={barX + 210} y={y - 1} fontSize={13} fill="currentColor" opacity={0.75}>
                {row.note}
              </text>
              <text
                x={barX + barW - 78}
                y={y - 1}
                fontSize={13.5}
                textAnchor="end"
                fill="currentColor"
                opacity={0.85}
                fontFamily="ui-monospace, Menlo, monospace"
              >
                {row.value}
              </text>
              <text
                x={barX + barW}
                y={y - 1}
                fontSize={13.5}
                textAnchor="end"
                fill={row.key === 'messages' ? color.messages : 'currentColor'}
                fontWeight={row.key === 'messages' ? 700 : 400}
                opacity={row.key === 'messages' ? 1 : 0.85}
              >
                {row.pct}
              </text>
              <line
                x1={barX}
                y1={y + 10}
                x2={barX + barW}
                y2={y + 10}
                stroke="currentColor"
                strokeWidth={1}
                opacity={0.08}
              />
            </g>
          )
        })}
      </Box>
    </Box>
  )
}
