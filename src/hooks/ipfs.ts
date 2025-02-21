import { config } from '@/config'

import { useLoading } from './loading'

export const useIpfsLoading = <T>(cid: string | null) => {
  return useLoading<T | null>(
    null,
    async () => {
      const response = await fetch(`${config.IPFS_NODE_URL}/ipfs/${cid}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`)
      }

      return response.json()
    },
    { silentError: true, loadArgs: [cid], loadOnMount: Boolean(cid) },
  )
}
