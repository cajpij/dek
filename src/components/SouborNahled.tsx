import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

/**
 * Soubor z projektu k nahlédnutí, aniž by ho člověk musel stahovat.
 *
 * Klik otevře dialog s obsahem tak, jak leží ve složce — monospace, bez
 * formátování markdownu. Schválně: má být vidět, že je to obyčejný textový
 * soubor, ne vyrenderovaná stránka.
 */
export default function SouborNahled({
  nazev,
  popis,
  obsah,
}: {
  nazev: string
  popis: string
  obsah: string
}) {
  const [otevreno, setOtevreno] = useState(false)
  const radku = obsah.split('\n').length

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={() => setOtevreno(true)}
        aria-haspopup="dialog"
        sx={{
          my: 3,
          width: '100%',
          maxWidth: 720,
          display: 'flex',
          alignItems: 'center',
          gap: 1.75,
          textAlign: 'left',
          font: 'inherit',
          cursor: 'pointer',
          px: 2.5,
          py: 2,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'border-color .15s, background-color .15s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        }}
      >
        <DescriptionOutlinedIcon sx={{ color: 'text.secondary', fontSize: 26 }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 650, fontSize: 15.5, fontFamily: 'ui-monospace, Menlo, monospace' }}>
            {nazev}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 0.25 }}>{popis}</Typography>
        </Box>
        <Typography sx={{ color: 'primary.main', fontSize: 13.5, fontWeight: 650, whiteSpace: 'nowrap' }}>
          {radku} řádků · otevřít
        </Typography>
      </Box>

      <Dialog
        open={otevreno}
        onClose={() => setOtevreno(false)}
        maxWidth="md"
        fullWidth
        aria-label={`Obsah souboru ${nazev}`}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2.5,
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ flex: 1, fontWeight: 650, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 15 }}>
            {nazev}
          </Typography>
          <Button
            size="small"
            onClick={() => navigator.clipboard?.writeText(obsah)}
            sx={{ textTransform: 'none' }}
          >
            Kopírovat
          </Button>
          <IconButton size="small" onClick={() => setOtevreno(false)} aria-label="Zavřít">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="pre"
            sx={{
              m: 0,
              px: 2.5,
              py: 2.5,
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: 13,
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {obsah}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
