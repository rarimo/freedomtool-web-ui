import { Collapse, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'

import { DEFAULT_PAGE_LIMIT } from '@/api/clients'
import { deleteQRCode, getQrCodeLinks } from '@/api/modules/qr-code'
import { Icons, LoadingStates } from '@/enums'
import { ErrorHandler, formatCroppedString, generatePollQrCodeUrl } from '@/helpers'
import { useMultiPageLoading } from '@/hooks'
import QrCodeModal from '@/pages/Poll/components/QrCodeModal'
import { QrCodePanelSkeleton } from '@/pages/Poll/components/QrCodePanelSkeleton'
import { qrStore, useQrState } from '@/store'
import { UiIcon } from '@/ui'

import CreateQrModal from './CreateQrModal'

export const qrCodeModalGridTemplateColumns = '1.7fr 1.3fr 1fr'
const QR_CODES_LIST_LIMIT = 5

export default function QrCodePanel() {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const { id } = useParams()
  const { isQrInfoVisible } = useQrState()

  const [isDeleting, setIsDeleting] = useState(false)

  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isCreateQrOpen, setIsCreateQrOpen] = useState(false)

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
      setIsDeleting(true)
      try {
        await deleteQRCode(qrCodeId)
        await updateQrCodes()
      } catch (error) {
        ErrorHandler.process(error)
      } finally {
        setIsDeleting(false)
      }
    },
    [updateQrCodes],
  )

  const firstActiveQRCode = useMemo(() => {
    const activeCodes = qrCodes.filter(qrCode => qrCode.active)
    return activeCodes.length > 0 ? activeCodes[0] : null
  }, [qrCodes])

  if ([LoadingStates.Initial, LoadingStates.Loading].includes(qrCodeLoadingState))
    return <QrCodePanelSkeleton />

  return (
    <>
      <Stack width='100%'>
        <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
          {firstActiveQRCode ? (
            <Stack direction='row' alignItems='center' spacing={4}>
              <QRCode
                value={generatePollQrCodeUrl(firstActiveQRCode.url)}
                size={88}
                fgColor={palette.text.primary}
                bgColor='transparent'
              />
              <Stack alignItems='flex-start' spacing={2}>
                <Typography variant='subtitle5' maxWidth={200} textOverflow='ellipsis'>
                  {firstActiveQRCode.metadata.name ||
                    formatCroppedString(firstActiveQRCode?.id || '')}
                </Typography>
                {firstActiveQRCode.scan_limit ? (
                  <Typography variant='body4' color={palette.text.secondary}>
                    {t('poll.qr-code-panel.qr-scan-limit-lbl', {
                      count: firstActiveQRCode?.scan_count || 0,
                      total: firstActiveQRCode.scan_limit,
                    })}
                  </Typography>
                ) : (
                  <Typography variant='body4' color={palette.text.secondary}>
                    {t('poll.qr-code-panel.qr-scan-count-lbl', {
                      count: firstActiveQRCode?.scan_count || 0,
                    })}
                  </Typography>
                )}
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={1}>
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
        </Stack>

        <Collapse in={isQrInfoVisible}>
          <Stack
            p={3}
            my={4}
            direction='row'
            bgcolor={palette.info.lighter}
            color={palette.info.darker}
            sx={{
              borderRadius: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -16,
                left: 45,
                transform: 'translateX(-50%)',
                borderWidth: 8,
                borderStyle: 'solid',
                borderColor: `transparent transparent ${palette.info.lighter} transparent`,
              },
            }}
            alignItems='center'
            justifyContent='space-between'
            spacing={3}
          >
            <Typography variant='body4'>{t('poll.qr-code-panel.info-msg')}</Typography>
            <IconButton color='secondary' onClick={qrStore.toggleQrInfoVisible}>
              <UiIcon name={Icons.CloseFill} size={4} />
            </IconButton>
          </Stack>
        </Collapse>
      </Stack>

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        qrCodes={qrCodes}
        qrCodeLoadingState={qrCodeLoadingState}
        isDisabled={isDeleting}
        onReload={reloadQrCodes}
        onLoadNext={loadNextQrCodes}
        onDelete={deleteQrCode}
        onCreateModalOpen={() => setIsCreateQrOpen(true)}
      />
      <CreateQrModal
        isOpen={isCreateQrOpen}
        onClose={() => setIsCreateQrOpen(false)}
        onSuccess={() => {
          setIsQrModalOpen(false)
          reloadQrCodes()
        }}
      />
    </>
  )
}
