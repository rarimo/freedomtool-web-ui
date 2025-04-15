import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext } from '@dnd-kit/sortable'
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
import SortableItem from './SortableItem'

const dndModifiers = [restrictToVerticalAxis, restrictToParentElement]

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
    move,
  } = useFieldArray({
    control,
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

  const swapQuestionsAfterDrag = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const activeIndex = active.data.current?.sortable?.index
      const overIndex = over.data.current?.sortable?.index
      // index could be 0
      if (activeIndex !== undefined && overIndex !== undefined) {
        move(activeIndex, overIndex)
      }
    }
  }

  return (
    <Stack
      pb={{
        xs: questionFields.length > 1 || questionFields[0]?.options?.length > 3 ? 20 : 0,
        md: 0,
      }}
    >
      <DndContext modifiers={dndModifiers} onDragEnd={swapQuestionsAfterDrag}>
        <SortableContext items={questionFields.map(q => q.id)}>
          <Stack spacing={{ xs: 4, md: 6 }}>
            {questionFields.map((question, index) => (
              <SortableItem key={question.id} id={question.id} index={index}>
                {({ attributes, listeners }) => (
                  <QuestionForm
                    attributes={attributes}
                    listeners={listeners}
                    draggable={questionFields.length > 1}
                    question={question}
                    index={index}
                    control={control}
                    isDisabled={isSubmitting}
                    canDelete={questionFields.length > 1}
                    onDelete={() => remove(index)}
                  />
                )}
              </SortableItem>
            ))}
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
        </SortableContext>
      </DndContext>
    </Stack>
  )
}
