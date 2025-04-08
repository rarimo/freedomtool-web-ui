import { Button, Divider, IconButton, Stack, TextField, useTheme } from '@mui/material'
import { Control, Controller, FieldArrayWithId, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import { DotDivider } from '@/common'
import { MAX_OPTIONS_PER_QUESTION } from '@/constants'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'

interface QuestionFormProps {
  question: FieldArrayWithId<CreatePollSchema, 'questions', 'id'>
  control: Control<CreatePollSchema, unknown>
  index: number
  canDelete: boolean
  isDisabled: boolean
  onDelete: () => void
}

interface QuestionCardProps extends QuestionFormProps {
  isEditing: boolean
  onEdit: () => void
}

export default function QuestionCard(props: QuestionCardProps) {
  return <QuestionForm {...props} />
}

function QuestionForm(props: QuestionFormProps) {
  const { palette } = useTheme()
  const { question, index, canDelete, control, onDelete } = props
  const { t } = useTranslation()

  return (
    <Stack
      py={4}
      px={5}
      bgcolor={palette.action.active}
      key={question.id}
      spacing={2}
      borderRadius={4}
    >
      <Stack>
        <Controller
          name={`questions.${index}.text`}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              placeholder={t('create-poll.question-lbl', { order: index + 1 })}
              size='medium'
              label={t('create-poll.question-lbl', { order: index + 1 })}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              InputProps={{
                endAdornment: canDelete && (
                  <IconButton color='secondary' onClick={onDelete}>
                    <UiIcon name={Icons.DeleteBin6Line} size={4} />
                  </IconButton>
                ),
              }}
              fullWidth
            />
          )}
        />
        <Divider sx={{ mt: 2, mb: 3 }} />
      </Stack>
      <OptionsForm control={control} questionIndex={index} />
    </Stack>
  )
}

function OptionsForm({
  control,
  questionIndex,
}: {
  control: Control<CreatePollSchema, unknown>
  questionIndex: number
}) {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  })

  return (
    <Stack spacing={2}>
      {fields.map((option, index) => (
        <Stack key={option.id} direction='row' alignItems='center' spacing={2}>
          <Stack direction='row' ml={2} spacing={2} alignItems='center' width='100%'>
            <DotDivider />
            <Controller
              name={`questions.${questionIndex}.options.${index}.text`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t('create-poll.option-lbl', { order: index + 1 })}
                  label={t('create-poll.option-lbl', { order: index + 1 })}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    sx: {
                      background: palette.background.light,
                      '&:focus-within': {
                        background: palette.background.light,
                      },
                      '&:hover': {
                        background: palette.background.light,
                      },
                    },
                    endAdornment: fields.length > 2 && (
                      <IconButton color='secondary' onClick={() => remove(index)}>
                        <UiIcon name={Icons.DeleteBin6Line} size={4} />
                      </IconButton>
                    ),
                  }}
                  fullWidth
                />
              )}
            />
          </Stack>
        </Stack>
      ))}
      <Button
        size='medium'
        variant='text'
        sx={{ mr: 'auto', py: 0, ml: 8, pl: 0, mt: 4, mb: 2, height: 'fit-content' }}
        startIcon={<UiIcon name={Icons.Plus} size={4} />}
        disabled={fields.length === MAX_OPTIONS_PER_QUESTION}
        onClick={() => append({ id: uuidv4(), text: '' })}
      >
        {t('create-poll.add-option-lbl')}
      </Button>
    </Stack>
  )
}
