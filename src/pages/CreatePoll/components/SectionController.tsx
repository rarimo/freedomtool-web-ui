import { Button, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

interface ISection {
  title?: string
  body: ReactNode
  footer?: ReactNode
  onContinue?: () => Promise<boolean>
}

interface ISectionsController {
  sections: ISection[]
  isDisabled: boolean
}

export default function SectionsController({ sections, isDisabled }: ISectionsController) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { body, footer, title, onContinue } = sections[currentIndex]
  const { t } = useTranslation()
  const { palette } = useTheme()

  const isLastStep = currentIndex === sections.length - 1

  const goNext = async () => {
    const isValid = await onContinue?.()
    if (!isValid) return
    setCurrentIndex(prev => prev + 1)
  }

  return (
    <Stack spacing={10}>
      <Stack spacing={2}>
        <Typography variant='body4'>
          {t('create-poll.step-counter', { total: sections.length, current: currentIndex + 1 })}
        </Typography>
        {title && <Typography variant='h1'>{title}</Typography>}
      </Stack>

      {body}

      <Stack direction='row' spacing={10} flexWrap='wrap' alignItems='center'>
        <Stack flex={1} spacing={10} direction='row'>
          {currentIndex !== 0 && (
            <IconButton
              sx={{ background: palette.action.active }}
              onClick={() => setCurrentIndex(prev => prev - 1)}
            >
              <UiIcon name={Icons.ArrowLeft} />
            </IconButton>
          )}
          {isLastStep ? (
            <Button disabled={isDisabled} type='submit'>
              {t('create-poll.submit-btn')}
            </Button>
          ) : (
            <Button
              disabled={isDisabled}
              endIcon={<UiIcon name={Icons.ArrowRight} />}
              onClick={goNext}
            >
              {t('create-poll.continue-btn')}
            </Button>
          )}
        </Stack>
        <Stack ml='auto' flex={0}>
          {footer}
        </Stack>
      </Stack>
    </Stack>
  )
}
