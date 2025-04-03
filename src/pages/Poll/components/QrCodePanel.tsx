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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'

import { DotDivider } from '@/common'
import { Icons } from '@/enums'
import { UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'

const qrCodeModalGridTemplateColumns = '1.7fr 1.3fr 1fr'

export default function QrCodePanel({ qrCodeUrl }: { qrCodeUrl: string }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  const [isQrModalShown, setIsQrModalShown] = useState(false)

  return (
    <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
      <Stack direction='row' alignItems='center' spacing={1}>
        <QRCodeBlock url={qrCodeUrl} />
        <Stack alignItems='flex-start' spacing={2}>
          <Typography variant='subtitle5'>Main QR Code</Typography>
          <Typography variant='body4' color={palette.text.secondary}>
            {t('poll.qr-code-panel.qr-scan-count-lbl', { count: 2 })}
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
      <QrCodeModal open={isQrModalShown} onClose={() => setIsQrModalShown(false)} />
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

function QrCodeModal({ open, onClose, ...rest }: DialogProps) {
  const { palette, spacing, breakpoints } = useTheme()
  const { t } = useTranslation()

  const isMdUp = useMediaQuery(breakpoints.up('md'))

  const headers = [
    t('poll.qr-code-panel.headers.qr-code-lbl'),
    t('poll.qr-code-panel.headers.creation-time-lbl'),
    t('poll.qr-code-panel.headers.actions-lbl'),
  ]

  const shareQrCode = () => {}

  const downloadQrCode = () => {}

  const deleteQrCode = () => {}

  const generateNewQrCode = () => {}

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
            <Box
              display='grid'
              gridTemplateColumns={qrCodeModalGridTemplateColumns}
              alignItems='center'
            >
              <Stack direction='row' alignItems='center' spacing={3}>
                <QRCodeBlock size={12} innerPadding={2.5} url='http://localhost:8000' />
                <Stack alignItems='flex-start'>
                  <Typography variant='subtitle6'>Main QR Code</Typography>
                  <Typography variant='body4' color={palette.text.secondary}>
                    {t('poll.qr-code-panel.qr-scan-count-lbl', { count: 2 })}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant='subtitle6'>13/08/25 10:21AM</Typography>
              <Stack direction='row' alignItems='center' spacing={3}>
                <IconButton sx={{ p: 3 }} onClick={shareQrCode}>
                  <UiIcon name={Icons.ShareLine} size={4} />
                </IconButton>
                <IconButton sx={{ p: 3 }} onClick={downloadQrCode}>
                  <UiIcon name={Icons.DownloadLine} size={4} />
                </IconButton>
                <IconButton color='error' sx={{ p: 3 }} onClick={deleteQrCode}>
                  <UiIcon name={Icons.DeleteBin6Line} size={4} />
                </IconButton>
              </Stack>
            </Box>
          </>
        ) : (
          <Stack spacing={2}>
            <Stack direction='row' justifyContent='space-between'>
              <QRCodeBlock size={12} innerPadding={2.5} url='http://localhost:8000' />
              <Stack direction='row' alignItems='center' spacing={3}>
                <IconButton sx={{ p: 3 }} onClick={shareQrCode}>
                  <UiIcon name={Icons.ShareLine} size={4} />
                </IconButton>
                <IconButton sx={{ p: 3 }} onClick={downloadQrCode}>
                  <UiIcon name={Icons.DownloadLine} size={4} />
                </IconButton>
                <IconButton color='error' sx={{ p: 3 }} onClick={deleteQrCode}>
                  <UiIcon name={Icons.DeleteBin6Line} size={4} />
                </IconButton>
              </Stack>
            </Stack>
            <Stack>
              <Typography variant='subtitle6'>Main QR Code</Typography>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography variant='body4' color={palette.text.secondary}>
                  {t('poll.qr-code-panel.qr-scan-count-lbl', { count: 2 })}
                </Typography>
                <DotDivider />
                <Typography variant='body4' color={palette.text.secondary}>
                  13/08/25 10:21AM
                </Typography>
              </Stack>
            </Stack>
          </Stack>
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
