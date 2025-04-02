import { api } from '@/api/clients'
import { ApiServicePaths } from '@/enums'
import { IUploadData, IVoteIpfs } from '@/types'

export const uploadJsonToIpfs = (vote: IVoteIpfs) => {
  return api.post<IUploadData>(`${ApiServicePaths.Ipfs}/v1/public/upload`, {
    body: {
      data: {
        type: 'upload_json',
        attributes: {
          metadata: vote,
        },
      },
    },
  })
}

export const uploadImageToIpfs = (image: File) => {
  const formData = new FormData()
  formData.append('image', image)

  return api.post<IUploadData>(`${ApiServicePaths.Ipfs}/v1/public/upload-file`, {
    body: formData,
  })
}
