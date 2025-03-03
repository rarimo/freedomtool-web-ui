import { Box, Button, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { InfiniteList } from '@/common'
import { Icons, RoutePaths } from '@/enums'
import { useProposalState } from '@/hooks'
import { UiIcon } from '@/ui'

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

  const { breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const { t } = useTranslation()

  return (
    <Stack mt={12} spacing={8} divider={<Divider />}>
      <Stack alignItems='center' spacing={3} direction='row' justifyContent='space-between'>
        <Typography component='h1' variant='h2'>
          {t('votes.title')}
        </Typography>
        <Button
          component={Link}
          to={RoutePaths.VotesNew}
          size={isMdUp ? 'large' : 'small'}
          variant='outlined'
          startIcon={<UiIcon name={Icons.Plus} size={5} />}
        >
          {t('votes.create-new-vote-btn')}
        </Button>
      </Stack>
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
    </Stack>
  )
}
