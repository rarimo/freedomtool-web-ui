import { Button, IconButton, Stack, Typography } from '@mui/material'
import { PropsWithChildren, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

interface ISection extends PropsWithChildren {
  title?: string
  footer?: ReactNode
  validate?: () => Promise<boolean>
  onContinue?: () => void
}

interface SectionsControllerProps {
  sections: ISection[]
  isDisabled: boolean
}

export default function SectionsController({ sections, isDisabled }: SectionsControllerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { children, footer, title, validate, onContinue } = sections[currentIndex]
  const { t } = useTranslation()

  const isLastStep = currentIndex === sections.length - 1

  const goNext = async () => {
    if (validate) {
      const isValid = await validate()
      if (!isValid) return
    }
    onContinue?.()
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

      {children}

      <Stack
        direction={{ xs: 'column-reverse', md: 'row' }}
        spacing={10}
        flexWrap='wrap'
        alignItems='center'
      >
        <Stack width={1} flex={1} spacing={10} direction='row'>
          {currentIndex !== 0 && (
            <IconButton
              sx={{ width: 48, height: 48 }}
              onClick={() => setCurrentIndex(prev => prev - 1)}
            >
              <UiIcon name={Icons.ArrowLeft} size={5} />
            </IconButton>
          )}
          {isLastStep ? (
            <Button key='submit-button' disabled={isDisabled} type='submit'>
              {t('create-poll.submit-btn')}
            </Button>
          ) : (
            <Button
              disabled={isDisabled}
              endIcon={<UiIcon name={Icons.ArrowRight} size={5} />}
              onClick={goNext}
            >
              {t('create-poll.continue-btn')}
            </Button>
          )}
        </Stack>
        {footer && (
          <Stack ml='auto' flex={0}>
            {footer}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
