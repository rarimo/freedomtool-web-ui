import { useRef, useState } from 'react'

const usePressedState = ({
  onRelease,
  delay = 100,
}: {
  onRelease?: () => void
  delay?: number
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const press = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPressed(true)
  }

  const release = () => {
    timeoutRef.current = setTimeout(() => {
      setIsPressed(false)
      if (onRelease) onRelease()
    }, delay)
  }

  return { isPressed, press, release }
}

export default usePressedState
