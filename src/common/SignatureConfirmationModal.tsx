import { Dialog, DialogProps, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { UiDialogContent } from '@/ui'

import DotsLoader from './DotsLoader'

function SignatureConfirmationModal(props: DialogProps) {
  const { t } = useTranslation()
  const { palette } = useTheme()

  return (
    <Dialog
      {...props}
      PaperProps={{
        noValidate: true,
        position: 'relative',
        ...props.PaperProps,
        sx: { width: 470, ...props.PaperProps?.sx },
      }}
    >
      <UiDialogContent
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={6}
        p={{ xs: 4, md: 6 }}
        textAlign='center'
      >
        <Stack spacing={2} alignItems='center'>
          <Typography variant='subtitle2'>{t('signature-confirmation-modal.title')}</Typography>
          <Typography
            whiteSpace='pre-wrap'
            variant='body3'
            color={palette.text.secondary}
            maxWidth={375}
          >
            {t('signature-confirmation-modal.description')}
          </Typography>
        </Stack>
        <DotsLoader
          color={palette.text.secondary}
          size={3}
          sx={{ alignItems: 'center', height: 50 }}
        />
      </UiDialogContent>
    </Dialog>
  )
}
export default SignatureConfirmationModal
