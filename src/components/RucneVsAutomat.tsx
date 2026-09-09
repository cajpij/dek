import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Co z ručního procesu převzala úloha a co zůstalo člověku.
 *
 * Navazuje na regal-flow: ten kreslí proces, jak vypadal bez automatizace,
 * tenhle ho staví vedle toho, co dělá hotová úloha z cvičného projektu.
 * Pointa nejsou kroky — ta je vidět jinde. Pointa je poslední sloupec:
 * dva řádky zůstávají člověku a je to rozhodnutí, ne nedodělek.
 */

type Radek = {
  krok: string
  kdo: string
  drive: string[]
  ted: string[]
  stav: 'automat' | 'clovek'
}

const RADKY: Radek[] = [
  {
    krok: 'Faktura přijde',
    kdo: 'dodavatel → účtárna',
    drive: ['Účetní ji musí najít ve schránce mezi', 'desítkami zpráv a stáhnout přílohu.'],
    ted: ['Úloha kouká do schránky každých 15 minut', 'a PDF uloží do vstup/ pod datem', 'a jménem dodavatele.'],
    stav: 'automat',
  },
  {
    krok: 'Šest údajů',
    kdo: 'účtárna',
    drive: ['Přepis z PDF do kontrolní tabulky,', 'řádek po řádku.'],
    ted: ['Vytáhne je z PDF a zapíše do', 'objednavky.xlsx, do sešitu pojmenovaného', 'jménem dodavatele z faktury.'],
    stav: 'automat',
  },
  {
    krok: 'Chybí údaj',
    kdo: 'účtárna → dodavatel',
    drive: ['Účetní napíše dodavateli a čeká.', 'E-mail chodí tam a zpět.'],
    ted: ['Chybí-li jeden nebo dva: text vznikne', 'v kontrola-<datum>.xlsx a týmž textem', 'odejde e-mail. Čas se zapíše na tři místa.'],
    stav: 'automat',
  },
  {
    krok: 'Nečitelná faktura',
    kdo: 'účtárna',
    drive: ['Nerozlišovalo se — účetní řešila', 'každou zvlášť.'],
    ted: ['Chybí tři a víc údajů nebo z PDF nejde', 'přečíst text: neodchází nic, jde to', 'do protokolu k ruční kontrole.'],
    stav: 'clovek',
  },
  {
    krok: 'Schválení',
    kdo: 'středisko',
    drive: ['Vedoucí odklikne, účetní zapíše', 'odpověď zpátky do tabulky.'],
    ted: ['Beze změny. Úloha do schvalování', 'vůbec nesahá.'],
    stav: 'clovek',
  },
  {
    krok: 'Zadání k platbě',
    kdo: 'účtárna',
    drive: ['Účetní zadá fakturu ručně', 'do účetního systému.'],
    ted: ['Beze změny, a schválně. Špatnou žádost', 'o doplnění lze omluvit, špatně zaplacenou', 'fakturu nikdo nevrátí.'],
    stav: 'clovek',
  },
]

export default function RucneVsAutomat() {
  const c = useFigureColors()
  const rucne = c.warning
  const barva: Record<Radek['stav'], string> = { automat: c.success, clovek: c.textSecondary }
  const stitek: Record<Radek['stav'], string> = { automat: 'DĚLÁ ÚLOHA', clovek: 'ZŮSTÁVÁ ČLOVĚKU' }

  const xKrok = 20
  const xA = 210
  const xB = 552
  const w = 328
  const h = 96
  const rozestup = 108
  const y0 = 76

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
        viewBox="0 0 900 762"
        role="img"
        aria-label="Srovnání ručního procesu a hotové úlohy v šesti krocích. Faktura přijde: dřív ji účetní hledala ve schránce a stahovala, teď úloha kouká do schránky každých 15 minut a PDF uloží do složky vstup — dělá úloha. Šest údajů: dřív přepis z PDF do tabulky, teď je vytáhne a zapíše do objednavky.xlsx do sešitu podle dodavatele — dělá úloha. Chybí údaj: dřív účetní psala dodavateli a čekala, teď při jednom nebo dvou chybějících vznikne text v souboru kontrola a týmž textem odejde e-mail, čas se zapíše na tři místa — dělá úloha. Nečitelná faktura: dřív se nerozlišovalo, teď při třech a více chybějících údajích nebo nečitelném PDF neodchází nic a případ jde do protokolu k ruční kontrole — zůstává člověku. Schválení vedoucím střediska a zadání k platbě zůstávají beze změny na člověku, protože špatně zaplacenou fakturu nikdo nevrátí."
        sx={{ display: 'block', width: '100%', minWidth: 780, height: 'auto' }}
      >
        <text x={xA} y={30} fontSize={12} fontWeight={700} fill={rucne} letterSpacing={1.4}>
          DŘÍV — RUČNĚ
        </text>
        <text x={xB} y={30} fontSize={12} fontWeight={700} fill={c.success} letterSpacing={1.4}>
          TEĎ — S HOTOVOU ÚLOHOU
        </text>
        <line x1={20} y1={44} x2={880} y2={44} stroke="currentColor" strokeWidth={1} opacity={0.25} />

        {RADKY.map((r, i) => {
          const y = y0 + i * rozestup
          const col = barva[r.stav]
          return (
            <g key={r.krok}>
              <text x={xKrok} y={y + 24} fontSize={13} fontWeight={700} fill="currentColor" opacity={0.95}>
                {r.krok}
              </text>
              <text x={xKrok} y={y + 42} fontSize={11} fill="currentColor" opacity={0.6}>
                {r.kdo}
              </text>

              <rect x={xA} y={y} width={w} height={h} rx={9} fill={rucne} opacity={0.07} />
              <rect x={xA} y={y} width={w} height={h} rx={9} fill="none" stroke={rucne} strokeWidth={1.1} opacity={0.5} />
              {r.drive.map((t, j) => (
                <text key={`d${j}`} x={xA + 16} y={y + 30 + j * 16} fontSize={11.5} fill="currentColor" opacity={0.85}>
                  {t}
                </text>
              ))}

              <rect x={xB} y={y} width={w} height={h} rx={9} fill={col} opacity={r.stav === 'clovek' ? 0.05 : 0.09} />
              <rect
                x={xB}
                y={y}
                width={w}
                height={h}
                rx={9}
                fill="none"
                stroke={col}
                strokeWidth={1.2}
                opacity={0.65}
                strokeDasharray={r.stav === 'clovek' ? '5 4' : undefined}
              />
              <text x={xB + 16} y={y + 22} fontSize={10} fontWeight={700} fill={col} letterSpacing={0.8}>
                {stitek[r.stav]}
              </text>
              {r.ted.map((t, j) => (
                <text key={`t${j}`} x={xB + 16} y={y + 42 + j * 16} fontSize={11.5} fill="currentColor" opacity={0.85}>
                  {t}
                </text>
              ))}

              <line
                x1={xA + w + 6}
                y1={y + h / 2}
                x2={xB - 6}
                y2={y + h / 2}
                stroke="currentColor"
                strokeWidth={1}
                opacity={0.3}
              />
            </g>
          )
        })}

        <text x={20} y={744} fontSize={12} fill="currentColor" opacity={0.85}>
          Krok „dohledání objednávky“ v nové podobě není: úloha eviduje, co přišlo, a proti schváleným objednávkám to neporovnává.
        </text>
      </Box>
    </Box>
  )
}
