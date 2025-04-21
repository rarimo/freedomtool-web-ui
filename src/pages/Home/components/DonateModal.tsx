import { Dialog, DialogProps, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQRCode from 'react-qr-code'

import { DonateTokenConfig, donateTokenConfig } from '@/constants'
import { Icons } from '@/enums'
import { UiCopyField, UiDialogContent, UiDialogTitle, UiIcon, UiTabs } from '@/ui'

export default function DonateModal({ open, onClose }: DialogProps) {
  const { t } = useTranslation()
  const { palette, breakpoints } = useTheme()
  const isMdDown = useMediaQuery(breakpoints.down('md'))

  const tokenTabs = useMemo(
    () =>
      donateTokenConfig.map(token => ({
        label: token.symbol,
        sx: {
          border: `1px solid ${palette.action.active}`,
          py: 4,
          px: 8,
          height: 'unset',
          '&.MuiTab-labelIcon': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          },
          borderRadius: 2,
          [breakpoints.down('md')]: {
            py: 2,
            px: 4,
          },
        },
        ...(isMdDown ? {} : { icon: <UiIcon size={5} name={token.iconName as Icons} /> }),
        iconPosition: 'start' as const,
        content: <DonateModalContent {...token} key={token.symbol} />,
      })),
    [breakpoints, palette, isMdDown],
  )
  return (
    <Dialog open={open} onClose={onClose}>
      <UiDialogTitle onClose={onClose}>{t('donate-modal.title')}</UiDialogTitle>
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

interface ContributeModalContentProps extends DonateTokenConfig {
  description?: string
}

function DonateModalContent({
  address,
  description,
  name,
  symbol,
  type,
  iconName,
}: ContributeModalContentProps) {
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
