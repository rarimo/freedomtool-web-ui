import { Stack, StackProps, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import { Icons } from '@/enums'
import { calculateProgress } from '@/helpers/time'
import { UiIcon } from '@/ui'

type Props = { startTimestamp: number; endTimestamp: number } & StackProps

const PROGRESS_HEIGHT = 4
const THUMB_SIZE = 16

export default function FlashMarketTimeProgress({ startTimestamp, endTimestamp, ...rest }: Props) {
  const [progress, setProgress] = useState(calculateProgress(startTimestamp, endTimestamp))
  const intervalRef = useRef<number | null>(null)
  const { palette } = useTheme()

  useEffect(() => {
    const updateProgress = () => {
      const newProgress = calculateProgress(startTimestamp, endTimestamp)
      setProgress(newProgress)
    }

    intervalRef.current = window.setInterval(updateProgress, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimestamp, endTimestamp, progress])

  return (
    <Stack
      position='relative'
      height={PROGRESS_HEIGHT}
      width={130}
      bgcolor={palette.action.active}
      borderRadius={100}
      {...rest}
    >
      <Stack
        position='absolute'
        top={0}
        left={0}
        height='100%'
        width={`${progress}%`}
        borderRadius={100}
        bgcolor={palette.additional.marketFlashProgressThumb}
      />
      <Stack
        width={THUMB_SIZE}
        height={THUMB_SIZE}
        py={0.5}
        px={1.25}
        borderRadius='50%'
        position='absolute'
        top={0}
        left={`calc(${progress}% - ${THUMB_SIZE / 2}px)`}
        alignItems='center'
        justifyContent='center'
        sx={{
          transform: `translate(-50% ,-${(THUMB_SIZE - PROGRESS_HEIGHT) / 2}px)`,
          background: palette.additional.marketFlashProgressIndicator,
        }}
      >
        <UiIcon name={Icons.TimeArrows} size={4} color={palette.common.white} />
      </Stack>
    </Stack>
  )
}
