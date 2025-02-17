import { Stack } from '@mui/material'

import AuthBlock from '@/common/AuthBlock'
import { useWeb3Context } from '@/contexts/web3-context'

import CreateVoteForm from './components/CreateVoteForm'

export default function CreateVote() {
  const { isConnected } = useWeb3Context()

  return (
    <Stack alignItems='center'>
      {isConnected ? (
        <CreateVoteForm />
      ) : (
        <Stack minWidth={350}>
          <AuthBlock />
        </Stack>
      )}
    </Stack>
  )
}
