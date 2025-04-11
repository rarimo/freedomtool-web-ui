import { alpha, Box, Stack, Typography, useTheme } from '@mui/material'

import { ProposalStatus } from '@/enums/proposal'

export default function StatusBadge({ status }: { status?: ProposalStatus }) {
  const { palette } = useTheme()

  if (!status) return null

  const statusMap: Record<ProposalStatus, { text: string; color: string }> = {
    [ProposalStatus.Started]: {
      text: 'Live',
      color: palette.primary.main,
    },
    [ProposalStatus.Ended]: {
      text: 'Finished',
      color: palette.common.white,
    },
    [ProposalStatus.Waiting]: {
      text: 'Awaiting',
      color: palette.warning.main,
    },
    [ProposalStatus.None]: {
      text: 'None',
      color: palette.common.white,
    },
    [ProposalStatus.DoNotShow]: {
      text: 'Hidden',
      color: palette.common.white,
    },
  }

  const { text, color } = statusMap[status as ProposalStatus]

  return (
    <Stack
      direction='row'
      px={2}
      py={1}
      spacing={2}
      alignItems='center'
      justifyContent='center'
      bgcolor={alpha(palette.common.black, 0.5)}
      sx={{ borderRadius: 100 }}
    >
      <Box width={8} height={8} borderRadius={100} bgcolor={color} />
      <Typography color={palette.common.white} variant='overline2'>
        {text}
      </Typography>
    </Stack>
  )
}
