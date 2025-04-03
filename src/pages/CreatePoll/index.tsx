import { Stack } from '@mui/material'

import AuthBlock from '@/common/AuthBlock'
import { useAuthState } from '@/store'

import CreatePollForm from './components/CreatePollForm'

export default function CreatePoll() {
  const { isAuthorized } = useAuthState()

  return (
    <Stack mx={{ md: 'auto' }} minWidth={{ md: 620 }}>
      {isAuthorized ? (
        <CreatePollForm />
      ) : (
        <Stack minWidth={350}>
          <AuthBlock />
        </Stack>
      )}
    </Stack>
  )
}
