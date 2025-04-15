import { Box, Button, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ErrorView, LazyImage, RoundedBackground } from '@/common'
import AuthBlock from '@/common/AuthBlock'
import DarkGradient from '@/common/DarkGradient'
import { DESKTOP_HEADER_HEIGHT } from '@/constants'
import { useRouteTitleContext } from '@/contexts'
import { Icons, RoutePaths } from '@/enums'
import { getCountProgress, getIpfsImageSrc } from '@/helpers'
import { useProposal } from '@/hooks/proposal'
import QrCodePanel from '@/pages/Poll/components/QrCodePanel'
import { useAuthState, useUiState } from '@/store'
import { lineClamp } from '@/theme/helpers'
import { ParsedContractProposal } from '@/types'
import { UiIcon, UiTabs } from '@/ui'

import BalanceDetails from './components/BalanceDetails'
import PollDetails from './components/PollDetails'
import PollSkeleton from './components/PollSkeleton'
import QuestionList from './components/QuestionList'
import StatusBadge from './components/StatusBadge'
import TopUpForm from './components/TopUpForm'

export default function Poll() {
  const { id } = useParams()
  const { palette, breakpoints } = useTheme()
  const { setTitle } = useRouteTitleContext()
  const { isAuthorized } = useAuthState()
  const isMdDown = useMediaQuery(breakpoints.down('md'))
  const { isDarkMode } = useUiState()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    isRestricted,
    isLoading,
    isError,

    criteria,

    pollDetails,
    balanceDetails,

    proposal,
    proposalMetadata,

    isTopUpAllowed,

    formattedEndDate,
    formattedStartDate,

    isAlive,

    participantsAmount,
    remainingVotesCount,
  } = useProposal(id)

  useEffect(() => {
    if (proposal && !isRestricted && !isLoading && !isError) {
      setTitle(proposalMetadata?.title ?? '')
    }

    return () => {
      setTitle('')
    }
  }, [isError, isLoading, isRestricted, proposal, proposalMetadata?.title, setTitle])

  return (
    <>
      {isAuthorized ? (
        <AnimatePresence mode='popLayout'>
          {isLoading && !isError && (
            <Stack
              component={motion.div}
              key='loading'
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PollSkeleton />
            </Stack>
          )}

          {isRestricted && (
            <ErrorView
              sx={{ maxWidth: 320, mx: 'auto', mt: 8 }}
              title='404'
              description={t('poll.unavailable-error')}
              action={
                <Button variant='outlined' size='medium' onClick={() => navigate(RoutePaths.Polls)}>
                  {t('poll.back-to-poll-btn')}
                </Button>
              }
            />
          )}

          {isError && (
            <motion.div
              key='error'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ErrorView
                sx={{ maxWidth: 300, mx: 'auto', mt: 8 }}
                description={t('poll.loading-error')}
                action={
                  <Button
                    variant='outlined'
                    size='medium'
                    onClick={() => navigate(RoutePaths.Polls)}
                  >
                    {t('poll.back-to-poll-btn')}
                  </Button>
                }
              />
            </motion.div>
          )}

          {!isLoading && !isError && !isRestricted && (
            <Stack
              component={motion.div}
              sx={{ overflowX: 'hidden' }}
              width='100%'
              key='content'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'grid',
                  gap: 0.5,
                  gridTemplateColumns: { xs: '1fr', lg: '0.63fr 0.37fr' },
                  height: { lg: `calc(100vh - ${DESKTOP_HEADER_HEIGHT}px - 2px)` },
                }}
              >
                <RoundedBackground
                  sx={{
                    alignItems: { lg: 'flex-end' },
                    pr: { lg: 24.5 },
                    [breakpoints.down('md')]: {
                      p: 0,
                      borderRadius: 0,
                      m: 0,
                      pb: 10,
                    },
                  }}
                >
                  <Stack
                    component={motion.div}
                    maxWidth={{ lg: 656, xl: 720 }}
                    width='100%'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Stack sx={{ height: 'fit-content' }} spacing={5}>
                      <Stack spacing={3}>
                        <Stack
                          sx={{
                            aspectRatio: '2.6',
                            borderRadius: 5,
                            overflow: 'hidden',
                            position: 'relative',
                            [breakpoints.down('md')]: {
                              aspectRatio: '1.71',
                              borderRadius: 0,
                            },
                          }}
                        >
                          <Stack sx={{ position: 'absolute', top: 24, left: 24, zIndex: 1 }}>
                            <StatusBadge status={proposal?.fromContract.status} />
                          </Stack>
                          <LazyImage
                            width={1}
                            height={1}
                            imageProps={{
                              sx: {
                                objectFit: 'cover',
                                objectPosition: 'top',
                                width: '100%',
                                height: 'auto',
                              },
                            }}
                            src={
                              proposalMetadata?.imageCid
                                ? getIpfsImageSrc(proposalMetadata.imageCid)
                                : `/images/${isDarkMode ? 'globe-dark.png' : 'globe-light.png'}`
                            }
                            alt='Poll banner'
                          />
                          <DarkGradient
                            sx={{
                              position: 'absolute',
                              height: isMdDown ? '100%' : '80%',
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
                            <Stack direction='row' spacing={6} alignItems='center' flexWrap='wrap'>
                              <Stack
                                color={palette.common.white}
                                direction='row'
                                spacing={1.5}
                                sx={{ opacity: 0.7 }}
                                alignItems='center'
                              >
                                <UiIcon size={4} name={Icons.CalendarLine} />
                                <Typography
                                  variant='body3'
                                  typography={{ xs: 'body4', md: 'body3' }}
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
                                  variant='body3'
                                  typography={{ xs: 'body4', md: 'body3' }}
                                  sx={{ ...lineClamp(5) }}
                                >
                                  {participantsAmount}
                                </Typography>
                              </Stack>
                            </Stack>
                          </DarkGradient>
                        </Stack>
                      </Stack>

                      <Stack
                        px={6}
                        py={3}
                        mx={{ xs: 4, lg: 0 }}
                        bgcolor={palette.action.active}
                        sx={{ borderRadius: 5 }}
                      >
                        <Typography variant='body4' color={palette.text.secondary}>
                          {proposalMetadata?.description}
                        </Typography>
                      </Stack>

                      {isMdDown && (
                        <Stack mx={4}>
                          <QrCodePanel isCreatable={isAlive} />
                        </Stack>
                      )}

                      {isMdDown && (
                        <Stack mx={4}>
                          <UiTabs
                            tabs={[
                              {
                                label: t('poll.tab-1-lbl'),
                                content: (
                                  <Stack>
                                    <Stack spacing={6} width='100%'>
                                      <VotesLeftProgress
                                        remainingVotes={remainingVotesCount ?? 0}
                                        participantsAmount={participantsAmount}
                                      />
                                      {isTopUpAllowed && <TopUpForm />}
                                      <PollDetails list={pollDetails} criteria={criteria} />
                                      <Divider />
                                      <BalanceDetails list={balanceDetails} />
                                    </Stack>
                                  </Stack>
                                ),
                              },
                              {
                                label: t('poll.tab-2-lbl'),
                                content: (
                                  <Stack>
                                    <QuestionList
                                      proposal={proposal?.fromContract as ParsedContractProposal}
                                      questions={proposalMetadata?.acceptedOptions ?? []}
                                    />
                                  </Stack>
                                ),
                              },
                            ]}
                          />
                        </Stack>
                      )}

                      {!isMdDown && (
                        <Stack>
                          <QuestionList
                            proposal={proposal?.fromContract as ParsedContractProposal}
                            questions={proposalMetadata?.acceptedOptions ?? []}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </RoundedBackground>

                {!isMdDown && (
                  <RoundedBackground sx={{ pl: 13, alignItems: 'flex-start' }}>
                    <Stack
                      component={motion.div}
                      sx={{
                        maxWidth: { lg: 368 },
                        height: 'fit-content',
                        position: 'sticky',
                        top: 50,
                        width: '100%',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    >
                      <Stack
                        spacing={6}
                        divider={<Divider orientation='horizontal' flexItem />}
                        sx={{
                          alignItems: 'center',
                          marginBottom: 3,
                        }}
                      >
                        <QrCodePanel isCreatable={isAlive} />
                        <Stack spacing={6} width='100%'>
                          <VotesLeftProgress
                            remainingVotes={remainingVotesCount ?? 0}
                            participantsAmount={participantsAmount}
                          />
                          {isTopUpAllowed && <TopUpForm />}
                        </Stack>
                        <PollDetails list={pollDetails} criteria={criteria} />
                        <BalanceDetails list={balanceDetails} />
                      </Stack>
                    </Stack>
                  </RoundedBackground>
                )}
              </Box>
            </Stack>
          )}
        </AnimatePresence>
      ) : (
        <Stack minWidth={350} mx='auto' mt={8}>
          <AuthBlock />
        </Stack>
      )}
    </>
  )
}

function VotesLeftProgress({
  remainingVotes,
  participantsAmount,
}: {
  remainingVotes: number
  participantsAmount: number
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  return (
    <Stack spacing={2} width='100%'>
      <Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>
        <Typography variant='body4' color={palette.text.secondary}>
          {t('polls.poll-card.progress-lbl')}
        </Typography>
        <Typography variant='subtitle6'>
          {t('polls.poll-card.participants-lbl', {
            currentVotesCount: participantsAmount ?? 0,
            totalVotes: remainingVotes + participantsAmount || 0,
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
          width={`${getCountProgress(participantsAmount, participantsAmount + remainingVotes)}%`}
          bgcolor={palette.primary.main}
        />
      </Stack>
    </Stack>
  )
}
