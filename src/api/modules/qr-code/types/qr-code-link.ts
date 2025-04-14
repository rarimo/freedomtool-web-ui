export interface QrCodeLink {
  id: string
  type: 'links'
  resource_id: string
  metadata: QRCodeMetadata
  scan_count: number
  scan_limit?: number
  active: boolean
  expires_at?: number
  created_at: number
  url: string
}

export interface QRCodeMetadata {
  proposal_id: number
  name?: string
}

export interface CreateQRCode {
  type: 'links'
  attributes: {
    resource_id: string
    metadata: QRCodeMetadata
    scan_limit?: number
    expires_at?: number
  }
}

export interface UpdateQRCode {
  id: string
  type: 'links'
  attributes: {
    metadata?: QRCodeMetadata
    scan_limit?: number
    expires_at?: number
    active?: boolean
  }
}
