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
import { useState } from 'react'
import { Control, Controller, FieldArrayWithId, useFieldArray, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import { MAX_OPTIONS_PER_QUESTION } from '../constants'
import { ICreateVote } from '../types'

interface IQuestionForm {
  question: FieldArrayWithId<ICreateVote, 'questions', 'id'>
  control: Control<ICreateVote, unknown>
  index: number
  canDelete: boolean
  onDelete: () => void
}

interface IQuestionCard extends IQuestionForm {
  isEditing: boolean
  onEdit: () => void
}

export default function QuestionCard(props: IQuestionCard) {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const { index, control } = props
  const [isExpanded, setIxExpanded] = useState(true)

  const questionText = useWatch({
    control,
    name: `questions.${index}.text`,
  })

  const { invalid } = control.getFieldState(`questions.${index}`)

  const toggleAccordion = () => {
    setIxExpanded(prev => !prev)
  }

  return (
    <Accordion
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
          variant='buttonMedium'
        >
          {questionText || t('create-vote.form.question-lbl', { order: index + 1 })}
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
    <Stack key={question.id} spacing={2} p={2} borderRadius={2}>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Controller
          name={`questions.${index}.text`}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t('create-vote.form.question-lbl', { order: index + 1 })}
              variant='standard'
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
        {canDelete && (
          <IconButton color='error' onClick={onDelete}>
            <UiIcon name={Icons.DeleteBin6Line} size={4} />
          </IconButton>
        )}
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
          <Controller
            name={`questions.${questionIndex}.options.${index}.text`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                variant='standard'
                size='small'
                label={t('create-vote.form.option-lbl', { order: index + 1 })}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          {fields.length > 2 && (
            <IconButton onClick={() => remove(index)} color='error'>
              <UiIcon name={Icons.DeleteBin6Line} size={4} />
            </IconButton>
          )}
        </Stack>
      ))}
      <Button
        size='small'
        variant='text'
        sx={{ mr: 'auto', pl: 0, mt: 3 }}
        startIcon={<UiIcon name={Icons.Plus} size={4} />}
        disabled={fields.length === MAX_OPTIONS_PER_QUESTION}
        onClick={() => append({ id: uuidv4(), text: '' })}
      >
        {t('create-vote.form.add-option-lbl')}
      </Button>
    </Stack>
  )
}
