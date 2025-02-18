import { Grid } from '@mui/material'

import { useProposalState } from '@/hooks'
import { UiContainer } from '@/ui'

import VoteItem, { VoteItemSkeleton } from './componennts/VoteItem'

export default function Votes() {
  const { isLoading, proposals } = useProposalState()

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
        <Grid container spacing={2}>
          {proposals.map((proposal, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <VoteItem proposal={proposal} />
            </Grid>
          ))}
        </Grid>
      )}
    </UiContainer>
  )
}
