import { Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'

import { generateQrCodeUrl } from '@/helpers'

export default function VoteQrCode({
  baseUrl,
  queryParams,
}: {
  baseUrl: string
  queryParams: Record<string, string>
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const qrCodeUrl = generateQrCodeUrl(baseUrl, queryParams)

  return (
    <Stack spacing={2}>
      <Stack
        sx={{
          width: 160,
          height: 160,
          backgroundColor: palette.common.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: `1px solid ${palette.action.active}`,
        }}
      >
        <QRCode value={qrCodeUrl} size={130} />
      </Stack>
      <Typography variant='body2' typography={{ xs: 'body3', md: 'body2' }} color='textSecondary'>
        {t('vote.qr-code-subtitle')}
      </Typography>
    </Stack>
  )
}
