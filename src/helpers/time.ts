import { time } from '@distributedlab/tools'

export const calculateProgress = (startTime: number, endTime: number): number => {
  const currentTime = time().timestamp
  if (currentTime < startTime) return 0 // Not started yet
  if (currentTime >= endTime) return 100 // Already completed

  return Math.round(((currentTime - startTime) / (endTime - startTime)) * 100)
}
