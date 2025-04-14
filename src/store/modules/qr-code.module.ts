import { createStore } from '@/helpers'

type QrStore = {
  isQrInfoVisible: boolean
}

export const [qrStore, useQrState] = createStore(
  'qr',
  { isQrInfoVisible: true } as QrStore,
  () => ({}),
  state => ({
    toggleQrInfoVisible: () => {
      state.isQrInfoVisible = !state.isQrInfoVisible
    },
  }),
)
