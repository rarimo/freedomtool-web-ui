import { time } from '@distributedlab/tools'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Paper, Stack, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import SignatureConfirmationModal from '@/common/SignatureConfirmationModal'
import UiDatePicker from '@/common/UiDatePicker'
import { BusEvents, Icons } from '@/enums'
import { bus, ErrorHandler } from '@/helpers'
import { useCheckVoteAmount, useProposalState } from '@/hooks'
import { UiCheckVoteInput, UiIcon } from '@/ui'

import { MAX_QUESTIONS, MAX_VOTE_COUNT_PER_TX } from '../constants'
import {
  prepareAcceptedOptionsToContract,
  prepareAcceptedOptionsToIpfs,
  uploadToIpfs,
} from '../helpers'
import { ICreateVote } from '../types'
import QuestionCard from './QuestionCard'

const minDate = time().utc()

const defaultValues: ICreateVote = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  votesCount: 0,
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

  const { createProposal } = useProposalState({ shouldFetchProposals: false })

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { isSubmitting },
  } = useForm<ICreateVote>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<ICreateVote>(
      Yup.object({
        title: Yup.string().required().max(50),
        description: Yup.string().required().max(200),
        votesCount: Yup.number().required().moreThan(0).integer().max(MAX_VOTE_COUNT_PER_TX),
        startDate: Yup.string().required(),
        endDate: Yup.string()
          .required()
          .test('isAfterStartDate', t('create-vote.end-date-error'), function (value) {
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

  const [isConfirmationModalShown, setIsConfirmationModalShown] = useState(false)
  const [editQuestionIndex, setEditQuestionIndex] = useState(questionFields.length - 1)
  const { isCalculating, helperText, resetHelperText, getVoteAmountDetails } = useCheckVoteAmount()

  const submit = async (formData: ICreateVote) => {
    try {
      const votesCount = String(getValues('votesCount'))
      const { isEnoughBalance, votesAmount } = await getVoteAmountDetails(votesCount)
      if (!isEnoughBalance) return

      const { endDate, startDate, questions, title, description } = formData
      const acceptedOptionsIpfs = prepareAcceptedOptionsToIpfs(questions)
      const response = await uploadToIpfs({
        title,
        description,
        acceptedOptions: acceptedOptionsIpfs,
      })
      const cid = response.data.hash

      const acceptedOptions = prepareAcceptedOptionsToContract(questions)

      const startTimestamp = time(startDate).timestamp
      const endTimestamp = time(endDate).timestamp
      const duration = endTimestamp - startTimestamp

      setIsConfirmationModalShown(true)

      await createProposal({
        acceptedOptions,
        description: cid,
        amount: votesAmount,
        startTimestamp: time(startDate).timestamp,
        duration,
      })

      bus.emit(BusEvents.success, {
        message: t('create-vote.success-msg'),
      })
      reset()
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      setIsConfirmationModalShown(false)
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
    <Stack>
      <Stack onSubmit={handleSubmit(submit)} component='form' width='100%'>
        <Stack spacing={2} width='100%' pb={{ md: 10 }}>
          <Stack sx={{ position: 'relative' }} component={Paper} spacing={5}>
            <Controller
              name='title'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  disabled={isSubmitting}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  placeholder={t('create-vote.proposal-title-plh')}
                  label={t('create-vote.proposal-title-lbl')}
                />
              )}
            />
            <Controller
              name='description'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  multiline
                  rows={3}
                  disabled={isSubmitting}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={t('create-vote.proposal-description-lbl')}
                  placeholder={t('create-vote.proposal-description-plh')}
                  sx={{
                    background: 'transparent',
                    '& .MuiInputBase-root': {
                      height: 'unset',
                    },
                  }}
                />
              )}
            />
          </Stack>
          <Stack component={Paper} direction={{ md: 'row' }} justifyContent='space-between' gap={5}>
            <Controller
              name='startDate'
              control={control}
              render={({ field, fieldState }) => (
                <UiDatePicker
                  {...field}
                  hasTime
                  minDate={minDate}
                  disabled={isSubmitting}
                  errorMessage={fieldState.error?.message}
                  label={t('create-vote.start-date-lbl')}
                  slotProps={{
                    textField: {
                      placeholder: t('create-vote.start-date-plh'),
                    },
                  }}
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
                  disabled={isSubmitting}
                  errorMessage={fieldState.error?.message}
                  label={t('create-vote.end-date-lbl')}
                  slotProps={{
                    textField: {
                      placeholder: t('create-vote.end-date-plh'),
                    },
                  }}
                />
              )}
            />
          </Stack>

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
              {t('create-vote.add-question-btn')}
            </Button>
          </Stack>
          <Stack component={Paper}>
            <Controller
              name='votesCount'
              control={control}
              render={({ field, fieldState }) => (
                <UiCheckVoteInput
                  {...field}
                  disabled={isSubmitting || isCalculating}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message || helperText}
                  label={t('create-vote.votes-count-lbl')}
                  onCheck={() => getVoteAmountDetails(String(getValues('votesCount')))}
                  onChange={e => {
                    field.onChange(e)
                    resetHelperText?.()
                  }}
                />
              )}
            />
          </Stack>
          <Button sx={{ ml: 'auto', mt: 3 }} disabled={isSubmitting} type='submit'>
            {t('create-vote.submit-btn')}
          </Button>
        </Stack>
      </Stack>
      <SignatureConfirmationModal open={isConfirmationModalShown} />
    </Stack>
  )
}
