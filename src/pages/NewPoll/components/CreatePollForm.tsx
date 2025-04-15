import { time } from '@distributedlab/tools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import { parseUnits } from 'ethers'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { createQRCode } from '@/api/modules/qr-code'
import { RoundedBackground } from '@/common'
import { DESKTOP_HEADER_HEIGHT } from '@/constants'
import VoteParamsResult from '@/contexts/vote-params/components/VoteParamsResult'
import {
  ErrorHandler,
  prepareAcceptedOptionsToContract,
  prepareAcceptedOptionsToIpfs,
  prepareVotingWhitelistData,
  scrollToSelector,
  uploadImageToIpfs,
  uploadJsonToIpfs,
  waitForProposalToBeIndexed,
} from '@/helpers'
import { useProposalState, useScrollWithShadow } from '@/hooks'
import nationalities from '@/locales/resources/countries_en.json'
import { hiddenScrollbar } from '@/theme/constants'
import { Nationality } from '@/types'

import { ProcessingPollStep, SectionAnchor } from '../constants'
import { createPollDefaultValues, CreatePollSchema, createPollSchema } from '../createPollSchema'
import CriteriaSection from './CriteriaSection'
import DetailsSection from './DetailsSection'
import PollPreview from './PollPreview'
import PollQuestionPreview from './PollQuestionPreview'
import ProcessingPollModal from './ProcessingPollModal'
import QuestionsSection from './QuestionsSection'
import SectionsController from './SectionsController'
import SettingsSection from './SettingsSection'

nationalities satisfies Nationality[]

export default function CreatePollForm() {
  const { t } = useTranslation()
  const { breakpoints } = useTheme()
  const isLgUp = useMediaQuery(breakpoints.up('lg'))

  const { containerRef, shadowScrollStyle } = useScrollWithShadow(80)

  const { createProposal } = useProposalState()
  const [isQuestionPreview, setIsQuestionPreview] = useState(false)

  const form = useForm<CreatePollSchema>({
    defaultValues: createPollDefaultValues,
    mode: 'onChange',
    resolver: zodResolver(createPollSchema),
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(ProcessingPollStep.Image)
  const [proposalId, setProposalId] = useState<string | null>(null)

  const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0)

  const {
    trigger,
    handleSubmit,
    formState: { touchedFields },
  } = form

  const submit = async (formData: CreatePollSchema) => {
    try {
      setIsProcessing(true)
      setProcessingStep(ProcessingPollStep.Image)

      const {
        details: { title, description, startDate, endDate, image },
        criteria: { minAge, nationalities, maxAge, sex },
        questions,
        settings: { amount },
      } = formData

      let imageCid: string | null = null
      if (image) {
        imageCid = (await uploadImageToIpfs(image)).data.hash
      }

      setProcessingStep(ProcessingPollStep.Metadata)

      const acceptedOptionsIpfs = prepareAcceptedOptionsToIpfs(questions)
      const response = await uploadJsonToIpfs({
        title,
        description,
        acceptedOptions: acceptedOptionsIpfs,
        ...(imageCid && { imageCid }),
      })

      setProcessingStep(ProcessingPollStep.Proposal)

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

      const proposalId = await createProposal({
        votingWhitelistData,
        acceptedOptions,
        description: cid,
        amount: parseUnits(amount, 18).toString(),
        startTimestamp,
        duration,
      })

      if (!proposalId) {
        throw new Error(t('create-poll.proposal-id-empty-error'))
      }

      setProposalId(proposalId)

      setProcessingStep(ProcessingPollStep.QrCode)
      await createQRCode({
        type: 'links',
        attributes: {
          resource_id: proposalId,
          metadata: { proposal_id: Number(proposalId), name: 'Main QR Code' },
        },
      })

      setProcessingStep(ProcessingPollStep.Indexing)
      await waitForProposalToBeIndexed(proposalId)

      setProcessingStep(ProcessingPollStep.Live)
    } catch (error) {
      ErrorHandler.process(error)
      setIsProcessing(false)
      setProcessingStep(ProcessingPollStep.Initial)
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
        onContinue: () => {
          setIsQuestionPreview(true)
          setTimeout(() => scrollToSelector(`#${SectionAnchor.Questions}`), 0)
        },
        onBack: () => scrollToSelector(`#${SectionAnchor.Details}`),
      },
      {
        title: t('create-poll.titles.questions'),
        children: (
          <QuestionsSection
            previewQuestionIndex={previewQuestionIndex}
            onSelect={setPreviewQuestionIndex}
          />
        ),
        validate: () => trigger(['questions']),
        onBack: () => {
          setIsQuestionPreview(false)
          setTimeout(() => scrollToSelector(`#${SectionAnchor.Criteria}`), 0)
        },
      },
      {
        title: t('create-poll.titles.settings'),
        children: <SettingsSection />,
        footer: <VoteParamsResult />,
      },
    ],
    [previewQuestionIndex, t, trigger],
  )

  const { details, criteria, questions } = form.watch()

  useEffect(() => {
    // Prevent closing the tab until the poll is live
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (processingStep !== ProcessingPollStep.Live && !isEmpty(touchedFields)) {
        event.preventDefault()
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [processingStep, touchedFields])

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
            height: { md: `calc(100vh - ${DESKTOP_HEADER_HEIGHT}px - 2px)` },
            position: 'relative',
          }}
        >
          <RoundedBackground
            sx={{
              alignItems: 'flex-end',
              pr: { lg: 24.5 },
              [breakpoints.down('md')]: { p: 4, mb: 20 },
            }}
          >
            <SectionsController isDisabled={form.formState.isSubmitting} sections={sections} />
          </RoundedBackground>

          {isLgUp && (
            <RoundedBackground>
              <Stack
                ref={containerRef}
                height={500}
                sx={{
                  overflow: 'auto',
                  ...shadowScrollStyle,
                  ...hiddenScrollbar,
                  position: 'sticky',
                  top: DESKTOP_HEADER_HEIGHT,
                }}
              >
                {isQuestionPreview ? (
                  <PollQuestionPreview question={questions[previewQuestionIndex ?? 0]} />
                ) : (
                  <PollPreview {...details} {...criteria} />
                )}
              </Stack>
            </RoundedBackground>
          )}
        </Box>
      </Stack>
      <ProcessingPollModal open={isProcessing} step={processingStep} proposalId={proposalId} />
    </FormProvider>
  )
}
