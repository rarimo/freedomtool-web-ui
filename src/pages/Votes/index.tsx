import { Box } from '@mui/material'
import { motion } from 'framer-motion'

import { InfiniteList } from '@/common'
import { useProposalState } from '@/hooks'

import VoteItem from './componennts/VoteItem'

const listSx = {
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 2,
  pb: { md: 10 },
}

const itemVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay, duration: 0.25 },
  }),
}

export default function Votes() {
  const { proposals, proposalsLoadingState, loadNextProposals, reloadProposals } = useProposalState(
    {
      shouldFetchProposals: true,
    },
  )

  return (
    <InfiniteList
      items={proposals}
      loadingState={proposalsLoadingState}
      onRetry={reloadProposals}
      onLoadNext={loadNextProposals}
    >
      <Box sx={listSx}>
        {proposals?.map(({ id, proposal }) => (
          <motion.div
            key={id}
            initial='hidden'
            animate='visible'
            variants={itemVariants}
            custom={Math.random() * 0.5}
          >
            <VoteItem proposal={proposal} id={id} />
          </motion.div>
        ))}
      </Box>
    </InfiniteList>
  )
}
