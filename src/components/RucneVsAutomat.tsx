import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Co z ručního procesu převzala úloha a co zůstalo člověku.
 *
 * Pointa není v krocích — ta je vidět jinde. Pointa je ten řez uprostřed:
 * nad ním to dělá úloha, pod ním člověk, a je to rozhodnutí, ne nedodělek.
 * Proto řez místo štítku u každého řádku: šestkrát zopakovaná nálepka
 * říká totéž co jedna čára, jen hlučněji.
 */

type Radek = { krok: string; kdo: string; drive: string[]; ted: string[] }

const AUTOMAT: Radek[] = [
  {
    krok: 'Faktura přijde',
    kdo: 'dodavatel → Marie',
    drive: ['Marie ji musí najít ve schránce mezi', 'desítkami zpráv a stáhnout přílohu.'],
    ted: ['Úloha kouká do schránky každých 15 minut', 'a PDF uloží do vstup/ pod datem', 'a jménem dodavatele.'],
  },
  {
    krok: 'Šest údajů',
    kdo: 'Marie',
    drive: ['Přepis z PDF do tabulky,', 'řádek po řádku.'],
    ted: ['Vytáhne je z PDF a zapíše do', 'objednavky.xlsx, do sešitu pojmenovaného', 'jménem dodavatele z faktury.'],
  },
  {
    krok: 'Chybí údaj',
    kdo: 'Marie → dodavatel',
    drive: ['Marie napíše dodavateli a čeká.', 'E-mail chodí tam a zpět.'],
    ted: ['Chybí-li jeden nebo dva: text vznikne', 'v kontrola-<datum>.xlsx a týmž textem', 'odejde e-mail. Čas se zapíše na tři místa.'],
  },
]

const CLOVEK: Radek[] = [
  {
    krok: 'Nečitelná faktura',
    kdo: 'Marie',
    drive: ['Nerozlišovalo se — Marie řešila', 'každou zvlášť.'],
    ted: ['Chybí tři a víc údajů nebo z PDF nejde', 'přečíst text: neodchází nic, jde to', 'do protokolu k ruční kontrole.'],
  },
  {
    krok: 'Předání účtárně',
    kdo: 'Marie → účtárna',
    drive: ['Marie posílala dál i faktury,', 'kterým něco chybělo — a řešilo se to', 'až v účtárně.'],
    ted: ['Přepošle až tu, která prošla celým', 'během: je kompletní a zaevidovaná.', 'Účtárna nedostane nic k vracení.'],
  },
  {
    krok: 'Schválení a platba',
    kdo: 'účtárna a středisko',
    drive: ['Vedoucí odklikne, účetní zadá', 'fakturu do systému.'],
    ted: ['Beze změny, a schválně. Špatnou žádost', 'o doplnění lze omluvit, špatně zaplacenou', 'fakturu nikdo nevrátí.'],
  },
]

const X_KROK = 20
const X_A = 188
const X_B = 528
const W = 302
const RADEK_VYSKA = 17
const PADDING = 34
const MEZERA = 14
const REZ = 46

const vyskaRadku = (r: Radek) => Math.max(r.drive.length, r.ted.length) * RADEK_VYSKA + PADDING

