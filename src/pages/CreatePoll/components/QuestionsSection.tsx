import { Button, Stack } from '@mui/material'
import { useEvent } from '@reactuses/core'
import { t } from 'i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { MAX_QUESTIONS } from '@/constants'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'
import QuestionForm from './QuestionForm'

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

  return (
    <Stack>
      <Stack spacing={6}>
        {questionFields.map((question, index) => {
          return (
            <QuestionForm
              key={question.id}
              question={question}
              index={index}
              control={control}
              isDisabled={isSubmitting}
              canDelete={questionFields.length > 1}
              onDelete={() => remove(index)}
            />
          )
        })}
        <Button
          sx={{ mr: 'auto', py: 0, pl: 0, height: 'fit-content' }}
          size='medium'
          variant='text'
          disabled={questionFields.length === MAX_QUESTIONS || isSubmitting}
          startIcon={<UiIcon name={Icons.Plus} size={5} />}
          onClick={addQuestion}
        >
          {t('create-poll.add-question-btn')}
        </Button>
      </Stack>
    </Stack>
  )
}
