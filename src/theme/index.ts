import { createTheme as createMuiTheme, PaletteMode } from '@mui/material'

import { breakpoints } from './breakpoints'
import { darkPalette, lightPalette } from './colors'
import { components } from './components'
import { typography } from './typography'

export const createTheme = (mode: PaletteMode) => {
  return createMuiTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography,
    components,
    breakpoints,
    spacing: 4,
    shape: {
      borderRadius: 4,
    },
  })
}
