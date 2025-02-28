import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'

import { DEFAULT_PAGE_LIMIT } from '@/api/clients'
import { LoadingStates } from '@/enums'
import { ErrorHandler } from '@/helpers'

export const useProposalMultiPageLoading = <D extends { id: number }>(
  loadFn: (page: number, pageLimit: number) => Promise<D[]>,
  opts?: {
    loadOnMount?: boolean
    pageLimit: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadArgs?: any[]
    silentError?: boolean
  },
): {
  data: D[]
  loadingState: LoadingStates
  hasNext: boolean
  load: () => Promise<void>
  reload: () => Promise<void>
  reset: () => void
  update: () => Promise<void>
  loadNext: () => Promise<void>
  setData: Dispatch<SetStateAction<D[]>>
} => {
  const [data, setData] = useState<D[]>([])
  const [loadingState, setLoadingState] = useState<LoadingStates>(LoadingStates.Initial)
  const [hasNext, setHasNext] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const optsWithDefaults = useMemo(() => {
    return {
      loadOnMount: true,
      pageLimit: DEFAULT_PAGE_LIMIT,
      silentError: false,
      ...opts,
    }
  }, [opts])

  const handleError = useCallback(
    (e: unknown) => {
      if (optsWithDefaults.silentError) {
        ErrorHandler.processWithoutFeedback(e)
      } else {
        ErrorHandler.process(e)
      }
    },
    [optsWithDefaults.silentError],
  )

  const handleResponse = useCallback((newData: D[]) => {
    setData(prevData => {
      const map = new Map(prevData.map(item => [item.id, item]))
      newData.forEach(item => map.set(item.id, item))
      return Array.from(map.values())
    })
    setHasNext(newData.length !== 0)
  }, [])

  const load = useCallback(async () => {
    setLoadingState(LoadingStates.Loading)
    try {
      const newData = await loadFn(1, optsWithDefaults.pageLimit)
      handleResponse(newData)
      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [handleError, handleResponse, loadFn, optsWithDefaults.pageLimit])

  const update = useCallback(async () => {
    try {
      const newData = await loadFn(currentPage, optsWithDefaults.pageLimit)
      handleResponse(newData)
      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [handleError, handleResponse, loadFn, currentPage, optsWithDefaults.pageLimit])

  const loadNext = useCallback(async () => {
    if (!hasNext || loadingState === LoadingStates.NextLoading) return

    setLoadingState(LoadingStates.NextLoading)
    try {
      const newData = await loadFn(currentPage + 1, optsWithDefaults.pageLimit)
      setCurrentPage(prevPage => prevPage + 1)
      handleResponse(newData)
      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [
    hasNext,
    loadingState,
    loadFn,
    currentPage,
    optsWithDefaults.pageLimit,
    handleResponse,
    handleError,
  ])

  const reset = useCallback(() => {
    setData([])
    setLoadingState(LoadingStates.Initial)
    setHasNext(true)
    setCurrentPage(1)
  }, [])

  const reload = useCallback(async () => {
    reset()
    await load()
  }, [load, reset])

  useEffect(() => {
    if (!optsWithDefaults.loadOnMount) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, optsWithDefaults.loadArgs ?? [])

  return {
    data,
    loadingState,
    hasNext,
    load,
    update,
    reload,
    reset,
    loadNext,
    setData,
  }
}
