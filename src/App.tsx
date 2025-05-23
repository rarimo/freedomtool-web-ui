import { CssBaseline, ThemeProvider } from '@mui/material'
import { useAppKit, useAppKitState } from '@reown/appkit/react'
import { memo, useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RouterProvider } from 'react-router-dom'

import { AppLoader, ErrorBoundaryFallback } from '@/common'
import { ToastsManager } from '@/contexts'
import { useWeb3Context } from '@/contexts/web3-context'
import { useViewportSizes } from '@/hooks'
import { useLocalizedZodSchema } from '@/hooks/zod'
import { createRouter } from '@/router'
import { authStore } from '@/store'
import { createTheme } from '@/theme'

const router = createRouter()

const App = () => {
  const {
    address,
    isConnected,
    isInitialized: isWeb3Initialized,
    isCorrectNetwork,
  } = useWeb3Context()
  const { close } = useAppKit()
  const { open: isOpen, loading: isLoading } = useAppKitState()

  useViewportSizes()
  useLocalizedZodSchema()

  // Keep only light mode
  const theme = useMemo(() => createTheme('light'), [])

  useEffect(() => {
    if ((!address && isConnected) || !isConnected) return
    authStore.verifyToken(address || '')
  }, [address, isConnected])

  useEffect(() => {
    const handleCloseModal = async () => {
      if (isOpen && !isCorrectNetwork && !isLoading) {
        await close()
      }
    }
    handleCloseModal()
  }, [isOpen, isCorrectNetwork, close, isLoading])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastsManager>
        <div className='App' key='app_main'>
          {isWeb3Initialized ? (
            <ErrorBoundary
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorBoundaryFallback onReset={resetErrorBoundary} />
              )}
              onReset={() => window.location.reload()}
            >
              <RouterProvider router={router} future={{ v7_startTransition: true }} />
            </ErrorBoundary>
          ) : (
            <AppLoader />
          )}
        </div>
      </ToastsManager>
    </ThemeProvider>
  )
}

export default memo(App)
