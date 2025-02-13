import { JsonApiLinkFields, JsonApiResponse, JsonApiResponseLinks } from '@distributedlab/jac'
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

import { LoadingStates } from '@/enums'

type QueryResponse<D, M> = {
  response: JsonApiResponse<D[], M>
  meta?: M
  data: D[]
  links?: JsonApiResponseLinks
}

type PageParams<D, M> = {
  pageLimit?: number
} & QueryResponse<D, M>

// TODO: put page limit from opts to request opts
export const useMultiPageLoadingV2 = <D, M>(
  loadFn: (pageParams?: PageParams<D, M>) => Promise<JsonApiResponse<D[], M>>,
  opts?: {
    key?: string
    loadOnMount?: boolean
    pageLimit?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadArgs?: any[]
  },
): {
  data: InfiniteData<QueryResponse<D, M>>
  loadingState: LoadingStates
  hasNext: boolean
  load: () => Promise<void>
  reload: () => Promise<void>
  update: () => Promise<void>
  loadNext: () => Promise<void>
} => {
  const queryClient = useQueryClient()

  const optsWithDefaults = useMemo(() => {
    return {
      loadOnMount: true,
      pageLimit: 100,
      ...opts,
    }
  }, [opts])

  const queryKey = useMemo(() => {
    return opts?.key || uuid()
  }, [opts?.key])

  const infiniteQuery = useInfiniteQuery({
    queryKey: [queryKey, ...(optsWithDefaults.loadArgs ? [optsWithDefaults.loadArgs] : [])],
    queryFn: async ({ pageParam }) => {
      let res: JsonApiResponse<D[], M> | undefined
      if (pageParam.response) {
        res = await pageParam.response?.fetchPage(JsonApiLinkFields.next)
      } else {
        res = await loadFn(pageParam)
      }

      const result: QueryResponse<D, M> = {
        response: res,
        meta: res?.meta,
        data: res?.data ?? [],
        links: res?.links,
      }

      return result
    },
    initialPageParam: {
      pageLimit: optsWithDefaults.pageLimit,
      response: undefined as JsonApiResponse<D[], M> | undefined,
    } as PageParams<D, M>,
    getPreviousPageParam: firstPage => {
      if (!firstPage?.links?.prev) return undefined

      return {
        ...firstPage,
      }
    },
    getNextPageParam: lastPage => {
      if (!lastPage?.links?.next) return undefined

      return {
        ...lastPage,
      }
    },
    refetchOnMount: optsWithDefaults.loadOnMount,
  })

  const loadingState = useMemo((): LoadingStates => {
    if (
      (infiniteQuery.isLoading || infiniteQuery.isPending) &&
      !infiniteQuery.isFetchingNextPage &&
      !infiniteQuery.isFetchingPreviousPage
    ) {
      return LoadingStates.Loading
    }

    if (
      infiniteQuery.isError ||
      infiniteQuery.isLoadingError ||
      infiniteQuery.isRefetchError ||
      infiniteQuery.isFetchNextPageError ||
      infiniteQuery.isFetchPreviousPageError
    ) {
      return LoadingStates.Error
    }

    if (infiniteQuery.isFetchingNextPage) {
      return LoadingStates.NextLoading
    }

    if (infiniteQuery.status === 'success') {
      return LoadingStates.Loaded
    }

    return LoadingStates.Initial
  }, [infiniteQuery])

  const load = useCallback(async () => {
    await infiniteQuery.refetch()
  }, [infiniteQuery])

  const update = useCallback(async () => {
    await infiniteQuery.refetch()
  }, [infiniteQuery])

  const loadNext = useCallback(async () => {
    await infiniteQuery.fetchNextPage()
  }, [infiniteQuery])

  const reload = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [queryKey] })
  }, [queryKey, queryClient])

  return {
    data: infiniteQuery.data || ({} as InfiniteData<QueryResponse<D, M>>),
    loadingState,
    load,
    update,
    reload,
    loadNext,
    hasNext: infiniteQuery.hasNextPage,
  }
}
