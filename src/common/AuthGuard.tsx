import { useAppKit, useAppKitEvents } from '@reown/appkit/react'
import { JsonRpcSigner } from 'ethers'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { requestChallenge } from '@/api/modules/auth'
import { InstallMetamaskModal } from '@/common'
import { useWeb3Context, Web3ProviderContext } from '@/contexts/web3-context'
import { isMetamaskInstalled, isMobile } from '@/helpers'
import { authStore, useAuthState } from '@/store'

import SignatureConfirmationModal from './SignatureConfirmationModal'

export type AuthGuardRef = {
  verifyAuth: () => Promise<boolean>
}

type AuthWeb3Context = {
  addr: Web3ProviderContext['address']
  rawProviderSigner: Web3ProviderContext['rawProviderSigner']
}

const AuthGuard = forwardRef<AuthGuardRef>((_, ref) => {
  const [isInstallMetaMaskModalShown, setIsInstallMetaMaskModalShown] = useState(false)
  const [isSignatureConfirmationModalShown, setIsSignatureConfirmationModalShown] = useState(false)

  const { isAuthorized } = useAuthState()

  const connectionPromise = useRef<{
    resolve: (value: AuthWeb3Context) => void
    reject: () => void
  } | null>(null)
  const { address, isConnected, rawProviderSigner } = useWeb3Context()
  const { open } = useAppKit()
  const events = useAppKitEvents()

  const isMMInstalled = isMetamaskInstalled()
  const isMobileDevice = isMobile()

  const handleSignIn = useCallback(
    async (addr: string, rawProviderSigner: JsonRpcSigner | null) => {
      try {
        if (!rawProviderSigner) throw new Error('No provider signer')
        setIsSignatureConfirmationModalShown(true)
        const challenge = await requestChallenge(addr || address)
        const signature = await rawProviderSigner.signMessage(challenge)
        await authStore.signIn(addr || address, signature)
      } finally {
        setIsSignatureConfirmationModalShown(false)
      }
    },
    [address],
  )

  const handleVerification = useCallback(async () => {
    if (isMobileDevice && !isMMInstalled) {
      const link = `https://metamask.app.link/dapp/${window.location.origin}`

      window.open(link)
      return false
    }

    if (!isMMInstalled) {
      setIsInstallMetaMaskModalShown(true)
      return false
    }

    let web3Context: AuthWeb3Context = { addr: address, rawProviderSigner }
    try {
      if (!isConnected) {
        await open()

        const connect = new Promise<AuthWeb3Context>((resolve, reject) => {
          connectionPromise.current = { resolve, reject }
        })
        web3Context = await connect
      }

      if (!isAuthorized) {
        await handleSignIn(web3Context.addr, web3Context.rawProviderSigner ?? rawProviderSigner)
      }

      return true
    } catch (error) {
      authStore.signOut()
      throw error
    }
  }, [
    address,
    isMobileDevice,
    isMMInstalled,
    isConnected,
    isAuthorized,
    handleSignIn,
    open,
    rawProviderSigner,
  ])

  useEffect(() => {
    const eventType = events.data.event
    // properties.connected is being included only in the MODAL_CLOSE event
    const isConnectedAfterClose =
      events.data.event === 'MODAL_CLOSE' && events.data.properties.connected

    if (
      (eventType === 'CONNECT_SUCCESS' || isConnectedAfterClose) &&
      address &&
      rawProviderSigner
    ) {
      connectionPromise.current?.resolve({ addr: address, rawProviderSigner })
    }

    // Handling the case when user closes the modal before connection (or the error)
    if (!(eventType === 'MODAL_CLOSE' || eventType === 'CONNECT_ERROR')) return
    if (eventType === 'CONNECT_ERROR' || !isConnectedAfterClose) {
      connectionPromise.current?.reject()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, address, isConnected, rawProviderSigner])

  useImperativeHandle(
    ref,
    () => ({
      verifyAuth: () => {
        return handleVerification()
      },
    }),
    [handleVerification],
  )

  return (
    <>
      <InstallMetamaskModal
        open={isInstallMetaMaskModalShown}
        onClose={() => setIsInstallMetaMaskModalShown(false)}
      />
      <SignatureConfirmationModal open={isSignatureConfirmationModalShown} />
    </>
  )
})

export default AuthGuard
