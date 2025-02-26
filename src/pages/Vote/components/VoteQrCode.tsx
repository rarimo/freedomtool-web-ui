import { Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'

export default function VoteQrCode({ qrCodeUrl }: { qrCodeUrl: string }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack spacing={4}>
      <QRCodeBlock url={qrCodeUrl} />
      <Typography variant='body3' color={palette.text.secondary} textAlign='center'>
        {t('vote.qr-code-subtitle')}
      </Typography>
    </Stack>
  )
}

export function QRCodeBlock({
  url,
  size = 40,
  isLink = false,
}: {
  url: string
  size?: number
  isLink?: boolean
}) {
  const { palette, spacing } = useTheme()

  const qrSize = Number(spacing(size).replace('px', '')) - 30

  return (
    <Stack
      component={isLink ? 'a' : 'div'}
      {...(isLink && {
        href: url,
        target: '_blank',
        rel: 'noreferrer',
      })}
      sx={{
        width: spacing(size),
        height: spacing(size),
        backgroundColor: palette.common.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        border: `1px solid ${palette.action.active}`,
        boxShadow:
          '0px 16px 16px 0px rgba(58, 58, 58, 0.05), 0px 4px 4px 0px rgba(58, 58, 58, 0.05),0px 2px 2px 0px rgba(58, 58, 58, 0.05),0px 1px 1px 0px rgba(58, 58, 58, 0.05),0px 0px 0px 0.33px rgba(58, 58, 58, 0.05)',
        cursor: isLink ? 'pointer' : 'default',
      }}
    >
      <QRCode value={url} size={qrSize > 0 ? qrSize : 1} />
    </Stack>
  )
}
