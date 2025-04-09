import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, useLocation } from 'react-router-dom'

import { RoutePaths } from '@/enums'

export interface RouteTitleContextType {
  title: ReactNode
  setTitle: (title: ReactNode) => void
}

const RouteTitleContext = createContext<RouteTitleContextType>({
  title: '',
  setTitle: () => {},
})

export function RouteTitleContextProvider({ children }: PropsWithChildren) {
  const [title, setTitle] = useState<ReactNode>('')
  const { t } = useTranslation()

  const { pathname } = useLocation()

  const routePathToTitle: Partial<Record<RoutePaths, ReactNode>> = useMemo(
    () => ({
      [RoutePaths.Polls]: t('routes.vote'),
      [RoutePaths.NewPoll]: t('routes.create-new-proposal'),
    }),
    [t],
  )

  const defaultTitle = useMemo(() => {
    const matchedPath = Object.keys(routePathToTitle).find(pattern =>
      matchPath({ path: pattern, end: true }, pathname),
    )
    return matchedPath ? routePathToTitle[matchedPath as RoutePaths] : ''
  }, [pathname, routePathToTitle])

  useEffect(() => {
    setTitle(defaultTitle)
  }, [defaultTitle])

  return (
    <RouteTitleContext.Provider value={{ title, setTitle }}>{children}</RouteTitleContext.Provider>
  )
}

export const useRouteTitleContext = () => useContext(RouteTitleContext)
