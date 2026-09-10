/**
 * Nástěnka — sdílené otázky ze sálu.
 *
 * Běží nad Supabase, protože GitHub Pages umí jen posílat soubory a zápis
 * nepřijme. Čte se i zapisuje přes obyčejné HTTP (PostgREST), takže tu není
 * žádná knihovna navíc; novinky se dotahují dotazem po pár vteřinách, což
 * je na deset lidí v sále víc než dost.
 *
 * Anon klíč je ve zdrojáku schválně — je to veřejný identifikátor projektu,
 * ne tajemství. Co s ním kdo smí, rozhodují pravidla v databázi: číst a
 * přidávat ano, mazat a přepisovat ne, a jméno musí být jedno z těch níž.
 */

/* ---------------------------------------------------- sem přijdou dvě hodnoty
 * Supabase → Project Settings → API:
 *   Project URL  →  ADRESA
 *   anon public  →  KLIC
 * Dokud jsou prázdné, nástěnka to řekne a nikam se neptá.
 */
export const ADRESA = ''
export const KLIC = ''

export const JMENA = [
  'Darina',
  'Michal',
  'Martin',
  'Barbora',
  'Vít',
  'Tomáš',
  'Svitlana',
  'Jana',
  'Kateřina',
  'Marie',
] as const

export interface Zprava {
  id: string
  vlakno: string | null
  jmeno: string
  text: string
  lekce: string | null
  cas: string
}

export const nastaveno = () => Boolean(ADRESA && KLIC)

const hlavicky = () => ({
  apikey: KLIC,
  Authorization: `Bearer ${KLIC}`,
  'Content-Type': 'application/json',
})

export async function nacti(): Promise<Zprava[]> {
  const r = await fetch(`${ADRESA}/rest/v1/zpravy?select=*&order=cas.asc`, {
    headers: hlavicky(),
  })
  if (!r.ok) throw new Error(`nástěnka: ${r.status}`)
  return r.json()
}

export async function posli(z: Omit<Zprava, 'id' | 'cas'>): Promise<void> {
  const r = await fetch(`${ADRESA}/rest/v1/zpravy`, {
    method: 'POST',
    headers: { ...hlavicky(), Prefer: 'return=minimal' },
    body: JSON.stringify(z),
  })
  if (!r.ok) throw new Error(`nástěnka: ${r.status} ${await r.text()}`)
}
