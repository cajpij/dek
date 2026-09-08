import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Jedno odpoledne nad automatizací kontroly faktur — a kde v něm sedí
 * /clear, /compact a /rewind.
 *
 * Předchozí obrázek ukazuje, co ty tři příkazy udělají s historií. Tenhle
 * ukazuje, kdy se který hodí, na práci, kterou účastníci opravdu řeší a řeší
 * ji dlouho: rozkoukání ve složce, psaní skillu, doladění, naplánování rutiny
 * a mezitím dotaz od kolegy na něco úplně jiného.
 *
 * Poslední fáze (dotaz na rozpis dovolených) je schválně z jiné agendy —
 * ukazuje, že /clear se použije při každé změně úlohy, ne jen na konci dne.
 *
 * Sloupec = jedna zpráva, výška = kolik se u ní posílá znovu. Tvar je pointa,
 * čísla jsou dílky, ne tokeny. Tři věci, které z obrázku mají zůstat:
 *  - /rewind ukrojí jen konec, křivka spadne o kousek,
 *  - /compact má vlastní špičku — shrnutí musí celou historii přečíst,
 *  - /clear sráží na nulu a je zadarmo; proto se jím oddělují úlohy.
 */

type Bar = { v: number; tone?: 'spike' }

/** Odpoledne po zprávách. Čísla jsou dílky — jde o tvar křivky. */
const BARS: Bar[] = [
  // 14:00 — co je ve složce (Claude čte pět PDF, každá zpráva přidá dost)
  { v: 6 },
  { v: 11 },
  { v: 19 },
  { v: 26 },
  { v: 32 },
  // /rewind → zpátky na 19
  // 14:20 — píšeš skill
  { v: 24 },
  { v: 28 },
  { v: 34 },
  { v: 39 },
  { v: 43 },
  { v: 48 },
  // /compact → vlastní špička, pak souhrn
  { v: 48, tone: 'spike' },
  // 15:05 — doladění
  { v: 18 },
  { v: 23 },
  { v: 27 },
  { v: 30 },
  { v: 34 },
  // /clear
  // 15:40 — rutina na 7:00
  { v: 4 },
  { v: 7 },
  { v: 11 },
  { v: 14 },
  // /clear
  // 16:10 — dotaz kolegy na rozpis dovolených
  { v: 5 },
  { v: 9 },
  { v: 12 },
]

const PHASES = [
  { from: 0, to: 5, label: '14:00 · Co je ve složce' },
  { from: 5, to: 11, label: '14:20 · Píšeš skill' },
  { from: 12, to: 17, label: '15:05 · Doladění' },
  { from: 17, to: 21, label: '15:40 · Rutina 7:00' },
  { from: 21, to: 24, label: '16:10 · Dovolené' },
]

const X0 = 40
const COL_W = 26
const COL_GAP = 5
const STEP = COL_W + COL_GAP
const BASE_Y = 292
const CHART_H = 170
const MAX = 48

const colX = (i: number) => X0 + i * STEP

