import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Průběh jednoho běhu skillu kontrola-faktur.
 *
 * Pointa obrázku není řada kroků — ta je nudná a dá se přečíst v textu.
 * Pointa je to rozcestí dole: počet chybějících údajů rozhoduje, jestli se
 * dodavateli píše, nebo jestli to jde na člověka. Proto mají tři výstupy
 * vlastní barvu a horní kroky žádnou.
 *
 * Kreslí se ručně místo knihovny na diagramy — je to jeden konkrétní
 * obrázek, který se nemění, a takhle se chová k motivu: čáry a text jdou
 * z currentColor, barvu mají jen místa, o která v tom zadání jde.
 */

type Krok = { n: string; titul: string; detail: string }

const KROKY: Krok[] = [
  {
    n: '1',
    titul: 'Do schránky přijde e-mail s fakturou v PDF',
    detail: 'automatizace se dívá každých 15 minut · bez konektoru bere místo toho PDF, která leží ve vstup/',
  },
  {
    n: '2',
    titul: 'Fakturu uloží do vstup/',
    detail: '<datum>_<dodavatel>.pdf · přibýt smí, přepsat ani smazat ne — hlídá to hook',
  },
  {
    n: '3',
    titul: 'Z PDF vytáhne šest údajů, jeden po druhém',
    detail: 'číslo faktury · dodavatel · IČO · číslo objednávky · základ daně bez DPH · splatnost',
  },
  {
    n: '4',
    titul: 'Zapíše je do data/objednavky.xlsx',
    detail: 'sešit pojmenovaný jménem dodavatele z faktury · co se nepřečetlo, zůstane prázdné',
  },
]

type Vetev = { znacka: string; titul: string; radky: string[]; stav: 'hotovo' | 'posle' | 'clovek' }

const VETVE: Vetev[] = [
  {
    znacka: 'nechybí nic',
    titul: 'Hotovo',
    radky: ['Faktura je zaevidovaná', 'a čeká na člověka,', 'který rozhodne o proplacení.', '', 'Nevzniká výstup', 'a neodchází žádná zpráva.'],
    stav: 'hotovo',
  },
  {
    znacka: 'chybí 1 nebo 2',
    titul: 'Píše se dodavateli',
    radky: [
      'vystup/kontrola-<datum>.xlsx:',
      'sešit „Přehled“ a sešit dodavatele',
      's navrženým textem.',
      '',
      'Ten text odejde e-mailem a čas',
      'se zapíše na tři místa — do obou',
      'sešitů a do sloupce Žádost odeslána.',
    ],
    stav: 'posle',
  },
  {
    znacka: 'chybí 3 a víc',
    titul: 'Zůstává na člověku',
    radky: [
      'Totéž, když z PDF nejde',
      'přečíst text vůbec.',
      '',
      'Do protokolu jde „k ruční kontrole“',
      'a neodchází nic. Tolik prázdných polí',
      'je spíš špatně přečtené PDF',
      'než špatná faktura.',
    ],
    stav: 'clovek',
  },
]

