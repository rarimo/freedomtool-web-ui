import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

import { InfiniteList } from '@/common'
import { ProposalStatus } from '@/enums/proposals'
import { useProposalState } from '@/hooks'
import PollCard from '@/pages/Dashboard/components/PollCard'

export default function ActivePolls() {
  const { proposals, proposalsLoadingState, loadNextProposals, reloadProposals } = useProposalState(
    {
      shouldFetchProposals: true,
    },
  )

  const activePolls = useMemo(
    () =>
      proposals.filter(
        proposal =>
          Number(proposal.proposal.status) === ProposalStatus.Started ||
          Number(proposal.proposal.status) === ProposalStatus.Waiting,
      ),
    [proposals],
  )

  return (
    <InfiniteList
      items={proposals}
      loadingState={proposalsLoadingState}
      onRetry={reloadProposals}
      onLoadNext={loadNextProposals}
    >
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 4,
        }}
      >
        {activePolls.map(({ id, proposal }) => (
          <motion.div
            key={id}
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
            <PollCard proposal={proposal} id={id} />
          </motion.div>
        ))}
      </Box>
    </InfiniteList>
  )
}
