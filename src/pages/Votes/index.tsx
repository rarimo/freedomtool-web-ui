import { Stack } from '@mui/material'

import { useProposalState } from '@/hooks'

import VotesPagination from './componennts/Pagination'
import VoteItem from './componennts/VoteItem'

const PAGINATION_LIMIT = 10

export default function Votes() {
  const { changePage, currentPage, isLoading, lastProposalId } = useProposalState(PAGINATION_LIMIT)
  const pageCount = Math.ceil(lastProposalId ?? 0 / PAGINATION_LIMIT)

  return (
    <>
      <Stack spacing={4}>
        <Stack spacing={2}>
          <VoteItem />
          <VoteItem />
          <VoteItem />
        </Stack>
      </Stack>
      <VotesPagination
        pageCount={pageCount}
        currentPage={currentPage}
        isLoading={isLoading}
        onChange={changePage}
      />
    </>
  )
}
