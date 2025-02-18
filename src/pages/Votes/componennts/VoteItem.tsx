import { Divider, Paper, Stack, Typography, useTheme } from '@mui/material'

import { useIpfsLoading } from '@/hooks'
import { IQuestionIpfs } from '@/pages/CreateVote/types'

export default function VoteItem({ cid }: { cid: string }) {
  const { palette } = useTheme()

  const { data } = useIpfsLoading<IQuestionIpfs[]>(cid)

  // eslint-disable-next-line no-console
  console.log('data', data?.[0].title)

  return (
    <Stack>
      <Stack spacing={2} component={Paper}>
        <Stack direction='row' spacing={5} divider={<Divider flexItem orientation='vertical' />}>
          <Typography variant='buttonMedium'>Description</Typography>
          <Typography color={palette.text.secondary}>Status:</Typography>
          <Typography color={palette.text.secondary}>Info:</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
