import { useEffect, useRef, useState } from 'react'

export function useScrollWithShadow(size: number = 80) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  function getMaskStyle(): React.CSSProperties {
    const shadowSize = `${size}px`

    const isBottom = clientHeight === scrollHeight - scrollTop
    const isTop = scrollTop === 0
    const isBetween = scrollTop > 0 && clientHeight < scrollHeight - scrollTop

    let maskImage = 'none'

    if (isTop && isBottom) {
      maskImage = 'none'
    } else if (isTop) {
      maskImage = `linear-gradient(to top, transparent, #000 ${shadowSize})`
    } else if (isBottom) {
      maskImage = `linear-gradient(to bottom, transparent, #000 ${shadowSize})`
    } else if (isBetween) {
      maskImage = `linear-gradient(to bottom, transparent, #000 ${shadowSize}, #000 calc(100% - ${shadowSize}), transparent)`
    }

    return {
      maskImage,
      WebkitMaskImage: maskImage,
      transition: 'mask-image 0.3s ease-in-out, -webkit-mask-image 0.3s ease-in-out',
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observeScroll = () => {
      setScrollTop(container.scrollTop)
      setScrollHeight(container.scrollHeight)
      setClientHeight(container.clientHeight)
    }

    observeScroll()

    container.addEventListener('scroll', observeScroll)
    return () => {
      container.removeEventListener('scroll', observeScroll)
    }
  }, [])

  return {
    containerRef,
    shadowScrollStyle: getMaskStyle(),
  }
}
