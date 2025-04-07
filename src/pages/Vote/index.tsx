import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ErrorView, LazyImage } from '@/common'
import AbstractBackground from '@/common/AbstractBackground'
import DarkGradient from '@/common/DarkGradient'
import { useRouteTitleContext } from '@/contexts'
import { Icons } from '@/enums'
import { getCountProgress, getIpfsImageSrc } from '@/helpers'
import { useProposal } from '@/hooks/proposal'
import QrCodePanel from '@/pages/Poll/components/QrCodePanel'
import { lineClamp } from '@/theme/helpers'
import { UiIcon } from '@/ui'

import PollDetails from './components/PollDetails'
import QuestionList from './components/QuestionList'
import TopUpForm from './components/TopUpForm'
import VoteSkeleton from './components/VoteSkeleton'

export default function Poll() {
  const { id } = useParams()
  const { palette, breakpoints } = useTheme()
  const { setTitle } = useRouteTitleContext()
  const isMdDown = useMediaQuery(breakpoints.down('md'))

  const {
    isLoading,
    isError,

    criteria,

    pollDetails,
    proposal,
    proposalMetadata,
    isTopUpAllowed,

    formattedEndDate,
    formattedStartDate,

    participantsAmount,
    remainingVotesCount,
  } = useProposal(id)

  useEffect(() => {
    setTitle(proposalMetadata?.title ?? '')
  }, [proposalMetadata?.title, setTitle])

  return (
    <AnimatePresence mode='popLayout'>
      {isLoading && !isError && (
        <motion.div
          key='loading'
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VoteSkeleton />
        </motion.div>
      )}

      {isError && (
        <motion.div
          key='error'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ErrorView sx={{ maxWidth: 300, mx: 'auto' }} />
        </motion.div>
      )}

      {!isLoading && !isError && (
        <motion.div
          key='content'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: { xs: 6, md: 10 },
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/*{isMdDown && <VoteBlock qrCodeUrl={qrCodeUrl} />}*/}
              <Stack sx={{ height: 'fit-content', mb: { md: 15 } }} pt={5} spacing={5}>
                <Stack spacing={3}>
                  <Stack
                    sx={{
                      aspectRatio: '6 / 2',
                      borderRadius: 5,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {proposalMetadata?.imageCid ? (
                      <LazyImage
                        width={1}
                        height={1}
                        src={getIpfsImageSrc(proposalMetadata.imageCid)}
                        alt=''
                      />
                    ) : (
                      <AbstractBackground
                        backgrounds={[palette.additional.gradient4, palette.additional.gradient5]}
                      />
                    )}
                    <DarkGradient
                      sx={{
                        position: 'absolute',
                        height: isMdDown ? '100%' : '50%',
                        bottom: 0,
                        right: 0,
                        left: 0,
                        justifyContent: 'flex-end',
                        p: 6,
                        gap: 3.5,
                      }}
                    >
                      <Typography
                        width={{ xs: 280, md: 500 }}
                        variant='h3'
                        title={proposalMetadata?.title}
                        color={palette.common.white}
                        typography={{ xs: 'h5', md: 'h3' }}
                        sx={{ ...lineClamp(2) }}
                      >
                        {proposalMetadata?.title}
                      </Typography>
                      <Stack direction='row' spacing={6} alignItems='center'>
                        <Stack
                          color={palette.common.white}
                          direction='row'
                          spacing={1.5}
                          sx={{ opacity: 0.7 }}
                          alignItems='center'
                        >
                          <UiIcon size={4} name={Icons.CalendarLine} />
                          <Typography
                            variant='body2'
                            typography={{ xs: 'body3', md: 'body4' }}
                            sx={{ ...lineClamp(5) }}
                          >
                            {formattedStartDate} – {formattedEndDate}
                          </Typography>
                        </Stack>
                        <Stack
                          color={palette.common.white}
                          direction='row'
                          spacing={1.5}
                          sx={{ opacity: 0.7 }}
                          alignItems='center'
                        >
                          <UiIcon size={4} name={Icons.GroupLine} />
                          <Typography
                            variant='body2'
                            typography={{ xs: 'body3', md: 'body4' }}
                            sx={{ ...lineClamp(5) }}
                          >
                            {participantsAmount}
                          </Typography>
                        </Stack>
                      </Stack>
                    </DarkGradient>
                  </Stack>
                </Stack>

                <Stack px={6} py={3} bgcolor={palette.action.active} sx={{ borderRadius: 5 }}>
                  <Typography variant='body4' color={palette.text.secondary}>
                    {proposalMetadata?.description}
                  </Typography>
                </Stack>

                <QuestionList
                  proposal={proposal}
                  questions={proposalMetadata?.acceptedOptions ?? []}
                />
              </Stack>
            </motion.div>

            {isMdDown && isTopUpAllowed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Stack
                  spacing={10}
                  sx={{
                    textAlign: 'center',
                    alignItems: 'center',
                    marginBottom: 3,
                    height: 'fit-content',
                    position: 'sticky',
                    top: 80,
                  }}
                >
                  <TopUpForm />
                  <PollDetails list={pollDetails} criteria={criteria} />
                </Stack>
              </motion.div>
            )}

            {!isMdDown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Stack
                  pt={5}
                  spacing={6}
                  divider={<Divider orientation='horizontal' flexItem />}
                  sx={{
                    textAlign: 'center',
                    alignItems: 'center',
                    marginBottom: 3,
                    height: 'fit-content',
                    position: 'sticky',
                    top: 80,
                  }}
                >
                  <QrCodePanel />
                  <Stack spacing={6} width='100%'>
                    <VotesLeftProgress
                      remainingVotes={remainingVotesCount ?? 0}
                      totalVotes={participantsAmount}
                    />
                    {isTopUpAllowed && <TopUpForm />}
                  </Stack>
                  <PollDetails list={pollDetails} criteria={criteria} />
                </Stack>
              </motion.div>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function VotesLeftProgress({
  remainingVotes,
  totalVotes,
}: {
  remainingVotes: number
  totalVotes: number
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  return (
    <Stack spacing={2} width='100%'>
      <Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>
        <Typography variant='body4' color={palette.text.secondary}>
          {t('dashboard.poll-card.progress-lbl')}
        </Typography>
        <Typography variant='subtitle6'>
          {t('dashboard.poll-card.participants-lbl', {
            currentVotesCount: totalVotes ?? 0,
            totalVotes: remainingVotes ?? 0, // TODO: Replace
          })}
        </Typography>
      </Stack>
      <Stack
        position='relative'
        width='100%'
        height={12}
        borderRadius={1000}
        bgcolor={palette.action.active}
        overflow='hidden'
      >
        <Stack
          position='absolute'
          top={0}
          left={0}
          height='100%'
          // TODO: Replace remainingVotes
          width={`${getCountProgress(remainingVotes, totalVotes)}%`}
          bgcolor={palette.primary.main}
        />
      </Stack>
    </Stack>
  )
}
