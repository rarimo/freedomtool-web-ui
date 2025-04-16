import { JsonApiLinkFields, JsonApiResponse } from '@distributedlab/jac'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { LoadingStates } from '@/enums'
import { ErrorHandler } from '@/helpers'

export const useMultiPageLoading = <D, M>(
  loadFn: () => Promise<JsonApiResponse<D[], M>>,
  opts?: {
    loadOnMount?: boolean
    pageLimit: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadArgs?: any[]
    silentError?: boolean
  },
): {
  data: D[]
  meta?: M
  loadingState: LoadingStates
  hasNext: boolean
  load: () => Promise<void>
  reload: () => Promise<void>
  reset: () => void
  update: () => Promise<void>
  loadNext: () => Promise<void>
  setData: Dispatch<SetStateAction<D[]>>
} => {
  const [response, setResponse] = useState<JsonApiResponse<D[], M>>()
  const [data, setData] = useState<D[]>([])
  const [meta, setMeta] = useState<M>()
  const [loadingState, setLoadingState] = useState<LoadingStates>(LoadingStates.Initial)
  const [hasNext, setHasNext] = useState(true)

  const abortControllerRef = useRef<AbortController>(new AbortController())

  const optsWithDefaults = useMemo(
    () => ({
      loadOnMount: true,
      pageLimit: 100,
      silentError: false,
      ...opts,
    }),
    [opts],
  )

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
    (res: JsonApiResponse<D[], M>) => {
      setResponse(res)
      setData(res.data)
      setMeta(res.meta)
      setHasNext(res.data.length >= optsWithDefaults.pageLimit && Boolean(res.links?.next))
    },
    [optsWithDefaults.pageLimit],
  )

  const load = useCallback(async () => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoadingState(LoadingStates.Loading)
    try {
      const res = await loadFn()
      if (controller.signal.aborted) return

      handleResponse(res)
      if (controller.signal.aborted) return

      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      if (controller.signal.aborted) return

      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [handleError, handleResponse, loadFn])

  const update = useCallback(async () => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const res = await loadFn()
      if (controller.signal.aborted) return

      handleResponse(res)
      if (controller.signal.aborted) return

      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      if (controller.signal.aborted) return

      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [handleError, handleResponse, loadFn])

  const loadNext = useCallback(async () => {
    if (!response || !hasNext || loadingState === LoadingStates.NextLoading) return

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoadingState(LoadingStates.NextLoading)
    try {
      const res = await response.fetchPage(JsonApiLinkFields.next)
      if (controller.signal.aborted) return

      setResponse(res)
      setData(prev => prev.concat(res.data))
      setHasNext(res.data.length >= optsWithDefaults.pageLimit && Boolean(res.links?.next))
      setLoadingState(LoadingStates.Loaded)
    } catch (error) {
      if (controller.signal.aborted) return

      setLoadingState(LoadingStates.Error)
      handleError(error)
    }
  }, [response, hasNext, loadingState, optsWithDefaults.pageLimit, handleError])

  const reset = useCallback(() => {
    setData([])
    setMeta(undefined)
    setLoadingState(LoadingStates.Initial)
    setHasNext(true)
  }, [])

  const reload = useCallback(async () => {
    reset()
    await load()
  }, [load, reset])

  useEffect(() => {
    const currentController = abortControllerRef.current
    return () => {
      currentController.abort()
    }
  }, [])

  useEffect(() => {
    if (optsWithDefaults.loadOnMount) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, optsWithDefaults.loadArgs ?? [])

  return {
    data,
    meta,
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
