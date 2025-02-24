import { JsonApiError } from '@distributedlab/jac'
import { ErrorCode } from 'ethers'
import { t } from 'i18next'
import log from 'loglevel'

import { BusEvents } from '@/enums'

import { bus } from './event-bus'

export class ErrorHandler {
  static isError(error: unknown): error is Error {
    return error instanceof Error || (error instanceof Object && 'message' in error)
  }

  static process(error: unknown, message = ''): void {
    if (!ErrorHandler.isError(error)) return
    bus.emit(BusEvents.error, {
      message: message || this.getErrorMessage(error),
    })
    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: unknown): void {
    if (!ErrorHandler.isError(error)) return
    log.error(error)
  }

  private static getErrorMessage(error: Error & { code?: ErrorCode }): string {
    if (error instanceof JsonApiError && error.httpStatus) {
      const statusToMessage: Record<number, string> = {
        400: t('errors.bad-request'),
        401: t('errors.unauthorized'),
        403: t('errors.forbidden'),
        404: t('errors.not-found'),
        409: t('errors.conflict'),
        429: t('errors.too-many-requests'),
        500: t('errors.internal-server-error'),
        503: t('errors.service-unavailable'),
      }

      return statusToMessage[error.httpStatus] || t('errors.network-error')
    }

    switch (error.code) {
      case 'ACTION_REJECTED':
        return t('errors.user-rejected-request')
      default:
        return t('errors.unknown-error')
    }
  }
}
