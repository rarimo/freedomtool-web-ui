import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RARIME_APP_STORE_URL, RARIME_GOOGLE_PLAY_URL } from '@/constants'
import { Icons } from '@/enums'
import { UiDialogContent, UiIcon } from '@/ui'

import { QRCodeBlock } from './VoteQrCode'

export default function VoteBlock({ qrCodeUrl }: { qrCodeUrl: string }) {
  const { palette, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const { t } = useTranslation()

  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)

  if (isMdUp) return null

  return (
    <>
      <Stack
        justifyContent='center'
        component={Paper}
        sx={{ mb: 4, position: 'sticky', top: 60, background: palette.primary.light, zIndex: 2 }}
      >
        <Stack alignItems='center' direction='row' spacing={4}>
          <Stack
            width={40}
            height={40}
            alignItems='center'
            justifyContent='center'
            sx={{ background: palette.common.white, borderRadius: 2 }}
          >
            <UiIcon name={Icons.Rarime} />
          </Stack>
          <Stack
            flex={1}
            alignItems='center'
            width={1}
            spacing={2}
            direction='row'
            justifyContent='space-between'
          >
            <Stack spacing={0.5}>
              <Typography variant='buttonMedium' color={palette.primary.darker}>
                {t('vote.promo.title')}
              </Typography>
              <Typography variant='body4' color={palette.primary.main}>
                {t('vote.promo.description')}
              </Typography>
            </Stack>
            <Button
              color='primary'
              size='small'
              sx={{ width: 'fit-content' }}
              onClick={() => setIsVoteModalOpen(true)}
            >
              {t('vote.promo.vote-btn')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <VoteModal
        qrCodeUrl={qrCodeUrl}
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
      />
    </>
  )
}

function VoteModal({
  qrCodeUrl,
  isOpen,
  onClose,
}: {
  qrCodeUrl: string
  isOpen: boolean
  onClose: () => void
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: 1 },
      }}
    >
      <Stack>
        <UiDialogContent>
          <Stack spacing={5} alignItems='center' justifyContent='center'>
            <Typography mb={2} variant='h5' textAlign='center'>
              {t('vote.promo.modal-title')}
            </Typography>
            <QRCodeBlock size={30} url={qrCodeUrl} isLink />
            <Divider textAlign='center' flexItem>
              <Typography color={palette.text.secondary}>{t('vote.promo.download-app')}</Typography>
            </Divider>
            <Stack direction='row' spacing={4}>
              <Box
                component='a'
                href={RARIME_APP_STORE_URL}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Box
                  component='img'
                  src='/images/app-store.svg'
                  alt={t('vote.promo.app-store-alt')}
                />
              </Box>
              <Box
                component='a'
                href={RARIME_GOOGLE_PLAY_URL}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Box
                  component='img'
                  src='/images/play-market.svg'
                  alt={t('vote.promo.play-market-alt')}
                />
              </Box>
            </Stack>
          </Stack>
        </UiDialogContent>
      </Stack>
    </Dialog>
  )
}
