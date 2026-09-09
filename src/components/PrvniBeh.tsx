import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Co po prvním spuštění přibude ve složce.
 *
 * Není to postup — ten kreslí kontrola-flow. Tohle je seznam výsledků, na
 * kterém si člověk ověří, že mu vyšlo totéž co ve vzoru. Poslední řádek je
 * ten nejdůležitější: prázdná odeslaná pošta není chyba běhu.
 */

type Radek = { cesta: string; popis: string[]; stav: 'zmena' | 'beze' | 'pozor' }

const RADKY: Radek[] = [
  { cesta: 'vstup/', popis: ['beze změny — pět faktur, co tam ležely'], stav: 'beze' },
  {
    cesta: 'data/objednavky.xlsx',
    popis: ['pět sešitů podle dodavatelů, každý s jedním řádkem;', 'před spuštěním tam byly jen hlavičky sloupců'],
    stav: 'zmena',
  },
  {
    cesta: 'vystup/kontrola-<datum>.xlsx',
    popis: ['sešit „Přehled" a sešit „Elektro Dvořák" s hotovým', 'textem žádosti o doplnění čísla objednávky'],
    stav: 'zmena',
  },
  {
    cesta: 'vystup/protokol-<datum>.md',
    popis: ['pět faktur, čtyři kompletní, jedna k doplnění'],
    stav: 'zmena',
  },
  {
    cesta: 'odeslaná pošta',
    popis: ['prázdná. Bez konektoru se e-mail jen navrhne a do evidence', 'se zapíše „připraveno, čeká na konektor" — to je správný konec.'],
    stav: 'pozor',
  },
]

export default function PrvniBeh() {
  const c = useFigureColors()
  const barva: Record<Radek['stav'], string> = {
    zmena: c.success,
    beze: c.textSecondary,
    pozor: c.info,
  }

  const y0 = 62
  const rozestup = 56

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
        viewBox="0 0 900 356"
        role="img"
        aria-label="Co najdeš ve složce po prvním spuštění. Složka vstup beze změny, pět faktur, které tam ležely. Soubor data/objednavky.xlsx má pět sešitů podle dodavatelů, každý s jedním řádkem, přitom před spuštěním tam byly jen hlavičky sloupců. Ve složce vystup přibyl soubor kontrola s dnešním datem, v něm sešit Přehled a sešit Elektro Dvořák s hotovým textem žádosti o doplnění čísla objednávky, a protokol s dnešním datem shrnující pět faktur, z toho čtyři kompletní a jednu k doplnění. Odeslaná pošta zůstává prázdná: bez konektoru se e-mail jen navrhne a do evidence se zapíše připraveno, čeká na konektor, což je správný konec běhu, ne chyba."
        sx={{ display: 'block', width: '100%', minWidth: 700, height: 'auto' }}
      >
        <text x={20} y={26} fontSize={12.5} fontWeight={700} fill="currentColor" opacity={0.6} letterSpacing={1.2}>
          PO PRVNÍM SPUŠTĚNÍ NAJDEŠ VE SLOŽCE
        </text>
        <line x1={20} y1={40} x2={880} y2={40} stroke="currentColor" strokeWidth={1} opacity={0.22} />

        {RADKY.map((r, i) => {
          const y = y0 + i * rozestup
          const col = barva[r.stav]
          return (
            <g key={r.cesta}>
              <circle cx={30} cy={y + 4} r={4.5} fill={col} opacity={r.stav === 'beze' ? 0.45 : 0.9} />
              <text
                x={48}
                y={y + 9}
                fontSize={12.5}
                fontWeight={700}
                fill={col}
                fontFamily="ui-monospace, Menlo, monospace"
              >
                {r.cesta}
              </text>
              {r.popis.map((t, j) => (
                <text key={j} x={330} y={y + 9 + j * 16} fontSize={12} fill="currentColor" opacity={0.85}>
                  {t}
                </text>
              ))}
            </g>
          )
        })}

        <text x={20} y={344} fontSize={12} fill="currentColor" opacity={0.85}>
          Porovnej to s tím, co ve vystup/ leželo předtím. Musí vyjít tentýž jeden nález — pak projektu můžeš začít věřit.
        </text>
      </Box>
    </Box>
  )
}
