import { Box, Stack, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Transitions } from '@/theme/constants'

type PollTab = {
  pollsAmount: number
  label: string
  href: string
  isExact?: boolean
}

type PollTabsProps = {
  tabs: PollTab[]
}

export default function PollsTabs({ tabs }: PollTabsProps) {
  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={8}
      component={motion.div}
      width='100%'
      pt={3}
    >
      {tabs.map((tab, index) => (
        <PollsTab key={index} {...tab} />
      ))}
    </Stack>
  )
}

function PollsTab({ pollsAmount, label, href, isExact = false }: PollTab) {
  const location = useLocation()
  const { palette } = useTheme()

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
        pt: 1.5,
        pb: 4,
        textDecoration: 'none',
        color: isRouteActive ? palette.text.primary : palette.text.secondary,
        transition: Transitions.Gentle,
        zIndex: 1,

        '&:hover': {
          color: palette.text.primary,
        },
      }}
    >
      <Stack direction='row' spacing={2} alignItems='center'>
        <Typography
          variant='subtitle6'
          color={isRouteActive ? palette.common.black : palette.text.secondary}
          sx={{
            px: 1.5,
            textAlign: 'center',
            width: 'fit-content',
            height: 20,
            backgroundColor: isRouteActive ? palette.primary.main : palette.action.active,
            borderRadius: 1000,
            zIndex: 2,
          }}
        >
          {pollsAmount}
        </Typography>
        <Typography
          variant='buttonLarge'
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          {label}
        </Typography>
      </Stack>
      {isRouteActive && (
        <Box
          component={motion.div}
          layoutId='active-tab'
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 2,
            backgroundColor: palette.primary.main,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
      )}
    </Stack>
  )
}
