import 'ldrs/react/LineSpinner.css'

import { useTheme } from '@mui/material'
import { LineSpinner } from 'ldrs/react'

interface Props {
  size?: number
  stroke?: number
  speed?: number
  color?: string
}

export default function UiLineSpinner({ color, size = 10, speed = 1, stroke = 3 }: Props) {
  const { spacing, palette } = useTheme()

  return (
    <LineSpinner
      size={spacing(size).replace('px', '')}
      stroke={stroke}
      speed={speed}
      color={color ?? palette.text.primary}
    />
  )
}
