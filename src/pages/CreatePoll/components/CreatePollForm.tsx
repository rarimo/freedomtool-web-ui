import { time } from '@distributedlab/tools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import { parseUnits } from 'ethers'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { RoundedBackground } from '@/common'
import SignatureConfirmationModal from '@/common/SignatureConfirmationModal'
import { DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/constants'
import VoteParamsResult from '@/contexts/vote-params/components/VoteParamsResult'
import { BusEvents, RoutePaths } from '@/enums'
import {
  bus,
  ErrorHandler,
  prepareAcceptedOptionsToContract,
  prepareAcceptedOptionsToIpfs,
  prepareVotingWhitelistData,
  scrollToSelector,
  uploadImageToIpfs,
  uploadJsonToIpfs,
} from '@/helpers'
import { useProposalState, useScrollWithShadow } from '@/hooks'
import nationalities from '@/locales/resources/countries_en.json'
import PollPreview from '@/pages/CreateVote/components/PollPreview'
import PollQuestionPreview from '@/pages/CreateVote/components/PollQuestionPreview'
import { hiddenScrollbar } from '@/theme/constants'
import { Nationality } from '@/types'

import { SectionAnchor } from '../constants'
import { createPollDefaultValues, CreatePollSchema, createPollSchema } from '../createPollSchema'
import CriteriaSection from './CriteriaSection'
import DetailsSection from './DetailsSection'
import QuestionsSection from './QuestionsSection'
import FormPartBackground from './RoundedBackground'
import SectionsController from './SectionsController'
import SettingsSection from './SettingsSection'

nationalities satisfies Nationality[]

export default function CreatePollForm() {
  const { t } = useTranslation()
  const { breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))

  const { onScrollHandler, shadowScrollStyle } = useScrollWithShadow(80)
  const { onScrollHandler: questionScrollHandler, shadowScrollStyle: questionScrollStyle } =
    useScrollWithShadow(80)
  const { createProposal } = useProposalState()
  const [isQuestionPreview, setIsQuestionPreview] = useState(false)

  const form = useForm<CreatePollSchema>({
    defaultValues: createPollDefaultValues,
    mode: 'onChange',
    resolver: zodResolver(createPollSchema),
  })

  const [isConfirmationModalShown, setIsConfirmationModalShown] = useState(false)
  const navigate = useNavigate()

  const { reset, trigger, handleSubmit } = form

  const submit = async (formData: CreatePollSchema) => {
    try {
      const {
        details: { title, description, startDate, endDate, image },
        criteria: { minAge, nationalities, maxAge, sex },
        questions,
        settings: { amount },
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
        amount: parseUnits(amount, 18).toString(),
        startTimestamp,
        duration,
      })

      bus.emit(BusEvents.success, {
        message: t('create-poll.success-msg'),
      })
      reset()

      navigate(RoutePaths.Home)
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      setIsConfirmationModalShown(false)
    }
  }

  const sections = useMemo(
    () => [
      {
        title: t('create-poll.titles.details'),
        children: <DetailsSection />,
        validate: () => trigger(['details']),
        onContinue: () => scrollToSelector(`#${SectionAnchor.Criteria}`),
      },
      {
        title: t('create-poll.titles.criteria'),
        children: <CriteriaSection />,
        validate: () => trigger(['criteria']),
        onContinue: () => setIsQuestionPreview(true),
        onBack: () => scrollToSelector(`#${SectionAnchor.Details}`),
      },
      {
        title: t('create-poll.titles.questions'),
        children: <QuestionsSection />,
        validate: () => trigger(['questions']),
        onBack: () => {
          setIsQuestionPreview(false)
          setTimeout(() => scrollToSelector(`#${SectionAnchor.Criteria}`), 100)
        },
      },
      {
        title: t('create-poll.titles.settings'),
        children: <SettingsSection />,
        footer: <VoteParamsResult />,
      },
    ],
    [t, trigger],
  )

  const { details, criteria, questions } = form.watch()

  return (
    <FormProvider {...form}>
      <Stack
        component='form'
        width='100%'
        onSubmit={handleSubmit(submit)}
        sx={{ overflowX: 'hidden' }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 0.5,
            gridTemplateColumns: { xs: '1fr', lg: '0.63fr 0.37fr' },
            width: '100%',
            height: `calc(100vh - ${isMdUp ? DESKTOP_HEADER_HEIGHT : MOBILE_HEADER_HEIGHT}px - 2px)`,
            position: 'relative',
          }}
        >
          <RoundedBackground sx={{ alignItems: 'flex-end', pr: 24.5 }}>
            <SectionsController isDisabled={form.formState.isSubmitting} sections={sections} />
          </RoundedBackground>

          {isMdUp && (
            <>
              {isQuestionPreview ? (
                <RoundedBackground>
                  <Stack
                    key='question'
                    height={500}
                    sx={{
                      overflow: 'auto',
                      ...questionScrollStyle,
                      position: 'sticky',
                      top: DESKTOP_HEADER_HEIGHT,
                    }}
                    onScroll={questionScrollHandler}
                  >
                    <PollQuestionPreview question={questions[questions.length - 1]} />
                  </Stack>
                </RoundedBackground>
              ) : (
                <FormPartBackground>
                  <Stack
                    height={500}
                    sx={{
                      overflow: 'auto',
                      ...shadowScrollStyle,
                      ...hiddenScrollbar,
                      position: 'sticky',
                      top: DESKTOP_HEADER_HEIGHT,
                    }}
                    onScroll={onScrollHandler}
                  >
                    <PollPreview {...details} {...criteria} />
                  </Stack>
                </FormPartBackground>
              )}
            </>
          )}
        </Box>
      </Stack>
      <SignatureConfirmationModal open={isConfirmationModalShown} />
    </FormProvider>
  )
}
