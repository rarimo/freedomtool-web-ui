import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Control, Controller, FieldArrayWithId, useFieldArray, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import { DotDivider } from '@/common'
import { MAX_OPTIONS_PER_QUESTION } from '@/constants'
import { Icons } from '@/enums'
import { ICreateVote } from '@/types'
import { UiIcon } from '@/ui'

interface IQuestionForm {
  question: FieldArrayWithId<ICreateVote, 'questions', 'id'>
  control: Control<ICreateVote, unknown>
  index: number
  canDelete: boolean
  isDisabled: boolean
  onDelete: () => void
}

interface IQuestionCard extends IQuestionForm {
  isEditing: boolean
  onEdit: () => void
}

export default function QuestionCard(props: IQuestionCard) {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const { index, control, isDisabled } = props
  const [isExpanded, setIxExpanded] = useState(true)

  const questionText = useWatch({
    control,
    name: `questions.${index}.text`,
  })

  const { invalid } = control.getFieldState(`questions.${index}`)

  const toggleAccordion = () => {
    setIxExpanded(prev => !prev)
  }

  useEffect(() => {
    if (isDisabled) setIxExpanded(false)
  }, [isDisabled])

  return (
    <Accordion
      disabled={isDisabled}
      expanded={isExpanded}
      onChange={toggleAccordion}
      sx={{ border: invalid ? `1px solid ${palette.error.main}` : '' }}
    >
      <AccordionSummary>
        <Typography
          title={questionText}
          maxWidth={{ xs: 300, md: 450 }}
          noWrap
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {questionText || t('create-vote.question-lbl', { order: index + 1 })}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />
        <QuestionForm {...props} />
      </AccordionDetails>
    </Accordion>
  )
}

function QuestionForm(props: IQuestionForm) {
  const { question, index, canDelete, control, onDelete } = props
  const { t } = useTranslation()

  return (
    <Stack key={question.id} spacing={2} borderRadius={2}>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Controller
          name={`questions.${index}.text`}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              placeholder={t('create-vote.question-lbl', { order: index + 1 })}
              size='medium'
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              InputProps={{
                endAdornment: canDelete && (
                  <IconButton color='error' onClick={onDelete}>
                    <UiIcon name={Icons.DeleteBin6Line} size={4} />
                  </IconButton>
                ),
              }}
              fullWidth
            />
          )}
        />
      </Stack>

      <OptionsForm control={control} questionIndex={index} />
    </Stack>
  )
}

function OptionsForm({
  control,
  questionIndex,
}: {
  control: Control<ICreateVote, unknown>
  questionIndex: number
}) {
  const { t } = useTranslation()
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
                  size='small'
                  variant='outlined'
                  placeholder={t('create-vote.option-lbl', { order: index + 1 })}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    endAdornment: fields.length > 2 && (
                      <IconButton onClick={() => remove(index)} color='error'>
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
        size='small'
        variant='text'
        sx={{ mr: 'auto', pl: 1, mt: 1 }}
        startIcon={<UiIcon name={Icons.Plus} size={4} />}
        disabled={fields.length === MAX_OPTIONS_PER_QUESTION}
        onClick={() => append({ id: uuidv4(), text: '' })}
      >
        {t('create-vote.add-option-lbl')}
      </Button>
    </Stack>
  )
}
