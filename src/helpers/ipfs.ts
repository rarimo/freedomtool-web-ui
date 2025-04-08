import { api } from '@/api/clients'
import { config } from '@/config'
import { ApiServicePaths } from '@/enums'
import { ProposalMetadata, UploadedDataIpfs } from '@/types'

export const uploadJsonToIpfs = (vote: ProposalMetadata) => {
  return api.post<UploadedDataIpfs>(`${ApiServicePaths.Ipfs}/v1/public/upload`, {
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

  return api.post<UploadedDataIpfs>(`${ApiServicePaths.Ipfs}/v1/public/upload-file`, {
    body: formData,
  })
}

export const getIpfsImageSrc = (imageCid: string) => `${config.IPFS_NODE_URL}/ipfs/${imageCid}`
