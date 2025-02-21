import { Box } from '@mui/material'

import { useProposalState } from '@/hooks'

import VoteItem, { VoteItemSkeleton } from './componennts/VoteItem'

export default function Votes() {
  const { isLoading, proposals } = useProposalState({ shouldFetchProposals: true })

  if (isLoading)
    return (
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 2,
        }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <VoteItemSkeleton key={index} />
        ))}
      </Box>
    )

  return (
    <Box
      sx={{
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 2,
      }}
    >
      {proposals?.map(({ id, proposal }, index) => (
        <VoteItem proposal={proposal} id={id} key={index} />
      ))}
    </Box>
  )
}
