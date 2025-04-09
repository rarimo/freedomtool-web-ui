import { Box, BoxProps } from '@mui/material'
import { forwardRef } from 'react'

import { Illustrations } from '@/enums'
import { useUiState } from '@/store'
type Props = {
  size?: number
  name: Illustrations
} & BoxProps<'svg'>

const UiIllustration = forwardRef<SVGSVGElement, Props>(({ ...props }, ref) => {
  const { supportedPaletteMode } = useUiState()

  const { className, name, ...rest } = props

  return (
    <Box
      {...rest}
      ref={ref}
      component='svg'
      sx={props.sx}
      className={['illustration', ...(className ? [className] : [])].join(' ')}
      aria-hidden='true'
    >
      <use href={`#${name}-${supportedPaletteMode}-illustration`} />
    </Box>
  )
})

export default UiIllustration
