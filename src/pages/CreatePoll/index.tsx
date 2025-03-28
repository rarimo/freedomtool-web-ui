import { Stack } from '@mui/material'

import AuthBlock from '@/common/AuthBlock'
import { useWeb3Context } from '@/contexts/web3-context'

import CreatePollForm from './components/CreatePollForm'

export default function C() {
  const { isConnected } = useWeb3Context()

  return (
    <Stack mx={{ md: 'auto' }} minWidth={{ md: 620 }}>
      {isConnected ? (
        <CreatePollForm />
      ) : (
        <Stack minWidth={350}>
          <AuthBlock />
        </Stack>
      )}
    </Stack>
  )
}
