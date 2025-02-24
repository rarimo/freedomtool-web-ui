import { Box, Divider, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ErrorView } from '@/common'
import { useRouteTitleContext } from '@/contexts'
import { useWeb3Context } from '@/contexts/web3-context'
import { useVote } from '@/hooks/vote'

import { VOTE_QR_BASE_URL } from '../CreateVote/constants'
import QuestionList from './components/QuestionList'
import TopUpForm from './components/TopUpForm'
import VoteDetails from './components/VoteDetails'
import VoteQrCode from './components/VoteQrCode'
import VoteSkeleton from './components/VoteSkeleton'

export default function Vote() {
  const { id } = useParams()
  const { palette } = useTheme()
  const { setTitle } = useRouteTitleContext()

  const { isLoading, isError, voteDetails, proposal, proposalMetadata } = useVote(id)
  const { address } = useWeb3Context()

  useEffect(() => {
    setTitle(proposalMetadata?.title ?? '')
  }, [proposalMetadata?.title, setTitle])

  if (isLoading) return <VoteSkeleton />
  if (isError) return <ErrorView sx={{ maxWidth: 300, mx: 'auto' }} />

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3,
      }}
    >
      <Stack
        component={Paper}
        sx={{ padding: 10, height: 'fit-content' }}
        spacing={5}
        divider={<Divider />}
      >
        <Stack spacing={2}>
          <Typography variant='h3' typography={{ xs: 'h4', md: 'h3' }}>
            {proposalMetadata?.title}
          </Typography>
          <Typography variant='body2' color={palette.text.secondary}>
            {proposalMetadata?.description}
          </Typography>
        </Stack>

        <VoteDetails list={voteDetails} />
        <QuestionList proposal={proposal} questions={proposalMetadata?.acceptedOptions ?? []} />
      </Stack>

      <Stack
        component={Paper}
        spacing={2}
        sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3, height: 'fit-content' }}
      >
        <VoteQrCode
          baseUrl={VOTE_QR_BASE_URL}
          queryParams={{
            type: 'voting',
            proposal_id: id ?? '',
          }}
        />

        {address && <TopUpForm />}
      </Stack>
    </Box>
  )
}
