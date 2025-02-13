import { Stack, type StackProps, useTheme } from '@mui/material'
import { ElementType, ReactNode } from 'react'

import LazyImage from './LazyImage'

interface LogoAvatarProps extends StackProps {
  src?: string
  alt?: string
  size: number
  fallback?: ReactNode
}

export default function LogoAvatar<T extends ElementType = 'div'>({
  src,
  alt,
  size,
  fallback,
  ...rest
}: LogoAvatarProps & StackProps<T, { component?: T }>) {
  const { spacing, palette } = useTheme()

  if (!src && !fallback) return null

  return (
    <Stack
      bgcolor={palette.primary.lighter}
      justifyContent='center'
      alignItems='center'
      borderRadius='50%'
      minWidth={spacing(size)}
      width={spacing(size)}
      height={spacing(size)}
      overflow='hidden'
      {...rest}
    >
      {src ? (
        <LazyImage src={src} alt={alt || 'market logo'} width='100%' height='100%' />
      ) : (
        fallback
      )}
    </Stack>
  )
}