export default function KontrolaFlow() {
  const c = useFigureColors()
  const barva: Record<Vetev['stav'], string> = {
    hotovo: c.success,
    // Jediná větev, ze které něco odchází ven z firmy — vlastní barva,
    // ne zelená jako „hotovo“, aby nevypadala jako bezriziková.
    posle: c.info,
    clovek: c.warning,
  }

  const w = 860
  const h = 54
  const rozestup = 68
  const y0 = 48
  const yRozcesti = y0 + KROKY.length * rozestup + 16
  const yVetve = yRozcesti + 44
  const vw = 270
  const vh = 176

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
        viewBox="0 0 900 640"
        role="img"
        aria-label="Průběh jednoho běhu kontroly faktur. Nejdřív čtyři kroky za sebou: do schránky přijde e-mail s fakturou v PDF; faktura se uloží do složky vstup, kam smí jen přibývat; z PDF se vytáhne šest údajů, tedy číslo faktury, dodavatel, IČO, číslo objednávky, základ daně bez DPH a splatnost; a ty se zapíšou do souboru objednavky.xlsx do sešitu pojmenovaného jménem dodavatele. Pak se běh rozdělí podle toho, kolik ze šesti údajů chybí. Když nechybí nic, je hotovo a neodchází žádná zpráva. Když chybí jeden nebo dva, vznikne soubor kontrola s navrženým textem, ten text odejde dodavateli e-mailem a čas odeslání se zapíše na tři místa. Když chybí tři a víc, nebo z PDF vůbec nejde přečíst text, neodchází nic a případ jde do protokolu k ruční kontrole."
        sx={{ display: 'block', width: '100%', minWidth: 760, height: 'auto' }}
      >
        <defs>
          <marker id="kf-sipka" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity={0.45} />
          </marker>
        </defs>

        <text x={20} y={22} fontSize={12.5} fontWeight={700} fill="currentColor" opacity={0.6}>
          JEDEN BĚH SKILLU KONTROLA-FAKTUR
        </text>

        {KROKY.map((k, i) => {
          const y = y0 + i * rozestup
          return (
            <g key={k.n}>
              <rect x={20} y={y} width={w} height={h} rx={9} fill="currentColor" opacity={0.045} />
              <rect x={20} y={y} width={w} height={h} rx={9} fill="none" stroke="currentColor" strokeWidth={1.1} opacity={0.28} />
              <text x={38} y={y + 23} fontSize={14} fontWeight={700} fill="currentColor" opacity={0.55}>
                {k.n}
              </text>
              <text x={58} y={y + 23} fontSize={13.5} fontWeight={650} fill="currentColor" opacity={0.95}>
                {k.titul}
              </text>
              <text x={58} y={y + 42} fontSize={12} fill="currentColor" opacity={0.7}>
                {k.detail}
              </text>
              <line
                x1={450}
                y1={y + h + 2}
                x2={450}
                y2={y + rozestup - 3}
                stroke="currentColor"
                strokeWidth={1.2}
                opacity={0.45}
                markerEnd="url(#kf-sipka)"
              />
            </g>
          )
        })}

        <text x={450} y={yRozcesti + 6} textAnchor="middle" fontSize={13.5} fontWeight={700} fill="currentColor" opacity={0.9}>
          Kolik ze šesti údajů chybí?
        </text>

        <path
          d={`M 155 ${yVetve - 22} H 745`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.35}
        />
        <line x1={450} y1={yRozcesti + 14} x2={450} y2={yVetve - 22} stroke="currentColor" strokeWidth={1.2} opacity={0.35} />

        {VETVE.map((v, i) => {
          const x = 20 + i * (vw + 25)
          const stred = x + vw / 2
          const col = barva[v.stav]
          return (
            <g key={v.titul}>
              <line
                x1={stred}
                y1={yVetve - 22}
                x2={stred}
                y2={yVetve - 4}
                stroke="currentColor"
                strokeWidth={1.2}
                opacity={0.45}
                markerEnd="url(#kf-sipka)"
              />
              <rect x={x} y={yVetve} width={vw} height={vh} rx={9} fill={col} opacity={0.08} />
              <rect x={x} y={yVetve} width={vw} height={vh} rx={9} fill="none" stroke={col} strokeWidth={1.2} opacity={0.7} />
              <text x={x + 16} y={yVetve + 24} fontSize={12} fontWeight={700} fill={col}>
                {v.znacka}
              </text>
              <text x={x + 16} y={yVetve + 46} fontSize={14} fontWeight={700} fill="currentColor" opacity={0.95}>
                {v.titul}
              </text>
              {v.radky.map((r, j) => (
                <text key={`${v.titul}-${j}`} x={x + 16} y={yVetve + 68 + j * 15} fontSize={11.5} fill="currentColor" opacity={0.82}>
                  {r}
                </text>
              ))}
            </g>
          )
        })}

        <text x={20} y={628} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Prostřední větev je jediná, ze které něco odchází ven z firmy — a jen žádost o doplnění údaje na faktuře.
        </text>
      </Box>
    </Box>
  )
}
