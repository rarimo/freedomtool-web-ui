import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useGoBack = (fallback: string) => {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(() => {
    if (location.state?.canGoBack) {
      navigate(-1)
      return
    }
    navigate(fallback, { replace: true })
  }, [fallback, location.state?.canGoBack, navigate])
}
