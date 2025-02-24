export const generateQrCodeUrl = (baseUrl: string, queryParams: Record<string, string>) => {
  const newUrl = new URL(baseUrl)
  Object.entries(queryParams).forEach(([key, value]) => {
    newUrl.searchParams.append(key, value)
  })
  return newUrl.toString()
}
