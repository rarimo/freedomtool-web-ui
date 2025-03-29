import { time } from '@distributedlab/tools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack } from '@mui/material'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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

import { CreatePollSchema, createPollSchema, defaultValues } from '../createPollSchema'
import CriteriasSection from './CriteriasSection'
import DetailsSection from './DetailsSection'
import QuestionsSection from './QuestionsSection'
import SectionsController from './SectionsController'
import SettingsSection from './SettingsSection'

nationalities satisfies INationality[]

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
      const votesCount = String(form.getValues('settings.votesCount'))
      const { isEnoughBalance, votesAmount } = await getVoteAmountDetails(votesCount)
      if (!isEnoughBalance) return

      const {
        criterias: { minAge, nationalities, uniqueness },
        details: { title, description, startDate, endDate },
        questions,
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
        message: t('create-poll.success-msg'),
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
          <SectionsController
            isDisabled={form.formState.isValid || form.formState.disabled}
            sections={[
              {
                title: 'Poll details',
                body: <DetailsSection />,
                onContinue: () => form.trigger('details'),
              },
              {
                title: 'Criterias',
                body: <CriteriasSection />,
                onContinue: () => form.trigger('criterias'),
              },
              {
                title: 'Questions',
                body: <QuestionsSection />,
                onContinue: () => form.trigger('questions'),
              },
              {
                title: 'Settings',
                body: <SettingsSection />,
                footer: null, // TODO: Add <CheckAmountResult/> and pass value from its context
              },
            ]}
          />
        </Stack>
      </Stack>
      <SignatureConfirmationModal open={isConfirmationModalShown} />
    </FormProvider>
  )
}
