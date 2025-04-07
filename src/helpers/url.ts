import { VOTE_QR_BASE_URL } from '@/constants'

export const generateQrCodeUrl = (baseUrl: string, queryParams: Record<string, string>) => {
  const newUrl = new URL(baseUrl)
  Object.entries(queryParams).forEach(([key, value]) => {
    newUrl.searchParams.append(key, value)
  })
  return newUrl.toString()
}

export const generatePollQrCodeUrl = (url: string) => {
  return generateQrCodeUrl(VOTE_QR_BASE_URL, {
    type: 'voting',
    qr_code_url: url,
  })
}
