import { Box, BoxProps, SxProps } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { forwardRef } from 'react'

import { Icons } from '@/enums'

type Props = {
  size?: number
  name: Icons
  sx?: SxProps<Theme>
} & BoxProps<'svg'>

const UiIcon = forwardRef<SVGSVGElement, Props>(
  ({ size = 6, name, className, color, ...rest }, ref) => {
    const sx: SxProps<Theme> = {
      width: theme => theme.spacing(size),
      height: theme => theme.spacing(size),
      minWidth: theme => theme.spacing(size),
      minHeight: theme => theme.spacing(size),
      maxWidth: theme => theme.spacing(size),
      maxHeight: theme => theme.spacing(size),
      ...rest.sx,
    }

    return (
      <Box
        {...rest}
        ref={ref}
        component='svg'
        sx={sx}
        color={color || 'inherit'}
        className={['icon', ...(className ? [className] : [])].join(' ')}
        aria-hidden='true'
      >
        <use href={`#${name}-icon`} />
      </Box>
    )
  },
)

export default UiIcon