export default function FakturySezeni() {
  const c = useFigureColors()
  const accent = c.primary
  const ok = c.success
  const warn = c.warning

  /** Svislá čára v místě zásahu + štítek s příkazem pod osou. */
  const marker = (atIndex: number, cmd: string, color: string, note: string) => {
    const x = colX(atIndex) - COL_GAP / 2
    const w = 78
    return (
      <g key={cmd + atIndex}>
        <line
          x1={x}
          y1={96}
          x2={x}
          y2={BASE_Y + 6}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="3 4"
          opacity={0.85}
        />
        <rect x={x - w / 2} y={BASE_Y + 12} width={w} height={21} rx={5} fill={color} opacity={0.18} />
        <text
          x={x}
          y={BASE_Y + 27}
          fontSize={12}
          textAnchor="middle"
          fontWeight={700}
          fill={color}
          fontFamily="ui-monospace, Menlo, monospace"
        >
          {cmd}
        </text>
        <text x={x} y={BASE_Y + 48} fontSize={11.5} textAnchor="middle" fill={color} opacity={0.95}>
          {note}
        </text>
      </g>
    )
  }

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
        viewBox="0 0 900 372"
        role="img"
        aria-label="Jedno odpoledne nad automatizací kontroly faktur jako sloupcový graf: každý sloupec je jedna zpráva a jeho výška to, kolik se u ní posílá znovu. Od dvou hodin se rozkoukáváš ve složce a Claude čte pět PDF, takže sloupce rychle rostou. Práce se vydá špatným směrem, takže lomítko rewind ukrojí poslední dva kroky a křivka spadne o kousek. Ve dvacet po druhé píšeš skill a sloupce zase rostou až na maximum. V přestávce dáš lomítko compact: má vlastní špičku, protože shrnutí musí celou historii nejdřív přečíst, ale hned po ní se pokračuje z mnohem nižší hladiny. V pět po třetí doladíš, co skill hlásí. Pak přecházíš na jinou úlohu, naplánovat rutinu na sedmou ráno, a lomítko clear srazí historii na nulu zadarmo. V deset po čtvrté se kolega ptá na rozpis dovolených, tedy zase jiná úloha, a znovu lomítko clear. Bez těch čtyř zásahů by poslední zpráva odpoledne táhla s sebou všech třiadvacet předchozích."
        sx={{ display: 'block', width: '100%', minWidth: 820, height: 'auto' }}
      >
        <text x={X0} y={18} fontSize={12.5} fill="currentColor" opacity={0.8}>
          Jedno odpoledne nad automatizací kontroly faktur
        </text>
        <text x={X0} y={36} fontSize={11.5} fill="currentColor" opacity={0.6}>
          Sloupec = jedna zpráva. Výška = kolik se u ní posílá znovu.
        </text>

        {/* pásy fází */}
        {PHASES.map((ph) => {
          const x = colX(ph.from)
          const w = (ph.to - ph.from) * STEP - COL_GAP
          return (
            <g key={ph.label}>
              <rect x={x} y={52} width={w} height={22} rx={5} fill="currentColor" opacity={0.08} />
              <text x={x + 8} y={67} fontSize={11.5} fill="currentColor" opacity={0.85}>
                {ph.label}
              </text>
            </g>
          )
        })}

        {/* sloupce */}
        {BARS.map((b, i) => {
          const h = (b.v / MAX) * CHART_H
          const spike = b.tone === 'spike'
          return (
            <rect
              key={i}
              x={colX(i)}
              y={BASE_Y - h}
              width={COL_W}
              height={h}
              rx={3}
              fill={spike ? warn : accent}
              opacity={spike ? 0.95 : 0.25 + (b.v / MAX) * 0.6}
            />
          )
        })}

        {/* osa */}
        <line
          x1={X0 - 6}
          y1={BASE_Y}
          x2={colX(BARS.length) + 4}
          y2={BASE_Y}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.35}
        />

        {/* zásahy */}
        {marker(5, '/rewind', accent, 'zpátky o dva kroky')}
        {marker(12, '/compact', warn, 'v přestávce na kávu')}
        {marker(17, '/clear', ok, 'jiná úloha')}
        {marker(21, '/clear', ok, 'zase jiná úloha')}

        {/* popisek špičky /compact — končí těsně před ní, aby nic nepřekrýval */}
        <text x={colX(11) - 4} y={92} fontSize={11.5} textAnchor="end" fontWeight={650} fill={warn}>
          shrnutí přečte celou historii,
        </text>
        <text x={colX(11) - 4} y={108} fontSize={11.5} textAnchor="end" fill={warn}>
          proto ta špička →
        </text>

        {/* co by bylo bez zásahů */}
        <text x={X0} y={362} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Bez těch čtyř zásahů by poslední zpráva odpoledne táhla s sebou všech 23 předchozích — včetně pěti faktur a dotazu na dovolené.
        </text>
      </Box>
    </Box>
  )
}
