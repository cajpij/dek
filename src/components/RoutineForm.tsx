import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

type Field = {
  label: string
  value: string[]
  y: number
  h: number
  mono?: boolean
  note?: string
  warn?: boolean
}

/** Vyplněný formulář nové úlohy pro kontrolu faktur. Hodnoty jsou reálné, ne ilustrační — je to ten samý cvičný projekt, který je ke stažení. */
const FIELDS: Field[] = [
  {
    label: 'Name',
    value: ['kontrola-faktur'],
    y: 78,
    h: 32,
    mono: true,
    note: 'Z názvu vznikne složka na disku. Bez diakritiky, jedno slovo.',
  },
  {
    label: 'Description',
    value: ['Ranní kontrola nových faktur a mail s výsledkem'],
    y: 138,
    h: 32,
  },
  {
    label: 'Instructions',
    value: [
      'Postupuj podle skillu kontrola-faktur.',
      'Vstup jsou nové faktury ve vstup/.',
      'Když nepřibyla žádná nová, nic nedělej a nic neposílej.',
      'Po dokončení otevři rozepsaný e-mail se shrnutím z protokolu.',
      'Neodesílej — jen otevři okno, odeslání zůstává na mně.',
    ],
    y: 198,
    h: 104,
    mono: true,
    warn: true,
    note: 'Vždycky sem patří i podmínka, kdy se nemá odeslat nic.',
  },
  {
    label: 'Model · Permission mode',
    value: ['Sonnet  ·  Accept edits'],
    y: 330,
    h: 32,
    note: 'Accept edits, jinak se běh zastaví na dotazu, na který v sedm ráno nikdo neodpoví.',
    warn: true,
  },
  {
    label: 'Folder',
    value: ['~/…/OneDrive – DEK/Účetnictví/faktury-kontrola'],
    y: 390,
    h: 32,
    mono: true,
    note: 'Ta nasyncovaná složka. Bez ní se úloha neuloží.',
  },
  {
    label: 'Schedule',
    value: ['Daily  ·  7:00'],
    y: 450,
    h: 32,
    note: 'Faktury chodí přes noc, tak ať je kontrola hotová, než přijdou do práce.',
  },
]

/**
 * Mockup formuláře „New routine → Local“ vyplněného na příkladu kontroly faktur.
 *
 * Kreslený schválně, ne odchycený screenshot: obrazovka se každou verzí mění,
 * kdežto tohle zestárne až ve chvíli, kdy se změní samotná pole.
 */
export default function RoutineForm() {
  const c = useFigureColors()
  const accent = c.primary
  const warn = c.warning
  const formW = 520
  const x0 = 16

  return (
    <Box tabIndex={0} sx={{ overflowX: 'auto', color: 'text.secondary', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
      <Box
        component="svg"
        viewBox="0 0 900 560"
        role="img"
        aria-label="Vyplněný formulář nové naplánované úlohy: název kontrola-faktur, popis ranní kontrola nových faktur a mail s výsledkem, instrukce odkazující na skill kontrola-faktur s podmínkou nic neodesílat a jen otevřít rozepsaný e-mail, model Sonnet a režim Accept edits, složka faktury-kontrola na OneDrive a rozvrh denně v sedm ráno."
        sx={{ display: 'block', width: '100%', minWidth: 720, height: 'auto' }}
      >
        {/* rám okna */}
        <rect
          x={x0}
          y={12}
          width={formW}
          height={532}
          rx={10}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.35}
        />
        <line
          x1={x0}
          y1={52}
          x2={x0 + formW}
          y2={52}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.35}
        />
        <text x={x0 + 18} y={36} fontSize={14} fontWeight={650} fill={accent}>
          New routine
        </text>
        <text x={x0 + 132} y={36} fontSize={13} fill="currentColor" opacity={0.85}>
          Local — běží na tvém počítači
        </text>

        {FIELDS.map((f) => (
          <g key={f.label}>
            <text x={x0 + 18} y={f.y} fontSize={12} fill="currentColor" opacity={0.75}>
              {f.label}
            </text>
            <rect
              x={x0 + 18}
              y={f.y + 8}
              width={formW - 36}
              height={f.h}
              rx={6}
              fill="none"
              stroke={f.warn ? warn : 'currentColor'}
              strokeWidth={f.warn ? 1.5 : 1}
              opacity={f.warn ? 0.9 : 0.3}
            />
            {f.value.map((line, i) => (
              <text
                key={line}
                x={x0 + 30}
                y={f.y + 29 + i * 18}
                fontSize={f.mono ? 12 : 12.5}
                fontFamily={f.mono ? 'ui-monospace, Menlo, monospace' : undefined}
                fill="currentColor"
              >
                {line}
              </text>
            ))}
            {f.note ? (
              <>
                <line
                  x1={x0 + formW}
                  y1={f.y + 8 + f.h / 2}
                  x2={x0 + formW + 40}
                  y2={f.y + 8 + f.h / 2}
                  stroke={f.warn ? warn : 'currentColor'}
                  strokeWidth={1}
                  strokeDasharray="2 4"
                  opacity={0.6}
                />
                <text
                  x={x0 + formW + 52}
                  y={f.y + 8 + f.h / 2 - 4}
                  fontSize={12.5}
                  fill={f.warn ? warn : 'currentColor'}
                  opacity={f.warn ? 1 : 0.9}
                >
                  {f.note.length > 44 ? f.note.slice(0, f.note.lastIndexOf(' ', 44)) : f.note}
                </text>
                {f.note.length > 44 ? (
                  <text
                    x={x0 + formW + 52}
                    y={f.y + 8 + f.h / 2 + 13}
                    fontSize={12.5}
                    fill={f.warn ? warn : 'currentColor'}
                    opacity={f.warn ? 1 : 0.9}
                  >
                    {f.note.slice(f.note.lastIndexOf(' ', 44) + 1)}
                  </text>
                ) : null}
              </>
            ) : null}
          </g>
        ))}

        {/* tlačítko */}
        <rect
          x={x0 + 18}
          y={500}
          width={104}
          height={30}
          rx={6}
          fill={accent}
          opacity={0.92}
        />
        <text x={x0 + 46} y={520} fontSize={13} fontWeight={600} fill="#fff">
          Create
        </text>
        <text x={x0 + 140} y={520} fontSize={12.5} fill="currentColor" opacity={0.85}>
          a hned potom Run now
        </text>
      </Box>
    </Box>
  )
}
