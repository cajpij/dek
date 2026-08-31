#!/usr/bin/env node
/**
 * Zašifruje ucastnici.json do public/ucastnici.enc.
 *
 *   npm run encrypt:participants
 *
 * Heslo se zadává na terminálu a nikam se neukládá — ani do souboru, ani do
 * historie shellu. Pro neinteraktivní běh jde nasypat na stdin:
 *
 *   read -rs PASS && printf '%s' "$PASS" | node scripts/encrypt-participants.mjs
 *   RUNSHEET_PASSPHRASE='heslo' node scripts/encrypt-participants.mjs
 *
 * Výsledný .enc se commituje a nasazuje. ucastnici.json zůstává v .gitignore.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// Volitelně jiný vstup a výstup: node scripts/encrypt-participants.mjs [zdroj.json] [cil.enc]
const [argSource, argTarget] = process.argv.slice(2)
const SOURCE = argSource ? path.resolve(argSource) : path.join(ROOT, 'ucastnici.json')
const TARGET = argTarget ? path.resolve(argTarget) : path.join(ROOT, 'public', 'ucastnici.enc')

/** OWASP doporučení pro PBKDF2-SHA256 — drží offline hádání hesla drahé. */
const ITERATIONS = 600_000
const MIN_LENGTH = 12

const CR = '\r'
const LF = '\n'
const ETX = '\u0003' // ctrl-c
const EOT = '\u0004' // ctrl-d
const DEL = '\u007f'

const b64 = (bytes) => Buffer.from(bytes).toString('base64')

/**
 * Načte heslo. Na terminálu ho maskuje hvězdičkami, aby bylo poznat, že se
 * píše; z roury si ho vezme rovnou a nic nevypisuje.
 */
function askHidden(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin
    if (!stdin.isTTY) {
      let data = ''
      stdin.setEncoding('utf8')
      stdin.on('data', (d) => {
        data += d
      })
      stdin.on('end', () => resolve(data.replace(/\r?\n$/, '')))
      return
    }
    process.stdout.write(question)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    let buf = ''
    const onData = (ch) => {
      if (ch === CR || ch === LF || ch === EOT) {
        stdin.setRawMode(false)
        stdin.pause()
        stdin.removeListener('data', onData)
        process.stdout.write('\n')
        resolve(buf)
      } else if (ch === ETX) {
        stdin.setRawMode(false)
        process.stdout.write('\n')
        process.exit(130)
      } else if (ch === DEL || ch === '\b') {
        if (buf.length > 0) {
          buf = buf.slice(0, -1)
          process.stdout.write('\b \b')
        }
      } else if (ch >= ' ') {
        buf += ch
        process.stdout.write('*')
      }
    }
    stdin.on('data', onData)
  })
}

const die = (msg) => {
  console.error(`\n✗ ${msg}`)
  process.exit(1)
}

let raw
try {
  raw = await readFile(SOURCE, 'utf8')
} catch {
  die(`Nenašel jsem ${path.relative(ROOT, SOURCE)}. Vzor je v ucastnici.example.json.`)
}

let parsed
try {
  parsed = JSON.parse(raw)
} catch (e) {
  die(`ucastnici.json není platný JSON: ${e.message}`)
}
if (!Array.isArray(parsed.participants) || parsed.participants.length === 0) {
  die('ucastnici.json nemá neprázdné pole „participants“.')
}

const fromEnv = process.env.RUNSHEET_PASSPHRASE
if (fromEnv) {
  console.log('Beru heslo z proměnné RUNSHEET_PASSPHRASE.')
}
const passphrase = fromEnv ?? (await askHidden('Heslo pro zašifrování (píše se, jen se maskuje): '))
if (passphrase.length < MIN_LENGTH) {
  die(
    `Heslo má ${passphrase.length} znaků, potřebuje aspoň ${MIN_LENGTH}.\n` +
      '  Zašifrovaný soubor bude veřejně ke stažení, takže se na něm dá heslo\n' +
      '  hádat offline. Krátké heslo tu neochrání nic.',
  )
}
if (!fromEnv && process.stdin.isTTY) {
  const again = await askHidden('Heslo znovu pro kontrolu: ')
  if (again !== passphrase) die('Hesla se neshodují, nic jsem nezapsal.')
}

// Komentáře a další klíče se zahazují — šifruje se jen samotný seznam.
const plaintext = JSON.stringify({ participants: parsed.participants })

const salt = crypto.getRandomValues(new Uint8Array(16))
const iv = crypto.getRandomValues(new Uint8Array(12))
const material = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(passphrase),
  'PBKDF2',
  false,
  ['deriveKey'],
)
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  material,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
)
const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext))

const envelope = {
  v: 1,
  kdf: 'PBKDF2',
  hash: 'SHA-256',
  iterations: ITERATIONS,
  salt: b64(salt),
  iv: b64(iv),
  ct: b64(new Uint8Array(ct)),
}

await writeFile(TARGET, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8')

console.log(`\n✓ Zašifrováno ${parsed.participants.length} účastníků → ${path.relative(ROOT, TARGET)}`)
console.log('  Soubor se commituje a nasazuje. Heslo předej lidem jinou cestou než tímhle repem.')
