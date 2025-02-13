import { PaletteMode } from '@mui/material'
import { useEffect, useState } from 'react'

import { useUiState } from '@/store'
import { getSystemTheme } from '@/theme/helpers'

export const useSystemPaletteMode = () => {
  const [systemTheme, setSystemTheme] = useState<PaletteMode>(getSystemTheme())
  const { paletteMode } = useUiState()

  useEffect(() => {
    const listener = ({ matches }: { matches: boolean }) => {
      setSystemTheme(matches ? 'dark' : 'light')
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener)
    }
  }, [])

  return paletteMode === 'system' ? systemTheme : paletteMode
}
