import { Box, Divider, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { formatDateTime } from '@/helpers'
import { hiddenScrollbar, textWrapAndDirectionStyles } from '@/theme/constants'
import { lineClamp } from '@/theme/helpers'
import { Nationality, Sex } from '@/types'
import { UiIcon } from '@/ui'

import { SectionAnchor } from '../constants'
import PreviewLayout from './PreviewLayout'

interface PollDetailsProps {
  title: string
  description: string
  startDate: string
  endDate: string
}

interface Props extends PollDetailsProps {
  image?: File | null
  nationalities: Nationality[]
  minAge?: number | ''
  maxAge?: number | ''
  sex?: string
}

export default function PollPreview({
  title,
  description,
  image,
  startDate,
  endDate,
  nationalities,
  minAge,
  maxAge,
  sex,
}: Props) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const [imageSrc, setImageSrc] = useState<string>('')

  const getAgeValue = () => {
    if (minAge && maxAge) return `${minAge}-${maxAge}`
    if (minAge) return `${minAge}+`
    if (maxAge) return t('poll-preview.max-age-criteria', { age: maxAge })
    return ''
  }

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
      text: t('poll-preview.age-criteria-item', { value: getAgeValue() }),
      isHidden: !minAge && !maxAge,
    },
    {
      id: 'sex',
      text: t('poll-preview.sex-criteria-item', {
        value: sex === Sex.Male ? t('poll-preview.sex-male') : t('poll-preview.sex-female'),
      }),
      isHidden: !sex,
    },
  ]

  const hasAnyCriteria = criteriaItems.some(({ isHidden }) => !isHidden)

  useEffect(() => {
    if (!image) {
      setImageSrc('')
      return
    }

    const objectUrl = URL.createObjectURL(image)
    setImageSrc(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [image])

  return (
    <>
      <Stack id={SectionAnchor.Details} />
      <PreviewLayout>
        <PollImage imageSrc={imageSrc} />
        <Stack spacing={5} px={3.5} py={5}>
          <PollDetails
            title={title}
            startDate={startDate}
            endDate={endDate}
            description={description}
          />

          <Stack height={320} spacing={5}>
            {hasAnyCriteria && (
              <Stack spacing={5}>
                <Divider />
                <Typography variant='overline3' color={palette.text.placeholder}>
                  {t('poll-preview.criteria-subtitle')}
                </Typography>
              </Stack>
            )}
            {hasAnyCriteria && (
              <Stack spacing={5} pb={2} sx={{ overflow: 'auto', ...hiddenScrollbar }}>
                <Stack spacing={4}>
                  {criteriaItems.map(
                    ({ id, text, isHidden }) => !isHidden && <CriteriaItem key={id} text={text} />,
                  )}
                </Stack>
              </Stack>
            )}
            <Stack id={SectionAnchor.Criteria} />
          </Stack>
        </Stack>
      </PreviewLayout>
    </>
  )
}

function PollImage({ imageSrc }: { imageSrc?: string }) {
  const { palette } = useTheme()

  return (
    <Stack
      position='relative'
      justifyContent='center'
      alignItems='center'
      height={194}
      borderBottom={imageSrc ? 0 : 1}
      borderColor={palette.action.active}
    >
      {imageSrc ? (
        <Box
          component='img'
          src={imageSrc}
          position='absolute'
          width='100%'
          height='100%'
          sx={{
            inset: 0,
            objectFit: 'cover',
          }}
        />
      ) : (
        <UiIcon name={Icons.ImageFill} size={6} color={palette.text.placeholder} />
      )}
    </Stack>
  )
}

function PollDetails({ title, startDate, endDate, description }: Partial<PollDetailsProps>) {
  const { palette } = useTheme()

  const formattedStartDate = startDate ? formatDateTime(startDate) : '---'
  const formattedEndDate = endDate ? formatDateTime(endDate) : '---'

  return (
    <Stack spacing={2.5}>
      <Typography
        title={title}
        variant='h4'
        color={palette.text.primary}
        sx={{ ...textWrapAndDirectionStyles, ...lineClamp(2) }}
      >
        {title || '---'}
      </Typography>
      <Stack alignItems='center' direction='row' spacing={1.5} color={palette.text.placeholder}>
        <UiIcon name={Icons.CalendarLine} size={4} />
        <Typography variant='body4'>
          {startDate || endDate ? `${formattedStartDate} – ${formattedEndDate}` : '----'}
        </Typography>
      </Stack>
      <Typography
        variant='body4'
        title={description}
        color={palette.text.placeholder}
        sx={{ ...textWrapAndDirectionStyles, ...lineClamp(3) }}
      >
        {description || '----'}
      </Typography>
    </Stack>
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
