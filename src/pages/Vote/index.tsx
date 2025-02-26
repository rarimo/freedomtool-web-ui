import { Box, Divider, Paper, Stack, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ErrorView } from '@/common'
import { useRouteTitleContext } from '@/contexts'
import { useVote } from '@/hooks/vote'
import { lineClamp } from '@/theme/helpers'

import { VOTE_QR_BASE_URL } from '../CreateVote/constants'
import QuestionList from './components/QuestionList'
import TopUpForm from './components/TopUpForm'
import VoteBlock from './components/VoteBlock'
import VoteDetails from './components/VoteDetails'
import VoteQrCode from './components/VoteQrCode'
import VoteSkeleton from './components/VoteSkeleton'

export default function Vote() {
  const { id } = useParams()
  const { palette } = useTheme()
  const { setTitle } = useRouteTitleContext()

  const { isLoading, isError, voteDetails, proposal, proposalMetadata, isTopUpAllowed } =
    useVote(id)

  useEffect(() => {
    setTitle(proposalMetadata?.title ?? '')
  }, [proposalMetadata?.title, setTitle])

  return (
    <AnimatePresence mode='popLayout'>
      <VoteBlock />

      {isLoading && (
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
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 3,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Stack
                component={Paper}
                sx={{ padding: 10, height: 'fit-content', mb: { md: 15 } }}
                spacing={5}
                divider={<Divider />}
              >
                <Stack spacing={3}>
                  <Typography
                    width={{ xs: 280, md: 500, ...lineClamp(2) }}
                    variant='h3'
                    typography={{ xs: 'h5', md: 'h3' }}
                  >
                    {proposalMetadata?.title}
                  </Typography>
                  <Typography
                    variant='body2'
                    typography={{ xs: 'body3', md: 'body2' }}
                    color={palette.text.secondary}
                  >
                    {proposalMetadata?.description}
                  </Typography>
                </Stack>

                <VoteDetails list={voteDetails} />
                <QuestionList
                  proposal={proposal}
                  questions={proposalMetadata?.acceptedOptions ?? []}
                />
              </Stack>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Stack
                component={Paper}
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
                <VoteQrCode
                  baseUrl={VOTE_QR_BASE_URL}
                  queryParams={{
                    type: 'voting',
                    proposal_id: id ?? '',
                  }}
                />

                {isTopUpAllowed && <TopUpForm />}
              </Stack>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
