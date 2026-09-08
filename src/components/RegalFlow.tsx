import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Diagram typického ručního procesu kontroly faktur ve třech pruzích.
 *
 * Kreslí se ručně místo knihovny na diagramy: je to jeden konkrétní obrázek,
 * který se nemění, a takhle se chová k motivu — čáry a text jdou z currentColor,
 * barvu mají jen ta místa, o kterých je celé zadání.
 */
export default function RegalFlow() {
  const c = useFigureColors()
  const hot = c.warning
  const keep = c.success
  const badgeText = c.paper

  const lane = (x: number, label: string) => (
    <>
      <rect
        x={x}
        y={58}
        width={240}
        height={660}
        rx={3}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 5"
        opacity={0.35}
      />
      <text
        x={x + 120}
        y={44}
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize={11.5}
        letterSpacing={1.6}
        fill="currentColor"
        opacity={0.75}
      >
        {label}
      </text>
    </>
  )

  return (
    <Box tabIndex={0} sx={{ overflowX: 'auto', color: 'text.secondary', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
      <Box
        component="svg"
        viewBox="0 0 900 760"
        role="img"
        aria-label="Diagram typického ručního procesu kontroly faktur ve třech pruzích: dodavatel, účtárna, středisko. Faktura přijde e-mailem od dodavatele, účetní z ní ručně přepíše údaje do kontrolní tabulky, pak ručně dohledá odpovídající objednávku a porovná částku; když něco nesedí, jde e-mail tam a zpět. Když sedí, faktura jde e-mailem ke schválení vedoucímu střediska, schválení se vrátí a ručně zapíše zpátky do tabulky, a nakonec se schválená faktura ručně zadá do účetního systému k platbě — to je krok, který zůstává na člověku."
        sx={{ display: 'block', width: '100%', minWidth: 720, height: 'auto' }}
      >
        <defs>
          <marker
            id="regal-arrow"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        {lane(50, 'DODAVATEL')}
        {lane(330, 'ÚČTÁRNA')}
        {lane(610, 'STŘEDISKO')}

        {/* 1 — e-mail s fakturou */}
        <rect x={60} y={90} width={220} height={66} rx={3} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={76} y={118} fontSize={14.5} fontWeight={600} fill="currentColor">
          E-mail s fakturou
        </text>
        <text x={76} y={137} fontSize={12} fill="currentColor" opacity={0.75}>
          PDF do sdílené schránky
        </text>
        <path
          d="M170,156 L170,178 L450,178 L450,198"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          markerEnd="url(#regal-arrow)"
        />

        {/* 2 — přepis údajů (hotspot) */}
        <g color={hot}>
          <rect x={340} y={198} width={220} height={76} rx={3} fill="none" stroke="currentColor" strokeWidth={2} />
          <rect x={340} y={198} width={5} height={76} fill="currentColor" />
          <circle cx={560} cy={198} r={12} fill="currentColor" />
          <text x={560} y={203} textAnchor="middle" fontSize={13} fontWeight={700} fill={badgeText}>
            1
          </text>
          <text x={360} y={226} fontSize={14.5} fontWeight={600} fill="currentColor">
            Přepis údajů z PDF
          </text>
          <text x={360} y={245} fontSize={12} fill="currentColor" opacity={0.85}>
            šest údajů ručně do
          </text>
          <text x={360} y={261} fontSize={12} fill="currentColor" opacity={0.85}>
            kontrolní tabulky
          </text>
          <path d="M450,274 L450,306" fill="none" stroke="currentColor" strokeWidth={2} markerEnd="url(#regal-arrow)" />
        </g>

        {/* 3 — dohledání objednávky (hotspot) */}
        <g color={hot}>
          <rect x={340} y={306} width={220} height={76} rx={3} fill="none" stroke="currentColor" strokeWidth={2} />
          <rect x={340} y={306} width={5} height={76} fill="currentColor" />
          <circle cx={560} cy={306} r={12} fill="currentColor" />
          <text x={560} y={311} textAnchor="middle" fontSize={13} fontWeight={700} fill={badgeText}>
            2
          </text>
          <text x={360} y={334} fontSize={14.5} fontWeight={600} fill="currentColor">
            Dohledání objednávky
          </text>
          <text x={360} y={353} fontSize={12} fill="currentColor" opacity={0.85}>
            ruční hledání v exportu,
          </text>
          <text x={360} y={369} fontSize={12} fill="currentColor" opacity={0.85}>
            ruční porovnání částky
          </text>
        </g>
        <path
          d="M340,344 L300,344"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          markerEnd="url(#regal-arrow)"
          opacity={0.6}
        />
        <text x={292} y={330} textAnchor="end" fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor" opacity={0.7}>
          když nesedí: e-mail
        </text>
        <text x={292} y={346} textAnchor="end" fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor" opacity={0.7}>
          tam a zpět, čekání
        </text>

        <path
          d="M450,382 L450,404 L730,404 L730,426"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          markerEnd="url(#regal-arrow)"
        />
        <text x={462} y={400} fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor" opacity={0.7}>
          když sedí
        </text>

        {/* 4 — schválení na středisku */}
        <rect x={620} y={426} width={220} height={66} rx={3} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={636} y={454} fontSize={14.5} fontWeight={600} fill="currentColor">
          Schválení
        </text>
        <text x={636} y={473} fontSize={12} fill="currentColor" opacity={0.75}>
          vedoucí střediska odklikne
        </text>
        <path
          d="M730,492 L730,514 L450,514 L450,536"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          markerEnd="url(#regal-arrow)"
        />
        <text x={462} y={510} fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor" opacity={0.7}>
          e-mailem zpátky
        </text>

        {/* 5 — zápis schválení zpět (hotspot) */}
        <g color={hot}>
          <rect x={340} y={536} width={220} height={76} rx={3} fill="none" stroke="currentColor" strokeWidth={2} />
          <rect x={340} y={536} width={5} height={76} fill="currentColor" />
          <circle cx={560} cy={536} r={12} fill="currentColor" />
          <text x={560} y={541} textAnchor="middle" fontSize={13} fontWeight={700} fill={badgeText}>
            3
          </text>
          <text x={360} y={564} fontSize={14.5} fontWeight={600} fill="currentColor">
            Zápis schválení zpět
          </text>
          <text x={360} y={583} fontSize={12} fill="currentColor" opacity={0.85}>
            z e-mailu ručně do tabulky,
          </text>
          <text x={360} y={599} fontSize={12} fill="currentColor" opacity={0.85}>
            kontrola, že nic neposunulo
          </text>
        </g>
        <path d="M450,612 L450,644" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#regal-arrow)" />

        {/* 6 — zadání k platbě (zůstává člověku) */}
        <g color={keep}>
          <rect
            x={340}
            y={644}
            width={220}
            height={66}
            rx={3}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          <text x={360} y={672} fontSize={14.5} fontWeight={600} fill="currentColor">
            Zadání k platbě
          </text>
          <text x={360} y={691} fontSize={12} fill="currentColor" opacity={0.85}>
            ručně, rozhoduje člověk
          </text>
        </g>
      </Box>
    </Box>
  )
}
