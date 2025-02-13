export const createDeepPath = (path: string) => {
  return path.endsWith('*') ? path : `${path}/*`
}
