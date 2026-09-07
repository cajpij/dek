import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Jak se konektor připojí a jak se pozná, že je připojený.
 *
 * Vlevo karta konektoru v adresáři (to se klikne jednou), vpravo výpis
 * příkazu /mcp v Claude Code (to se kontroluje pokaždé, když něco nejde).
 * Stavy vpravo jsou ty, které Claude Code umí vypsat — ne vymyšlené.
 *
 * Kreslené: obrazovka se mění, tohle zestárne až se změní samotné stavy.
 */

const STATES = [
  { name: 'microsoft365', meta: 'HTTP · claude.ai', state: '✔ Connected · 7 tools', tone: 'ok' },
  { name: 'mcp-dek', meta: 'stdio · user', state: '✔ Connected · 5 tools', tone: 'ok' },
  { name: 'jiny-server', meta: 'HTTP · local', state: '! Needs authentication', tone: 'warn' },
  { name: 'stary-pokus', meta: 'stdio · local', state: '⊘ Disabled for this project', tone: 'dim' },
] as const

export default function ConnectorSetup() {
  const c = useFigureColors()
  const accent = c.primary
  const ok = c.success
  const warn = c.warning
  const mono = 'ui-monospace, Menlo, monospace'

  const leftX = 20
  const leftW = 420
  const rightX = 470
  const rightW = 410

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
        viewBox="0 0 900 330"
        role="img"
        aria-label="Vlevo karta konektoru Microsoft 365 v adresáři konektorů s tlačítkem Connect to Claude a poznámkou, že je potřeba firemní účet, ne osobní. Vpravo výpis příkazu lomítko mcp v Claude Code: microsoft365 připojený se sedmi nástroji, mcp-dek připojený s pěti nástroji, jiný server hlásí Needs authentication, tedy že se čeká na přihlášení, a starý pokus je vypnutý pro tenhle projekt. Levá strana se dělá jednou, pravá je to, co zkontroluješ, když něco nejde."
        sx={{ display: 'block', width: '100%', minWidth: 780, height: 'auto' }}
      >
        {/* --- vlevo: adresář konektorů --- */}
        <text x={leftX} y={20} fontSize={12.5} fontWeight={700} fill="currentColor" opacity={0.6}>
          JEDNOU: PŘIPOJIT
        </text>
        <rect
          x={leftX}
          y={32}
          width={leftW}
          height={196}
          rx={10}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.3}
        />
        <rect x={leftX + 18} y={54} width={34} height={34} rx={7} fill="currentColor" opacity={0.18} />
        <text x={leftX + 64} y={70} fontSize={15} fontWeight={700} fill="currentColor">
          Microsoft 365
        </text>
        <text x={leftX + 64} y={88} fontSize={12} fill="currentColor" opacity={0.75}>
          SharePoint, OneDrive, Outlook, Teams
        </text>
        <rect x={leftX + 250} y={112} width={152} height={30} rx={6} fill={accent} opacity={0.9} />
        <text x={leftX + 275} y={132} fontSize={13} fontWeight={650} fill="#fff">
          Connect to Claude
        </text>
        <text x={leftX + 18} y={126} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Adresář konektorů
        </text>
        <text x={leftX + 18} y={144} fontSize={12.5} fill="currentColor" opacity={0.85}>
          → Microsoft 365 → tlačítko vpravo
        </text>
        <line
          x1={leftX + 18}
          y1={162}
          x2={leftX + leftW - 18}
          y2={162}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.15}
        />
        <text x={leftX + 18} y={184} fontSize={12.5} fill={warn} fontWeight={650}>
          Přihlašuješ se firemním účtem.
        </text>
        <text x={leftX + 18} y={202} fontSize={12.5} fill={warn}>
          Osobní outlook.com nebo hotmail.com neprojde.
        </text>

        <text x={leftX} y={256} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Odesílání mailů (write tools) je zvlášť a musí ho
        </text>
        <text x={leftX} y={274} fontSize={12.5} fill="currentColor" opacity={0.85}>
          povolit správce. Bez toho zvládneš jen číst.
        </text>

        {/* --- vpravo: /mcp --- */}
        <text x={rightX} y={20} fontSize={12.5} fontWeight={700} fill="currentColor" opacity={0.6}>
          POKAŽDÉ, KDYŽ NĚCO NEJDE: /MCP
        </text>
        <rect
          x={rightX}
          y={32}
          width={rightW}
          height={196}
          rx={10}
          fill="currentColor"
          opacity={0.05}
        />
        <text x={rightX + 18} y={58} fontSize={13} fontFamily={mono} fill="currentColor" opacity={0.8}>
          /mcp
        </text>
        {STATES.map((sv, i) => {
          const y = 92 + i * 34
          const color = sv.tone === 'ok' ? ok : sv.tone === 'warn' ? warn : 'currentColor'
          return (
            <g key={sv.name}>
              <text x={rightX + 18} y={y} fontSize={13} fontFamily={mono} fill="currentColor">
                {sv.name}
              </text>
              <text x={rightX + 160} y={y} fontSize={11.5} fill="currentColor" opacity={0.55}>
                {sv.meta}
              </text>
              <text
                x={rightX + 18}
                y={y + 15}
                fontSize={12}
                fontFamily={mono}
                fill={color}
                opacity={sv.tone === 'dim' ? 0.55 : 1}
              >
                {sv.state}
              </text>
            </g>
          )
        })}
        <text x={rightX} y={256} fontSize={12.5} fill={warn} fontWeight={650}>
          „Needs authentication“ není chyba —
        </text>
        <text x={rightX} y={274} fontSize={12.5} fill={warn}>
          klikni na ten řádek a přihlas se v prohlížeči.
        </text>
        <text x={rightX} y={300} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Co nepoužíváš, tady rovnou vypni. Každý připojený
        </text>
        <text x={rightX} y={318} fontSize={12.5} fill="currentColor" opacity={0.85}>
          server něco zabírá v každé zprávě.
        </text>
      </Box>
    </Box>
  )
}
