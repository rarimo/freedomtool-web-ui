import {
  ButtonBase,
  Divider,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AppMenu } from '@/common/index'
import { useWeb3Context } from '@/contexts/web3-context'
import { Icons } from '@/enums'
import { formatAddress, formatAmountShort } from '@/helpers'
import { authStore, uiStore } from '@/store'
import { Transitions } from '@/theme/constants'
import { UiIcon, UiSwitch } from '@/ui'

export default function AppSettingsMenu() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  const { disconnect, address, balance } = useWeb3Context()

  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const menuItemSx: SxProps = { minHeight: 40, p: 2, m: 0, gap: 3 }

  return (
    <>
      <Stack
        component={ButtonBase}
        bgcolor={palette.action.active}
        px={4}
        py={{ xs: 1.5, md: 2.5 }}
        borderRadius={100}
        fontFamily='inherit'
        sx={{
          transition: Transitions.Default,
          '&:hover, &:focus-visible': {
            bgcolor: palette.action.hover,
          },
        }}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        <Stack direction='row' spacing={2} alignItems='center'>
          <UiIcon name={Icons.Ethereum} size={5} />
          <Typography variant='subtitle6'>{formatAmountShort(balance)}</Typography>
          <Divider orientation='vertical' flexItem />
          {isMdUp && <Typography variant='subtitle6'>{formatAddress(address, 5)}</Typography>}
          <UiIcon name={Icons.ArrowDownSLine} size={4} />
        </Stack>
      </Stack>
      <AppMenu
        anchorEl={anchorEl}
        id='settings-menu'
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        MenuListProps={{
          sx: {
            width: 238,
            p: 0,
          },
        }}
        onClose={() => setAnchorEl(null)}
      >
        <Stack spacing={1.5} divider={<Divider flexItem />}>
          {!isMdUp && (
            <Stack
              direction='row'
              alignItems='center'
              spacing={3}
              sx={{
                py: 2,
                pr: 2,
                pl: 2,
              }}
            >
              <UiIcon size={5} color={palette.text.secondary} name={Icons.User3Line} />
              <Typography variant='subtitle6'>{formatAddress(address, 5)}</Typography>
            </Stack>
          )}
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Stack direction='row' alignItems='center' spacing={3} sx={menuItemSx}>
              <UiIcon name={Icons.Moon} size={5} color={palette.text.secondary} />
              <Typography variant='buttonMedium' color={palette.text.primary}>
                {t('app-header.dark-mode-switch-lbl')}
              </Typography>
            </Stack>
            <UiSwitch checked={palette.mode === 'dark'} onChange={uiStore.togglePaletteMode} />
          </Stack>
          <MenuItem
            sx={menuItemSx}
            onClick={() => {
              disconnect()
              authStore.signOut()
            }}
          >
            <UiIcon name={Icons.LogoutCircleRLine} size={5} color={palette.error.dark} />
            <Typography variant='buttonMedium' color={palette.error.dark}>
              {t('app-header.disconnect-btn')}
            </Typography>
          </MenuItem>
        </Stack>
      </AppMenu>
    </>
  )
}
