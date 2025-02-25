import { Button, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useAppKit } from '@reown/appkit/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { UiIcon } from '@/ui'

export default function AuthBlock() {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const { open } = useAppKit()

  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await open()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
    setIsLoading(false)
  }

  return (
    <Stack
      component={Paper}
      spacing={4}
      width={{ xs: 1, md: 350 }}
      mx='auto'
      alignItems='center'
      textAlign='center'
    >
      <Stack
        alignItems='center'
        justifyContent='center'
        width={40}
        height={40}
        bgcolor={palette.action.active}
        borderRadius='50%'
      >
        <UiIcon name={Icons.LockLine} size={5} color={palette.text.secondary} />
      </Stack>
      <Stack spacing={1}>
        <Typography variant='subtitle3'>{t('auth-block.title')}</Typography>
        <Typography variant='body4' color={palette.text.secondary} maxWidth={200}>
          {t('auth-block.description')}
        </Typography>
      </Stack>
      <Button
        variant='contained'
        size='medium'
        disabled={isLoading}
        sx={{ width: 160 }}
        onClick={() => handleSignIn()}
      >
        {t('auth-block.auth-btn')}
      </Button>
    </Stack>
  )
}
