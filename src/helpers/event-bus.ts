import { EventEmitter } from '@distributedlab/tools'

import { BusEventMap } from '@/types'

export const bus = new EventEmitter<
  BusEventMap & {
    OpenConnectDropdown: () => void
  }
>()
