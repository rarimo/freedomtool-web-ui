import { Stack, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'

import PollCriteriaList, { PollCriteriaListProps } from './PollCriteriaList'

export interface PollDetailsProps {
  title: ReactNode
  description: ReactNode
}

export default function PollDetails({
  list,
  criteria,
}: {
  list: PollDetailsProps[]
  criteria?: PollCriteriaListProps
}) {
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
      <PollCriteriaList {...criteria} />
    </Stack>
  )
}
