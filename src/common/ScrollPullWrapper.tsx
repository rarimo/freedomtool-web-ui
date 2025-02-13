import { Box, StackProps } from '@mui/material'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { Transitions } from '@/theme/constants'

interface Props extends StackProps {
  /** Distance to pull before onPullUp or onPullDown is called */
  threshold?: number
  /** Resistance to pull distance, 1 = no resistance */
  resistance?: number
  isDisabled?: boolean
  upIndicator?: ReactNode
  downIndicator?: ReactNode
  containerSelector?: string
  onPullUp?: () => void
  onPullDown?: () => void
}

const WHEEL_END_DELAY = 150 // ms

type PullDirection = 'up' | 'down'

export default function ScrollPullWrapper({ isDisabled, children, ...rest }: Props) {
  if (isDisabled) return children

  return <ScrollPullController {...rest}>{children}</ScrollPullController>
}

function ScrollPullController({
  threshold = 40,
  resistance = 7,
  upIndicator,
  downIndicator,
  containerSelector = '#main-content',
  children,
  onPullUp,
  onPullDown,
  ...rest
}: Props) {
  const wheelTimeout = useRef<number>(-1)
  const isBlockedRef = useRef(false)
  const directionRef = useRef<PullDirection>('down')

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const container = document.querySelector(containerSelector) as HTMLElement | null

  const refreshWheelTimeout = useCallback(() => {
    clearTimeout(wheelTimeout.current)
    wheelTimeout.current = window.setTimeout(() => {
      setPullDistance(0)
      isBlockedRef.current = false
    }, WHEEL_END_DELAY)
  }, [])

  const checkContainerScroll = useCallback(() => {
    if (!container) return

    const { scrollTop, scrollHeight, offsetHeight } = container
    const isTopReached = scrollTop === 0
    const isBottomReached = Math.ceil(scrollTop) + offsetHeight >= scrollHeight

    const canPullUp = isTopReached && directionRef.current === 'up'
    const canPullDown = isBottomReached && directionRef.current === 'down'

    if (!canPullUp && !canPullDown) {
      isBlockedRef.current = true
    }
  }, [container])

  const handlePullInteraction = useCallback(
    (e: WheelEvent) => {
      const direction = e.deltaY < 0 ? 'up' : 'down'
      directionRef.current = direction

      const isUpDisabled = direction === 'up' && !upIndicator
      const isDownDisabled = direction === 'down' && !downIndicator

      if (!container || isRefreshing || isUpDisabled || isDownDisabled) return

      refreshWheelTimeout()
      checkContainerScroll()

      if (isBlockedRef.current) return

      const newPullDistance = pullDistance - e.deltaY / resistance
      const pullDistanceToSet =
        direction === 'up'
          ? Math.min(newPullDistance, threshold)
          : Math.max(newPullDistance, -threshold)

      e.preventDefault()
      setPullDistance(pullDistanceToSet)
    },
    [
      pullDistance,
      isRefreshing,
      threshold,
      resistance,
      upIndicator,
      downIndicator,
      container,
      refreshWheelTimeout,
      checkContainerScroll,
    ],
  )

  useEffect(() => {
    container?.addEventListener('wheel', handlePullInteraction)
    return () => container?.removeEventListener('wheel', handlePullInteraction)
  }, [container, handlePullInteraction])

  useEffect(() => {
    if (Math.abs(pullDistance) < threshold) return

    setIsRefreshing(true)
    setPullDistance(0)
    isBlockedRef.current = false

    if (directionRef.current === 'up') {
      onPullUp?.()
    } else {
      onPullDown?.()
    }

    // Wait for wheel inertia to end
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [pullDistance, threshold, onPullUp, onPullDown])

  return (
    <Box position='relative' {...rest}>
      <Box
        position='absolute'
        top={0}
        left='50%'
        sx={{
          transition: isRefreshing ? Transitions.Default : 'none',
          transform: `translateX(-50%) scale(${pullDistance / threshold})`,
          transformOrigin: 'top',
        }}
      >
        {upIndicator}
      </Box>
      <Box
        sx={{
          transition: isRefreshing ? Transitions.Default : 'none',
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </Box>
      <Box
        position='absolute'
        bottom={0}
        left='50%'
        sx={{
          transition: isRefreshing ? Transitions.Default : 'none',
          transform: `translateX(-50%) scale(${-pullDistance / threshold})`,
          transformOrigin: 'bottom',
        }}
      >
        {downIndicator}
      </Box>
    </Box>
  )
}
