import { Button, Dialog, DialogProps, Link, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'

import UiCircledBadge from '../ui/UiCircledBadge'

export default function InstallMetamaskModal({ open, onClose, ...rest }: DialogProps) {
  const { palette, spacing } = useTheme()
  const { t } = useTranslation()

  return (
    <Dialog
      {...rest}
      open={open}
      onClose={onClose}
      PaperProps={{
        ...rest.PaperProps,
        noValidate: true,
        position: 'relative',
        sx: {
          width: '100%',
          maxWidth: spacing(100),
        },
      }}
    >
      <UiDialogTitle onClose={onClose}>{t('install-metamask-modal.title')}</UiDialogTitle>
      <UiDialogContent
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={6}
        px={6}
        py={8}
        textAlign='center'
      >
        <UiCircledBadge
          iconProps={{
            name: Icons.Metamask,
            size: 10,
          }}
          sx={{
            background: palette.warning.lighter,
            width: 96,
            height: 96,
          }}
        />
        <Typography variant='body3' color={palette.text.secondary} maxWidth={360}>
          {t('install-metamask-modal.description')}
        </Typography>
        <Button
          variant='outlined'
          fullWidth
          component={Link}
          href='https://metamask.io/download'
          target='_blank'
          rel='noreferrer'
          startIcon={<UiIcon name={Icons.Metamask} size={5} />}
          onClick={e => onClose?.(e, 'backdropClick')}
        >
          {t('install-metamask-modal.install-lbl')}
        </Button>
      </UiDialogContent>
    </Dialog>
  )
}
