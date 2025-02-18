import { Pagination, Stack } from '@mui/material'

interface IVotesPagination {
  pageCount: number
  currentPage: number
  isLoading: boolean
  onChange: (page: number) => void
}

export default function VotesPagination({
  pageCount,
  currentPage,
  isLoading,
  onChange,
}: IVotesPagination) {
  return (
    <Stack alignItems='center' justifySelf='flex-end'>
      <Pagination
        color='standard'
        variant='text'
        count={pageCount}
        page={currentPage}
        onChange={(_, page) => onChange(page)}
        shape='rounded'
        disabled={isLoading}
      />
    </Stack>
  )
}
