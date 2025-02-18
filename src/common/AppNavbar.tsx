import { Stack, StackProps, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, NavLink, useLocation } from 'react-router-dom'

import { Icons, RoutePaths } from '@/enums'
import { Transitions } from '@/theme/constants'
import { UiIcon } from '@/ui'

import SettingsMenu from './SettingsMenu'

const AppNavbar = ({ ...rest }: StackProps) => {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  const isMdDown = useMediaQuery(() => breakpoints.down('md'))

  const navbarItems = useMemo<NavbarLinkProps[]>(
    () => [
      {
        routesList: [RoutePaths.Votes],
        to: RoutePaths.Votes,
        title: t('routes.vote'),
        icon: Icons.ChartBar,
        activeIcon: Icons.ChartBarFill,
      },
      {
        routesList: [RoutePaths.VotesNew],
        to: RoutePaths.VotesNew,
        title: t('routes.create-new-proposal'),
        icon: Icons.Plus,
        activeIcon: Icons.Plus,
      },
    ],
    [t],
  )

  return (
    <Stack
      {...rest}
      justifyContent='space-between'
      alignItems='center'
      sx={{
        px: 4,
        py: 6,
        zIndex: zIndex.appBar,
        [breakpoints.down('md')]: {
          position: 'fixed',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          background: palette.inverted.dark,
          flexDirection: 'row',
          borderRadius: '1000px',
          p: 0,
          boxShadow: '0px 0px 0px 0.33px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
        },
        ...rest.sx,
      }}
    >
      {!isMdDown && (
        <Stack spacing={0.5} alignItems='center'>
          <Stack component={NavLink} to={RoutePaths.Home} alignItems='center'>
            <UiIcon
              name={Icons.App}
              size={10}
              color={palette.text.primary}
              sx={{
                transition: 'transform 500ms ease-out',
                '&:hover': {
                  transform: 'rotate(540deg)',
                },
              }}
            />
          </Stack>
        </Stack>
      )}
      <Stack
        spacing={{ xs: 2, md: 4 }}
        p={1}
        sx={{
          [breakpoints.down('md')]: {
            flexDirection: 'row',
          },
        }}
      >
        {navbarItems.map((item, idx) => (
          <NavbarLink key={idx} {...item} />
        ))}
      </Stack>

      {!isMdDown && <SettingsMenu />}
    </Stack>
  )
}

interface NavbarLinkProps {
  routesList: RoutePaths[]
  to: RoutePaths
  title: string
  icon: Icons
  activeIcon: Icons
}

const NavbarLink = ({ routesList, to, title, icon, activeIcon }: NavbarLinkProps) => {
  const { pathname } = useLocation()
  const { palette, breakpoints } = useTheme()
  const isMdDown = useMediaQuery(() => breakpoints.down('md'))

  const isRouteActive = useMemo(
    () => routesList.some(route => matchPath(route, pathname)),
    [pathname, routesList],
  )

  return (
    <Tooltip title={isMdDown ? '' : title} placement='right' enterDelay={500}>
      <NavLink to={to}>
        <Stack
          alignItems='center'
          justifyContent='center'
          sx={{
            px: { xs: 3, md: 4 },
            py: { xs: 2.5, md: 3 },
            borderRadius: { xs: 100, md: 3 },
            backgroundColor: isRouteActive ? palette.action.active : 'transparent',
            color: isRouteActive ? palette.text.primary : palette.text.secondary,
            transition: Transitions.Default,
            '&:hover': {
              backgroundColor: isRouteActive ? palette.action.active : palette.action.hover,
              color: palette.text.primary,
            },
            [breakpoints.down('md')]: {
              '&, &:disabled, &:focus, &:active, &:hover': {
                backgroundColor: isRouteActive ? palette.inverted.light : 'transparent',
                opacity: isRouteActive ? 1 : 0.6,
                color: isRouteActive ? palette.inverted.dark : palette.inverted.light,
              },
            },
          }}
        >
          <UiIcon name={isRouteActive ? activeIcon : icon} color='inherit' size={5} />
        </Stack>
      </NavLink>
    </Tooltip>
  )
}

export default AppNavbar
