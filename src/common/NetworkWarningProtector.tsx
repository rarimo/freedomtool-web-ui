import { Button, Dialog, Stack, Typography, useTheme } from '@mui/material'
import { PropsWithChildren, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useWeb3Context } from '@/contexts/web3-context'
import { ErrorHandler } from '@/helpers'
import { UiDialogContent } from '@/ui'

type Props = {
  title?: string
  desc?: string
} & PropsWithChildren

export default function NetworkWarningProtector({ title, desc, children }: Props) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  const { isCorrectNetwork, isConnected, safeSwitchChain, getNetworkConfig } = useWeb3Context()

  const networkConfig = useMemo(() => getNetworkConfig(), [getNetworkConfig])

  const switchNetwork = useCallback(() => {
    try {
      safeSwitchChain(networkConfig.appKitChain)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [networkConfig.appKitChain, safeSwitchChain])

  if (!isConnected || isCorrectNetwork) {
    return children
  }

  return (
    <Dialog
      open={isConnected && !isCorrectNetwork}
      PaperProps={{
        noValidate: true,
        position: 'relative',
        sx: { width: 470 },
      }}
    >
      <UiDialogContent
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={6}
        px={6}
        py={8}
        textAlign='center'
      >
        <Stack spacing={2} alignItems='center'>
          <Typography variant='subtitle2'>{title || t('network-warning-modal.title')}</Typography>
          <Typography variant='body3' color={palette.text.secondary} maxWidth={360}>
            {desc ||
              t('network-warning-modal.description', {
                chainName: networkConfig.name,
              })}
          </Typography>
        </Stack>

        <Button variant='outlined' type='submit' fullWidth onClick={() => switchNetwork()}>
          {t('network-warning-modal.submit-lbl')}
        </Button>
      </UiDialogContent>
    </Dialog>
  )
}
