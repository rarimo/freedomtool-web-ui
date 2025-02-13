import { JsonApiError } from '@distributedlab/jac'

export function getJsonApiErrorMeta(error: unknown): Record<string, string> | null {
  if (!(error instanceof JsonApiError)) return null

  const validationErrors = error.originalError.response?.data?.errors ?? []
  return (validationErrors[0]?.meta as Record<string, string>) ?? null
}
