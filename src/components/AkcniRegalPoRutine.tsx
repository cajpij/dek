import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Akční regál celý od začátku do konce, s vyznačeným tím, co z něj vezme
 * naplánovaná automatizace.
 *
 * Protějšek k AkcniRegalFlow: ten ukazuje ruční proces a místa, kde to bolí,
 * tenhle tytéž kroky s odpovědí, kdo je po automatizaci dělá. Rozpadá se to
 * na tři routines, ne na jednu — proto svorky vlevo, ne barva na krabičce.
 *
 * Barvy drží význam z prvního obrázku: oranžová je místo, kde to vázne,
 * zelená je práce, která má člověku zůstat. Modrá je nová — to, co přebírá
 * automatizace.
 */

type Typ = 'clovek' | 'zadrhel' | 'routine' | 'zustava' | 'smiseny'
type Krok = { kdo: string; titul: string; detail: string[]; typ: Typ }

const KROKY: Krok[] = [
  {
    kdo: 'produkťáci',
    titul: 'Obsah magazínu do Google Tabulky',
    detail: ['jedenáct lidí zapisuje průběžně, zhruba šest týdnů předem', 'bez pevného termínu — proto se čeká, ne plánuje'],
    typ: 'clovek',
  },
  {
    kdo: 'logistika',
    titul: 'Export složeného listu do nasyncované složky',
    detail: ['jediný ruční krok, který zůstane: Claude bez konektoru vidí jen soubory ve složce', 'dokud tohle nepadne, nemá první automatizace odkud brát'],
    typ: 'zadrhel',
  },
  {
    kdo: '',
    titul: 'Rozpad na čtyři divizní Excely',
    detail: ['položky, min/max, sklad poboček a centrální sklad rozdělené podle divize'],
    typ: 'routine',
  },
  {
    kdo: '',
    titul: 'Rozeslání jedenácti produkťákům',
    detail: ['každý dostane svou sekci · do protokolu se zapíše, komu co odešlo'],
    typ: 'routine',
  },
  {
    kdo: 'produkťák',
    titul: 'Výběr pěti až deseti položek do regálu',
    detail: ['z padesáti, s prioritou a poznámkou', 'tohle je úsudek a ten nepřebírá nikdo'],
    typ: 'clovek',
  },
  {
    kdo: '',
    titul: 'Zápis odpovědí zpátky do hlavní tabulky',
    detail: ['i z print screenu — obrázek Claude přečte, takže nikdo nemusí měnit zvyk'],
    typ: 'routine',
  },
  {
    kdo: '',
    titul: 'Párování podle kódu položky, ne podle pořadí řádků',
    detail: ['když kód nesedí, pole zůstane prázdné a jde to do protokolu', 'tím zmizí „kontrola, že se nic neposunulo“ jako samostatná práce'],
    typ: 'routine',
  },
  {
    kdo: '',
    titul: 'Hlídání, od koho odpověď nepřišla',
    detail: ['po pár dnech připomínka · v dnešním procesu to není vůbec, drží to něčí hlava'],
    typ: 'routine',
  },
  {
    kdo: 'logistika',
    titul: 'Fyzické vzorování v regálu',
    detail: ['vejdou se tři kufry vedle sebe? měrnou jednotkou je vrtačka, ne kufr', 'fotka je důkaz proti datům — tenhle krok se automatizovat nemá'],
    typ: 'zustava',
  },
  {
    kdo: 'schvaluje člověk',
    titul: 'Návrh min/max a schválení',
    detail: ['automatizace předpočítá z prodejů za dvanáct měsíců', 'člověk potvrdí a upraví podle dohod s dodavateli'],
    typ: 'smiseny',
  },
  {
    kdo: '',
    titul: 'Tři finální podklady',
    detail: ['Word a Excel pro marketing · Excel pro centrální sklad · Excel pro backoffice'],
    typ: 'routine',
  },
]

/** Svorky vlevo: která automatizace které kroky drží. */
const SVORKY = [
  { od: 2, do: 3, label: 'ROUTINE A', pozn: 'rozeslat' },
  { od: 5, do: 7, label: 'ROUTINE B', pozn: 'posbírat zpátky' },
  { od: 9, do: 10, label: 'ROUTINE C', pozn: 'vygenerovat' },
]

const Y0 = 54
const MEZERA = 24
/** Krabička je vysoká podle toho, kolik má řádků — jinak zbývá dole díra. */
const vyskaKroku = (k: Krok) => 30 + k.detail.length * 18
const yKroku = (i: number) =>
  KROKY.slice(0, i).reduce((y, k) => y + vyskaKroku(k) + MEZERA, Y0)
const dnoKroku = (i: number) => yKroku(i) + vyskaKroku(KROKY[i])

