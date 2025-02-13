import { Box, BoxProps } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface Props extends BoxProps {
  onIntersect: () => void
  options?: IntersectionObserverInit
}

export default function IntersectionAnchor({ onIntersect, options, ...rest }: Props) {
  const anchorEl = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  const observer = useRef(
    new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options),
  )

  useEffect(() => {
    if (!anchorEl?.current) return

    observer.current.observe(anchorEl.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => observer.current.disconnect()
  }, [])

  useEffect(() => {
    if (isIntersecting) {
      onIntersect()
    }
  }, [isIntersecting, onIntersect])

  return (
    <Box
      ref={anchorEl}
      position='absolute'
      left={0}
      bottom={0}
      width='100%'
      zIndex={-1}
      {...rest}
      sx={{
        pointerEvents: 'none',
        ...rest.sx,
      }}
    />
  )
}
