import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

const STEPS = [
  { label: 'Zadání', note: 'uděláš to ručně' },
  { label: 'Pravidlo', note: 'do CLAUDE.md' },
  { label: 'Skill', note: 'postup na jednu větu' },
  { label: 'Hook', note: 'spustí se sám' },
  { label: 'Běh bez tebe', note: 'naplánovaně' },
]

/**
 * Pět stupňů, po kterých se z ruční práce stane automatizace.
 *
 * Schválně jako schody: pointa obrázku je, že se přeskakovat nedají — kdo
 * začne hookem, nastaví ho na postup, který si nikdy neověřil.
 */
export default function AutomationLadder() {
  const theme = useTheme()
  const accent = theme.palette.primary.main
  const stepW = 168
  const stepH = 46
  const baseY = 300

  return (
    <Box tabIndex={0} sx={{ overflowX: 'auto', color: 'text.secondary', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
      <Box
        component="svg"
        viewBox="0 0 900 340"
        role="img"
        aria-label="Pět stupňů automatizace: zadání, pravidlo v CLAUDE.md, skill, hook a nakonec běh bez tebe. Každý stupeň staví na tom předchozím."
        sx={{ display: 'block', width: '100%', minWidth: 700, height: 'auto' }}
      >
        {STEPS.map((s, i) => {
          const x = 20 + i * 172
          const y = baseY - (i + 1) * 46
          const isLast = i === STEPS.length - 1
          return (
            <g key={s.label} color={isLast ? accent : undefined}>
              <rect
                x={x}
                y={y}
                width={stepW}
                height={stepH}
                rx={3}
                fill="none"
                stroke="currentColor"
                strokeWidth={isLast ? 2 : 1.5}
              />
              <text
                x={x + 14}
                y={y + 20}
                fontSize={11}
                fontFamily="ui-monospace, Menlo, monospace"
                fill="currentColor"
                opacity={0.65}
              >
                {i + 1}
              </text>
              <text x={x + 34} y={y + 21} fontSize={14} fontWeight={600} fill="currentColor">
                {s.label}
              </text>
              <text x={x + 14} y={y + 38} fontSize={11.5} fill="currentColor" opacity={0.8}>
                {s.note}
              </text>
              {i < STEPS.length - 1 ? (
                <line
                  x1={x + stepW}
                  y1={y + stepH}
                  x2={x + 172}
                  y2={y + stepH}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              ) : null}
            </g>
          )
        })}
        <line x1={20} y1={baseY + 6} x2={880} y2={baseY + 6} stroke="currentColor" strokeWidth={1} opacity={0.3} />
        <text x={20} y={baseY + 26} fontSize={12} fill="currentColor" opacity={0.7}>
          ruční práce
        </text>
        <text x={880} y={baseY + 26} fontSize={12} textAnchor="end" fill="currentColor" opacity={0.7}>
          běží samo
        </text>
      </Box>
    </Box>
  )
}
