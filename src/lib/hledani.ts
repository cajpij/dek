import { COURSES, type Block, type Course, type Lesson } from '../academy'

/**
 * Fulltext nad akademií.
 *
 * Lekce jsou data, ne stránky, takže se index staví přímo z nich — projde se
 * každý blok a rozloží na útržky s vahou podle toho, kde ten text stojí.
 * Titulek lekce váží dvanáctkrát víc než odstavec; obsah vloženého souboru
 * naopak skoro nic, jinak by dotaz na běžné slovo vytáhl vždycky ty lekce,
 * které v sobě mají celý rutina.md.
 *
 * Diakritika se srovnává pryč, takže „cvičný“ najde i ten, kdo napíše
 * „cvicny“. Víceslovný dotaz je AND: musí sedět všechna slova.
 */

/** Kde útržek stojí — čte se to i v seznamu výsledků. */
export type Puvod =
  | 'titul'
  | 'shrnutí'
  | 'co se naučíš'
  | 'nadpis'
  | 'oddíl'
  | 'soubor'
  | 'upozornění'
  | 'krok'
  | 'tabulka'
  | 'kód'
  | 'obsah souboru'
  | 'odkaz'
  | 'text'

const VAHA: Record<Puvod, number> = {
  titul: 12,
  soubor: 9,
  'shrnutí': 6,
  nadpis: 5,
  'oddíl': 5,
  'co se naučíš': 4,
  'upozornění': 4,
  krok: 3,
  odkaz: 2,
  tabulka: 2,
  text: 1,
  'kód': 1,
  'obsah souboru': 0.3,
}

/** Kolik zásahů z jednoho útržku se ještě počítá — ať dlouhý soubor nepřebije titulek. */
const STROP_ZASAHU = 4

export interface Utrzek {
  puvod: Puvod
  text: string
}

export interface ZaznamLekce {
  kurz: Course
  lekce: Lesson
  utrzky: Utrzek[]
}

export interface Vysledek {
  kurz: Course
  lekce: Lesson
  skore: number
  /** Nejlepší nalezené místo — do seznamu výsledků jako ukázka. */
  ukazka: { puvod: Puvod; text: string; od: number; do: number } | null
  zasahu: number
}

