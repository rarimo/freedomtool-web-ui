import { Box, Divider, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'

import { ErrorView } from '@/common'
import { useRouteTitleContext } from '@/contexts'
import { useWeb3Context } from '@/contexts/web3-context'
import { useVote } from '@/hooks/vote'

import QuestionList from './components/QuestionList'
import TopUpForm from './components/TopUpForm'
import VoteDetails from './components/VoteDetails'
import VoteSkeleton from './components/VoteSkeleton'

export default function Vote() {
  const { t } = useTranslation()
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
      <Paper>
        <Stack sx={{ padding: 2 }} spacing={5} divider={<Divider />}>
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
      </Paper>

      <Stack
        component={Paper}
        spacing={2}
        sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3, height: 'fit-content' }}
      >
        <Stack
          sx={{
            width: 160,
            height: 160,
            backgroundColor: palette.common.white,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            border: `1px solid ${palette.action.active}`,
          }}
        >
          {/* TODO: Add a valid QR-code value */}
          <QRCode value={proposal?.cid || ''} size={130} />
        </Stack>
        <Typography
          variant='body2'
          typography={{ xs: 'body3', md: 'body2' }}
          color='textSecondary'
          mb={{ xs: 8 }}
          mt={1}
        >
          {t('vote.qr-code-subtitle')}
        </Typography>

        {address && <TopUpForm />}
      </Stack>
    </Box>
  )
}
