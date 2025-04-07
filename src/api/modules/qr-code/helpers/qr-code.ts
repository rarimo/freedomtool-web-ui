import { JsonApiClientRequestOpts } from '@distributedlab/jac'

import { api } from '@/api/clients'
import { CreateQRCode, QRCode, UpdateQRCode } from '@/api/modules/qr-code'
import { ApiServicePaths } from '@/enums'

export const getQRCodes = async (opts?: Partial<JsonApiClientRequestOpts>) => {
  return api.get<QRCode[]>(`${ApiServicePaths.QRCode}/v1/public/links`, opts)
}

export const getQRCode = async (linkId: string) => {
  return api.get<QRCode>(`${ApiServicePaths.QRCode}/v1/public/links/${linkId}`)
}

export const createQRCode = async ({ attributes }: CreateQRCode) => {
  return api.post<QRCode>(`${ApiServicePaths.QRCode}/v1/public/links`, {
    body: {
      data: {
        type: 'links',
        attributes,
      },
    },
  })
}

export const updateQRCode = async ({ id, attributes }: UpdateQRCode) => {
  return api.patch<QRCode>(`${ApiServicePaths.QRCode}/v1/public/links/${id}`, {
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
  return api.delete<QRCode>(`${ApiServicePaths.QRCode}/v1/public/links/${linkId}`)
}
