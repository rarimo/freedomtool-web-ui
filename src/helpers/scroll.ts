export const scrollToSelector = (selector: string) => {
  const el = document.querySelector(selector)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
