import type { ToastPayload } from '@/contexts/toasts-manager'
import { BusEvents } from '@/enums'

export type BusEventMap = {
  [BusEvents.success]: ToastPayload
  [BusEvents.error]: ToastPayload
  [BusEvents.warning]: ToastPayload
  [BusEvents.info]: ToastPayload
}
