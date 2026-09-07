import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

/**
 * Dvě různá povolení složky — a proč na tom rozdílu záleží.
 *
 * Vlevo dialog, který ukáže Cowork: úloha běží v cloudu, takže soubory
 * odcházejí z počítače. Vpravo to, co se ptá Claude Code v režimu Local:
 * jestli složce věříš. Soubory zůstávají na disku.
 *
 * Kreslené podle skutečných obrazovek. Klíčová je ta věta o cloudu — je to
 * jediné místo, kde se to člověk dozví, a v logistice na tom záleží.
 */
export default function FolderPermission() {
  const theme = useTheme()
  const accent = theme.palette.primary.main
  const warn = theme.palette.warning.main
  const ok = theme.palette.success.main
  const mono = 'ui-monospace, Menlo, monospace'

  const leftX = 20
  const rightX = 470
  const boxW = 410

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
        viewBox="0 0 900 360"
        role="img"
        aria-label="Dvě různá povolení složky vedle sebe. Vlevo dialog Coworku: Allow this Cowork session to access this folder, s upozorněním, že úloha běží v cloudu a soubory tedy odcházejí z počítače na servery Anthropiku. Vpravo dotaz Claude Code v režimu Local: jestli složce věříš; tam soubory zůstávají na disku a odchází jen to, co Claude opravdu přečte. Pro firemní data je to rozdíl, který je potřeba znát."
        sx={{ display: 'block', width: '100%', minWidth: 780, height: 'auto' }}
      >
        {/* --- Cowork --- */}
        <text x={leftX} y={18} fontSize={12.5} fontWeight={700} fill={warn}>
          COWORK — ÚLOHA BĚŽÍ V CLOUDU
        </text>
        <rect
          x={leftX}
          y={30}
          width={boxW}
          height={214}
          rx={10}
          fill="currentColor"
          opacity={0.05}
          stroke={warn}
          strokeWidth={1}
        />
        <rect x={leftX + 20} y={50} width={26} height={26} rx={6} fill={warn} opacity={0.8} />
        <text x={leftX + 58} y={62} fontSize={13.5} fontWeight={700} fill="currentColor">
          Allow this Cowork session to
        </text>
        <text x={leftX + 58} y={79} fontSize={13.5} fontWeight={700} fill="currentColor">
          access this folder?
        </text>
        <text x={leftX + 20} y={106} fontSize={12} fontFamily={mono} fill="currentColor" opacity={0.8}>
          /Users/…/DEK-simulace-OneDrive
        </text>
        <text x={leftX + 20} y={132} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Claude bude moct soubory číst i měnit —
        </text>
        <text x={leftX + 20} y={150} fontSize={12.5} fill="currentColor" opacity={0.85}>
          pro tohle sezení, nebo napořád.
        </text>
        <rect x={leftX + 16} y={162} width={boxW - 32} height={40} rx={6} fill={warn} opacity={0.14} />
        <text x={leftX + 28} y={180} fontSize={12.5} fill={warn} fontWeight={650}>
          „Because this task runs in the cloud, files
        </text>
        <text x={leftX + 28} y={196} fontSize={12.5} fill={warn} fontWeight={650}>
          Claude uses leave your device.“
        </text>
        <rect x={leftX + 232} y={210} width={78} height={24} rx={5} fill="currentColor" opacity={0.15} />
        <text x={leftX + 250} y={226} fontSize={12} fill="currentColor">
          Cancel
        </text>
        <rect x={leftX + 320} y={210} width={70} height={24} rx={5} fill="currentColor" opacity={0.3} />
        <text x={leftX + 340} y={226} fontSize={12} fill="currentColor">
          Allow
        </text>

        <text x={leftX} y={272} fontSize={12.5} fill={warn} fontWeight={650}>
          Tohle si u firemních dat přečti dvakrát.
        </text>
        <text x={leftX} y={292} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Cowork pracuje ve vlastním prostředí v cloudu, takže
        </text>
        <text x={leftX} y={310} fontSize={12.5} fill="currentColor" opacity={0.85}>
          soubory z té složky opustí tvůj počítač. U cvičného
        </text>
        <text x={leftX} y={328} fontSize={12.5} fill="currentColor" opacity={0.85}>
          projektu nevadí. U skutečných faktur je to rozhodnutí.
        </text>

        {/* --- Claude Code --- */}
        <text x={rightX} y={18} fontSize={12.5} fontWeight={700} fill={ok}>
          CLAUDE CODE, PROSTŘEDÍ LOCAL
        </text>
        <rect
          x={rightX}
          y={30}
          width={boxW}
          height={214}
          rx={10}
          fill="currentColor"
          opacity={0.05}
          stroke={ok}
          strokeWidth={1}
        />
        <rect x={rightX + 20} y={50} width={26} height={26} rx={6} fill={accent} opacity={0.8} />
        <text x={rightX + 58} y={62} fontSize={13.5} fontWeight={700} fill="currentColor">
          Věříš téhle složce?
        </text>
        <text x={rightX + 58} y={79} fontSize={12.5} fill="currentColor" opacity={0.8}>
          Do you trust the files in this folder?
        </text>
        <text x={rightX + 20} y={106} fontSize={12} fontFamily={mono} fill="currentColor" opacity={0.8}>
          …/faktury-kontrola
        </text>
        <text x={rightX + 20} y={132} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Ptá se jednou, když složku otevřeš poprvé.
        </text>
        <text x={rightX + 20} y={150} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Potvrzuješ, že obsahu té složky věříš.
        </text>
        <rect x={rightX + 16} y={162} width={boxW - 32} height={40} rx={6} fill={ok} opacity={0.14} />
        <text x={rightX + 28} y={180} fontSize={12.5} fill={ok} fontWeight={650}>
          Práce běží na tvém počítači. Soubory
        </text>
        <text x={rightX + 28} y={196} fontSize={12.5} fill={ok} fontWeight={650}>
          zůstávají na disku.
        </text>
        <rect x={rightX + 300} y={210} width={90} height={24} rx={5} fill={accent} opacity={0.85} />
        <text x={rightX + 320} y={226} fontSize={12} fill="#fff" fontWeight={650}>
          Věřím
        </text>

        <text x={rightX} y={272} fontSize={12.5} fill={ok} fontWeight={650}>
          Tohle je varianta pro agendy s firemními daty.
        </text>
        <text x={rightX} y={292} fontSize={12.5} fill="currentColor" opacity={0.85}>
          Odchází jen to, co Claude při práci opravdu přečte —
        </text>
        <text x={rightX} y={310} fontSize={12.5} fill="currentColor" opacity={0.85}>
          ne celá složka. A naplánovaná úloha typu Local
        </text>
        <text x={rightX} y={328} fontSize={12.5} fill="currentColor" opacity={0.85}>
          umí běžet jen takhle, protože potřebuje ten disk.
        </text>
      </Box>
    </Box>
  )
}
