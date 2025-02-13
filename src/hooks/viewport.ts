import debounce from 'lodash/debounce'
import { useCallback, useEffect, useRef, useState } from 'react'

import { uiStore, useUiState } from '@/store'

export const useViewportSizes = () => {
  const { viewportWidth } = useUiState()
  const [isResizing, setIsResizing] = useState(false)
  const debounceRef = useRef<ReturnType<typeof debounce> | null>(null)

  const assignVhCssVariable = useCallback(() => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [])

  const setViewportSizes = useCallback(() => {
    assignVhCssVariable()
    uiStore.setViewportWidth(window.innerWidth)
    setIsResizing(false)
  }, [assignVhCssVariable])

  useEffect(() => {
    debounceRef.current = debounce(() => {
      setViewportSizes()
    }, 300)

    return () => {
      debounceRef.current?.cancel()
    }
  }, [setViewportSizes])

  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true)
      debounceRef.current?.()
    }

    assignVhCssVariable()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [assignVhCssVariable])

  return { viewportWidth, isResizing }
}
