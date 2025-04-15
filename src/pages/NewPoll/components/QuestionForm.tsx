import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Button, Divider, IconButton, Stack, TextField, useTheme } from '@mui/material'
import { Control, Controller, FieldArrayWithId, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import { MAX_OPTIONS_PER_QUESTION } from '@/constants'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import { CreatePollSchema } from '../createPollSchema'
import SortableItem, { SortableAction } from './SortableItem'

interface QuestionFormProps extends SortableAction {
  question: FieldArrayWithId<CreatePollSchema, 'questions', 'id'>
  control: Control<CreatePollSchema, unknown>
  index: number
  canDelete: boolean
  isDisabled: boolean
  onDelete: () => void
}

export default function QuestionForm(props: QuestionFormProps) {
  const { palette } = useTheme()
  const { question, index, canDelete, control, onDelete, draggable, attributes, listeners } = props
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
            <Stack direction='row'>
              {draggable && (
                <IconButton color='secondary' onClick={onDelete} {...attributes} {...listeners}>
                  <UiIcon name={Icons.Draggable} size={4} />
                </IconButton>
              )}
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
            </Stack>
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
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  })

  const swapOptionsAfterDrag = (event: DragEndEvent) => {
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
    <DndContext onDragEnd={swapOptionsAfterDrag}>
      <SortableContext items={fields.map(option => option.id)}>
        <Stack spacing={2}>
          {fields.map((option, index) => (
            <SortableItem key={option.id} id={option.id} index={index}>
              {({ attributes, listeners }) => (
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Stack direction='row' spacing={2} alignItems='flex-start' width='100%'>
                    <IconButton
                      {...attributes}
                      {...listeners}
                      color='secondary'
                      sx={{ cursor: 'grab', height: 56 }}
                    >
                      <UiIcon name={Icons.Draggable} size={4} />
                    </IconButton>
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
              )}
            </SortableItem>
          ))}
        </Stack>
      </SortableContext>
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
    </DndContext>
  )
}
