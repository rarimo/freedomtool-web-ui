import { useState } from 'react'

export function useScrollWithShadow(size: number = 80) {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  const onScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    setScrollTop(target.scrollTop)
    setScrollHeight(target.scrollHeight)
    setClientHeight(target.clientHeight)
  }

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

  return {
    shadowScrollStyle: getMaskStyle(),
    onScrollHandler,
  }
}
