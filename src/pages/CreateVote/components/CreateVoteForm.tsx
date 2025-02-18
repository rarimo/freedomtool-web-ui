import { time } from '@distributedlab/tools'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import UiDatePicker from '@/common/UiDatePicker'
import { Icons } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useProposalState } from '@/hooks'
import { UiIcon } from '@/ui'

import { MAX_QUESTIONS } from '../constants'
import {
  prepareAcceptedOptionsToContract,
  prepareAcceptedOptionsToIpfs,
  uploadToIpfs,
} from '../helpers'
import { ICreateVote } from '../types'
import QuestionCard from './QuestionCard'

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
  const { t } = useTranslation()
  const { createProposal } = useProposalState()

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

  const submit = async (formData: ICreateVote) => {
    const { endDate, startDate, questions } = formData
    try {
      const acceptedOptionsIpfs = prepareAcceptedOptionsToIpfs(questions)
      const response = await uploadToIpfs(acceptedOptionsIpfs)
      const cid = response.data.hash

      const acceptedOptions = prepareAcceptedOptionsToContract(questions)

      const startTimestamp = time(startDate).timestamp
      const endTimestamp = time(endDate).timestamp
      const duration = endTimestamp - startTimestamp

      await createProposal({
        acceptedOptions,
        description: cid,
        startTimestamp: time(startDate).timestamp,
        duration,
        amount: 1,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

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
