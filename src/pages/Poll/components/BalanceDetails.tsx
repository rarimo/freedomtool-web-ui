import { Stack, Typography, useTheme } from '@mui/material'

interface BalanceItem {
  title: string
  description: string
}

export default function BalanceDetails({ list }: { list: BalanceItem[] }) {
  const { palette } = useTheme()

  return (
    <Stack width='100%' spacing={4}>
      {list.map(({ title, description }, index) => (
        <Stack direction='row' justifyContent='space-between' key={index} spacing={5}>
          <Typography variant='body4' color={palette.text.secondary}>
            {title}
          </Typography>
          <Typography textAlign='right' variant='subtitle6'>
            {description}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