/** Bez diakritiky a malými písmeny — jinak by „IČO“ nenašel ten, kdo píše „ico“. */
export function srovnej(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function zBloku(b: Block, ven: Utrzek[]): void {
  const dej = (puvod: Puvod, ...texty: (string | undefined)[]) => {
    for (const t of texty) if (t) ven.push({ puvod, text: t })
  }
  switch (b.kind) {
    case 'p':
      return dej('text', b.text)
    case 'h':
      return dej('nadpis', b.text)
    case 'list':
      return dej('text', ...b.items)
    case 'steps':
      for (const i of b.items) {
        dej('krok', i.title)
        dej('text', i.body)
        dej('kód', i.code)
        dej('text', i.image?.alt, i.image?.caption)
        for (const l of i.links ?? []) dej('odkaz', l.label, l.note)
      }
      return
    case 'code':
      return dej('kód', b.text, b.caption)
    case 'note':
      dej('upozornění', b.title)
      return dej('text', b.text)
    case 'table':
      dej('tabulka', ...b.head)
      for (const r of b.rows) dej('tabulka', ...r)
      return
    case 'figure':
      return dej('text', b.caption)
    case 'image':
      return dej('text', b.alt, b.caption)
    case 'sekce':
      dej('oddíl', b.titul, b.stitek)
      return dej('text', b.popis)
    case 'soubor':
      dej('soubor', b.nazev)
      dej('text', b.popis)
      return dej('obsah souboru', b.obsah)
    case 'checklist':
      dej('upozornění', b.title)
      return dej('text', ...b.items)
    case 'task':
      dej('upozornění', b.title)
      return dej('text', b.intro, ...b.items, b.hint)
    case 'video':
      dej('odkaz', b.title)
      for (const v of b.items) dej('text', v.title, v.author, v.note)
      return
    case 'platform':
      for (const x of [...b.mac, ...b.win]) zBloku(x, ven)
      return
    case 'tabs':
      for (const t of b.items) {
        dej('oddíl', t.label)
        for (const x of t.blocks) zBloku(x, ven)
      }
      return
    case 'links':
      dej('odkaz', b.title)
      for (const i of b.items) dej('odkaz', i.label, i.note)
      return
  }
}

function zLekce(kurz: Course, lekce: Lesson): ZaznamLekce {
  const utrzky: Utrzek[] = [
    { puvod: 'titul', text: lekce.title },
    { puvod: 'titul', text: lekce.slug.replace(/-/g, ' ') },
    { puvod: 'shrnutí', text: lekce.summary },
    ...lekce.outcomes.map((o): Utrzek => ({ puvod: 'co se naučíš', text: o })),
  ]
  for (const b of lekce.body) zBloku(b, utrzky)
  return { kurz, lekce, utrzky }
}

/** Postaví se jednou a drží se — lekce se za běhu nemění. */
export const INDEX: ZaznamLekce[] = COURSES.flatMap((k) => k.lessons.map((l) => zLekce(k, l)))

/** Předpočítané srovnané znění, ať se to nedělá při každém úhozu. */
const SROVNANE = INDEX.map((z) => z.utrzky.map((u) => srovnej(u.text)))

function pocetVyskytu(kupka: string, jehla: string): number {
  let n = 0
  let i = kupka.indexOf(jehla)
  while (i !== -1) {
    n++
    i = kupka.indexOf(jehla, i + jehla.length)
  }
  return n
}

export function hledej(dotaz: string): Vysledek[] {
  const slova = srovnej(dotaz).split(/\s+/).filter(Boolean)
  if (slova.length === 0) return []

  const out: Vysledek[] = []
  INDEX.forEach((zaznam, iz) => {
    const texty = SROVNANE[iz]
    let skore = 0
    let zasahu = 0
    let nejlepsi: Vysledek['ukazka'] = null
    let nejlepsiVaha = -1

    for (const slovo of slova) {
      let naslo = false
      texty.forEach((t, iu) => {
        const n = pocetVyskytu(t, slovo)
        if (n === 0) return
        naslo = true
        const u = zaznam.utrzky[iu]
        const vaha = VAHA[u.puvod]
        skore += vaha * Math.min(n, STROP_ZASAHU)
        zasahu += n
        // Celé slovo váží víc než kus jiného slova.
        const cele = new RegExp(`(^|[^a-z0-9])${slovo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`)
        if (cele.test(t)) skore += vaha
        if (vaha > nejlepsiVaha) {
          nejlepsiVaha = vaha
          const od = t.indexOf(slovo)
          nejlepsi = { puvod: u.puvod, text: u.text, od, do: od + slovo.length }
        }
      })
      // AND: co nemá všechna slova, do výsledků nepatří.
      if (!naslo) {
        skore = -1
        return
      }
    }
    if (skore > 0) out.push({ kurz: zaznam.kurz, lekce: zaznam.lekce, skore, ukazka: nejlepsi, zasahu })
  })

  return out.sort((a, b) => b.skore - a.skore || a.lekce.title.localeCompare(b.lekce.title, 'cs'))
}

/** Kousek textu kolem nálezu, ať je v seznamu vidět kontext. */
export function vyrizni(text: string, od: number, doo: number, sirka = 90): string {
  const zac = Math.max(0, od - sirka)
  const kon = Math.min(text.length, doo + sirka)
  return (zac > 0 ? '…' : '') + text.slice(zac, kon) + (kon < text.length ? '…' : '')
}

/**
 * Rozseká ukázku na kusy podle toho, co se má zvýraznit.
 *
 * Hledá se ve srovnaném znění (bez diakritiky), ale vracet se musí původní
 * text — jinak by ve výsledcích zmizely háčky. Proto se indexy počítají nad
 * srovnanou kopií, která má stejnou délku jako originál.
 */
export function zvyrazni(text: string, dotaz: string): { text: string; shoda: boolean }[] {
  const slova = srovnej(dotaz).split(/\s+/).filter(Boolean)
  const hledane = srovnej(text)
  const oznaceno = new Array<boolean>(text.length).fill(false)
  for (const s of slova) {
    let i = hledane.indexOf(s)
    while (i !== -1) {
      for (let j = i; j < i + s.length && j < oznaceno.length; j++) oznaceno[j] = true
      i = hledane.indexOf(s, i + s.length)
    }
  }
  const kusy: { text: string; shoda: boolean }[] = []
  let zac = 0
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || oznaceno[i] !== oznaceno[zac]) {
      kusy.push({ text: text.slice(zac, i), shoda: oznaceno[zac] })
      zac = i
    }
  }
  return kusy
}
