import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'

import { DEFAULT_PAGE_LIMIT } from '@/api/clients'
import { LoadingStates } from '@/enums'
import { ErrorHandler } from '@/helpers'

export const useProposalMultiPageLoading = <D>(
  loadFn: (page: number, pageLimit: number, lastProposalId: number) => Promise<D[]>,
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
  const [totalItems, setTotalItems] = useState<number | null>(null)

  const [lastProposalId, setLastProposalId] = useState<number | null>(null)

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

  const handleResponse = useCallback(
    (newData: D[], total: number | null) => {
      setData(prevData => [...prevData, ...newData])
      setTotalItems(total)
      if (total !== null) {
        setHasNext(newData.length >= optsWithDefaults.pageLimit && newData.length < total)
        return
      }
      setHasNext(newData.length >= optsWithDefaults.pageLimit)
    },
    [optsWithDefaults.pageLimit],
  )

  const load = useCallback(async () => {
    setLoadingState(LoadingStates.Loading)
    try {
      const newData = await loadFn(1, optsWithDefaults.pageLimit, lastProposalId ?? 0)
      handleResponse(newData, newData.length)
      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [handleError, handleResponse, loadFn, optsWithDefaults.pageLimit, lastProposalId])

  const update = useCallback(async () => {
    try {
      const newData = await loadFn(currentPage, optsWithDefaults.pageLimit, lastProposalId ?? 0)
      handleResponse(newData, newData.length)
      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [handleError, handleResponse, loadFn, currentPage, optsWithDefaults.pageLimit, lastProposalId])

  const loadNext = useCallback(async () => {
    if (!hasNext || loadingState === LoadingStates.NextLoading || lastProposalId === null) return

    setLoadingState(LoadingStates.NextLoading)
    try {
      const newData = await loadFn(currentPage + 1, optsWithDefaults.pageLimit, lastProposalId ?? 0)
      setCurrentPage(prevPage => prevPage + 1)
      handleResponse(newData, totalItems ?? 0)
      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [
    hasNext,
    loadingState,
    lastProposalId,
    loadFn,
    currentPage,
    optsWithDefaults.pageLimit,
    handleResponse,
    totalItems,
    handleError,
  ])

  const reset = useCallback(() => {
    setData([])
    setLoadingState(LoadingStates.Initial)
    setHasNext(true)
    setTotalItems(null)
    setCurrentPage(1)
    setLastProposalId(null)
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
