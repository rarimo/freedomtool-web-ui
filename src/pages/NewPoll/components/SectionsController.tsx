import { Button, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { PropsWithChildren, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

interface ISection extends PropsWithChildren {
  title?: string
  footer?: ReactNode
  validate?: () => Promise<boolean>
  onContinue?: () => void
  onBack?: () => void
}

interface SectionsControllerProps {
  sections: ISection[]
  isDisabled: boolean
}

export default function SectionsController({ sections, isDisabled }: SectionsControllerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { children, footer, title, validate, onContinue, onBack } = sections[currentIndex]
  const { t } = useTranslation()
  const { breakpoints, palette } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))

  const isLastStep = currentIndex === sections.length - 1

  const goNext = async () => {
    if (validate) {
      const isValid = await validate()
      if (!isValid) return
    }
    onContinue?.()
    setCurrentIndex(prev => prev + 1)
  }

  const goBack = () => {
    setCurrentIndex(prev => prev - 1)
    onBack?.()
  }

  return (
    <Stack spacing={{ xs: 6, md: 10 }} width={{ xs: '100%', lg: 656, xl: 720 }}>
      <Stack spacing={2}>
        <Typography variant='body4'>
          {t('create-poll.step-counter', { total: sections.length, current: currentIndex + 1 })}
        </Typography>
        {title && <Typography variant='h1'>{title}</Typography>}
      </Stack>

      <Stack width='100%'>
        {children}
        {!isMdUp && footer}
      </Stack>

      {isMdUp && (
        <Stack
          direction={{ xs: 'column-reverse' }}
          spacing={10}
          flexWrap='wrap'
          alignItems='center'
        >
          <Stack width={1} flex={1} spacing={10} direction='row'>
            {currentIndex !== 0 && (
              <IconButton sx={{ width: 48, height: 48 }} onClick={goBack}>
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
      )}

      {!isMdUp && (
        <Stack
          position='fixed'
          height={64}
          left={0}
          bottom={0}
          right={0}
          sx={{ borderTop: `1px solid ${palette.action.active}`, zIndex: 1, overflow: 'hidden' }}
        >
          <Stack
            bgcolor={palette.background.paper}
            py={2}
            px={4}
            width='100%'
            flex={1}
            spacing={10}
            justifyContent='space-between'
            direction='row'
          >
            {currentIndex !== 0 && (
              <IconButton sx={{ width: 48, height: 48 }} onClick={goBack}>
                <UiIcon name={Icons.ArrowLeft} size={5} />
              </IconButton>
            )}
            {isLastStep ? (
              <Button sx={{ ml: 'auto' }} key='submit-button' disabled={isDisabled} type='submit'>
                {t('create-poll.submit-btn')}
              </Button>
            ) : (
              <Button
                sx={{ ml: 'auto' }}
                disabled={isDisabled}
                endIcon={<UiIcon name={Icons.ArrowRight} size={5} />}
                onClick={goNext}
              >
                {t('create-poll.continue-btn')}
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
