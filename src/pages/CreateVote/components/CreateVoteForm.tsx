import { time } from '@distributedlab/tools'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import UiDatePicker from '@/common/UiDatePicker'

interface ICreateVote {
  startDate: string
  endDate: string
}

const defaultValues: ICreateVote = {
  startDate: '',
  endDate: '',
}

const minDate = time().utc()

export default function CreateVoteForm() {
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
        endDate: Yup.string()
          .required()
          .test('isAfterStartDate', 'End Date must be after Start Date', function (value) {
            const startTimestamp = Math.floor(
              new Date(
                isNaN(Number(this.parent.startDate))
                  ? this.parent.startDate
                  : Number(this.parent.startDate) * 1000,
              ).getTime() / 1000,
            )

            const endTimestamp = Math.floor(
              new Date(isNaN(Number(value)) ? value : Number(value) * 1000).getTime() / 1000,
            )

            return startTimestamp !== null && endTimestamp !== null && endTimestamp > startTimestamp
          }),
      }),
    ),
  })

  const submit = (data: typeof defaultValues) => {
    // eslint-disable-next-line no-console
    console.log('data', data)
  }

  return (
    <Stack onSubmit={handleSubmit(submit)} component='form' minWidth={{ md: 600 }}>
      <Stack spacing={5} width='100%'>
        <Stack direction='row' justifyContent='space-between' spacing={5}>
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
            name='endDate'
            control={control}
            render={({ field, fieldState }) => (
              <UiDatePicker
                {...field}
                hasTime
                minDate={minDate}
                errorMessage={fieldState.error?.message}
                label='End Date (UTC)'
              />
            )}
          />
        </Stack>
        <Button type='submit'>Submit</Button>
      </Stack>
    </Stack>
  )
}
