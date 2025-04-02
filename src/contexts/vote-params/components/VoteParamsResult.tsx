import { Stack, Typography, useTheme } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import { NATIVE_CURRENCY } from '@/constants'
import { CreatePollSchema } from '@/pages/CreatePoll/createPollSchema'

export default function VoteParamsResult() {
  const { watch } = useFormContext<CreatePollSchema>()
  const { palette } = useTheme()

  const amount = watch('settings.amount')

  return (
    <Stack minWidth={250} alignItems='flex-end'>
      <Stack spacing={1} color={palette.text.secondary} direction='row' alignItems='center'>
        <Typography variant='body4'>Fee:</Typography>
        {/* TODO: Add gas estimate */}
        <Typography variant='subtitle6'>0.000000000000000007 ETH</Typography>
      </Stack>
      <Stack spacing={1} direction='row' justifyContent='center' alignItems='center'>
        <Typography variant='body2'>Total:</Typography>
        <Typography variant='subtitle4'>
          {amount || '0'} {NATIVE_CURRENCY}
        </Typography>
      </Stack>
    </Stack>
  )
}
