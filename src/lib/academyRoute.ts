/**
 * Routování akademie uvnitř jednoho hashe.
 *
 * Aplikace běží na GitHub Pages, kde neexistuje server, který by uměl přesměrovat
 * hluboký odkaz zpátky na index.html. Proto je celá adresa v hashi:
 *
 *   #academy                       rozcestník kurzů
 *   #academy?q=<dotaz>             výsledky hledání
 *   #academy?nastenka             sdílené otázky ze sálu
 *   #academy?odpovedi             zodpovězené otázky z nástěnky
 *   #academy/<kurz>                detail kurzu se sylabem
 *   #academy/<kurz>/<lekce>        stránka lekce
 *
 * Dotaz visí za otazníkem schválně: kdyby měl vlastní segment cesty, srazil
 * by se s kurzem toho jména. Takhle je adresa výsledků sdílitelná a zpátky
 * v prohlížeči funguje jako všude jinde.
 */

export type AcademyRoute =
  | { view: 'list' }
  | { view: 'search'; q: string }
  | { view: 'nastenka' }
  | { view: 'odpovedi' }
  | { view: 'course'; course: string }
  | { view: 'lesson'; course: string; lesson: string }

const PREFIX = '#academy'

export function readAcademyRoute(hash: string = window.location.hash): AcademyRoute {
  const rest = hash.slice(PREFIX.length).replace(/^\//, '')
  if (rest.startsWith('?')) {
    const p = new URLSearchParams(rest.slice(1))
    if (p.has('nastenka')) return { view: 'nastenka' }
    if (p.has('odpovedi')) return { view: 'odpovedi' }
    const q = p.get('q') ?? ''
    return q ? { view: 'search', q } : { view: 'list' }
  }
  if (!rest) return { view: 'list' }
  const [course, lesson] = rest.split('/').map(decodeURIComponent)
  if (!course) return { view: 'list' }
  if (!lesson) return { view: 'course', course }
  return { view: 'lesson', course, lesson }
}

export function academyHref(route: AcademyRoute): string {
  if (route.view === 'list') return PREFIX
  if (route.view === 'search') return `${PREFIX}?q=${encodeURIComponent(route.q)}`
  if (route.view === 'nastenka') return `${PREFIX}?nastenka`
  if (route.view === 'odpovedi') return `${PREFIX}?odpovedi`
  if (route.view === 'course') return `${PREFIX}/${route.course}`
  return `${PREFIX}/${route.course}/${route.lesson}`
}

/** Odkaz na akademii zvenčí aplikace — ke zkopírování do pozvánky. */
export function academyUrl(): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}${PREFIX}`
}

export function goAcademy(route: AcademyRoute): void {
  window.location.hash = academyHref(route)
  window.scrollTo({ top: 0 })
}
