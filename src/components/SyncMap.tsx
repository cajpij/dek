import Box from '@mui/material/Box'
import { useFigureColors } from '../lib/figureColors'

/**
 * Kudy se knihovna ze SharePointu dostane až ke Claudovi.
 *
 * Smysl obrázku je jediný: ukázat, že po nasyncování už jde o obyčejnou složku
 * na disku a že jediný rozdíl mezi Macem a Windows je cesta k ní.
 */
export default function SyncMap() {
  const c = useFigureColors()
  const accent = c.primary

  return (
    <Box tabIndex={0} sx={{ overflowX: 'auto', color: 'text.secondary', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
      <Box
        component="svg"
        viewBox="0 0 900 300"
        role="img"
        aria-label="Knihovna na SharePointu se přes Přidat zástupce do OneDrivu nasyncuje do složky na disku — na Macu do ~/Library/CloudStorage, ve Windows do složky s názvem firmy v profilu uživatele. Tuhle složku pak Claude připojí tlačítkem Add folder."
        sx={{ display: 'block', width: '100%', minWidth: 680, height: 'auto' }}
      >
        <defs>
          <marker
            id="sync-arrow"
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

        {/* SharePoint */}
        <rect x={20} y={110} width={180} height={80} rx={4} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={40} y={143} fontSize={15} fontWeight={600} fill="currentColor">
          SharePoint
        </text>
        <text x={40} y={164} fontSize={12.5} fill="currentColor" opacity={0.75}>
          knihovna dokumentů
        </text>

        <path d="M200,150 L266,150" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#sync-arrow)" />
        <text
          x={233}
          y={100}
          textAnchor="middle"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize={10.5}
          fill="currentColor"
          opacity={0.8}
        >
          Přidat zástupce
        </text>

        {/* OneDrive */}
        <rect x={272} y={110} width={150} height={80} rx={4} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={292} y={143} fontSize={15} fontWeight={600} fill="currentColor">
          OneDrive
        </text>
        <text x={292} y={164} fontSize={12.5} fill="currentColor" opacity={0.75}>
          stáhne obsah
        </text>

        {/* rozdvojení na dva systémy */}
        <path d="M422,150 L452,150 L452,68 L500,68" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#sync-arrow)" />
        <path d="M452,150 L452,232 L500,232" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#sync-arrow)" />

        {/* Mac */}
        <rect x={506} y={36} width={300} height={64} rx={4} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={524} y={62} fontSize={13.5} fontWeight={600} fill="currentColor">
          macOS
        </text>
        <text x={524} y={83} fontFamily="ui-monospace, Menlo, monospace" fontSize={11.5} fill="currentColor" opacity={0.8}>
          ~/Library/CloudStorage/…
        </text>

        {/* Windows */}
        <rect x={506} y={200} width={300} height={64} rx={4} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={524} y={226} fontSize={13.5} fontWeight={600} fill="currentColor">
          Windows
        </text>
        <text x={524} y={247} fontFamily="ui-monospace, Menlo, monospace" fontSize={11.5} fill="currentColor" opacity={0.8}>
          {'%UserProfile%\\<firma>\\…'}
        </text>

        {/* sloučení do Clauda */}
        <path d="M806,68 L840,68 L840,150" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <path d="M806,232 L840,232 L840,150" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <g color={accent}>
          <path d="M840,150 L854,150" fill="none" stroke="currentColor" strokeWidth={2} markerEnd="url(#sync-arrow)" />
          <circle cx={868} cy={150} r={11} fill="currentColor" />
          <text x={868} y={155} textAnchor="middle" fontSize={12} fontWeight={700} fill={c.paper}>
            C
          </text>
          <text x={868} y={186} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="currentColor">
            Claude
          </text>
          <text x={868} y={203} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.85}>
            Add folder
          </text>
        </g>
      </Box>
    </Box>
  )
}
