import _copy from 'copy-to-clipboard'
import { useCallback, useState } from 'react'

import { sleep } from '@/helpers'

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)
  // TODO: migrate to navigator Api
  const copy = useCallback(async (value: string) => {
    if (_copy(value)) {
      setIsCopied(true)
      await sleep(2000)
      setIsCopied(false)
      return
    }
    throw new TypeError('Not copied')
  }, [])

  return { copy, isCopied }
}
