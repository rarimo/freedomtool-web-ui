import { Button, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { AuthGuard } from '@/common/index'
import { Icons } from '@/enums'
import { useSignIn } from '@/hooks'

import UiCircledBadge from '../ui/UiCircledBadge'

export default function AuthBlock() {
  const { palette, spacing } = useTheme()
  const { t } = useTranslation()
  const { handleSignIn, isLoading, authGuardRef } = useSignIn()

  return (
    <Stack component={Paper} spacing={4} alignItems='center' borderRadius={4} width='100%' py={8}>
      <UiCircledBadge
        iconProps={{
          name: Icons.LockLine,
          color: palette.primary.dark,
          size: 10,
        }}
        sx={{
          background: palette.primary.lighter,
          width: 96,
          height: 96,
        }}
      />
      <Typography variant='h3'>{t('auth-block.title')}</Typography>
      <Typography variant='body3' color={palette.text.secondary}>
        {t('auth-block.description')}
      </Typography>
      <Button
        fullWidth
        sx={{ height: spacing(14), maxWidth: spacing(87) }}
        disabled={isLoading}
        onClick={() => handleSignIn()}
      >
        {t('auth-block.auth-btn')}
      </Button>
      <AuthGuard ref={authGuardRef} />
    </Stack>
  )
}
