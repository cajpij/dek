const pad = (n: number) => (n < 10 ? `0${n}` : String(n))

/**
 * Odpočet jako mm:ss (nebo h:mm:ss u dlouhých bloků).
 * Záporná hodnota = blok přetahuje, vrací se s typografickým minusem.
 */
export function mmss(sec: number): string {
  const negative = sec < 0
  const total = Math.abs(Math.round(sec))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const body = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
  return negative ? `−${body}` : body
}

/** Hodiny na zdi, např. „14:05“. */
export function clockFromDate(d: Date): string {
  return `${d.getHours()}:${pad(d.getMinutes())}`
}

/** Minuty od půlnoci → „14:05“, s přetečením přes půlnoc. */
export function clockFromMinutes(mins: number): string {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440
  return `${Math.floor(m / 60)}:${pad(m % 60)}`
}

/** Délka bloku v celých minutách pro výpis v programu. */
export function minutesLabel(sec: number): string {
  return `${Math.round(sec / 60)} min`
}
