import { time } from '@distributedlab/tools'
import { yupResolver } from '@hookform/resolvers/yup'
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
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import UiDatePicker from '@/common/UiDatePicker'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import { ICreateVote } from '../types'

const minDate = time().utc()

const MAX_OPTIONS_PER_QUESTION = 8
const MAX_QUESTIONS = 12

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
  const { t } = useTranslation()
  const { control, handleSubmit, trigger } = useForm<ICreateVote>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<ICreateVote>(
      Yup.object({
        startDate: Yup.string().required(),
        endDate: Yup.string()
          .required()
          .test('isAfterStartDate', t('create-vote.form.end-date-error'), function (value) {
            return time(value).timestamp > time(this.parent.startDate).timestamp
          }),
        questions: Yup.array()
          .of(
            Yup.object({
              id: Yup.string().required(),
              text: Yup.string().required().max(30),
              options: Yup.array()
                .of(
                  Yup.object({
                    id: Yup.string().required(),
                    text: Yup.string().required(),
                  }),
                )
                .required(),
            }),
          )
          .min(1)
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

  const [editQuestionIndex, setEditQuestionIndex] = useState(questionFields.length - 1)
  const questionContainerRef = useRef<HTMLDivElement | null>(null)

  // eslint-disable-next-line no-console
  const submit = (data: ICreateVote) => console.log('data', data)

  const addQuestion = useCallback(() => {
    append({
      id: uuidv4(),
      text: '',
      options: [
        { id: uuidv4(), text: '' },
        { id: uuidv4(), text: '' },
      ],
    })
    trigger(['questions'])
  }, [append, trigger])

  useEffect(() => {
    setEditQuestionIndex(questionFields.length - 1)
  }, [questionFields.length, trigger])

  return (
    <Stack onSubmit={handleSubmit(submit)} component='form' width='100%'>
      <Stack ref={questionContainerRef} spacing={5} width='100%'>
        <Stack direction={{ md: 'row' }} justifyContent='space-between' gap={5}>
          <Controller
            name='startDate'
            control={control}
            render={({ field, fieldState }) => (
              <UiDatePicker
                {...field}
                hasTime
                minDate={minDate}
                errorMessage={fieldState.error?.message}
                label={t('create-vote.form.start-date-lbl')}
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
                label={t('create-vote.form.end-date-lbl')}
              />
            )}
          />
        </Stack>

        <Stack spacing={3}>
          <Button
            sx={{ mr: 'auto' }}
            size='medium'
            variant='text'
            disabled={questionFields.length === MAX_QUESTIONS}
            startIcon={<UiIcon name={Icons.Plus} size={4} />}
            onClick={addQuestion}
          >
            {t('create-vote.form.add-question-btn')}
          </Button>
          {questionFields.map((question, index) => {
            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                control={control}
                canDelete={questionFields.length > 1}
                isEditing={editQuestionIndex === index}
                onDelete={() => remove(index)}
                onEdit={() => setEditQuestionIndex(index)}
              />
            )
          })}
        </Stack>
        <Button type='submit' sx={{ mt: 3 }}>
          {t('create-vote.form.submit-btn')}
        </Button>
      </Stack>
    </Stack>
  )
}

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

function QuestionCard(props: IQuestionCard) {
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
