import { Stack } from '@mui/material'

import AuthBlock from '@/common/AuthBlock'
import { useAuthState } from '@/store'

import CreatePollForm from './components/CreatePollForm'

export default function CreatePoll() {
  const { isAuthorized } = useAuthState()

  return (
    <Stack>
      {isAuthorized ? (
        <CreatePollForm />
      ) : (
        <Stack minWidth={350} mx='auto' mt={8}>
          <AuthBlock />
        </Stack>
      )}
    </Stack>
  )
}
