import {
  Box,
  Button,
  Dialog,
  DialogProps,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { createQRCode, deleteQRCode, QRCode as QRCodeType } from '@/api/modules/qr-code'
import { DotDivider, InfiniteList } from '@/common'
import { Icons, LoadingStates } from '@/enums'
import { ErrorHandler, formatCroppedString, formatDateTime } from '@/helpers'
import { QRCodeBlock, qrCodeModalGridTemplateColumns } from '@/pages/Poll/components/QrCodePanel'
import { UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'

type QrCodeModal = {
  qrCodes: QRCodeType[]
  qrCodesActions: {
    qrCodeLoadingState: LoadingStates
    reloadQrCodes: () => Promise<void>
    loadNextQrCodes: () => Promise<void>
    updateQrCodes: () => Promise<void>
  }
} & DialogProps

export default function QrCodeModal({
  qrCodes,
  qrCodesActions,
  open,
  onClose,
  ...rest
}: QrCodeModal) {
  const { palette, spacing, breakpoints } = useTheme()
  const { t } = useTranslation()
  const { id } = useParams()

  const isMdUp = useMediaQuery(breakpoints.up('md'))

  const headers = [
    t('poll.qr-code-panel.headers.qr-code-lbl'),
    t('poll.qr-code-panel.headers.creation-time-lbl'),
    t('poll.qr-code-panel.headers.actions-lbl'),
  ]

  const shareQrCode = () => {}

  const downloadQrCode = () => {}

  const deleteQrCode = useCallback(
    async (qrCodeId: string) => {
      try {
        await deleteQRCode(qrCodeId)
        await qrCodesActions.updateQrCodes()
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    [qrCodesActions],
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

      await qrCodesActions.updateQrCodes()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [id, qrCodesActions])

  return (
    <Dialog
      {...rest}
      open={open}
      onClose={onClose}
      PaperProps={{
        ...rest.PaperProps,
        sx: {
          width: '100%',
          maxWidth: spacing(153),
          maxHeight: spacing(140),
          borderRadius: spacing(3),
        },
        position: 'relative',
      }}
    >
      <UiDialogTitle onClose={onClose}>{t('poll.qr-code-panel.modal-title')}</UiDialogTitle>
      <UiDialogContent component={Stack} gap={{ xs: 4, md: 5 }}>
        {isMdUp ? (
          <>
            <Box
              display='grid'
              gridTemplateColumns={qrCodeModalGridTemplateColumns}
              color={palette.text.secondary}
            >
              {headers.map(header => (
                <Typography
                  key={header}
                  variant='overline3'
                  sx={{
                    width: '100%',
                    '&:last-child': {
                      textAlign: 'end',
                    },
                  }}
                >
                  {header}
                </Typography>
              ))}
            </Box>
            <Divider flexItem />
            <InfiniteList
              items={qrCodes}
              loadingState={qrCodesActions.qrCodeLoadingState}
              onRetry={qrCodesActions.reloadQrCodes}
              onLoadNext={qrCodesActions.loadNextQrCodes}
            >
              {qrCodes.map(qrCode => (
                <Box
                  key={qrCode.id}
                  display='grid'
                  gridTemplateColumns={qrCodeModalGridTemplateColumns}
                  alignItems='center'
                >
                  <Stack direction='row' alignItems='center' spacing={3}>
                    <QRCodeBlock size={12} innerPadding={2.5} url={qrCode.url} />
                    <Stack alignItems='flex-start'>
                      <Typography variant='subtitle6'>{formatCroppedString(qrCode.id)}</Typography>
                      <Typography variant='body4' color={palette.text.secondary}>
                        {t('poll.qr-code-panel.qr-scan-count-lbl', { count: qrCode.scan_count })}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant='subtitle6'>{formatDateTime(qrCode.created_at)}</Typography>
                  <QRCodeListItemActions
                    qrCode={qrCode}
                    onShare={shareQrCode}
                    onDownload={downloadQrCode}
                    onDelete={deleteQrCode}
                  />
                </Box>
              ))}
            </InfiniteList>
          </>
        ) : (
          <InfiniteList
            items={qrCodes}
            loadingState={qrCodesActions.qrCodeLoadingState}
            onRetry={qrCodesActions.reloadQrCodes}
            onLoadNext={qrCodesActions.loadNextQrCodes}
          >
            {qrCodes.map(qrCode => (
              <Stack key={qrCode.id} spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <QRCodeBlock size={12} innerPadding={2.5} url={qrCode.url} />
                  <QRCodeListItemActions
                    qrCode={qrCode}
                    onShare={shareQrCode}
                    onDownload={downloadQrCode}
                    onDelete={deleteQrCode}
                  />
                </Stack>
                <Stack>
                  <Typography variant='subtitle6'>{formatCroppedString(qrCode.id)}</Typography>
                  <Stack direction='row' alignItems='center' spacing={1}>
                    <Typography variant='body4' color={palette.text.secondary}>
                      {t('poll.qr-code-panel.qr-scan-count-lbl', { count: qrCode.scan_count })}
                    </Typography>
                    <DotDivider />
                    <Typography variant='body4' color={palette.text.secondary}>
                      {formatDateTime(qrCode.created_at)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </InfiniteList>
        )}
        <Divider flexItem />
        <Button
          variant='text'
          size='medium'
          startIcon={<UiIcon name={Icons.AddFill} size={5} />}
          sx={{
            width: 'fit-content',
            height: 'fit-content',
            p: 0,
          }}
          onClick={generateNewQrCode}
        >
          {t('poll.qr-code-panel.generate-qr-code-btn')}
        </Button>
      </UiDialogContent>
    </Dialog>
  )
}

function QRCodeListItemActions({
  qrCode,
  onShare,
  onDownload,
  onDelete,
}: {
  qrCode: QRCodeType
  onShare: () => void
  onDownload: () => void
  onDelete: (id: string) => void
}) {
  return (
    <Stack direction='row' alignItems='center' spacing={3}>
      <IconButton sx={{ p: 3 }} onClick={onShare}>
        <UiIcon name={Icons.ShareLine} size={4} />
      </IconButton>
      <IconButton sx={{ p: 3 }} onClick={onDownload}>
        <UiIcon name={Icons.DownloadLine} size={4} />
      </IconButton>
      <IconButton
        color='error'
        sx={{ p: 3 }}
        disabled={!qrCode.active}
        onClick={() => onDelete(qrCode.id)}
      >
        <UiIcon name={Icons.DeleteBin6Line} size={4} />
      </IconButton>
    </Stack>
  )
}
