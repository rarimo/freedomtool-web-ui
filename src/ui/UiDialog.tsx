import {
  Box,
  type BoxProps,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  type StackProps,
  Typography,
} from '@mui/material'
import { ReactNode } from 'react'

import { Icons } from '@/enums'

import UiIcon from './UiIcon'

interface UiDialogTitleProps extends StackProps {
  onClose?: DialogProps['onClose']
  closeButtonIcon?: ReactNode
}

export function UiDialogTitle({ children, onClose, closeButtonIcon, ...rest }: UiDialogTitleProps) {
  return (
    <DialogTitle
      {...rest}
      component={Stack}
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      width='100%'
    >
      <Typography component='p' typography='h4'>
        {children}
      </Typography>
      <IconButton
        aria-label='close'
        sx={{
          p: 1,
          background: 'transparent',
        }}
        onClick={e => onClose?.(e, 'backdropClick')}
      >
        {closeButtonIcon ?? <UiIcon name={Icons.CloseFill} size={5} />}
      </IconButton>
    </DialogTitle>
  )
}

export function UiDialogContent(props: BoxProps) {
  return <Box p={{ xs: 4, md: 6 }} flex={1} overflow='hidden auto' width='100%' {...props} />
}

export function UiDialogActions(props: BoxProps) {
  return (
    <Box px={5} py={4} borderTop={1} borderColor={theme => theme.palette.divider} {...props}></Box>
  )
}
