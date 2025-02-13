import { Button, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function ErrorBoundaryFallback({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation()
  const { palette } = useTheme()

  return (
    <Stack
      spacing={2}
      alignItems='center'
      justifyContent='center'
      maxWidth={420}
      mx='auto'
      px={4}
      height='100%'
      flex={1}
      textAlign='center'
    >
      <Typography variant='h2' mt={4}>
        {t('error-boundary.title')}
      </Typography>
      <Typography variant='body3' color={palette.text.secondary}>
        {t('error-boundary.description')}
      </Typography>
      <Button variant='outlined' size='medium' sx={{ mt: 2 }} onClick={onReset}>
        {t('error-boundary.button-lbl')}
      </Button>
    </Stack>
  )
}
