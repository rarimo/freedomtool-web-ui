import { IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'

import { DEFAULT_PAGE_LIMIT } from '@/api/clients'
import { createQRCode, deleteQRCode, getQrCodeLinks } from '@/api/modules/qr-code'
import { Icons, LoadingStates } from '@/enums'
import { ErrorHandler, formatCroppedString, generatePollQrCodeUrl } from '@/helpers'
import { useMultiPageLoading } from '@/hooks'
import QrCodeModal from '@/pages/Poll/components/QrCodeModal'
import { QrCodePanelSkeleton } from '@/pages/Poll/components/QrCodePanelSkeleton'
import { UiIcon } from '@/ui'

export const qrCodeModalGridTemplateColumns = '1.7fr 1.3fr 1fr'
const QR_CODES_LIST_LIMIT = 5

export default function QrCodePanel() {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const { id } = useParams()

  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  const {
    data: qrCodes,
    loadingState: qrCodeLoadingState,
    reload: reloadQrCodes,
    loadNext: loadNextQrCodes,
    update: updateQrCodes,
  } = useMultiPageLoading(
    () =>
      getQrCodeLinks({
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

  const deleteQrCode = useCallback(
    async (qrCodeId: string) => {
      try {
        await deleteQRCode(qrCodeId)
        await updateQrCodes()
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    [updateQrCodes],
  )

  const generateNewQrCode = useCallback(async () => {
    try {
      if (!id) return

      await createQRCode({
        type: 'links',
        attributes: {
          resource_id: id,
          metadata: {
            proposal_id: Number(id),
          },
        },
      })

      await updateQrCodes()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [id, updateQrCodes])

  const firstActiveQRCode = useMemo(() => {
    const activeCodes = qrCodes.filter(qrCode => qrCode.active)
    return activeCodes.length > 0 ? activeCodes[0] : null
  }, [qrCodes])

  if ([LoadingStates.Initial, LoadingStates.Loading].includes(qrCodeLoadingState))
    return <QrCodePanelSkeleton />

  return (
    <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
      {firstActiveQRCode ? (
        <Stack direction='row' alignItems='center' spacing={1}>
          <QRCode
            value={generatePollQrCodeUrl(firstActiveQRCode?.url || '')}
            size={88}
            fgColor={palette.text.primary}
            bgColor='transparent'
          />
          <Stack alignItems='flex-start' spacing={2}>
            <Typography variant='subtitle5'>
              {formatCroppedString(firstActiveQRCode?.id || '')}
            </Typography>
            <Typography variant='body4' color={palette.text.secondary}>
              {t('poll.qr-code-panel.qr-scan-count-lbl', {
                count: firstActiveQRCode?.scan_count || 0,
              })}
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={1} textAlign='left'>
          <Typography variant='subtitle5' color={palette.text.primary}>
            {t('poll.qr-code-panel.no-codes-title')}
          </Typography>
          <Typography variant='body4' color={palette.text.secondary}>
            {t('poll.qr-code-panel.no-codes-description')}
          </Typography>
        </Stack>
      )}
      <IconButton
        sx={{
          p: 2.5,
          backgroundColor: palette.action.active,
        }}
        onClick={() => setIsQrModalOpen(true)}
      >
        <UiIcon name={Icons.ArrowRightSLine} size={5} />
      </IconButton>
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        qrCodes={qrCodes}
        qrCodeLoadingState={qrCodeLoadingState}
        onReload={reloadQrCodes}
        onLoadNext={loadNextQrCodes}
        onCreate={generateNewQrCode}
        onDelete={deleteQrCode}
      />
    </Stack>
  )
}
