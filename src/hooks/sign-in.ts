import { useAppKit } from '@reown/appkit/react'
import { useState } from 'react'

import { ErrorHandler } from '@/helpers'

export const useSignIn = () => {
  const { open } = useAppKit()

  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await open()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
    setIsLoading(false)
  }

  return {
    handleSignIn,
    isLoading,
  }
}
