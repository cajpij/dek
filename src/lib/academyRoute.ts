/**
 * Routování akademie uvnitř jednoho hashe.
 *
 * Aplikace běží na GitHub Pages, kde neexistuje server, který by uměl přesměrovat
 * hluboký odkaz zpátky na index.html. Proto je celá adresa v hashi:
 *
 *   #academy                       rozcestník kurzů
 *   #academy/<kurz>                detail kurzu se sylabem
 *   #academy/<kurz>/<lekce>        stránka lekce
 */

export type AcademyRoute =
  | { view: 'list' }
  | { view: 'course'; course: string }
  | { view: 'lesson'; course: string; lesson: string }

const PREFIX = '#academy'

export function readAcademyRoute(hash: string = window.location.hash): AcademyRoute {
  const rest = hash.slice(PREFIX.length).replace(/^\//, '')
  if (!rest) return { view: 'list' }
  const [course, lesson] = rest.split('/').map(decodeURIComponent)
  if (!course) return { view: 'list' }
  if (!lesson) return { view: 'course', course }
  return { view: 'lesson', course, lesson }
}

export function academyHref(route: AcademyRoute): string {
  if (route.view === 'list') return PREFIX
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
