import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

/**
 * Diagram procesu akčního regálu ve třech pruzích.
 *
 * Kreslí se ručně místo knihovny na diagramy: je to jeden konkrétní obrázek,
 * který se nemění, a takhle se chová k motivu — čáry a text jdou z currentColor,
 * barvu mají jen ta místa, o kterých je celé zadání.
 */
export default function RegalFlow() {
  const theme = useTheme()
  const hot = theme.palette.warning.main
  const keep = theme.palette.success.main
  const badgeText = theme.palette.background.paper

  const lane = (x: number, label: string) => (
    <>
      <rect
        x={x}
        y={58}
        width={240}
        height={900}
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
        viewBox="0 0 900 1010"
        role="img"
        aria-label="Diagram procesu akčního regálu ve třech pruzích: produkťáci a marketing, logistika, výstupy. Data putují z Google Tabulky do velkého Excelu, rozpadají se na čtyři divizní Excely rozesílané e-mailem, produkťáci vybírají položky a posílají je e-mailem zpět k ručnímu přepisu, následuje fyzické vzorování v regálu, schválení a finální podklady pro marketing, centrální sklad a backoffice."
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

        {lane(50, 'PRODUKŤÁCI + MARKETING')}
        {lane(330, 'LOGISTIKA')}
        {lane(610, 'VÝSTUPY')}

        {/* 1 — Google Tabulka */}
        <rect x={60} y={90} width={220} height={66} rx={3} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={76} y={118} fontSize={14.5} fontWeight={600} fill="currentColor">
          Google Tabulka
        </text>
        <text x={76} y={137} fontSize={12} fill="currentColor" opacity={0.75}>
          obsah magazínu, zapisují průběžně
        </text>
        <path
          d="M170,156 L170,178 L450,178 L450,198"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          markerEnd="url(#regal-arrow)"
        />
        <text x={460} y={174} fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor" opacity={0.7}>
          7 sloupců pro logistiku
        </text>

        {/* 2 — velký Excel */}
        <rect x={340} y={198} width={220} height={76} rx={3} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={356} y={226} fontSize={14.5} fontWeight={600} fill="currentColor">
          Velký Excel
        </text>
        <text x={356} y={245} fontSize={12} fill="currentColor" opacity={0.75}>
          položky + min/max, sklad
        </text>
        <text x={356} y={261} fontSize={12} fill="currentColor" opacity={0.75}>
          poboček, centrální sklad
        </text>
        <path d="M450,274 L450,306" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#regal-arrow)" />

        {/* 3 — rozpad (hotspot) */}
        <g color={hot}>
          <rect x={340} y={306} width={220} height={66} rx={3} fill="none" stroke="currentColor" strokeWidth={2} />
          <rect x={340} y={306} width={5} height={66} fill="currentColor" />
          <circle cx={560} cy={306} r={12} fill="currentColor" />
          <text x={560} y={311} textAnchor="middle" fontSize={13} fontWeight={700} fill={badgeText}>
            2
          </text>
          <text x={360} y={334} fontSize={14.5} fontWeight={600} fill="currentColor">
            Rozpad na 4 divizní Excely
          </text>
          <text x={360} y={353} fontSize={12} fill="currentColor" opacity={0.85}>
            ručně / dnes s pomocí AI
          </text>
          <path
            d="M450,372 L450,394 L170,394 L170,416"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            markerEnd="url(#regal-arrow)"
          />
          <text x={185} y={388} fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor">
            e-mail, ručně, 11×
          </text>
        </g>

        {/* 4 — výběr produkťáka */}
        <rect x={60} y={416} width={220} height={76} rx={3} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={76} y={444} fontSize={14.5} fontWeight={600} fill="currentColor">
          Výběr do regálu
        </text>
        <text x={76} y={463} fontSize={12} fill="currentColor" opacity={0.75}>
          z ~50 položek vybere 5–10,
        </text>
        <text x={76} y={479} fontSize={12} fill="currentColor" opacity={0.75}>
          přidá prioritu a poznámky
        </text>

        {/* 5 — ruční přepis (hotspot) */}
        <g color={hot}>
          <path
            d="M170,492 L170,514 L450,514 L450,536"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            markerEnd="url(#regal-arrow)"
          />
          <text x={190} y={508} fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor">
            e-mail zpět · někdo print screen
          </text>
          <rect x={340} y={536} width={220} height={76} rx={3} fill="none" stroke="currentColor" strokeWidth={2} />
          <rect x={340} y={536} width={5} height={76} fill="currentColor" />
          <circle cx={560} cy={536} r={12} fill="currentColor" />
          <text x={560} y={541} textAnchor="middle" fontSize={13} fontWeight={700} fill={badgeText}>
            1
          </text>
          <text x={360} y={564} fontSize={14.5} fontWeight={600} fill="currentColor">
            Přepis odpovědí zpět
          </text>
          <text x={360} y={583} fontSize={12} fill="currentColor" opacity={0.85}>
            + kontrola, že se nic neposunulo
          </text>
          <text x={360} y={599} fontSize={12} fill="currentColor" opacity={0.85}>
            „takový vysírací krok“
          </text>
        </g>
        <path d="M450,612 L450,644" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#regal-arrow)" />

        {/* 6 — vzorování (zůstává člověku) */}
        <g color={keep}>
          <rect
            x={340}
            y={644}
            width={220}
            height={76}
            rx={3}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          <text x={360} y={672} fontSize={14.5} fontWeight={600} fill="currentColor">
            Fyzické vzorování
          </text>
          <text x={360} y={691} fontSize={12} fill="currentColor" opacity={0.85}>
            vejdou se tři kufry vedle sebe?
          </text>
          <text x={360} y={707} fontSize={12} fill="currentColor" opacity={0.85}>
            foto jako důkazní materiál
          </text>
        </g>
        <path
          d="M450,720 L450,742 L170,742 L170,764"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          markerEnd="url(#regal-arrow)"
        />
        <text x={185} y={736} fontFamily="ui-monospace, Menlo, monospace" fontSize={11} fill="currentColor" opacity={0.7}>
          fotky + návrh min/max
        </text>

        {/* 7 — schválení */}
        <rect x={60} y={764} width={220} height={66} rx={3} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={76} y={792} fontSize={14.5} fontWeight={600} fill="currentColor">
          Schválení
        </text>
        <text x={76} y={811} fontSize={12} fill="currentColor" opacity={0.75}>
          úpravy podle dohod s dodavateli
        </text>
        <path
          d="M170,830 L170,852 L450,852 L450,874"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          markerEnd="url(#regal-arrow)"
        />

        {/* 8 — finální podklady (hotspot) */}
        <g color={hot}>
          <rect x={340} y={874} width={220} height={66} rx={3} fill="none" stroke="currentColor" strokeWidth={2} />
          <rect x={340} y={874} width={5} height={66} fill="currentColor" />
          <circle cx={560} cy={874} r={12} fill="currentColor" />
          <text x={560} y={879} textAnchor="middle" fontSize={13} fontWeight={700} fill={badgeText}>
            3
          </text>
          <text x={360} y={902} fontSize={14.5} fontWeight={600} fill="currentColor">
            Finální podklady
          </text>
          <text x={360} y={921} fontSize={12} fill="currentColor" opacity={0.85}>
            Word + tři různé Excely
          </text>
          <path d="M566,907 L602,907" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#regal-arrow)" />
        </g>

        {/* 9 — výstupy */}
        <rect x={620} y={866} width={220} height={82} rx={3} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={636} y={892} fontSize={13} fill="currentColor">
          Marketing — na web
        </text>
        <text x={636} y={912} fontSize={13} fill="currentColor">
          Centrální sklad — naskladnění
        </text>
        <text x={636} y={932} fontSize={13} fill="currentColor">
          Backoffice — nastavení poboček
        </text>
      </Box>
    </Box>
  )
}
