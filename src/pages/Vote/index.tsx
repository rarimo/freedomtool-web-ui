import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ErrorView, LazyImage } from '@/common'
import AbstractBackground from '@/common/AbstractBackground'
import DarkGradient from '@/common/DarkGradient'
import { useRouteTitleContext } from '@/contexts'
import { Icons } from '@/enums'
import { getIpfsImageSrc } from '@/helpers'
import { useVote } from '@/hooks/vote'
import QrCodePanel from '@/pages/Poll/components/QrCodePanel'
import { lineClamp } from '@/theme/helpers'
import { UiIcon } from '@/ui'

import PollDetails from './components/PollDetails'
import QuestionList from './components/QuestionList'
import VoteBlock from './components/VoteBlock'
import VoteSkeleton from './components/VoteSkeleton'

export default function Poll() {
  const { id } = useParams()
  const { palette, breakpoints } = useTheme()
  const { setTitle } = useRouteTitleContext()
  const isMdDown = useMediaQuery(breakpoints.down('md'))

  const {
    isLoading,
    isError,

    criterias,

    pollDetails,
    proposal,
    proposalMetadata,
    isTopUpAllowed,
    qrCodeUrl,

    formattedEndDate,
    formattedStartDate,

    participantsAmount,
  } = useVote(id)

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
              gap: 3,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isMdDown && <VoteBlock qrCodeUrl={qrCodeUrl} />}
              <Stack sx={{ padding: 10, height: 'fit-content', mb: { md: 15 } }} spacing={5}>
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
                  {/* TODO: Update it and uncomment */}
                  {/* <TopUpForm /> */}
                  <PollDetails list={pollDetails} criterias={criterias} />
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
                  <QrCodePanel qrCodeUrl={qrCodeUrl} />
                  {/* TODO: Update it and uncomment */}
                  {/* {isTopUpAllowed && <TopUpForm />} */}
                  <PollDetails list={pollDetails} criterias={criterias} />
                </Stack>
              </motion.div>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
