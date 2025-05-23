import { Button, Dialog, Divider, Stack, Typography, useTheme } from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { formatAgeRange } from '@/helpers'
import { useScrollWithShadow } from '@/hooks'
import { UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'

export interface PollCriteriaListProps {
  formattedNationalitiesArray: string[] | null
  minAge: number | null
  maxAge: number | null
  formattedSex: string | null
}

export default function PollCriteriaList(props: Partial<PollCriteriaListProps>) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const { containerRef, shadowScrollStyle } = useScrollWithShadow(40)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isEmpty(props)) return null

  const { formattedNationalitiesArray, minAge, maxAge, formattedSex } = props

  const formattedAge = formatAgeRange({ minAge, maxAge })

  const hasNationalitiesList =
    Array.isArray(formattedNationalitiesArray) && formattedNationalitiesArray.length > 0

  const nationalitiesPreview = hasNationalitiesList
    ? formattedNationalitiesArray.length === 1
      ? formattedNationalitiesArray[0]
      : `${formattedNationalitiesArray[0]} +${formattedNationalitiesArray.length - 1}`
    : null

  const previewString =
    [nationalitiesPreview, formattedSex, formattedAge].filter(item => item !== null).join(', ') ||
    '–'

  const criteriaList = [
    {
      label: t('poll.criteria-list.sex'),
      value: formattedSex,
    },
    {
      label: t('poll.criteria-list.age'),
      value: formattedAge,
    },
  ]

  const hasCriteriaList = criteriaList.some(criteria => criteria.value)

  return (
    <>
      <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
        <Typography variant='body4' color={palette.text.secondary}>
          {t('poll.criteria')}
        </Typography>
        {hasNationalitiesList ? (
          <Button
            sx={{ p: 0, color: palette.text.primary, height: 'fit-content' }}
            variant='text'
            size='small'
            endIcon={<UiIcon size={4} name={Icons.Info} />}
            onClick={() => setIsModalOpen(true)}
          >
            <Typography variant='subtitle6'>{previewString}</Typography>
          </Button>
        ) : (
          <Typography variant='subtitle6'>{previewString}</Typography>
        )}
      </Stack>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UiDialogTitle onClose={() => setIsModalOpen(false)}>
          {t('poll.criteria-modal-title')}
        </UiDialogTitle>
        <UiDialogContent sx={{ width: { xs: 290, md: 450 } }}>
          {hasCriteriaList && (
            <>
              <Stack spacing={4}>
                {criteriaList.map(
                  (item, index) =>
                    item.value && (
                      <Stack
                        key={index}
                        direction='row'
                        width={1}
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Typography variant='body4' color={palette.text.secondary}>
                          {item.label}
                        </Typography>
                        <Typography
                          textAlign='right'
                          variant='subtitle6'
                          typography={{ xs: 'body4', md: 'subtitle6' }}
                        >
                          {item.value}
                        </Typography>
                      </Stack>
                    ),
                )}
              </Stack>
              <Divider flexItem orientation='horizontal' sx={{ my: 5 }} />
            </>
          )}

          {formattedNationalitiesArray?.length && (
            <Stack>
              <Typography variant='subtitle5'>
                {t('poll.criteria-list.allowed-nationalities', {
                  count: formattedNationalitiesArray.length,
                })}
              </Typography>
              <Stack
                ref={containerRef}
                spacing={1}
                minHeight={100}
                maxHeight={250}
                mt={2}
                sx={{
                  overflow: 'scroll',
                  ...shadowScrollStyle,
                }}
              >
                {formattedNationalitiesArray.map(item => (
                  <Typography
                    sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                    key={item}
                    variant='body4'
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          )}
        </UiDialogContent>
      </Dialog>
    </>
  )
}
