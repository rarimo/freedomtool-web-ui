import { Dialog, DialogProps, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQRCode from 'react-qr-code'

import { DonateTokenConfig, donateTokenConfig } from '@/constants'
import { UiCopyField, UiDialogContent, UiDialogTitle, UiIcon, UiTabs } from '@/ui'
import { UiTab } from '@/ui/UiTabs'

interface DonateModalProps extends DialogProps {
  title?: string
  tokenTabs: UiTab[]
}

export default function DefaultDonateModal({ open, onClose }: DialogProps) {
  const { t } = useTranslation()
  const { palette, breakpoints } = useTheme()

  const tokenTabs = useMemo(
    () =>
      donateTokenConfig.map(token => ({
        label: token.symbol,
        sx: {
          border: `1px solid ${palette.action.active}`,
          py: 4,
          px: 8,
          height: 'unset',
          borderRadius: 2,
          [breakpoints.down('md')]: {
            py: 2,
            px: 4,
          },
        },
        iconPosition: 'start' as const,
        content: <DonateModalContent {...token} key={token.symbol} />,
      })),
    [breakpoints, palette],
  )
  return (
    <DonateModal
      title={t('donate-modal.title')}
      tokenTabs={tokenTabs}
      open={open}
      onClose={onClose}
    />
  )
}

export function DonateModal({ title, open, onClose, tokenTabs }: DonateModalProps) {
  const { palette } = useTheme()
  return (
    <Dialog open={open} onClose={onClose}>
      <UiDialogTitle onClose={onClose}>{title}</UiDialogTitle>
      <UiDialogContent>
        <UiTabs
          slots={{
            tabsProps: {
              sx: {
                background: 'transparent',
                borderRadius: 0,
                height: 'unset',
                '& .MuiTabs-indicator': {
                  background: 'transparent',
                  border: `1px solid ${palette.text.primary}`,
                  height: '100%',
                  borderRadius: 2,
                },
              },
            },
          }}
          tabs={tokenTabs}
        />
      </UiDialogContent>
    </Dialog>
  )
}

interface DonateModalContentProps extends DonateTokenConfig {
  description?: string
}

function DonateModalContent({
  address,
  description,
  name,
  symbol,
  type,
  iconName,
}: DonateModalContentProps) {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()
  const isMdDown = useMediaQuery(breakpoints.down('md'))

  return (
    <Stack mt={3} spacing={{ xs: 4, md: 6 }} alignItems='center' justifyContent='center'>
      <UiIcon size={isMdDown ? 12 : 18} name={iconName} />
      <Typography textAlign='center' variant='subtitle5' color={palette.text.secondary}>
        {name} ({type || symbol})
      </Typography>
      <Typography textAlign='center' variant='body4' color={palette.text.secondary}>
        {description || t('donate-modal.description')}
      </Typography>
      <ReactQRCode size={isMdDown ? 80 : 140} value={address} />
      <UiCopyField label={t('donate-modal.address-lbl')} value={address} />
    </Stack>
  )
}
