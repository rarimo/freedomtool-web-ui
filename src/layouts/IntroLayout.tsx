import { Box, Stack, useTheme } from '@mui/material'
import { PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { NetworkWarningProtector } from '@/common'
import { useWeb3Context } from '@/contexts/web3-context'
import { vh } from '@/theme/helpers'

const IntroLayout = ({ children }: PropsWithChildren) => {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()
  const { getNetworkConfig } = useWeb3Context()

  const networkConfig = useMemo(() => getNetworkConfig(), [getNetworkConfig])

  return (
    <Stack
      direction='row'
      height={{ md: vh(100) }}
      sx={{
        backgroundColor: palette.background.pure,
      }}
    >
      <Stack
        flex={1}
        sx={{
          [breakpoints.down('md')]: {
            mt: 5,
          },
        }}
      >
        <Box flex={1}>
          {children}
          <NetworkWarningProtector
            title={t('intro-layout.incorrect-network-title')}
            desc={t('intro-layout.incorrect-network-desc', {
              networkName: networkConfig.name,
            })}
          />
        </Box>
      </Stack>
    </Stack>
  )
}

export default IntroLayout
