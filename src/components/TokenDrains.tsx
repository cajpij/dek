import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Čtyři místa, kudy odtéká příděl.
 *
 * Úvodní obrázek lekce: než se začne mluvit o příkazech, má být vidět, že
 * skoro všechno drahé má jednu ze čtyř příčin. Zbytek lekce pak jde po nich
 * v tomhle pořadí.
 *
 * Kreslené, ne odchycený obrázek — kvůli češtině, tmavému tématu a tomu, že
 * to zestárne až ve chvíli, kdy přestanou platit ty čtyři příčiny.
 */

type Card = {
  n: string
  title: string[]
  body: string[]
  /** Vlastní minigraf pod textem, kreslený relativně k levému hornímu rohu karty. */
  art: (x: number, y: number, color: string, dim: string) => React.ReactNode
}

const CARD_W = 410
const CARD_H = 280
const PAD = 22

export default function TokenDrains() {
  const c = useFigureColors()
  const c1 = c.primary
  const c2 = c.info
  const c3 = c.success
  const c4 = c.warning
  const dim = c.textDisabled

  const cards: Card[] = [
    {
      n: '1',
      title: ['Dlouhá sezení'],
      body: [
        'Každá zpráva posílá znovu všechno, co bylo',
        'před ní. Tady odteče většina tokenů celého',
        'sezení.',
      ],
      art: (x, y, color) => (
        <g>
          {[110, 170, 235, 300].map((w, i) => (
            <g key={w}>
              <rect x={x} y={y + i * 18} width={w} height={11} rx={5} fill={color} opacity={0.3} />
              <rect x={x + w + 4} y={y + i * 18} width={18} height={11} rx={4} fill={color} opacity={0.95} />
            </g>
          ))}
          <text x={x} y={y + 4 * 18 + 12} fontSize={11.5} fill={color} opacity={0.85}>
            světlé = posíláno znovu · tmavé = nová zpráva
          </text>
        </g>
      ),
    },
    {
      n: '2',
      title: ['Moc věcí v kontextu'],
      body: [
        'Soubory, které Claude nepotřeboval, upovídané',
        'výpisy, zbytky po minulé úloze, konektory, co',
        'nepoužíváš. Všechno se posílá při každé zprávě.',
      ],
      art: (x, y, color) => (
        <g>
          <rect x={x} y={y} width={46} height={14} rx={4} fill={color} opacity={0.95} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={x + 54 + i * 54}
              y={y}
              width={46}
              height={14}
              rx={4}
              fill="currentColor"
              opacity={0.18}
            />
          ))}
          <text x={x} y={y + 32} fontSize={11.5} fill={color} opacity={0.9}>
            potřeba
          </text>
          <text x={x + 90} y={y + 32} fontSize={11.5} fill="currentColor" opacity={0.6}>
            veze se s tím
          </text>
        </g>
      ),
    },
    {
      n: '3',
      title: ['Větší model nebo effort,', 'než úloha potřebuje'],
      body: [
        'Násobí se tím všechno ostatní — a obě nastavení',
        'zůstávají zapnutá i do dalších sezení.',
      ],
      art: (x, y, color) => (
        <g>
          <rect x={x} y={y} width={80} height={13} rx={4} fill={color} opacity={0.9} />
          <text x={x + 92} y={y + 11} fontSize={12} fontFamily="ui-monospace, Menlo, monospace" fill="currentColor">
            ×1 co úloha potřebuje
          </text>
          <rect x={x} y={y + 24} width={330} height={13} rx={4} fill={color} opacity={0.55} />
          <text
            x={x}
            y={y + 56}
            fontSize={12}
            fontFamily="ui-monospace, Menlo, monospace"
            fill="currentColor"
            opacity={0.85}
          >
            ×5 když sáhneš výš, než je třeba
          </text>
        </g>
      ),
    },
    {
      n: '4',
      title: ['Rozbitá cache'],
      body: [
        'Změna modelu, effortu nebo fast mode uprostřed',
        'práce — nebo návrat, když už cache vypršela —',
        'nechá celou konverzaci projít znovu plnou cenou.',
      ],
      art: (x, y, color) => (
        <g>
          <rect x={x} y={y} width={210} height={13} rx={4} fill={color} opacity={0.3} />
          <text x={x + 222} y={y + 11} fontSize={12} fontFamily="ui-monospace, Menlo, monospace" fill="currentColor">
            z cache · ×0,1
          </text>
          <rect x={x} y={y + 24} width={210} height={13} rx={4} fill={color} opacity={0.95} />
          <text
            x={x + 222}
            y={y + 35}
            fontSize={12}
            fontFamily="ui-monospace, Menlo, monospace"
            fill="currentColor"
          >
            znovu · ×1
          </text>
        </g>
      ),
    },
  ]

  const colors = [c1, c2, c3, c4]

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
        viewBox="0 0 900 614"
        role="img"
        aria-label="Čtyři místa, kudy odtéká příděl. Za prvé dlouhá sezení: každá zpráva posílá znovu všechno před sebou. Za druhé moc věcí v kontextu: nepotřebné soubory, upovídané výpisy, zbytky po minulé úloze a nepoužívané konektory. Za třetí větší model nebo vyšší effort, než úloha potřebuje — násobí se tím všechno ostatní. Za čtvrté rozbitá cache: změna modelu, effortu nebo fast mode uprostřed práce nechá celou konverzaci projít znovu plnou cenou místo desetiny."
        sx={{ display: 'block', width: '100%', minWidth: 720, height: 'auto' }}
      >
        {cards.map((card, i) => {
          const x = 20 + (i % 2) * (CARD_W + 30)
          const y = 16 + Math.floor(i / 2) * (CARD_H + 26)
          const color = colors[i]
          return (
            <g key={card.n}>
              <rect
                x={x}
                y={y}
                width={CARD_W}
                height={CARD_H}
                rx={12}
                fill="currentColor"
                opacity={0.045}
              />
              <text x={x + PAD} y={y + 44} fontSize={26} fontWeight={700} fill={color}>
                {card.n}
              </text>
              {card.title.map((line, k) => (
                <text
                  key={line}
                  x={x + PAD}
                  y={y + 80 + k * 22}
                  fontSize={15.5}
                  fontWeight={700}
                  fill="currentColor"
                >
                  {line}
                </text>
              ))}
              {card.body.map((line, k) => (
                <text
                  key={line}
                  x={x + PAD}
                  y={y + 80 + card.title.length * 22 + 14 + k * 20}
                  fontSize={13.5}
                  fill="currentColor"
                  opacity={0.85}
                >
                  {line}
                </text>
              ))}
              {card.art(x + PAD, y + 80 + card.title.length * 22 + 14 + card.body.length * 20 + 16, color, dim)}
            </g>
          )
        })}
      </Box>
    </Box>
  )
}
