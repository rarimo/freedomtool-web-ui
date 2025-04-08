import { Stack, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'

import PollCriteriaList, { PollCriteriaListProps } from './PollCriteriaList'

export interface IPollDetails {
  title: ReactNode
  description: ReactNode
}

export default function PollDetails({
  list,
  criteria,
}: {
  list: IPollDetails[]
  criteria?: PollCriteriaListProps
}) {
  const { palette } = useTheme()

  return (
    <Stack width='100%' spacing={{ xs: 2, md: 4 }}>
      {list.map(({ title, description }, index) => (
        <Stack direction='row' justifyContent='space-between' key={index} spacing={5}>
          <Typography variant='body4' color={palette.text.secondary}>
            {title}
          </Typography>
          <Typography
            textAlign='right'
            variant='subtitle6'
            typography={{ xs: 'body4', md: 'subtitle6' }}
          >
            {description}
          </Typography>
        </Stack>
      ))}
      <PollCriteriaList {...criteria} />
    </Stack>
  )
}
