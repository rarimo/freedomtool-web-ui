import { useEffect, useRef, useState } from 'react'

const defaultValues = {
  total: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isCompleted: false,
}
export const useCountdown = (
  endsAt: Date,
  onComplete?: () => void,
): {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
  isCompleted: boolean
} => {
  const nextTimeLeft = endsAt.getTime() - Date.now()
  const [timeLeft, setTimeLeft] = useState<number>(nextTimeLeft)
  const isCallbackCalled = useRef<boolean>(false)
  const prevTimeLeft = useRef<number>(timeLeft)

  useEffect(() => {
    if (timeLeft <= 0 && nextTimeLeft > 0) {
      setTimeLeft(nextTimeLeft)
    }
  }, [endsAt, nextTimeLeft, timeLeft])

  useEffect(() => {
    if (isNaN(timeLeft) || (timeLeft <= 0 && nextTimeLeft < 0)) return

    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, nextTimeLeft))
    }, 1000)

    return () => clearInterval(interval)
  }, [endsAt, nextTimeLeft, timeLeft])

  useEffect(() => {
    if (isNaN(timeLeft)) return

    if (prevTimeLeft.current > 0 && timeLeft <= 0 && onComplete && !isCallbackCalled.current) {
      onComplete()
      isCallbackCalled.current = true
    }

    prevTimeLeft.current = timeLeft
  }, [onComplete, timeLeft])

  if (isNaN(timeLeft) || timeLeft <= 0) {
    return defaultValues
  }

  // if we want to show negative values (consider removing multiplication by 1000)
  // const totalSeconds = Math.abs(timeLeft) / 1000
  return {
    total: timeLeft,
    days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
    isCompleted: timeLeft <= 0,
  }
}
