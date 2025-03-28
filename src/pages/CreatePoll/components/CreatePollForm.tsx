import { time } from '@distributedlab/tools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack } from '@mui/material'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import SignatureConfirmationModal from '@/common/SignatureConfirmationModal'
import { BusEvents, RoutePaths } from '@/enums'
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
import { INationality } from '@/types'

import { CreatePollSchema, createPollSchema } from '../createPollSchema'
import CriteriasSection from './CriteriasSection'
import DetailsSection from './DetailsSection'
import QuestionsSection from './QuestionsSection'
import SettingsSection from './SettingsSection'

nationalities satisfies INationality[]

const defaultValues = {
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

export default function CreatePollForm() {
  const { t } = useTranslation()

  const { createProposal } = useProposalState({ shouldFetchProposals: false })

  const form = useForm<CreatePollSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(createPollSchema),
  })

  const [isConfirmationModalShown, setIsConfirmationModalShown] = useState(false)
  const { getVoteAmountDetails } = useCheckVoteAmount()
  const navigate = useNavigate()

  const submit = async (formData: CreatePollSchema) => {
    try {
      const votesCount = String(form.getValues('votesCount'))
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
        minAge: Number(minAge),
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
      form.reset()

      navigate(RoutePaths.Home)
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      setIsConfirmationModalShown(false)
    }
  }

  return (
    <FormProvider {...form}>
      <Stack onSubmit={form.handleSubmit(submit)} component='form' width='100%'>
        <Stack spacing={3} width='100%' pb={{ md: 10 }}>
          <DetailsSection />
          <CriteriasSection />
          <QuestionsSection />
          <SettingsSection />

          <Button
            type='submit'
            variant='contained'
            size='large'
            disabled={form.formState.isSubmitting}
            sx={{ ml: 'auto' }}
          >
            {t('create-vote.submit-btn')}
          </Button>
        </Stack>
      </Stack>
      <SignatureConfirmationModal open={isConfirmationModalShown} />
    </FormProvider>
  )
}
