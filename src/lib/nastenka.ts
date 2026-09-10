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
 * přidávat ano, přepisovat ne, a jméno musí být jedno z těch níž.
 *
 * Smazat jde jen vlastní zpráva. Při odeslání se k ní vyrobí náhodné
 * tajemství — uloží se do databáze a zároveň do localStorage prohlížeče,
 * který zprávu napsal. Číst se ten sloupec nedá (sloupcová práva) a smazat
 * řádek jde jen s hlavičkou X-Tajemstvi, která sedí. Cizí zprávu tedy
 * nesmaže ani ten, kdo si veřejný klíč opíše ze zdrojáku.
 */

/* ---------------------------------------------------- sem přijdou dvě hodnoty
 * Supabase → Project Settings → API:
 *   Project URL  →  ADRESA
 *   anon public  →  KLIC
 * Dokud jsou prázdné, nástěnka to řekne a nikam se neptá.
 */
export const ADRESA = 'https://gilcqpndhpxqphydpueb.supabase.co'
export const KLIC = 'sb_publishable_LMv4M3wkJzzQkhGPjl1MVg_HtG3Grit'

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

/** Sloupce, které se čtou. Ne `*` — `tajemstvi` je před čtením zavřené. */
const SLOUPCE = 'id,vlakno,jmeno,text,lekce,cas'

/** id → tajemství zpráv napsaných z tohohle prohlížeče. */
const MOJE = 'nastenka.moje'

export const nastaveno = () => Boolean(ADRESA && KLIC)

export function mojeZpravy(): Record<string, string> {
  try {
    const s = localStorage.getItem(MOJE)
    return s ? (JSON.parse(s) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function zapisMoje(m: Record<string, string>) {
  try {
    localStorage.setItem(MOJE, JSON.stringify(m))
  } catch {
    // soukromé okno nebo zakázané úložiště — zpráva odejde, jen ji nepůjde smazat
  }
}

const nahodne = (bajtu: number) =>
  [...crypto.getRandomValues(new Uint8Array(bajtu))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

/** Id si vyrábí prohlížeč, aby k němu rovnou znal tajemství — bez čtení zpátky. */
function noveId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const h = nahodne(16)
  const v4 = h.slice(0, 12) + '4' + h.slice(13, 16) + ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16) + h.slice(17)
  return `${v4.slice(0, 8)}-${v4.slice(8, 12)}-${v4.slice(12, 16)}-${v4.slice(16, 20)}-${v4.slice(20)}`
}

/**
 * Supabase má dvě generace klíčů a posílají se jinak.
 *
 * Starý `anon` je JWT (začíná `eyJ`) a chce ho i hlavička Authorization.
 * Nový `sb_publishable_…` JWT není — když se pošle jako Bearer token,
 * PostgREST ho neumí přečíst a vrátí 401. Proto se podle tvaru rozhoduje,
 * jestli tu druhou hlavičku vůbec přidat.
 */
const hlavicky = (): Record<string, string> => {
  const h: Record<string, string> = { apikey: KLIC, 'Content-Type': 'application/json' }
  if (KLIC.startsWith('eyJ')) h.Authorization = `Bearer ${KLIC}`
  return h
}

export async function nacti(): Promise<Zprava[]> {
  const r = await fetch(`${ADRESA}/rest/v1/zpravy?select=${SLOUPCE}&order=cas.asc`, {
    headers: hlavicky(),
  })
  if (!r.ok) throw new Error(`nástěnka: ${r.status}`)
  return r.json()
}

export async function posli(z: Omit<Zprava, 'id' | 'cas'>): Promise<void> {
  const id = noveId()
  const tajemstvi = nahodne(24)

  const odesli = (telo: object) =>
    fetch(`${ADRESA}/rest/v1/zpravy`, {
      method: 'POST',
      headers: { ...hlavicky(), Prefer: 'return=minimal' },
      body: JSON.stringify(telo),
    })

  let r = await odesli({ ...z, id, tajemstvi })

  // Než se v databázi objeví sloupec tajemstvi (scripts/nastenka-mazani.sql),
  // ho PostgREST odmítne. Zpráva se má odeslat i tak — jen nepůjde smazat.
  if (r.status === 400 && (await r.clone().text()).includes('tajemstvi')) {
    const bezTajemstvi = await odesli({ ...z, id })
    if (!bezTajemstvi.ok) throw new Error(`nástěnka: ${bezTajemstvi.status} ${await bezTajemstvi.text()}`)
    return
  }

  if (!r.ok) throw new Error(`nástěnka: ${r.status} ${await r.text()}`)
  zapisMoje({ ...mojeZpravy(), [id]: tajemstvi })
}

/**
 * Smaže zprávu. Vrátí true, jen když řádek opravdu zmizel — PostgREST na
 * DELETE odpovídá 204 i tehdy, když pravidlo nepustilo nic, takže se ptáme
 * na smazané řádky zpátky a počítáme je.
 */
export async function smaz(id: string, tajemstvi: string): Promise<boolean> {
  const r = await fetch(`${ADRESA}/rest/v1/zpravy?id=eq.${encodeURIComponent(id)}&select=id`, {
    method: 'DELETE',
    headers: { ...hlavicky(), 'X-Tajemstvi': tajemstvi, Prefer: 'return=representation' },
  })
  if (!r.ok) return false
  const smazane = (await r.json()) as { id: string }[]
  if (smazane.length === 0) return false
  const m = mojeZpravy()
  delete m[id]
  zapisMoje(m)
  return true
}
