import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

/**
 * Proč se upovídaná práce vyplatí poslat podagentovi.
 *
 * Podagent dostane vlastní čistý kontext — svoje instrukce, nástroje a
 * CLAUDE.md, ale ne tvoji konverzaci. Všechen ten hluk (stovky řádků výpisu)
 * zůstane u něj a zpátky přijde jen odpověď. Kdyby totéž běželo v hlavním
 * sezení, ten výpis se pak posílá znovu při každé další zprávě.
 */
export default function SubagentContext() {
  const theme = useTheme()
  const accent = theme.palette.primary.main
  const ok = theme.palette.success.main
  const warn = theme.palette.warning.main

  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string | undefined,
    dashed = false,
  ) => (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      fill="none"
      stroke={color ?? 'currentColor'}
      strokeWidth={color ? 1.5 : 1}
      strokeDasharray={dashed ? '4 4' : undefined}
      opacity={color ? 0.9 : 0.35}
    />
  )

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
        viewBox="0 0 900 300"
        role="img"
        aria-label="Vlevo tvoje sezení: zadání, odpovědi a soubory, které Claude přečetl. Uprostřed šipka k podagentovi, který má vlastní čistý kontext — svoje instrukce, nástroje a CLAUDE.md, ale ne tvoji konverzaci. V něm se odehraje ta upovídaná práce, třeba tisíc řádků výpisu. Zpátky do tvého sezení se vrátí jen krátká odpověď, ten výpis ne."
        sx={{ display: 'block', width: '100%', minWidth: 760, height: 'auto' }}
      >
        {/* tvoje sezení */}
        {box(20, 40, 300, 220, accent)}
        <text x={38} y={66} fontSize={14} fontWeight={650} fill={accent}>
          Tvoje sezení
        </text>
        <text x={38} y={92} fontSize={13} fill="currentColor">
          zadání a odpovědi
        </text>
        <text x={38} y={114} fontSize={13} fill="currentColor">
          soubory, které Claude přečetl
        </text>
        <text x={38} y={136} fontSize={13} fill="currentColor">
          CLAUDE.md a nástroje
        </text>
        <text x={38} y={176} fontSize={12.5} fill="currentColor" opacity={0.75}>
          tohle se posílá znovu
        </text>
        <text x={38} y={194} fontSize={12.5} fill="currentColor" opacity={0.75}>
          při každé další zprávě
        </text>
        <rect x={38} y={214} width={110} height={26} rx={4} fill={ok} opacity={0.16} />
        <text x={52} y={231} fontSize={12.5} fill={ok} fontWeight={650}>
          + odpověď
        </text>

        {/* šipky */}
        <line x1={330} y1={110} x2={540} y2={110} stroke="currentColor" strokeWidth={1.5} opacity={0.5} />
        <polygon points="540,110 530,105 530,115" fill="currentColor" opacity={0.5} />
        <text x={360} y={100} fontSize={12.5} fill="currentColor" opacity={0.85}>
          „projdi ty logy a řekni mi…"
        </text>

        <line x1={540} y1={228} x2={330} y2={228} stroke={ok} strokeWidth={1.5} opacity={0.9} />
        <polygon points="330,228 340,223 340,233" fill={ok} opacity={0.9} />
        <text x={360} y={220} fontSize={12.5} fill={ok} fontWeight={650}>
          vrátí se jen odpověď
        </text>

        {/* podagent */}
        {box(550, 40, 330, 220, undefined, true)}
        <text x={568} y={66} fontSize={14} fontWeight={650} fill="currentColor">
          Podagent — vlastní čistý kontext
        </text>
        <text x={568} y={92} fontSize={13} fill="currentColor">
          svoje instrukce, nástroje, CLAUDE.md
        </text>
        <text x={568} y={114} fontSize={13} fill="currentColor" opacity={0.75}>
          tvoji konverzaci nedostane
        </text>
        <rect x={568} y={134} width={294} height={64} rx={6} fill={warn} opacity={0.12} />
        <text x={584} y={158} fontSize={13} fill={warn} fontWeight={650}>
          1 200 řádků výpisu
        </text>
        <text x={584} y={180} fontSize={12.5} fill={warn}>
          zůstane tady a zmizí s ním
        </text>
        <text x={568} y={228} fontSize={12.5} fill="currentColor" opacity={0.75}>
          hluk se do tvého sezení nikdy nedostane
        </text>
      </Box>
    </Box>
  )
}
