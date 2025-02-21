import { Stack, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'

export interface IVoteDetails {
  title: ReactNode
  description: ReactNode
}

export default function VoteDetails({ list }: { list: IVoteDetails[] }) {
  const { palette } = useTheme()

  return (
    <Stack spacing={3}>
      {list.map(({ title, description }, index) => (
        <Stack direction='row' justifyContent='space-between' key={index}>
          <Typography variant='body2' color={palette.text.secondary}>
            {title}
          </Typography>
          <Typography variant='body2'>{description}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}
