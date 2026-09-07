import { useTheme } from '@mui/material/styles'

/**
 * Barvy pro kreslené obrázky.
 *
 * Pozor na past: aplikace má zapnuté CSS proměnné (`cssVariables`), takže
 * `theme.palette.primary.main` vrátí hodnotu **světlého** tématu i ve chvíli,
 * kdy je zapnuté tmavé. Obrázek pak kreslí světlé barvy na tmavé pozadí —
 * u přízvučných odstínů to jen vypadá jinak, než má, ale u textových barev
 * (`text.secondary`) je výsledek černá na skoro černé, tedy nečitelný.
 *
 * `theme.vars.palette.*` vrací `var(--mui-palette-…)`, která se přepne podle
 * tématu. Tenhle pomocník to jen zabalí a nechá fallback pro případ, že by
 * CSS proměnné byly vypnuté.
 */
export function useFigureColors() {
  const theme = useTheme()
  const p = (theme as unknown as { vars?: typeof theme }).vars?.palette ?? theme.palette
  return {
    primary: p.primary.main,
    success: p.success.main,
    successDark: p.success.dark,
    warning: p.warning.main,
    warningLight: p.warning.light,
    error: p.error.main,
    errorLight: p.error.light,
    info: p.info.main,
    text: p.text.primary,
    textSecondary: p.text.secondary,
    textDisabled: p.text.disabled,
    /** Barva podkladu — na text uvnitř barevného kolečka. */
    paper: p.background.paper,
  }
}
