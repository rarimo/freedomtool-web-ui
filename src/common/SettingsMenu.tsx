import {
  Divider,
  IconButton,
  IconButtonProps,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AppMenu } from '@/common/index'
import { useWeb3Context } from '@/contexts/web3-context'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

import AppSettings from './AppSettings'

export default function SettingsMenu({ ...rest }: IconButtonProps) {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()
  const { address, disconnect } = useWeb3Context()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  return (
    <>
      <Tooltip title={t('app-navbar.settings-tooltip')} placement='right' enterDelay={500}>
        <IconButton
          {...rest}
          sx={{
            px: { xs: 2.5, md: 4 },
            py: { xs: 2.5, md: 3 },
            borderRadius: { xs: 100, md: 3 },
            backgroundColor: anchorEl
              ? palette.action.active
              : { xs: palette.action.active, md: 'transparent' },
            color: anchorEl ? palette.text.primary : palette.text.secondary,
            '&:hover': {
              backgroundColor: anchorEl ? palette.action.active : palette.action.hover,
              color: palette.text.primary,
            },
            ...rest.sx,
          }}
          onClick={event => setAnchorEl(event.currentTarget)}
        >
          <UiIcon
            name={anchorEl ? Icons.Settings4Fill : Icons.Settings4Line}
            size={5}
            color='inherit'
          />
        </IconButton>
      </Tooltip>
      <AppMenu
        anchorEl={anchorEl}
        id='settings-menu'
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        MenuListProps={{ sx: { width: 234 } }}
        sx={{
          transform: 'translateY(40px)',
          [breakpoints.up('md')]: {
            transform: 'translateY(-28px)',
          },
        }}
        onClose={() => setAnchorEl(null)}
      >
        <AppSettings>
          {Boolean(address) && (
            <>
              <Divider />
              <MenuItem
                component={Stack}
                direction='row'
                alignItems='center'
                spacing={3}
                sx={{ minHeight: 36, p: 2, m: 0 }}
                onClick={() => {
                  disconnect()
                }}
              >
                <UiIcon name={Icons.LogoutCircleRLine} color={palette.error.dark} size={5} />
                <Typography variant='buttonMedium' color={palette.error.dark}>
                  {t('app-navbar.logout-lbl')}
                </Typography>
              </MenuItem>
            </>
          )}
        </AppSettings>
      </AppMenu>
    </>
  )
}
