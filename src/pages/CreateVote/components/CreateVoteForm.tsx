import { time } from '@distributedlab/tools'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import SignatureConfirmationModal from '@/common/SignatureConfirmationModal'
import UiDatePicker from '@/common/UiDatePicker'
import { MAX_QUESTIONS } from '@/constants'
import { BusEvents, Icons, RoutePaths } from '@/enums'
import {
  bus,
  ErrorHandler,
  prepareAcceptedOptionsToContract,
  prepareAcceptedOptionsToIpfs,
  prepareVotingWhitelistData,
  uploadToIpfs,
} from '@/helpers'
import { useCheckVoteAmount, useProposalState } from '@/hooks'
import nationalities from '@/locales/resources/countries_en.json'
import { ICreateVote, INationality } from '@/types'
import { UiCheckVoteInput, UiIcon, UiNumberField } from '@/ui'

import { createVoteSchema } from '../schemas/createVoteSchema'
import QuestionCard from './QuestionCard'

nationalities satisfies INationality[]

const minDate = time().utc()

const defaultValues: ICreateVote = {
  title: '',
  description: '',

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

  uniqueness: false,
  nationalities: [],

  votesCount: 0,
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
    resolver: zodResolver(createVoteSchema),
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
  const { palette } = useTheme()
  const navigate = useNavigate()

  const submit = async (formData: ICreateVote) => {
    try {
      const votesCount = String(getValues('votesCount'))
      const { isEnoughBalance, votesAmount } = await getVoteAmountDetails(votesCount)
      if (!isEnoughBalance) return

      const {
        endDate,
        startDate,
        questions,
        title,
        description,
        minAge,
        nationalities,
        uniqueness,
      } = formData

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

      const votingWhitelistData = prepareVotingWhitelistData({
        minAge,
        nationalities,
        uniqueness,
        startTimestamp,
      })

      setIsConfirmationModalShown(true)

      await createProposal({
        votingWhitelistData,
        acceptedOptions,
        description: cid,
        amount: votesAmount,
        startTimestamp,
        duration,
      })

      bus.emit(BusEvents.success, {
        message: t('create-vote.success-msg'),
      })
      reset()

      navigate(RoutePaths.Home)
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
            <Stack spacing={5}>
              <Controller
                name='minAge'
                control={control}
                render={({ field, fieldState }) => (
                  <UiNumberField
                    {...field}
                    disabled={isSubmitting}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    label={t('create-vote.min-age-lbl')}
                  />
                )}
              />

              <Controller
                name='nationalities'
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl error={Boolean(fieldState.error)}>
                    <Autocomplete
                      multiple
                      limitTags={2}
                      disableCloseOnSelect
                      sx={{ maxWidth: 572 }}
                      options={nationalities}
                      getOptionLabel={({ name, flag }) => `${flag} ${name}`}
                      renderInput={params => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              '&.MuiInputBase-root:not(.MuiInputBase-multiline)': {
                                maxHeight: 'unset',
                                height: 'unset',
                              },
                            },
                          }}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            shrink: true,
                          }}
                          label={t('create-vote.nationalities-lbl')}
                        />
                      )}
                      renderOption={({ key, ...props }, { flag, name }) => {
                        return (
                          <Stack
                            alignItems='center'
                            justifyContent='center'
                            component='li'
                            direction='row'
                            spacing={2}
                            key={key}
                            {...props}
                          >
                            <Typography>{flag}</Typography>
                            <Typography>{name}</Typography>
                          </Stack>
                        )
                      }}
                      onChange={(_, value) => field.onChange(value)}
                    />

                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name='uniqueness'
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl {...field} error={Boolean(fieldState.error)}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={
                        <Typography variant='caption2' color={palette.text.secondary}>
                          {t('create-vote.uniqueness-lbl')}
                        </Typography>
                      }
                    />
                  </FormControl>
                )}
              />
            </Stack>
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
