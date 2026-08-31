import type { Participant } from '../types'

/**
 * Formát zašifrovaného seznamu účastníků. Do repozitáře jde jen tohle —
 * bez hesla je to nepoužitelný shluk bajtů.
 */
export interface Envelope {
  v: 1
  kdf: 'PBKDF2'
  hash: 'SHA-256'
  iterations: number
  salt: string
  iv: string
  ct: string
}

const b64ToBytes = (b64: string): Uint8Array =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
}

export class WrongPassphraseError extends Error {
  constructor() {
    super('Heslo nesedí.')
    this.name = 'WrongPassphraseError'
  }
}

/**
 * Dešifruje seznam účastníků. AES-GCM ověřuje integritu, takže špatné heslo
 * neskončí zmatenými daty, ale výjimkou.
 */
export async function decryptParticipants(env: Envelope, passphrase: string): Promise<Participant[]> {
  if (env.v !== 1 || env.kdf !== 'PBKDF2') throw new Error('Neznámý formát zašifrovaného souboru.')
  const key = await deriveKey(passphrase, b64ToBytes(env.salt), env.iterations)

  let plain: ArrayBuffer
  try {
    plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64ToBytes(env.iv) as BufferSource },
      key,
      b64ToBytes(env.ct) as BufferSource,
    )
  } catch {
    throw new WrongPassphraseError()
  }

  const parsed = JSON.parse(new TextDecoder().decode(plain)) as { participants?: Participant[] }
  if (!Array.isArray(parsed.participants)) throw new Error('Soubor neobsahuje pole „participants“.')
  return parsed.participants
}

/** Adresa zašifrovaného souboru — respektuje BASE_PATH nasazení. */
export const ENCRYPTED_URL = `${import.meta.env.BASE_URL}ucastnici.enc`

/** Načte obálku z nasazení. Vrací null, když soubor není — to není chyba. */
export async function fetchEnvelope(): Promise<Envelope | null> {
  try {
    const res = await fetch(ENCRYPTED_URL, { cache: 'no-store' })
    if (!res.ok) return null
    const env = (await res.json()) as Envelope
    return env?.v === 1 ? env : null
  } catch {
    return null
  }
}
