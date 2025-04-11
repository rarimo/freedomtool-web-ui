import { Box, Stack } from '@mui/material'
import { motion } from 'framer-motion'

import { DEFAULT_PAGE_LIMIT } from '@/api/clients'
import { InfiniteList } from '@/common'
import AuthBlock from '@/common/AuthBlock'
import { useWeb3Context } from '@/contexts/web3-context'
import { getProposals } from '@/helpers'
import { useMultiPageLoading } from '@/hooks'
import { useAuthState } from '@/store'
import { PollStatus } from '@/types'

import EmptyPollsView from './components/EmptyPollsView'
import PollCard from './components/PollCard'

export default function ActivePolls() {
  const { address } = useWeb3Context()
  const { isAuthorized } = useAuthState()

  const {
    data: proposals,
    loadingState: pollsLoadingState,
    reload: reloadPolls,
    loadNext,
  } = useMultiPageLoading(
    () =>
      getProposals({
        query: {
          filter: {
            creator: address,
            status: [PollStatus.Started, PollStatus.Waiting].join(','),
          },
        },
      }),
    {
      loadOnMount: Boolean(address),
      loadArgs: [address],
      pageLimit: DEFAULT_PAGE_LIMIT,
    },
  )

  if (!isAuthorized) {
    return (
      <Stack minWidth={350} mx='auto' mt={8}>
        <AuthBlock />
      </Stack>
    )
  }

  return (
    <InfiniteList
      items={proposals}
      loadingState={pollsLoadingState}
      onRetry={reloadPolls}
      onLoadNext={loadNext}
      slots={{
        noData: <EmptyPollsView />,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 4,
        }}
      >
        {proposals.map(proposal => (
          <motion.div
            key={proposal.id}
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { scale: 0.9, opacity: 0 },
              visible: (delay: number) => ({
                scale: 1,
                opacity: 1,
                transition: { delay, duration: 0.25 },
              }),
            }}
            custom={0.15}
          >
            <PollCard proposal={proposal} />
          </motion.div>
        ))}
      </Box>
    </InfiniteList>
  )
}
