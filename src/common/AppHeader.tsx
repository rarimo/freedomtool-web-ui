import {
  alpha,
  Button,
  Divider,
  IconButton,
  Stack,
  StackProps,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import { t } from 'i18next'
import { useEffect, useState } from 'react'

import { useWeb3Context } from '@/contexts/web3-context'
import { Icons } from '@/enums'
import { formatAddress } from '@/helpers'
import { useSignIn } from '@/hooks'
import { uiStore } from '@/store'
import { UiIcon } from '@/ui'

import AppLogo from './AppLogo'
export default function AppHeader(props: StackProps) {
  const { palette, zIndex } = useTheme()
  const { disconnect } = useWeb3Context()
  const { address } = useWeb3Context()
  const { handleSignIn, isLoading } = useSignIn()

  return (
    <Stack
      {...props}
      bgcolor={alpha(palette.background.default, 0.8)}
      component='header'
      sx={{
        position: 'fixed',
        py: { xs: 0, md: 5 },
        px: { xs: 5, lg: 0 },
        top: 0,
        left: 0,
        right: 0,
        zIndex: zIndex.appBar,
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        width: 1,

        ...props.sx,
      }}
    >
      <Stack
        sx={{
          flexDirection: { xs: 'row' },
          maxWidth: { md: 1192 },
          py: { xs: 4, lg: 0 },
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 1,
          mx: 'auto',
        }}
      >
        <AppLogo />

        <Stack
          direction='row'
          alignItems='center'
          spacing={4}
          divider={<Divider flexItem orientation='vertical' />}
        >
          <ThemeButton />
          {address ? (
            <Stack color={palette.text.secondary} direction='row' alignItems='center' spacing={2}>
              <Typography title={address} variant='buttonSmall'>
                {formatAddress(address)}
              </Typography>
              <Tooltip title={t('app-header.disconnect-tooltip')}>
                <IconButton
                  size='small'
                  sx={{ px: 1, color: palette.text.secondary }}
                  onClick={() => disconnect()}
                >
                  <UiIcon name={Icons.LogoutCircleRLine} size={4} />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Button size='small' sx={{ height: 34 }} disabled={isLoading} onClick={handleSignIn}>
              {t('app-header.connect-btn')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}

function ThemeButton() {
  const { palette } = useTheme()
  const [icon, setIcon] = useState(palette.mode === 'dark' ? Icons.Moon : Icons.Sun)

  useEffect(() => {
    setIcon(palette.mode === 'dark' ? Icons.Moon : Icons.Sun)
  }, [palette.mode])

  return (
    <IconButton key={palette.mode} onClick={uiStore.togglePaletteMode}>
      <motion.div
        key={palette.mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UiIcon name={icon} size={4} color={palette.text.primary} />
      </motion.div>
    </IconButton>
  )
}
