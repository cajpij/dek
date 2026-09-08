import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Co /clear, /compact a /rewind udělají s historií sezení.
 *
 * Tabulka to popsat umí, ale rozdíl mezi těmi třemi je tvarový: jeden historii
 * zahodí, druhý ji slisuje do souhrnu, třetí z ní ukrojí konec. A hlavně —
 * každý stojí něco jiného, protože každý jinak zachází s tím, co má cache už
 * přečtené. Proto obrázek: tři pásky zpráv a tři různé osudy.
 *
 * Kostičky jsou zprávy, ne tokeny. Jde o tvar, ne o čísla.
 */

const BEFORE = 9
const BLOCK_W = 14
const BLOCK_GAP = 4
const BLOCK_H = 24

const ROW_H = 100
const ROW_Y0 = 52

const LEFT_X = 20
const STRIP_X = 168
const AFTER_X = 396
const NOTE_X = 588

export default function TriPrikazy() {
  const c = useFigureColors()
  const mono = 'ui-monospace, Menlo, monospace'

  const strip = (x: number, y: number, n: number, color: string, from = 0) =>
    Array.from({ length: n }, (_, i) => (
      <rect
        key={i}
        x={x + i * (BLOCK_W + BLOCK_GAP)}
        y={y}
        width={BLOCK_W}
        height={BLOCK_H}
        rx={3}
        fill={color}
        opacity={0.3 + ((from + i) / (BEFORE - 1)) * 0.55}
      />
    ))

  const ghost = (x: number, y: number, n: number) =>
    Array.from({ length: n }, (_, i) => (
      <rect
        key={i}
        x={x + i * (BLOCK_W + BLOCK_GAP)}
        y={y}
        width={BLOCK_W}
        height={BLOCK_H}
        rx={3}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.35}
      />
    ))

  const arrow = (y: number, color: string) => (
    <g>
      <line x1={340} y1={y} x2={384} y2={y} stroke={color} strokeWidth={1.5} opacity={0.8} />
      <polygon points={`384,${y} 375,${y - 5} 375,${y + 5}`} fill={color} opacity={0.8} />
    </g>
  )

  const row = (
    i: number,
    cmd: string,
    color: string,
    price: string,
    afterLabel: string,
    when: string[],
    after: React.ReactNode,
  ) => {
    const y = ROW_Y0 + i * ROW_H
    const blockY = y + 6
    const mid = blockY + BLOCK_H / 2

    return (
      <g key={cmd}>
        {i > 0 ? (
          <line
            x1={LEFT_X}
            y1={y - 12}
            x2={880}
            y2={y - 12}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.14}
          />
        ) : null}

        {/* příkaz + co stojí */}
        <text x={LEFT_X} y={blockY + 17} fontSize={15} fontFamily={mono} fontWeight={700} fill={color}>
          {cmd}
        </text>
        <rect x={LEFT_X} y={blockY + 30} width={104} height={20} rx={4} fill={color} opacity={0.16} />
        <text x={LEFT_X + 10} y={blockY + 44} fontSize={11.5} fontWeight={650} fill={color}>
          {price}
        </text>

        {/* historie před */}
        {strip(STRIP_X, blockY, BEFORE, color)}
        <text x={STRIP_X} y={blockY + 48} fontSize={11.5} fill="currentColor" opacity={0.6}>
          historie sezení
        </text>

        {arrow(mid, color)}
        {after}
        <text x={AFTER_X} y={blockY + 48} fontSize={11.5} fill={color} opacity={0.9} fontWeight={650}>
          {afterLabel}
        </text>

        {/* kdy */}
        {when.map((line, k) => (
          <text
            key={k}
            x={NOTE_X}
            y={blockY + 14 + k * 17}
            fontSize={12.5}
            fill="currentColor"
            opacity={k === 0 ? 0.95 : 0.75}
          >
            {line}
          </text>
        ))}
      </g>
    )
  }

  const ok = c.success
  const warn = c.warning
  const accent = c.primary
  const blockY = (i: number) => ROW_Y0 + i * ROW_H + 6

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
        viewBox="0 0 900 336"
        role="img"
        aria-label="Tři způsoby, jak zkrátit dlouhé sezení, nakreslené jako pásek devíti zpráv a to, co s ním každý příkaz udělá. Lomítko clear historii celou zahodí a zůstane prázdno; nic to nestojí a použije se, jakmile jdeš na jinou úlohu. Lomítko compact historii slisuje do jednoho souhrnu, na který pak navazují nové zprávy; něco to stojí, protože shrnutí musí celou konverzaci nejdřív přečíst, takže se dělá v přestávce mezi kroky, ne uprostřed. Lomítko rewind ukrojí jen pár posledních kroků a zbytek historie nechá; je levné, protože se vrací do historie, kterou už má cache přečtenou, a hodí se, když se práce vydala špatným směrem."
        sx={{ display: 'block', width: '100%', minWidth: 800, height: 'auto' }}
      >
        <text x={LEFT_X} y={20} fontSize={12.5} fill="currentColor" opacity={0.75}>
          Kostička = jedna zpráva v historii. Co s ní který příkaz udělá — a co to stojí.
        </text>

        {/* --- /clear --- */}
        {row(
          0,
          '/clear',
          ok,
          'nic nestojí',
          'prázdno, začínáš načisto',
          ['Jakmile jdeš na jinou úlohu.', 'Nejúčinnější věc z celé lekce.'],
          <g>{ghost(AFTER_X, blockY(0), BEFORE)}</g>,
        )}

        {/* --- /compact --- */}
        {row(
          1,
          '/compact',
          warn,
          'něco stojí',
          'jeden souhrn + nové zprávy',
          ['Táž úloha, ale historie je moc dlouhá.', 'Shrnutí musí celou konverzaci přečíst,', 'takže dělej v přestávce, ne uprostřed.'],
          <g>
            <rect x={AFTER_X} y={blockY(1)} width={62} height={BLOCK_H} rx={3} fill={warn} opacity={0.85} />
            <text
              x={AFTER_X + 31}
              y={blockY(1) + 16}
              fontSize={11}
              textAnchor="middle"
              fontWeight={700}
              fill={c.paper}
            >
              souhrn
            </text>
            {strip(AFTER_X + 72, blockY(1), 2, warn)}
          </g>,
        )}

        {/* --- /rewind --- */}
        {row(
          2,
          '/rewind',
          accent,
          'skoro zdarma',
          'zbytek historie zůstává',
          ['Když se to vydalo špatným směrem.', 'Levnější než /compact — vrací se do', 'historie, kterou už má cache přečtenou.'],
          <g>
            {strip(AFTER_X, blockY(2), 6, accent)}
            {ghost(AFTER_X + 6 * (BLOCK_W + BLOCK_GAP), blockY(2), 3)}
            <path
              d={`M 552 ${blockY(2) - 9} q -27 -13 -54 0`}
              fill="none"
              stroke={accent}
              strokeWidth={1.5}
              opacity={0.85}
            />
            <polygon
              points={`498,${blockY(2) - 9} 507,${blockY(2) - 14} 507,${blockY(2) - 4}`}
              fill={accent}
              opacity={0.85}
            />
          </g>,
        )}

      </Box>
    </Box>
  )
}
