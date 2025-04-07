import { JsonApiClientRequestOpts } from '@distributedlab/jac'

import { api } from '@/api/clients'
import { CreateQRCode, QrCodeLink, UpdateQRCode } from '@/api/modules/qr-code'
import { ApiServicePaths } from '@/enums'

export const getQrCodeLinks = async (opts?: Partial<JsonApiClientRequestOpts>) => {
  return api.get<QrCodeLink[]>(`${ApiServicePaths.QrLink}/v1/public/links`, opts)
}

export const getQrCodeLink = async (linkId: string) => {
  return api.get<QrCodeLink>(`${ApiServicePaths.QrLink}/v1/public/links/${linkId}`)
}

export const createQRCode = async ({ attributes }: CreateQRCode) => {
  return api.post<QrCodeLink>(`${ApiServicePaths.QrLink}/v1/public/links`, {
    body: {
      data: {
        type: 'links',
        attributes,
      },
    },
  })
}

export const updateQRCode = async ({ id, attributes }: UpdateQRCode) => {
  return api.patch<QrCodeLink>(`${ApiServicePaths.QrLink}/v1/public/links/${id}`, {
    body: {
      data: {
        id,
        type: 'links',
        attributes,
      },
    },
  })
}

export const deleteQRCode = async (linkId: string) => {
  return api.delete<QrCodeLink>(`${ApiServicePaths.QrLink}/v1/public/links/${linkId}`)
}
