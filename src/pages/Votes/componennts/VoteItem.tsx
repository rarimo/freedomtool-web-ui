import { Divider, Paper, Stack, Typography, useTheme } from '@mui/material'

// TODO: Add real data
export default function VoteItem() {
  const { palette } = useTheme()

  return (
    <Stack>
      <Stack spacing={2} component={Paper}>
        <Stack direction='row' spacing={5} divider={<Divider flexItem orientation='vertical' />}>
          <Typography variant='buttonMedium'>Description</Typography>
          <Typography color={palette.text.secondary}>Status: 1</Typography>
          <Typography color={palette.text.secondary}>Info: Available??? </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
