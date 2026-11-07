import { api } from '@/api/clients'
import { config } from '@/config'
import { ApiServicePaths } from '@/enums'
import { ProposalMetadata, UploadedDataIpfs } from '@/types'

const addToIpfsNode = async (file: Blob, name: string): Promise<{ data: UploadedDataIpfs }> => {
  const formData = new FormData()
  formData.append('file', file, name)

  const response = await fetch(`${config.IPFS_UPLOAD_URL}/add`, { method: 'POST', body: formData })
  if (!response.ok) {
    throw new Error(`IPFS upload failed: ${response.status} ${await response.text()}`)
  }

  const { Hash } = (await response.json()) as { Hash: string }
  return { data: { id: Hash, type: 'ipfs', hash: Hash } }
}

export const uploadJsonToIpfs = (vote: ProposalMetadata) => {
  if (config.IPFS_UPLOAD_URL) {
    const json = new Blob([JSON.stringify(vote)], { type: 'application/json' })
    return addToIpfsNode(json, 'metadata.json')
  }

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
  if (config.IPFS_UPLOAD_URL) {
    return addToIpfsNode(image, image.name || 'image')
  }

  const formData = new FormData()
  formData.append('image', image)

  return api.post<UploadedDataIpfs>(`${ApiServicePaths.Ipfs}/v1/public/upload-file`, {
    body: formData,
  })
}

export const getIpfsImageSrc = (imageCid: string) => `${config.IPFS_NODE_URL}/ipfs/${imageCid}`
