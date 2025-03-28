import { Box, Divider, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { formatDateTime } from '@/helpers'
import { INationality } from '@/types'
import { UiIcon } from '@/ui'

import PreviewLayout from './PreviewLayout'

interface Props {
  title: string
  description: string
  imageSrc: string
  startDate: string
  endDate: string
  nationalities: INationality[]
  minimumAge?: number
  maximumAge?: number
  sex?: string
}

export default function PollPreview({
  title,
  description,
  imageSrc,
  startDate,
  endDate,
  nationalities,
  minimumAge,
  maximumAge,
  sex,
}: Props) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  const formattedStartDate = startDate ? formatDateTime(startDate) : '---'
  const formattedEndDate = endDate ? formatDateTime(endDate) : '---'

  const criteriaItems: { id: string; text: string; isHidden: boolean }[] = [
    {
      id: 'nationalities',
      text: t('poll-preview.nationalities-criteria-item', {
        value: nationalities.map(({ name }) => name).join(', '),
      }),
      isHidden: nationalities.length === 0,
    },
    {
      id: 'age',
      text: t('poll-preview.age-criteria-item', {
        value: () => {
          if (minimumAge && maximumAge) return `${minimumAge}-${maximumAge}`
          if (minimumAge) return `${minimumAge}+`
          if (maximumAge) return t('poll-preview.max-age-criteria', { age: maximumAge })
          return ''
        },
      }),
      isHidden: !minimumAge && !maximumAge,
    },
    {
      id: 'sex',
      text: t('poll-preview.sex-criteria-item', {
        value: sex === 'M' ? t('poll-preview.sex-male') : t('poll-preview.sex-female'),
      }),
      isHidden: !sex,
    },
  ]

  const hasAnyCriteria = criteriaItems.some(({ isHidden }) => !isHidden)

  return (
    <PreviewLayout>
      <Box component='img' src={imageSrc} width='100%' height={194} sx={{ objectFit: 'cover' }} />
      <Stack spacing={5} px={3.5} py={5}>
        <Stack spacing={2.5}>
          <Typography variant='h4' color={palette.text.primary}>
            {title || '---'}
          </Typography>
          <Stack direction='row' spacing={1.5} color={palette.text.placeholder}>
            <UiIcon name={Icons.CalendarBlank} size={4} />
            <Typography variant='body4'>
              {startDate || endDate ? `${formattedStartDate} - ${formattedEndDate}` : '----'}
            </Typography>
          </Stack>
          <Typography variant='body4' color={palette.text.placeholder}>
            {description || '----'}
          </Typography>
        </Stack>

        {hasAnyCriteria && (
          <>
            <Divider />
            <Typography variant='overline3' color={palette.text.placeholder}>
              {t('poll-preview.criteria-subtitle')}
            </Typography>
            <Stack spacing={4}>
              {criteriaItems.map(
                ({ id, text, isHidden }) => !isHidden && <CriteriaItem key={id} text={text} />,
              )}
            </Stack>
          </>
        )}
      </Stack>
    </PreviewLayout>
  )
}

function CriteriaItem({ text }: { text: string }) {
  const { palette } = useTheme()

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <UiIcon name={Icons.QuestionFill} size={5} color={palette.text.placeholder} />
      <Typography variant='subtitle6' color={palette.text.secondary}>
        {text}
      </Typography>
    </Stack>
  )
}
