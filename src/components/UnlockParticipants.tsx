import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import type { Participant } from '../types'
import { type Envelope, WrongPassphraseError, decryptParticipants } from '../lib/crypto'

/**
 * Odemknutí seznamu účastníků. Dešifruje se v prohlížeči — heslo se nikam
 * neposílá a nikde neukládá.
 */
export default function UnlockParticipants({
  envelope,
  onUnlocked,
}: {
  envelope: Envelope
  onUnlocked: (people: Participant[]) => void
}) {
  const [passphrase, setPassphrase] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passphrase || busy) return
    setBusy(true)
    setError('')
    try {
      onUnlocked(await decryptParticipants(envelope, passphrase))
      setPassphrase('')
    } catch (err) {
      setError(err instanceof WrongPassphraseError ? 'Heslo nesedí.' : (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ px: 2.25, py: 4, maxWidth: '52ch' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LockOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
        <Typography sx={{ fontWeight: 650 }}>Seznam účastníků je zamčený</Typography>
      </Box>

      <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 2.5 }}>
        Jsou to údaje o konkrétních lidech, takže v nasazení leží jen zašifrované. Heslo se
        nikam neodesílá — dešifruje se přímo tady v prohlížeči.
      </Typography>

      <TextField
        type="password"
        label="Heslo"
        size="small"
        fullWidth
        autoComplete="current-password"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        error={Boolean(error)}
        helperText={error || ' '}
        disabled={busy}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!passphrase || busy}
        startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {busy ? 'Odemykám…' : 'Odemknout'}
      </Button>

      <Typography sx={{ fontSize: 13, color: 'text.disabled', mt: 2 }}>
        Odemykání chvíli trvá schválně — odvození klíče je pomalé, aby se heslo nedalo
        rychle uhádnout hrubou silou.
      </Typography>
    </Box>
  )
}
