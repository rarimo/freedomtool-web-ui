import { Box } from '@mui/material'
import { motion } from 'framer-motion'

import { InfiniteList } from '@/common'
import { useWeb3Context } from '@/contexts/web3-context'
import { getProposals } from '@/helpers'
import { useMultiPageLoading } from '@/hooks'
import EmptyPollsView from '@/pages/Dashboard/components/EmptyPollsView'
import PollCard from '@/pages/Dashboard/components/PollCard'
import { PollStatus } from '@/types'

export default function FinishedPolls() {
  const { address } = useWeb3Context()

  const {
    data: proposals,
    loadingState,
    reload,
    loadNext,
  } = useMultiPageLoading(() =>
    getProposals({
      query: {
        filter: {
          creator: address,
          status: PollStatus.Ended,
        },
      },
    }),
  )

  return (
    <InfiniteList
      items={proposals}
      loadingState={loadingState}
      onRetry={reload}
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
            custom={Math.random() * 0.5}
          >
            <PollCard proposal={proposal} />
          </motion.div>
        ))}
      </Box>
    </InfiniteList>
  )
}
