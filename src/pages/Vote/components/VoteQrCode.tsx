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
    <Stack spacing={4}>
      <Stack
        sx={{
          width: 160,
          height: 160,
          backgroundColor: palette.common.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: `1px solid ${palette.action.active}`,
          boxShadow:
            '0px 16px 16px 0px rgba(58, 58, 58, 0.05), 0px 4px 4px 0px rgba(58, 58, 58, 0.05),0px 2px 2px 0px rgba(58, 58, 58, 0.05),0px 1px 1px 0px rgba(58, 58, 58, 0.05),0px 0px 0px 0.33px rgba(58, 58, 58, 0.05)',
        }}
      >
        <QRCode value={qrCodeUrl} size={130} />
      </Stack>
      <Typography variant='body3' color='textSecondary'>
        {t('vote.qr-code-subtitle')}
      </Typography>
    </Stack>
  )
}
