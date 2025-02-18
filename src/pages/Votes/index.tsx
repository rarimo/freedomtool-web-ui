import { Stack } from '@mui/material'

import { useProposalState } from '@/hooks'
import { UiContainer } from '@/ui'

import VoteItem from './componennts/VoteItem'

export default function Votes() {
  const { isLoading, proposals } = useProposalState()

  return (
    <UiContainer sx={{ maxWidth: 700 }}>
      <Stack spacing={4}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Stack spacing={2}>
            {proposals.map((proposal, index) => (
              <VoteItem cid={proposal[2][4]} key={index} />
            ))}
          </Stack>
        )}
      </Stack>
    </UiContainer>
  )
}
