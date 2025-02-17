import { time } from '@distributedlab/tools'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import UiDatePicker from '@/common/UiDatePicker'
import { UiTextField } from '@/ui'

interface ICreateVote {
  startDate: string
  description: string
}

const defaultValues: ICreateVote = {
  startDate: '',
  description: '',
}

const minDate = time().utc()

export default function CreateVoteForm() {
  const { t } = useTranslation()

  const { control, handleSubmit } = useForm<ICreateVote>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<ICreateVote>(
      Yup.object({
        startDate: Yup.string()
          .required()
          .test('minDate', 'Date cannot be earlier than today', function (value) {
            const currentTimestamp = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
            const inputTimestamp = Math.floor(
              new Date(isNaN(Number(value)) ? value : Number(value) * 1000).getTime() / 1000,
            )

            return inputTimestamp !== null && inputTimestamp >= currentTimestamp
          }),
        description: Yup.string()
          .trim()
          .required(t('create-vote.form.description-required-error'))
          .max(350),
      }),
    ),
  })

  const submit = (data: typeof defaultValues) => {
    console.log('data', data)
  }

  return (
    <Stack onSubmit={handleSubmit(submit)} component='form' minWidth={{ md: 600 }}>
      <Stack spacing={5} width='100%'>
        <Controller
          name='startDate'
          control={control}
          render={({ field, fieldState }) => (
            <UiDatePicker
              {...field}
              hasTime
              minDate={minDate}
              errorMessage={fieldState.error?.message}
              label='Start Date (UTC)'
            />
          )}
        />
        <Controller
          name='description'
          control={control}
          render={({ field, fieldState }) => (
            <UiTextField
              {...field}
              multiline
              rows={5}
              errorMessage={fieldState.error?.message}
              placeholder={t('create-vote.form.description-plh')}
              sx={{
                background: 'transparent',
                '& .MuiInputBase-root': {
                  height: 'unset',
                },
              }}
            />
          )}
        />
        <Button type='submit'>Submit</Button>
      </Stack>
    </Stack>
  )
}
