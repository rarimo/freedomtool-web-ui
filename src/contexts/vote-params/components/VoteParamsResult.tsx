import { BN } from '@distributedlab/tools'
import { Stack, Typography, useTheme } from '@mui/material'

import { NATIVE_CURRENCY } from '@/constants'
import { formatBalance } from '@/helpers'

import { useVoteParamsContext } from '../VoteParamsContext'

export default function VoteParamsResult() {
  const { votesAmount } = useVoteParamsContext()
  const { palette } = useTheme()
  return (
    <Stack minWidth={250} alignItems='flex-end'>
      <Stack spacing={1} color={palette.text.secondary} direction='row' alignItems='center'>
        <Typography variant='body4'>Fee:</Typography>
        {/* TODO: Replace with subtitle6 after merge */}
        {/* TODO: Add gas estimate */}
        <Typography variant='subtitle5'>0.000000000000000007 ETH</Typography>
      </Stack>
      <Stack spacing={1} direction='row' justifyContent='center' alignItems='center'>
        <Typography variant='body2'>Total:</Typography>
        <Typography variant='subtitle4'>
          {formatBalance(BN.fromBigInt(votesAmount).value)} {NATIVE_CURRENCY}
        </Typography>
      </Stack>
    </Stack>
  )
}
