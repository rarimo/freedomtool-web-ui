import _isEmpty from 'lodash/isEmpty'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ErrorHandler } from '@/helpers'

export const useLoading = <T>(
  initialState: T,
  loadFn: () => Promise<T>,
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadArgs?: any[] | null
    loadOnMount?: boolean
    silentError?: boolean
  },
) => {
  const { loadArgs, loadOnMount: _loadOnMount } = options ?? {}
  const loadOnMount = useMemo(() => _loadOnMount ?? true, [_loadOnMount])

  const [isLoading, setIsLoading] = useState(loadOnMount)
  const [isLoadingError, setIsLoadingError] = useState(false)
  const [data, setData] = useState(initialState)

  const isIgnoredRef = useRef(false)

  const isEmpty = useMemo(() => _isEmpty(data), [data])

  const handleError = (e: unknown) => {
    if (options?.silentError) {
      ErrorHandler.processWithoutFeedback(e)
    } else {
      ErrorHandler.process(e)
    }
  }

  const load = async () => {
    isIgnoredRef.current = false
    setIsLoading(true)
    setIsLoadingError(false)
    setData(initialState)

    try {
      const result = await loadFn()
      if (!isIgnoredRef.current) setData(result)
    } catch (e) {
      if (!isIgnoredRef.current) {
        setIsLoadingError(true)
        handleError(e)
      }
    } finally {
      if (!isIgnoredRef.current) setIsLoading(false)
    }
  }

  useEffect(() => {
    if (loadOnMount) {
      load()
    }

    return () => {
      isIgnoredRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, loadArgs ?? [])

  const reload = async () => {
    await load()
  }

  const update = async () => {
    isIgnoredRef.current = false
    setIsLoadingError(false)

    try {
      const result = await loadFn()
      if (!isIgnoredRef.current) setData(result)
    } catch (e) {
      if (!isIgnoredRef.current) {
        setIsLoadingError(true)
        handleError(e)
      }
    }
  }

  const reset = () => {
    isIgnoredRef.current = true
    setIsLoading(false)
    setIsLoadingError(false)
    setData(initialState)
  }

  return { data, isLoading, isLoadingError, isEmpty, reload, update, reset }
}
