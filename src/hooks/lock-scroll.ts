import { RefObject, useLayoutEffect, useRef } from 'react'

export function useLockScroll(isLocked: boolean, containerRef: RefObject<HTMLElement>) {
  const originalOverflowRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return

    if (originalOverflowRef.current === null) {
      originalOverflowRef.current = element.style.overflow
    }

    element.style.overflow = isLocked ? 'hidden' : (originalOverflowRef.current ?? '')
    if (!isLocked) {
      originalOverflowRef.current = null
    }
  }, [isLocked, containerRef])
}
