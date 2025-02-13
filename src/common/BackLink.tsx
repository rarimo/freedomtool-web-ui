import { Button, ButtonProps } from '@mui/material'
import { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

interface Props extends ButtonProps {
  to: string
  startIcon?: ReactNode
  buttonContent?: ReactNode
}

export default function BackLink({ to, startIcon, buttonContent, ...rest }: Props) {
  const location = useLocation()

  return (
    <Button
      component={NavLink}
      to={location.state?.from ?? to}
      variant='text'
      size='small'
      startIcon={startIcon ?? <UiIcon name={Icons.CaretLeft} size={4} />}
      {...rest}
      sx={{ width: 'fit-content', ...rest.sx }}
    >
      {buttonContent ?? 'Back'}
    </Button>
  )
}
