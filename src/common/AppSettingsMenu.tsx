import {
  Divider,
  IconButton,
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
import { formatAddress, formatBalance } from '@/helpers'
import { uiStore } from '@/store'
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
        bgcolor={palette.action.active}
        px={4}
        py={{ xs: 1.5, md: 2.5 }}
        borderRadius={100}
        onClick={() => {}}
      >
        <Stack direction='row' spacing={2} alignItems='center'>
          <UiIcon name={Icons.Ethereum} size={5} />
          <Typography variant='subtitle6'>{formatBalance(balance)}</Typography>
          <Divider orientation='vertical' flexItem />
          {isMdUp && <Typography variant='subtitle6'>{formatAddress(address, 5)}</Typography>}
          <IconButton color='secondary' onClick={event => setAnchorEl(event.currentTarget)}>
            <UiIcon name={Icons.ArrowDownSLine} size={4} />
          </IconButton>
        </Stack>
      </Stack>
      <AppMenu
        anchorEl={anchorEl}
        id='dashboard-menu'
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
        <Stack divider={<Divider flexItem />}>
          {!isMdUp && (
            <Typography
              variant='subtitle6'
              sx={{
                py: 2,
                pr: 2,
              }}
            >
              {formatAddress(address, 12)}
            </Typography>
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
          <MenuItem sx={menuItemSx} onClick={() => disconnect()}>
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