export default function RucneVsAutomat() {
  const c = useFigureColors()
  const rucne = c.warning
  const uloha = c.success
  const clovek = c.textSecondary

  let y = 72
  const rozvrzeni: { r: Radek; y: number; h: number; auto: boolean }[] = []
  for (const r of AUTOMAT) {
    const h = vyskaRadku(r)
    rozvrzeni.push({ r, y, h, auto: true })
    y += h + MEZERA
  }
  const yRez = y + 4
  y += REZ
  for (const r of CLOVEK) {
    const h = vyskaRadku(r)
    rozvrzeni.push({ r, y, h, auto: false })
    y += h + MEZERA
  }
  const H = y + 34

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
        viewBox={`0 0 900 ${H}`}
        role="img"
        aria-label="Srovnání toho, co Marie dělala ručně, a co dělá hotová úloha, v šesti krocích rozdělených řezem. Nad řezem tři kroky, které převzala úloha: fakturu dřív musela Marie najít ve schránce a stáhnout, teď se do schránky dívá úloha každých 15 minut a PDF uloží do složky vstup. Šest údajů dřív přepisovala z PDF do tabulky, teď je úloha vytáhne a zapíše do objednavky.xlsx do sešitu podle dodavatele. Když údaj chyběl, Marie psala dodavateli a čekala; teď při jednom nebo dvou chybějících vznikne text v souboru kontrola a týmž textem odejde e-mail, čas se zapíše na tři místa. Pod řezem tři kroky, které zůstávají lidem: nečitelná faktura nebo tři a víc chybějících údajů jde do protokolu k ruční kontrole a neodchází nic; předání účtárně dělá Marie, ale teprve u faktury, která prošla celým během a je kompletní a zaevidovaná; a schválení s platbou zůstávají na účtárně a středisku beze změny, protože špatnou žádost o doplnění lze omluvit, ale špatně zaplacenou fakturu nikdo nevrátí."
        sx={{ display: 'block', width: '100%', minWidth: 780, height: 'auto' }}
      >
        <defs>
          <marker id="rva-sipka" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity={0.35} />
          </marker>
        </defs>

        <text x={X_A} y={30} fontSize={12} fontWeight={700} fill={rucne} letterSpacing={1.5}>
          DŘÍV — RUČNĚ
        </text>
        <text x={X_B} y={30} fontSize={12} fontWeight={700} fill={uloha} letterSpacing={1.5}>
          TEĎ
        </text>
        <line x1={X_KROK} y1={46} x2={880} y2={46} stroke="currentColor" strokeWidth={1} opacity={0.22} />

        {rozvrzeni.map(({ r, y: ry, h, auto }) => {
          const col = auto ? uloha : clovek
          const stred = ry + h / 2
          return (
            <g key={r.krok}>
              <text x={X_KROK} y={ry + 22} fontSize={13.5} fontWeight={700} fill="currentColor" opacity={0.95}>
                {r.krok}
              </text>
              <text x={X_KROK} y={ry + 40} fontSize={11} fill="currentColor" opacity={0.55}>
                {r.kdo}
              </text>

              <rect x={X_A} y={ry} width={W} height={h} rx={10} fill={rucne} opacity={0.055} />
              {r.drive.map((s, j) => (
                <text key={`d${j}`} x={X_A + 18} y={ry + 26 + j * RADEK_VYSKA} fontSize={12} fill="currentColor" opacity={0.7}>
                  {s}
                </text>
              ))}

              <line
                x1={X_A + W + 8}
                y1={stred}
                x2={X_B - 8}
                y2={stred}
                stroke="currentColor"
                strokeWidth={1.2}
                opacity={0.35}
                markerEnd="url(#rva-sipka)"
              />

              <rect x={X_B} y={ry} width={W} height={h} rx={10} fill={col} opacity={auto ? 0.1 : 0.04} />
              <rect
                x={X_B}
                y={ry}
                width={W}
                height={h}
                rx={10}
                fill="none"
                stroke={col}
                strokeWidth={auto ? 1.6 : 1.2}
                opacity={auto ? 0.75 : 0.45}
                strokeDasharray={auto ? undefined : '5 4'}
              />
              {r.ted.map((s, j) => (
                <text key={`t${j}`} x={X_B + 18} y={ry + 26 + j * RADEK_VYSKA} fontSize={12} fill="currentColor" opacity={0.88}>
                  {s}
                </text>
              ))}
            </g>
          )
        })}

        {/* Řez: nad ním to dělá úloha, pod ním člověk. */}
        <line x1={X_KROK} y1={yRez + 14} x2={352} y2={yRez + 14} stroke={clovek} strokeWidth={1} opacity={0.3} />
        <text x={368} y={yRez + 19} fontSize={11.5} fontWeight={700} fill={clovek} letterSpacing={1.2} opacity={0.85}>
          ODSUD DÁL ZŮSTÁVÁ ČLOVĚKU
        </text>
        <line x1={636} y1={yRez + 14} x2={880} y2={yRez + 14} stroke={clovek} strokeWidth={1} opacity={0.3} />

        <text x={X_KROK} y={H - 10} fontSize={12} fill="currentColor" opacity={0.8}>
          Krok „dohledání objednávky“ v nové podobě není: úloha eviduje, co přišlo, a proti schváleným objednávkám to neporovnává.
        </text>
      </Box>
    </Box>
  )
}
