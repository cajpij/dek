import { createTheme } from '@mui/material/styles'

const SYSTEM_FONTS = [
  'ui-sans-serif',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')

/**
 * Plochý motiv: jeden podklad, oddělovače místo stínů.
 * Světlá i tmavá varianta jde přes CSS proměnné, takže se přepíná bez přerenderu.
 */
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#3352d8' },
        success: { main: '#0b7f57' },
        warning: { main: '#a75a06' },
        error: { main: '#c31f38' },
        background: { default: '#ffffff', paper: '#ffffff' },
        divider: '#e4e6ea',
      },
    },
    dark: {
      palette: {
        primary: { main: '#7f9bff' },
        success: { main: '#48c79a' },
        warning: { main: '#e2a24a' },
        error: { main: '#ff6b7f' },
        background: { default: '#0d0f12', paper: '#0d0f12' },
        divider: '#252a31',
      },
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: SYSTEM_FONTS,
    h1: { letterSpacing: '-0.03em' },
    h4: { fontWeight: 660, letterSpacing: '-0.02em' },
    overline: { fontWeight: 700, letterSpacing: '0.08em' },
    button: { textTransform: 'none', fontWeight: 550 },
  },
  components: {
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 6, borderRadius: 999 },
        bar: { transition: 'transform .3s linear' },
      },
    },
  },
})
