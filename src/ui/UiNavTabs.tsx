import { Box, Stack, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Transitions } from '@/theme/constants'

type Tab = {
  label: string
  href: string
  isExact?: boolean
}

type UiTabsProps = {
  tabs: Tab[]
}

export default function UiNavTabs({ tabs }: UiTabsProps) {
  return (
    <Stack
      direction='row'
      justifyContent='center'
      alignItems='center'
      component={motion.div}
      sx={({ palette }) => ({
        backgroundColor: palette.action.active,
        borderRadius: 14,
        p: 0.5,
        position: 'relative',
      })}
    >
      {tabs.map((tab, index) => (
        <UiNavTab key={index} {...tab} />
      ))}
    </Stack>
  )
}

function UiNavTab({ label, href, isExact = false }: Tab) {
  const location = useLocation()
  const { typography } = useTheme()

  const isRouteActive = useMemo(() => {
    return isExact ? location.pathname === href : location.pathname.includes(href)
  }, [isExact, location.pathname, href])

  return (
    <Stack
      component={NavLink}
      justifyContent='center'
      alignItems='center'
      to={href}
      sx={{
        position: 'relative',
        px: { xs: 2, md: 10 },
        py: { xs: 2, md: 2 },
        borderRadius: 6,
        textDecoration: 'none',
        color: theme => (isRouteActive ? theme.palette.text.primary : theme.palette.text.secondary),
        transition: Transitions.Gentle,
        '&:hover': {
          color: theme => theme.palette.text.primary,
        },
        zIndex: 1,
      }}
    >
      <Typography
        variant='buttonMedium'
        sx={{
          fontWeight: isRouteActive ? 500 : 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textAlign: 'center',
          zIndex: 2,
          typography: {
            xs: typography.buttonSmall,
            md: typography.buttonMedium,
          },
        }}
      >
        {label}
      </Typography>
      {isRouteActive && (
        <Box
          component={motion.div}
          layoutId='active-tab'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            borderRadius: 14,
            backgroundColor: theme => theme.palette.background.paper,
            boxShadow: '0px 1px 1px 0px #0000000D',
            zIndex: 0,
          }}
        />
      )}
    </Stack>
  )
}
