import {
  Box,
  Button,
  Dialog,
  DialogProps,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { saveAs } from 'file-saver'
import { toDataURL } from 'qrcode'
import { useTranslation } from 'react-i18next'
import ReactQRCode from 'react-qr-code'

import { QrCodeLink as QRCodeType } from '@/api/modules/qr-code'
import { DotDivider, InfiniteList } from '@/common'
import { Icons, LoadingStates } from '@/enums'
import { ErrorHandler, formatCroppedString, formatDateTime, generatePollQrCodeUrl } from '@/helpers'
import { useCopyToClipboard } from '@/hooks'
import { qrCodeModalGridTemplateColumns } from '@/pages/Poll/components/QrCodePanel'
import { UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'

interface QrCodeModalProps extends Omit<DialogProps, 'open' | 'onClose'> {
  isOpen: boolean
  onClose: () => void
  qrCodes: QRCodeType[]
  qrCodeLoadingState: LoadingStates
  onReload: () => Promise<void>
  onLoadNext: () => Promise<void>
  onDelete: (id: string) => void
  onCreateModalOpen: () => void
}

export default function QrCodeModal({
  isOpen,
  onClose,
  qrCodes,
  qrCodeLoadingState,
  onReload,
  onLoadNext,
  onDelete,
  onCreateModalOpen,
  ...rest
}: QrCodeModalProps) {
  const { t } = useTranslation()
  const { palette, spacing, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))

  const headers = [
    t('poll.qr-code-panel.headers.qr-code-lbl'),
    t('poll.qr-code-panel.headers.creation-time-lbl'),
    t('poll.qr-code-panel.headers.actions-lbl'),
  ]

  return (
    <Dialog
      {...rest}
      open={isOpen}
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
        {isMdUp && (
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
          </>
        )}
        <InfiniteList
          items={qrCodes}
          loadingState={qrCodeLoadingState}
          onRetry={onReload}
          onLoadNext={onLoadNext}
        >
          {qrCodes.map(qrCode =>
            isMdUp ? (
              <DesktopQrCodeItem key={qrCode.id} qrCode={qrCode} onDelete={onDelete} />
            ) : (
              <MobileQrCodeItem key={qrCode.id} qrCode={qrCode} onDelete={onDelete} />
            ),
          )}
        </InfiniteList>
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
          onClick={onCreateModalOpen}
        >
          {t('poll.qr-code-panel.generate-qr-code-btn')}
        </Button>
      </UiDialogContent>
    </Dialog>
  )
}

interface QrCodeItemProps {
  qrCode: QRCodeType
  onDelete: (id: string) => void
}

function DesktopQrCodeItem({ qrCode, onDelete }: QrCodeItemProps) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Box display='grid' gridTemplateColumns={qrCodeModalGridTemplateColumns} alignItems='center'>
      <Stack direction='row' alignItems='center' spacing={3}>
        <ReactQRCode
          value={generatePollQrCodeUrl(qrCode.url)}
          size={48}
          fgColor={palette.text.primary}
          bgColor='transparent'
        />
        <Stack alignItems='flex-start'>
          <Typography variant='subtitle6'>
            {qrCode.metadata.name || formatCroppedString(qrCode.id)}
          </Typography>
          {qrCode.scan_limit ? (
            <Typography variant='body4' color={palette.text.secondary}>
              {t('poll.qr-code-panel.qr-scan-limit-lbl', {
                count: qrCode?.scan_count || 0,
                total: qrCode.scan_limit,
              })}
            </Typography>
          ) : (
            <Typography variant='body4' color={palette.text.secondary}>
              {t('poll.qr-code-panel.qr-scan-count-lbl', { count: qrCode.scan_count })}
            </Typography>
          )}
        </Stack>
      </Stack>
      <Typography variant='subtitle6'>{formatDateTime(qrCode.created_at)}</Typography>
      <QRCodeListItemActions qrCode={qrCode} onDelete={onDelete} />
    </Box>
  )
}

function MobileQrCodeItem({ qrCode, onDelete }: QrCodeItemProps) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack spacing={2}>
      <Stack direction='row' justifyContent='space-between'>
        <ReactQRCode
          value={generatePollQrCodeUrl(qrCode.url)}
          size={40}
          fgColor={palette.text.primary}
          bgColor='transparent'
        />
        <QRCodeListItemActions qrCode={qrCode} onDelete={onDelete} />
      </Stack>
      <Stack>
        <Typography variant='subtitle6'>
          {qrCode.metadata.name || formatCroppedString(qrCode.id)}
        </Typography>
        <Stack direction='row' alignItems='center' spacing={1}>
          {qrCode.scan_limit ? (
            <Typography variant='body4' color={palette.text.secondary}>
              {t('poll.qr-code-panel.qr-scan-limit-lbl', {
                count: qrCode?.scan_count || 0,
                total: qrCode.scan_limit,
              })}
            </Typography>
          ) : (
            <Typography variant='body4' color={palette.text.secondary}>
              {t('poll.qr-code-panel.qr-scan-count-lbl', { count: qrCode.scan_count })}
            </Typography>
          )}
          <DotDivider />
          <Typography variant='body4' color={palette.text.secondary}>
            {formatDateTime(qrCode.created_at)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

function QRCodeListItemActions({
  qrCode,
  onDelete,
}: {
  qrCode: QRCodeType
  onDelete: (id: string) => void
}) {
  const { t } = useTranslation()
  const { copy, isCopied } = useCopyToClipboard()

  const qrCodeValue = generatePollQrCodeUrl(qrCode.url)

  const downloadQrCode = async () => {
    try {
      const dataUrl = await toDataURL(qrCodeValue)
      saveAs(dataUrl, `freedom-tool-qr-${qrCode.id}.png`)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  return (
    <Stack direction='row' alignItems='center' spacing={3}>
      <Tooltip
        title={
          isCopied
            ? t('poll.qr-code-panel.copied-btn-tooltip')
            : t('poll.qr-code-panel.copy-btn-tooltip')
        }
        enterDelay={300}
      >
        <IconButton sx={{ p: 3 }} onClick={() => copy(qrCodeValue)}>
          <UiIcon name={isCopied ? Icons.CheckFill : Icons.FileCopyLine} size={4} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('poll.qr-code-panel.download-btn-tooltip')} enterDelay={300}>
        <IconButton sx={{ p: 3 }} onClick={downloadQrCode}>
          <UiIcon name={Icons.DownloadLine} size={4} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('poll.qr-code-panel.delete-btn-tooltip')} enterDelay={300}>
        <IconButton color='error' sx={{ p: 3 }} onClick={() => onDelete(qrCode.id)}>
          <UiIcon name={Icons.DeleteBin6Line} size={4} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
