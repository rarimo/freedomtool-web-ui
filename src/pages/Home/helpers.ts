export function getRepositoryItemVariants(index: number, total: number, isLgDown: boolean) {
  if (isLgDown) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }
  }

  const middle = Math.floor(total / 2)
  if (index === middle) {
    return {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    }
  }

  if (index < middle) {
    return {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    }
  }

  return {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  }
}
