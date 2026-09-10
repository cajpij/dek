/**
 * Zodpovězené otázky z nástěnky.
 *
 * Tenhle soubor needituje člověk — dopisuje do něj naplánovaná automatizace
 * (`scripts/rutina-otazky.md`) přes `scripts/pridej-odpoved.py`. Proto je
 * schválně oddělený od `academy.ts`: automatizace nemá jak sáhnout do lekcí.
 *
 * `id` je id zprávy na nástěnce. Podle něj se pozná, co už je zodpovězené,
 * takže se stejná otázka nezpracuje dvakrát.
 */

export interface Odpoved {
  /** id zprávy na nástěnce */
  id: string
  jmeno: string
  otazka: string
  /** kdy se ptali, ISO */
  cas: string
  /** kdy vznikla odpověď, ISO */
  zodpovezeno: string
  /** z jaké lekce se ptali, když je to známé */
  lekce?: string
  /** Odpověď. Odstavce se oddělují prázdným řádkem. */
  odpoved: string
  /** Lekce, ze kterých odpověď vychází. Prázdné = v lekcích to není. */
  zdroje: { label: string; href: string }[]
}

export const ODPOVEDI: Odpoved[] = []
