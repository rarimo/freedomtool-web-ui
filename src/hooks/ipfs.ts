import { useEffect, useState } from 'react'

import { config } from '@/config'
import { ErrorHandler } from '@/helpers'

export const useIpfsLoading = <T>(cid: string | null) => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!cid) return

    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)

      try {
        const response = await fetch(`${config.IPFS_NODE_URL}/ipfs/${cid}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const result: T = await response.json()
        setData(result)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [cid])

  return { data, isLoading, isError }
}
