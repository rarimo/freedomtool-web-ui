import { Box, Grid } from '@mui/material'

import { useProposalState } from '@/hooks'
import { UiContainer } from '@/ui'

import VoteItem, { VoteItemSkeleton } from './componennts/VoteItem'

export default function Votes() {
  const { isLoading, proposals } = useProposalState({ shouldFetchProposals: true })

  return (
    <UiContainer>
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <VoteItemSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 2,
          }}
        >
          {proposals.map(({ id, proposal }, index) => (
            <VoteItem proposal={proposal} id={id} key={index} />
          ))}
        </Box>
      )}
    </UiContainer>
  )
}
