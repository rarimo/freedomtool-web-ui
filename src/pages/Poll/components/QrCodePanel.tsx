import { IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'

import { DEFAULT_PAGE_LIMIT } from '@/api/clients'
import { getQRCodes } from '@/api/modules/qr-code'
import { Icons, LoadingStates } from '@/enums'
import { formatCroppedString } from '@/helpers'
import { useMultiPageLoading } from '@/hooks'
import QrCodeModal from '@/pages/Poll/components/QRCodeModal'
import { QrCodePanelSkeleton } from '@/pages/Poll/components/QrCodePanelSkeleton'
import { UiIcon } from '@/ui'

export const qrCodeModalGridTemplateColumns = '1.7fr 1.3fr 1fr'
const QR_CODES_LIST_LIMIT = 5

export default function QrCodePanel() {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const { id } = useParams()

  const [isQrModalShown, setIsQrModalShown] = useState(false)

  const {
    data: qrCodes,
    loadingState: qrCodeLoadingState,
    reload: reloadQrCodes,
    loadNext: loadNextQrCodes,
    update: updateQrCodes,
  } = useMultiPageLoading(
    () =>
      getQRCodes({
        query: {
          page: {
            limit: QR_CODES_LIST_LIMIT,
          },
          filter: {
            resource_id: String(id),
          },
        },
      }),
    { pageLimit: DEFAULT_PAGE_LIMIT },
  )

  const lastFreshQRCode = useMemo(() => {
    const activeCodes = qrCodes.filter(qrCode => qrCode.active)
    return activeCodes.length > 0 ? activeCodes[0] : null
  }, [qrCodes])

  const qrCodesActions = {
    qrCodeLoadingState,
    reloadQrCodes,
    loadNextQrCodes,
    updateQrCodes,
  }

  if ([LoadingStates.Initial, LoadingStates.Loading].includes(qrCodeLoadingState))
    return <QrCodePanelSkeleton />

  return (
    <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
      <Stack direction='row' alignItems='center' spacing={1}>
        <QRCodeBlock url={lastFreshQRCode?.url || ''} />
        <Stack alignItems='flex-start' spacing={2}>
          <Typography variant='subtitle5'>
            {formatCroppedString(lastFreshQRCode?.id || '')}
          </Typography>
          <Typography variant='body4' color={palette.text.secondary}>
            {t('poll.qr-code-panel.qr-scan-count-lbl', { count: lastFreshQRCode?.scan_count || 0 })}
          </Typography>
        </Stack>
      </Stack>
      <IconButton
        sx={{
          p: 2.5,
          backgroundColor: palette.action.active,
        }}
        onClick={() => setIsQrModalShown(true)}
      >
        <UiIcon name={Icons.ArrowRightSLine} size={5} />
      </IconButton>
      <QrCodeModal
        qrCodes={qrCodes}
        qrCodesActions={qrCodesActions}
        open={isQrModalShown}
        onClose={() => setIsQrModalShown(false)}
      />
    </Stack>
  )
}

export function QRCodeBlock({
  url,
  size = 28,
  isLink = false,
  innerPadding = 6,
}: {
  url: string
  size?: number
  isLink?: boolean
  innerPadding?: number
}) {
  const { palette, spacing } = useTheme()

  const qrSize = Number(spacing(size).replace('px', '')) - innerPadding * 4

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
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isLink ? 'pointer' : 'default',
      }}
    >
      <QRCode
        value={url}
        size={qrSize > 0 ? qrSize : 1}
        fgColor={palette.text.primary}
        bgColor='transparent'
      />
    </Stack>
  )
}
