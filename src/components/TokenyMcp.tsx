import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Kolik kontextu spolkne jedna otázka nad katalogem — přes web a přes MCP.
 *
 * Čísla nejsou odhad. Přes MCP je to součet čtyř skutečných odpovědí na
 * dotaz „jaké jsou kategorie cihel"; přes web je to text jedné stránky
 * výpisu po odstranění značek, tedy zhruba to, co z ní model dostane.
 * Tokeny počítané po třech znacích, což u češtiny vychází přibližně.
 *
 * Pointa není poměr 2,6 : 1. Pointa je poslední řádek: ta jedna stránka
 * je jedna větev ze 4 661, kdežto ten rejstřík se prohledal celý.
 */

const MCP = 835
const WEB = 2187
const SIRKA = 560          // px pro delší sloupec
const px = (t: number) => (t / WEB) * SIRKA

export default function TokenyMcp() {
  const c = useFigureColors()
  const dobre = c.success
  const drahe = c.warning

  const radek = (
    y: number,
    popis: string,
    detail: string,
    tokeny: number,
    barva: string,
    zvyraznit: boolean,
  ) => (
    <g>
      <text x={0} y={y - 8} fontSize={14.5} fontWeight={700} fill={barva}>
        {popis}
      </text>
      <rect
        x={0}
        y={y}
        width={px(tokeny)}
        height={26}
        rx={4}
        fill={barva}
        opacity={zvyraznit ? 0.9 : 0.22}
        stroke={barva}
        strokeWidth={zvyraznit ? 0 : 1.5}
      />
      <text
        x={px(tokeny) + 12}
        y={y + 18}
        fontSize={14}
        fontWeight={700}
        fill={barva}
        fontFamily="ui-monospace, Menlo, monospace"
      >
        ~{tokeny.toLocaleString('cs-CZ')} tokenů
      </text>
      <text x={0} y={y + 44} fontSize={12.5} fill="currentColor" opacity={0.65}>
        {detail}
      </text>
    </g>
  )

  return (
    <Box
      component="svg"
      viewBox="0 0 780 262"
      role="img"
      aria-label="Srovnání, kolik kontextu spolkne jedna otázka nad katalogem dek.cz. Přes MCP server zhruba 835 tokenů — to je součet čtyř skutečných odpovědí, které dohromady prohledaly všech 4 661 kategorií rejstříku. Bez serveru, čtením jedné stránky výpisu na webu, zhruba 2 187 tokenů, tedy dva a půlkrát víc, a přitom je v tom obsah jediné větve katalogu. Ta stránka má přitom přes půl milionu znaků HTML, ze kterých po odstranění značek zbyde jen šest a půl tisíce znaků textu. Aby se z webu poskládala stejná odpověď, muselo by se načíst několik takových stránek za sebou."
      sx={{ display: 'block', width: '100%', minWidth: 620, height: 'auto', color: 'text.primary' }}
    >
      <text
        x={0}
        y={14}
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize={11}
        letterSpacing={1.5}
        fill="currentColor"
        opacity={0.7}
      >
        JEDNA OTÁZKA: „JAKÉ JSOU KATEGORIE CIHEL"
      </text>

      <g transform="translate(0, 46)">
        {radek(20, 'S MCP serverem', 'čtyři dotazy do rejstříku · prohledáno všech 4 661 kategorií', MCP, dobre, true)}
      </g>
      <g transform="translate(0, 138)">
        {radek(20, 'Bez serveru, přes web', 'text jedné stránky výpisu · jedna větev katalogu ze 4 661', WEB, drahe, true)}
      </g>

      <line x1={0} y1={236} x2={780} y2={236} stroke="currentColor" strokeWidth={1} opacity={0.15} />
      <text x={0} y={248} fontSize={12.5} fill="currentColor" opacity={0.65}>
        Ta stránka má 540 768 znaků HTML — text z ní je 6 561. Zbytek je obal, který se stáhne tak jako tak.
      </text>
    </Box>
  )
}
