import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Dvě různá povolení složky — a proč na tom rozdílu záleží.
 *
 * Vlevo dialog, který ukáže Cowork: úloha běží v cloudu, takže soubory
 * odcházejí z počítače. Vpravo dialog Claude Code v režimu Local — „Trust this
 * workspace?“. Soubory zůstávají na disku, ale je v něm řádek, který se snadno
 * přehlédne: „Execution allowed by: .claude/settings.json“. Ten řádek se objeví
 * proto, že ve složce leží nastavení, které samo spouští příkaz — u cvičného
 * projektu je to hook chránící vstup/. U složky stažené odjinud to může být
 * cokoli, a tohle je jediná chvíle, kdy na to aplikace upozorní.
 *
 * Pravá strana je kreslená podle skutečné obrazovky, včetně anglických textů —
 * aplikace je vypisuje takhle a účastník je má poznat.
 */
export default function FolderPermission() {
  const c = useFigureColors()
  const accent = c.primary
  const warn = c.warning
  const ok = c.success
  const mono = 'ui-monospace, Menlo, monospace'

  const leftX = 20
  const rightX = 470
  const boxW = 410
  const boxY = 30
  const boxH = 286

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
        viewBox="0 0 900 450"
        role="img"
        aria-label="Dvě různá povolení složky vedle sebe. Vlevo dialog Coworku: Allow this Cowork session to access this folder, s upozorněním, že úloha běží v cloudu a soubory tedy odcházejí z počítače. Vpravo skutečný dialog Claude Code v režimu Local: Trust this workspace, s vysvětlením, že Claude Code smí v té složce číst, zapisovat i spouštět soubory, a proto se má pokračovat jen u složky, které člověk věří. Pod cestou ke složce je věta, že se macOS může zeptat na přístup a je potřeba kliknout na Allow, a odkaz na bezpečnostní příručku. Dole je řádek Execution allowed by s hodnotou tečka claude lomítko settings tečka json: ve složce leží nastavení, které samo spouští příkaz. U staženého cvičného projektu je to zábrana nad složkou vstup a je to schválně, u složky odjinud je to důvod se do toho souboru podívat. Tlačítka jsou Cancel a Trust workspace."
        sx={{ display: 'block', width: '100%', minWidth: 800, height: 'auto' }}
      >
        {/* ---------------------------------------------------------- Cowork */}
        <text x={leftX} y={18} fontSize={12.5} fontWeight={700} fill={warn}>
          COWORK — ÚLOHA BĚŽÍ V CLOUDU
        </text>
        <rect
          x={leftX}
          y={boxY}
          width={boxW}
          height={boxH}
          rx={10}
          fill="currentColor"
          opacity={0.05}
          stroke={warn}
          strokeWidth={1}
        />
        <rect x={leftX + 24} y={boxY + 20} width={26} height={26} rx={6} fill={warn} opacity={0.8} />
        <text x={leftX + 62} y={boxY + 32} fontSize={14} fontWeight={700} fill="currentColor">
          Allow this Cowork session to
        </text>
        <text x={leftX + 62} y={boxY + 50} fontSize={14} fontWeight={700} fill="currentColor">
          access this folder?
        </text>
        <text x={leftX + 24} y={boxY + 86} fontSize={12.5} fontFamily={mono} fill="currentColor" opacity={0.8}>
          /Users/…/DEK-simulace-OneDrive
        </text>
        <text x={leftX + 24} y={boxY + 118} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Claude bude moct soubory číst i měnit —
        </text>
        <text x={leftX + 24} y={boxY + 136} fontSize={12.5} fill="currentColor" opacity={0.85}>
          pro tohle sezení, nebo napořád.
        </text>
        <rect x={leftX + 20} y={boxY + 154} width={boxW - 40} height={46} rx={6} fill={warn} opacity={0.14} />
        <text x={leftX + 32} y={boxY + 175} fontSize={12.5} fill={warn} fontWeight={650}>
          „Because this task runs in the cloud, files
        </text>
        <text x={leftX + 32} y={boxY + 192} fontSize={12.5} fill={warn} fontWeight={650}>
          Claude uses leave your device.“
        </text>
        <rect x={leftX + 208} y={boxY + 246} width={84} height={28} rx={6} fill="currentColor" opacity={0.15} />
        <text x={leftX + 250} y={boxY + 265} fontSize={12.5} textAnchor="middle" fill="currentColor">
          Cancel
        </text>
        <rect x={leftX + 302} y={boxY + 246} width={84} height={28} rx={6} fill="currentColor" opacity={0.32} />
        <text x={leftX + 344} y={boxY + 265} fontSize={12.5} textAnchor="middle" fill="currentColor">
          Allow
        </text>

        <text x={leftX} y={boxY + 316} fontSize={12.5} fill={warn} fontWeight={650}>
          Tohle si u firemních dat přečti dvakrát.
        </text>
        <text x={leftX} y={boxY + 336} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Cowork pracuje ve vlastním prostředí v cloudu, takže
        </text>
        <text x={leftX} y={boxY + 354} fontSize={12.5} fill="currentColor" opacity={0.85}>
          soubory z té složky opustí tvůj počítač. U cvičného
        </text>
        <text x={leftX} y={boxY + 372} fontSize={12.5} fill="currentColor" opacity={0.85}>
          projektu nevadí. U skutečných faktur je to rozhodnutí.
        </text>

        {/* ----------------------------------------------------- Claude Code */}
        <text x={rightX} y={18} fontSize={12.5} fontWeight={700} fill={ok}>
          CLAUDE CODE, PROSTŘEDÍ LOCAL
        </text>
        <rect
          x={rightX}
          y={boxY}
          width={boxW}
          height={boxH}
          rx={10}
          fill="currentColor"
          opacity={0.05}
          stroke={ok}
          strokeWidth={1}
        />
        <text x={rightX + 24} y={boxY + 34} fontSize={15} fontWeight={700} fill="currentColor">
          Trust this workspace?
        </text>
        <text x={rightX + 24} y={boxY + 60} fontSize={12.5} fill="currentColor" opacity={0.9}>
          Claude Code may read, write, or execute files in
        </text>
        <text x={rightX + 24} y={boxY + 77} fontSize={12.5} fill="currentColor" opacity={0.9}>
          this folder. Only proceed if you trust this workspace.
        </text>
        <text x={rightX + 24} y={boxY + 104} fontSize={12.5} fontFamily={mono} fontWeight={650} fill="currentColor">
          /Users/…/Downloads/faktury-kontrola
        </text>
        <text x={rightX + 24} y={boxY + 130} fontSize={12} fill="currentColor" opacity={0.7}>
          macOS may ask for permission to access this folder.
        </text>
        <text x={rightX + 24} y={boxY + 146} fontSize={12} fill="currentColor" opacity={0.7}>
          Click Allow on the prompt so Claude Code can start here.
        </text>
        <text x={rightX + 24} y={boxY + 170} fontSize={12} fill="currentColor" opacity={0.7}>
          Read our security guide for more information.
        </text>
        <line
          x1={rightX + 76}
          y1={boxY + 173}
          x2={rightX + 152}
          y2={boxY + 173}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.5}
        />
        <text x={rightX + 24} y={boxY + 198} fontSize={12} fill="currentColor" opacity={0.7}>
          Execution allowed by:
        </text>
        <rect
          x={rightX + 24}
          y={boxY + 206}
          width={boxW - 48}
          height={28}
          rx={5}
          fill={accent}
          opacity={0.14}
          stroke={accent}
          strokeWidth={1}
        />
        <text x={rightX + 36} y={boxY + 225} fontSize={12.5} fontFamily={mono} fill={accent} fontWeight={650}>
          .claude/settings.json
        </text>
        <rect x={rightX + 172} y={boxY + 246} width={84} height={28} rx={6} fill="currentColor" opacity={0.15} />
        <text x={rightX + 214} y={boxY + 265} fontSize={12.5} textAnchor="middle" fill="currentColor">
          Cancel
        </text>
        <rect x={rightX + 266} y={boxY + 246} width={120} height={28} rx={6} fill={accent} opacity={0.9} />
        <text x={rightX + 326} y={boxY + 265} fontSize={12.5} textAnchor="middle" fill="#fff" fontWeight={650}>
          Trust workspace
        </text>

        <text x={rightX} y={boxY + 316} fontSize={12.5} fill={ok} fontWeight={650}>
          Práce běží na tvém počítači, soubory zůstávají na disku.
        </text>
        <text x={rightX} y={boxY + 336} fontSize={12.5} fill={accent} fontWeight={650}>
          Ten zvýrazněný řádek si ale přečti.
        </text>
        <text x={rightX} y={boxY + 354} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Ve složce leží nastavení, které samo spouští příkaz. Tady
        </text>
        <text x={rightX} y={boxY + 372} fontSize={12.5} fill="currentColor" opacity={0.85}>
          je to zábrana nad vstup/. U složky stažené odjinud to může
        </text>
        <text x={rightX} y={boxY + 390} fontSize={12.5} fill="currentColor" opacity={0.85}>
          být cokoli — podívej se do něj dřív, než klikneš.
        </text>
      </Box>
    </Box>
  )
}
