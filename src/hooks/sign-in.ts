import { useRef, useState } from 'react'

import { AuthGuardRef } from '@/common/AuthGuard'
import { ErrorHandler } from '@/helpers'

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const authGuardRef = useRef<AuthGuardRef>(null)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await authGuardRef.current?.verifyAuth()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
    setIsLoading(false)
  }

  return {
    isLoading,
    setIsLoading,
    handleSignIn,
    authGuardRef,
  }
}
