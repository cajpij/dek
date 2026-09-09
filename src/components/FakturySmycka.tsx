import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Celá smyčka od pošty po proplacení — a kde na ní jsou hranice.
 *
 * Pointa obrázku není postup, ale ty čtyři značky. Kroky 1–3 dělá projekt
 * sám a bez rizika. Krok 4 taky běží sám, ale je to vědomá výjimka — proto
 * má vlastní barvu, ne zelenou jako 1–3. Kroky 5–6 zůstávají nepostavené,
 * a ne proto, že by to nešlo.
 */

type Krok = {
  n: string
  titul: string[]
  stav: 'hned' | 'spravce' | 'auto' | 'it'
}

const KROKY: Krok[] = [
  { n: '1', titul: ['Najít fakturu', 'v poště'], stav: 'hned' },
  { n: '2', titul: ['Stáhnout PDF', 'do vstup/'], stav: 'hned' },
  { n: '3', titul: ['Vytáhnout údaje', 'a zapsat je'], stav: 'hned' },
  { n: '4', titul: ['Požádat dodavatele', 'o doplnění'], stav: 'auto' },
  { n: '5', titul: ['Ověřit, jestli', 'je uhrazená'], stav: 'it' },
  { n: '6', titul: ['Poslat účtárně', 'k proplacení'], stav: 'spravce' },
]

const POPIS: Record<Krok['stav'], string> = {
  hned: 'jde hned',
  spravce: 'povoluje správce',
  auto: 'posílá se samo',
  it: 'potřebuje IT',
}

export default function FakturySmycka() {
  const c = useFigureColors()
  const barva: Record<Krok['stav'], string> = {
    hned: c.success,
    spravce: c.warning,
    // Vědomě jiná barva než 'hned' — technicky taky běží samo, ale je to
    // výjimka s odůvodněním, ne bezriziková věc jako kroky 1–3.
    auto: c.info,
    // Pozor: ne text.disabled. Tenhle krok je sice „ne o Claudovi“, ale
    // pořád se musí dát přečíst — ztlumená barva je na ztlumený text,
    // ne na štítek, který něco znamená.
    it: c.textSecondary,
  }

  // Tři na řádku ve dvou řadách: šest vedle sebe se na užší obrazovce ořízne.
  const w = 262
  const h = 104
  const mezeraX = 22
  const mezeraY = 26
  const x0 = 20
  const y0 = 46

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
        viewBox="0 0 900 400"
        role="img"
        aria-label="Šest kroků smyčky od pošty po proplacení. Najít fakturu v poště jde hned. Stáhnout PDF do vstup/ jde hned. Vytáhnout údaje a zapsat je jde hned. Požádat dodavatele o doplnění se posílá samo — to je vědomá výjimka, ne výchozí chování. Ověřit, jestli je faktura uhrazená, potřebuje IT. Poslat účtárně k proplacení povoluje správce. Kroky 1 až 4 tedy tenhle projekt zvládá sám; poslední dva zůstávají nepostavené, protože jejich chyba se nevrátí."
        sx={{ display: 'block', width: '100%', minWidth: 700, height: 'auto' }}
      >
        <text x={20} y={22} fontSize={12.5} fontWeight={700} fill="currentColor" opacity={0.6}>
          OD POŠTY PO PROPLACENÍ — A KDE JSOU HRANICE
        </text>

        {KROKY.map((k, i) => {
          const sloupec = i % 3
          const rada = Math.floor(i / 3)
          const x = x0 + sloupec * (w + mezeraX)
          const y = y0 + rada * (h + mezeraY)
          const c = barva[k.stav]
          return (
            <g key={k.n}>
              <rect x={x} y={y} width={w} height={h} rx={9} fill={c} opacity={k.stav === 'it' ? 0.06 : 0.09} />
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={9}
                fill="none"
                stroke={c}
                strokeWidth={1.2}
                opacity={k.stav === 'it' ? 0.55 : 0.7}
              />
              <text x={x + 16} y={y + 28} fontSize={15} fontWeight={700} fill={c}>
                {k.n}
              </text>
              {k.titul.map((t, j) => (
                <text key={t} x={x + 16} y={y + 50 + j * 17} fontSize={13} fill="currentColor">
                  {t}
                </text>
              ))}
              <text x={x + 16} y={y + h - 14} fontSize={12} fontWeight={650} fill={c}>
                {POPIS[k.stav]}
              </text>
              {sloupec < 2 && i < KROKY.length - 1 ? (
                <g>
                  <line
                    x1={x + w + 3}
                    y1={y + h / 2}
                    x2={x + w + mezeraX - 4}
                    y2={y + h / 2}
                    stroke="currentColor"
                    strokeWidth={1.2}
                    opacity={0.4}
                  />
                  <polygon
                    points={`${x + w + mezeraX - 4},${y + h / 2} ${x + w + mezeraX - 9},${y + h / 2 - 3.5} ${x + w + mezeraX - 9},${y + h / 2 + 3.5}`}
                    fill="currentColor"
                    opacity={0.4}
                  />
                </g>
              ) : null}
            </g>
          )
        })}

        <path
          d={`M ${x0 + 3 * w + 2 * mezeraX - 20} ${y0 + h + 6} q 24 14 -24 14 H ${x0 + 20} q -24 0 -24 -14`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.3}
        />
        <polygon
          points={`${x0 - 4},${y0 + h + 14} ${x0 + 1},${y0 + h + 9} ${x0 + 1},${y0 + h + 19}`}
          fill="currentColor"
          opacity={0.3}
          transform={`rotate(90 ${x0 - 4} ${y0 + h + 14})`}
        />
        <text x={20} y={332} fontSize={13} fill={barva.hned} fontWeight={650}>
          Kroky 1–4 dnes běží samy.
        </text>
        <text x={196} y={332} fontSize={13} fill="currentColor" opacity={0.9}>
          Krok 4 je vědomá výjimka, ne výchozí nastavení pro cokoli, co jde ven z firmy.
        </text>
        <text x={20} y={358} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Špatná žádost o doplnění je trapná a dá se omluvit. Špatné „k proplacení“ se může doopravdy zaplatit —
        </text>
        <text x={20} y={376} fontSize={12.5} fill="currentColor" opacity={0.85}>
          proto kroky 5 a 6 zůstávají nepostavené, ne proto, že by technicky nešly.
        </text>
      </Box>
    </Box>
  )
}
