import { Paper, Stack, StackProps, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

interface Props extends StackProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

export default function ErrorView({
  icon = <UiIcon name={Icons.Warning} size={6} />,
  title = 'Error',
  description,
  action,
  ...rest
}: Props) {
  const { palette } = useTheme()

  return (
    <Stack
      component={Paper}
      spacing={4}
      alignItems='center'
      width='100%'
      justifyContent='center'
      p={8}
      border={1}
      borderColor={palette.error.light}
      {...rest}
    >
      <Stack
        alignItems='center'
        justifyContent='center'
        color={palette.error.main}
        bgcolor={palette.error.lighter}
        borderRadius='50%'
        p={3}
      >
        {icon}
      </Stack>
      <Stack spacing={1} textAlign='center'>
        <Typography variant='subtitle3'>{title}</Typography>
        {description && (
          <Typography variant='body3' color={palette.text.secondary}>
            {description}
          </Typography>
        )}
      </Stack>
      {action}
    </Stack>
  )
}
