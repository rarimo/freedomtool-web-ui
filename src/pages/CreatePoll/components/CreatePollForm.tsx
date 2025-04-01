import { time } from '@distributedlab/tools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack } from '@mui/material'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SignatureConfirmationModal from '@/common/SignatureConfirmationModal'
import VoteParamsResult from '@/contexts/vote-params/components/VoteParamsResult'
import { VoteParamsProvider } from '@/contexts/vote-params/VoteParamsContext'
import { BusEvents, RoutePaths } from '@/enums'
import {
  bus,
  ErrorHandler,
  prepareAcceptedOptionsToContract,
  prepareAcceptedOptionsToIpfs,
  prepareVotingWhitelistData,
  uploadImageToIpfs,
  uploadJsonToIpfs,
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
  const { updateVoteParams } = useCheckVoteAmount()
  const navigate = useNavigate()

  const submit = async (formData: CreatePollSchema) => {
    try {
      const votesCount = String(form.getValues('settings.votesCount'))
      const { isEnoughBalance, votesAmount } = await updateVoteParams({
        type: 'vote_predict_amount',
        votesCount,
      })
      if (!isEnoughBalance) return

      const {
        details: { title, description, startDate, endDate, image },
        criterias: { minAge, nationalities, maxAge, sex },
        questions,
      } = formData

      let imageCid
      if (image) {
        imageCid = (await uploadImageToIpfs(image)).data.hash
      }

      const acceptedOptionsIpfs = prepareAcceptedOptionsToIpfs(questions)
      const response = await uploadJsonToIpfs({
        title,
        description,
        acceptedOptions: acceptedOptionsIpfs,
        ...(imageCid && { imageCid }),
      })
      const cid = response.data.hash

      const acceptedOptions = prepareAcceptedOptionsToContract(questions)

      const startTimestamp = time(startDate).timestamp
      const endTimestamp = time(endDate).timestamp
      const duration = endTimestamp - startTimestamp

      const votingWhitelistData = prepareVotingWhitelistData({
        maxAge: Number(maxAge),
        minAge: Number(minAge),
        sex,
        nationalities,
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
          <VoteParamsProvider>
            <SectionsController
              isDisabled={form.formState.isValid || form.formState.disabled}
              sections={[
                {
                  title: t('create-poll.titles.details'),
                  body: <DetailsSection />,
                  onContinue: () => form.trigger('details'),
                },
                {
                  title: t('create-poll.titles.criterias'),
                  body: <CriteriasSection />,
                  onContinue: () => form.trigger('criterias'),
                },
                {
                  title: t('create-poll.titles.questions'),
                  body: <QuestionsSection />,
                  onContinue: () => form.trigger('questions'),
                },
                {
                  title: t('create-poll.titles.settings'),
                  body: <SettingsSection />,
                  footer: <VoteParamsResult />,
                },
              ]}
            />
          </VoteParamsProvider>
        </Stack>
      </Stack>
      <SignatureConfirmationModal open={isConfirmationModalShown} />
    </FormProvider>
  )
}
