import { Box } from '@mui/material'

import { InfiniteList } from '@/common'
import { useProposalState } from '@/hooks'

import VoteItem, { VoteItemSkeleton } from './componennts/VoteItem'

const listSx = {
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: 2,
}

export default function Votes() {
  const { proposals, proposalsLoadingState, loadNextProposals, reloadProposals } = useProposalState(
    {
      shouldFetchProposals: true,
    },
  )

  return (
    <InfiniteList
      items={proposals}
      slots={{
        loading: <VotesSkeleton />,
      }}
      loadingState={proposalsLoadingState}
      onRetry={reloadProposals}
      onLoadNext={loadNextProposals}
    >
      <Box sx={listSx}>
        {proposals?.map(({ id, proposal }, index) => (
          <VoteItem proposal={proposal} id={id} key={index} />
        ))}
      </Box>
    </InfiniteList>
  )
}

export function VotesSkeleton() {
  return (
    <Box sx={listSx}>
      {Array.from({ length: 12 }).map((_, index) => (
        <VoteItemSkeleton key={index} />
      ))}
    </Box>
  )
}
