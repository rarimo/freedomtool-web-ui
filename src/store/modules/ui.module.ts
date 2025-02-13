import { PaletteMode } from '@mui/material'

import { createStore } from '@/helpers'
import { breakpoints } from '@/theme/breakpoints'
import { AppPaletteMode } from '@/theme/colors'
import { getSystemTheme } from '@/theme/helpers'

type UiStore = {
  viewportHeight: number
  viewportWidth: number
  paletteMode: AppPaletteMode
}

export const [uiStore, useUiState] = createStore(
  'ui',
  {
    viewportWidth: 0,
    paletteMode: 'system',
  } as UiStore,
  state => ({
    get isMobile() {
      return state.viewportWidth < breakpoints.values.sm
    },
    get isTablet() {
      return (
        state.viewportWidth >= breakpoints.values.sm && state.viewportWidth < breakpoints.values.md
      )
    },
    get isDesktop() {
      return state.viewportWidth >= breakpoints.values.md
    },
    get isDarkMode() {
      if (state.paletteMode === 'system') {
        const systemPalette = getSystemTheme()
        return systemPalette === 'dark'
      }

      return state.paletteMode === 'dark'
    },
    get supportedPaletteMode(): PaletteMode {
      if (state.paletteMode === 'system') {
        return getSystemTheme()
      }

      return state.paletteMode
    },
  }),
  state => ({
    setViewportWidth: (width: number) => {
      state.viewportWidth = width
    },
    setViewportHeight: (height: number) => {
      state.viewportHeight = height
    },
    togglePaletteMode: () => {
      let isDarkMode = state.paletteMode === 'dark'

      if (state.paletteMode === 'system') {
        const systemPalette = getSystemTheme()
        isDarkMode = systemPalette === 'dark'
      }

      state.paletteMode = isDarkMode ? 'light' : 'dark'
    },
    clearUiStorage: () => {
      state.paletteMode = 'system'
      state.viewportWidth = 0
    },
  }),
)
