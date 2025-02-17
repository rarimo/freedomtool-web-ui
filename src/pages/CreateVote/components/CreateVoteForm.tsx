import { time } from '@distributedlab/tools'
import { yupResolver } from '@hookform/resolvers/yup'
import { Delete } from '@mui/icons-material'
import { Button, Divider, IconButton, Stack, TextField } from '@mui/material'
import { Control, Controller, useFieldArray, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import UiDatePicker from '@/common/UiDatePicker'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import { ICreateVote } from '../types'

const minDate = time().utc()

const defaultValues: ICreateVote = {
  startDate: '',
  endDate: '',
  questions: [
    {
      id: uuidv4(),
      text: '',
      options: [
        { id: uuidv4(), text: '' },
        { id: uuidv4(), text: '' },
      ],
    },
  ],
}

export default function CreateVoteForm() {
  const { control, handleSubmit } = useForm<ICreateVote>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<ICreateVote>(
      Yup.object({
        startDate: Yup.string().required('Required'),
        endDate: Yup.string()
          .required('Required')
          .test('isAfterStartDate', 'End Date must be after Start Date', function (value) {
            return time(value).timestamp > time(this.parent.startDate).timestamp
          }),
        questions: Yup.array()
          .of(
            Yup.object({
              id: Yup.string().required(),
              text: Yup.string().required('Question is required'),
              options: Yup.array()
                .of(
                  Yup.object({
                    id: Yup.string().required(),
                    text: Yup.string().required('Option is required'),
                  }),
                )
                .min(2, 'At least two options required')
                .required(),
            }),
          )
          .min(1, 'At least one question required')
          .required(),
      }),
    ),
  })

  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'questions',
  })

  // eslint-disable-next-line no-console
  const submit = (data: ICreateVote) => console.log('data', data)

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

        <Stack spacing={3} divider={<Divider flexItem />}>
          {questionFields.map((question, index) => (
            <Stack key={question.id} spacing={2} p={2} borderRadius={2}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Controller
                  name={`questions.${index}.text`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={`Question #${index + 1}`}
                      variant='standard'
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
                {questionFields.length > 1 && (
                  <IconButton onClick={() => remove(index)} disabled={questionFields.length === 1}>
                    <Delete color='error' />
                  </IconButton>
                )}
              </Stack>

              <OptionsFieldArray control={control} questionIndex={index} />
            </Stack>
          ))}
        </Stack>

        <Button
          variant='text'
          onClick={() =>
            append({
              id: uuidv4(),
              text: '',
              options: [
                { id: uuidv4(), text: '' },
                { id: uuidv4(), text: '' },
              ],
            })
          }
        >
          Add Question
        </Button>

        <Button type='submit'>Submit</Button>
      </Stack>
    </Stack>
  )
}

function OptionsFieldArray({
  control,
  questionIndex,
}: {
  control: Control<ICreateVote, unknown>
  questionIndex: number
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  })

  return (
    <Stack spacing={2}>
      {fields.map((option, index) => (
        <Stack key={option.id} direction='row' alignItems='center' spacing={2}>
          <Controller
            name={`questions.${questionIndex}.options.${index}.text`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                variant='standard'
                size='small'
                label={`Option ${index + 1}`}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          {fields.length > 2 && (
            <IconButton onClick={() => remove(index)}>
              <Delete color='error' />
            </IconButton>
          )}
        </Stack>
      ))}
      <Button
        size='small'
        variant='text'
        sx={{ mr: 'auto' }}
        startIcon={<UiIcon name={Icons.Plus} size={4} />}
        onClick={() => append({ id: uuidv4(), text: '' })}
      >
        Add Option
      </Button>
    </Stack>
  )
}
