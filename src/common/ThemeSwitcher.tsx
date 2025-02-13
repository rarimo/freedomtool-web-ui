import { Switch, switchClasses } from '@mui/base/Switch'
import { Stack, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/system'
import { PropsWithChildren, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Icons } from '@/enums'
import { uiStore, useUiState } from '@/store'
import { UiIcon } from '@/ui'

function ThemeSwitcherThumb(props: { className: string }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='center'
      spacing={2.5}
      className={props.className}
      bgcolor={palette.background.pure}
      sx={{
        boxSizing: 'border-box',
        width: '113px',
        height: '34px',
        top: '2px',
        left: '2px',
        borderRadius: '24px',
        position: 'relative',
        transitionProperty: 'all',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '120ms',
      }}
    >
      <UiIcon
        name={palette.mode === 'dark' ? Icons.Moon : Icons.Sun}
        size={4}
        color={palette.text.primary}
      />
      <Typography variant='subtitle5' color={palette.text.primary}>
        {palette.mode === 'dark'
          ? t('theme-switcher.theme-option-dark')
          : t('theme-switcher.theme-option-light')}
      </Typography>
    </Stack>
  )
}

function ThemeSwitcherTrack(props: PropsWithChildren & { className: string }) {
  const { palette } = useTheme()
  const { supportedPaletteMode } = useUiState()
  const { t } = useTranslation()

  const renderBackgroundThumbPlaceholder = useCallback(
    (option: 'light' | 'dark') => {
      return (
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='center'
          spacing={2.5}
          color={option === supportedPaletteMode ? palette.text.primary : palette.text.secondary}
        >
          <UiIcon name={option === 'dark' ? Icons.Moon : Icons.Sun} size={4} />
          <Typography variant='subtitle5'>
            {option === 'dark'
              ? t('theme-switcher.theme-option-dark')
              : t('theme-switcher.theme-option-light')}
          </Typography>
        </Stack>
      )
    },
    [palette, t, supportedPaletteMode],
  )

  return (
    <Stack
      direction='row'
      bgcolor={palette.action.active}
      width='100%'
      sx={{
        overflow: 'hidden',
        boxSizing: 'border-box',
        borderRadius: '24px',
        display: 'block',
        height: '100%',
        width: '100%',
        position: 'absolute',
        transitionProperty: 'all',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '120ms',
      }}
    >
      <Stack
        direction='row'
        width='100%'
        sx={{
          justifyContent: 'space-around',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {renderBackgroundThumbPlaceholder('light')}
        {renderBackgroundThumbPlaceholder('dark')}
      </Stack>
      {props.children}
    </Stack>
  )
}

export default function ThemeSwitcher() {
  const { isDarkMode } = useUiState()

  return (
    <Switch
      checked={isDarkMode}
      slots={{
        root: Root,
        thumb: ThemeSwitcherThumb,
        track: ThemeSwitcherTrack,
      }}
      slotProps={{
        thumb: {
          className: switchClasses.thumb,
        },
      }}
      onChange={uiStore.togglePaletteMode}
    />
  )
}

// Using `any` due to issues with inferring MUI theme transitions types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Root = styled('span')(({ theme }: { theme: any }) => ({
  boxSizing: 'border-box',
  fontSize: 0,
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  height: '38px',
  cursor: 'pointer',
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.short,
  }),

  [`&.${switchClasses.disabled}`]: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  [`&.${switchClasses.checked} .${switchClasses.thumb}`]: {
    transform: 'translateX(calc(100% - 4px))',
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
  },

  [`&.${switchClasses.checked} .${switchClasses.track}`]: {
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create(['background-color'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
  },

  [`& .${switchClasses.thumb}`]: {
    transform: 'translateX(0)',
    width: '50%',
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
  },

  [`& .${switchClasses.track}`]: {
    backgroundColor: theme.palette.grey[400],
    transition: theme.transitions.create(['background-color'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
  },

  [`& .${switchClasses.input}`]: {
    cursor: 'inherit',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0,
    zIndex: 1,
    margin: 0,
  },
}))