export default function AkcniRegalPoRutine() {
  const c = useFigureColors()
  const bot = c.primary
  const hot = c.warning
  const keep = c.success
  const konec = dnoKroku(KROKY.length - 1) + 24

  return (
    <Box
      component="svg"
      viewBox={`0 0 920 ${konec + 130}`}
      role="img"
      aria-label="Celý proces akčního regálu od začátku do konce v jedenácti krocích, u každého je napsané, kdo ho po automatizaci dělá. Produkťáci zapisují obsah magazínu do Google Tabulky a logistika z ní exportuje složený list do nasyncované složky — tenhle ruční krok zůstává a je oranžový, protože bez něj nemá automatizace odkud brát. Routine A pak rozpadne data na čtyři divizní Excely a rozešle je jedenácti produkťákům. Produkťák vybere pět až deset položek, což je úsudek a ten nikdo nepřebírá. Routine B zapíše odpovědi zpátky do tabulky včetně těch poslaných jako print screen, páruje je podle kódu položky místo podle pořadí řádků a hlídá, od koho odpověď nepřišla. Fyzické vzorování v regálu je zelené, zůstává člověku, protože měrné jednotky lžou a fotka je důkaz proti datům. Návrh min a max automatizace předpočítá, ale schvaluje ho člověk. Routine C nakonec vygeneruje tři finální podklady pro marketing, centrální sklad a backoffice."
      sx={{ display: 'block', width: '100%', minWidth: 780, height: 'auto' }}
    >
      <text
        x={196}
        y={22}
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize={11.5}
        letterSpacing={1.6}
        fill="currentColor"
        opacity={0.75}
      >
        KROK ZA KROKEM — A KDO HO DĚLÁ POTOM
      </text>

      {/* páteř */}
      <line
        x1={182}
        y1={Y0 - 12}
        x2={182}
        y2={konec - 8}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.25}
      />

      {SVORKY.map((s) => {
        const y1 = yKroku(s.od) - 4
        const y2 = dnoKroku(s.do) + 4
        return (
          <g key={s.label}>
            <path
              d={`M 152 ${y1} L 140 ${y1} L 140 ${y2} L 152 ${y2}`}
              fill="none"
              stroke={bot}
              strokeWidth={1.6}
            />
            <text
              x={128}
              y={(y1 + y2) / 2 - 5}
              textAnchor="end"
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize={11}
              letterSpacing={1.1}
              fontWeight={700}
              fill={bot}
            >
              {s.label}
            </text>
            <text x={128} y={(y1 + y2) / 2 + 11} textAnchor="end" fontSize={12} fill={bot} opacity={0.8}>
              {s.pozn}
            </text>
          </g>
        )
      })}

      {KROKY.map((k, i) => {
        const y = yKroku(i)
        const h = vyskaKroku(k)
        const barva = k.typ === 'routine' ? bot : k.typ === 'zadrhel' ? hot : k.typ === 'zustava' ? keep : 'currentColor'
        const silne = k.typ === 'routine' || k.typ === 'zadrhel' || k.typ === 'zustava'
        return (
          <g key={k.titul}>
            <circle cx={182} cy={y + 17} r={4.5} fill={silne ? barva : 'currentColor'} opacity={silne ? 1 : 0.4} />
            <rect
              x={196}
              y={y}
              width={706}
              height={h}
              rx={4}
              fill="none"
              stroke={barva}
              strokeWidth={silne ? 1.8 : 1}
              strokeDasharray={k.typ === 'zustava' ? '6 4' : undefined}
              opacity={silne ? 1 : 0.45}
            />
            {k.kdo ? (
              <text
                x={886}
                y={y + 20}
                textAnchor="end"
                fontFamily="ui-monospace, Menlo, monospace"
                fontSize={10.5}
                letterSpacing={0.8}
                fill={barva}
                opacity={k.typ === 'clovek' ? 0.6 : 0.9}
              >
                {k.kdo.toUpperCase()}
              </text>
            ) : null}
            <text x={216} y={y + 24} fontSize={14.5} fontWeight={700} fill={barva} opacity={silne ? 1 : 0.85}>
              {k.titul}
            </text>
            {k.detail.map((r, j) => (
              <text
                key={r}
                x={216}
                y={y + 43 + j * 16}
                fontSize={12.5}
                fill={silne ? barva : 'currentColor'}
                opacity={silne ? 0.85 : 0.6}
              >
                {r}
              </text>
            ))}
          </g>
        )
      })}

      {/* výstupy */}
      <line x1={182} y1={konec - 8} x2={182} y2={konec + 14} stroke="currentColor" strokeWidth={1} opacity={0.25} />
      <rect x={196} y={konec + 2} width={706} height={78} rx={4} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.45} />
      <text
        x={216}
        y={konec + 24}
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize={11}
        letterSpacing={1.4}
        fill="currentColor"
        opacity={0.6}
      >
        VÝSTUPY
      </text>
      <text x={216} y={konec + 46} fontSize={13} fill="currentColor" opacity={0.8}>
        Marketing — na web · Centrální sklad — naskladnění · Backoffice — nastavení poboček
      </text>
      <text x={216} y={konec + 66} fontSize={12.5} fill="currentColor" opacity={0.6}>
        Tři soubory z jednoho schváleného zdroje, ne tři ručně skládané verze téhož.
      </text>
    </Box>
  )
}
