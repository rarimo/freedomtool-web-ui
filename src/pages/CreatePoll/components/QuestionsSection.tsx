import { Button, Paper, Stack } from '@mui/material'
import { useEvent } from '@reactuses/core'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { MAX_QUESTIONS } from '@/constants'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'
import QuestionCard from './QuestionCard'

export default function QuestionsSection() {
  const {
    control,
    trigger,
    formState: { isSubmitting },
  } = useFormContext<CreatePollSchema>()

  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: 'questions',
  })

  const [editQuestionIndex, setEditQuestionIndex] = useState(questionFields.length - 1)

  const addQuestion = useEvent(() => {
    append({
      id: uuidv4(),
      text: '',
      options: [
        { id: uuidv4(), text: '' },
        { id: uuidv4(), text: '' },
      ],
    })
    trigger(['questions'])
  })

  useEffect(() => {
    setEditQuestionIndex(questionFields.length - 1)
  }, [questionFields.length])

  return (
    <Stack>
      <Stack component={Paper} spacing={1}>
        {questionFields.map((question, index) => {
          return (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              control={control}
              isDisabled={isSubmitting}
              canDelete={questionFields.length > 1}
              isEditing={editQuestionIndex === index}
              onDelete={() => remove(index)}
              onEdit={() => setEditQuestionIndex(index)}
            />
          )
        })}
        <Button
          sx={{ ml: 'auto', mt: 2, pb: 0 }}
          size='small'
          variant='text'
          disabled={questionFields.length === MAX_QUESTIONS || isSubmitting}
          startIcon={<UiIcon name={Icons.Plus} size={4} />}
          onClick={addQuestion}
        >
          {t('create-poll.add-question-btn')}
        </Button>
      </Stack>
    </Stack>
  )
}
