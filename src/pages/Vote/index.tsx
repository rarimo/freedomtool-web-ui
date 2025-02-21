import { Box, Divider, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'

import { ErrorView } from '@/common'
import { useVote } from '@/hooks/vote'

import VoteDetails from './components/IVoteDetails'
import QuestionList from './components/QuestionList'
import TopUpForm from './components/TopUpForm'
import VoteSkeleton from './components/VoteSkeleton'

export default function Vote() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { palette } = useTheme()

  const {
    isLoading,
    isError,
    voteDetails,
    proposal,
    proposalMetadata,
    // top up hook
    topUpVoteContract,
    checkVoteAmount,
    isCalculating,
  } = useVote(id)

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
            <Typography variant='h3'>{proposalMetadata?.title}</Typography>
            <Typography variant='body2' color={palette.text.secondary}>
              {proposalMetadata?.description}
            </Typography>
          </Stack>

          <VoteDetails list={voteDetails} />
          <QuestionList proposal={proposal} questions={proposalMetadata?.acceptedOptions ?? []} />
        </Stack>
      </Paper>

      <Paper sx={{ height: 'fit-content' }}>
        <Stack sx={{ padding: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={2} sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3 }}>
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
                <QRCode value={proposal?.cid || ''} size={130} />
              </Stack>
              <Typography variant='body2' color='textSecondary' sx={{ marginTop: 1 }}>
                {t('vote.qr-code-subtitle')}
              </Typography>
            </Stack>

            <TopUpForm
              isCalculating={isCalculating}
              checkVoteAmount={checkVoteAmount}
              onSubmit={topUpVoteContract}
            />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
