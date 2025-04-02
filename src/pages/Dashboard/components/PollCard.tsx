import { Button, Divider, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { useInterval } from '@reactuses/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'

import { LazyImage } from '@/common'
import { Icons, RoutePaths } from '@/enums'
import { formatDateDM, getCountProgress, parseProposalFromContract } from '@/helpers'
import { useIpfsLoading } from '@/hooks'
import { lineClamp } from '@/theme/helpers'
import { IVoteIpfs } from '@/types'
import { ProposalsState } from '@/types/contracts/ProposalState'
import { UiIcon, UiTypographySkeleton } from '@/ui'

const MAX_FETCH_TRIES = 3

export default function PollCard({
  proposal,
  id,
}: {
  id: number
  proposal: ProposalsState.ProposalInfoStructOutput
}) {
  const navigate = useNavigate()

  const { palette } = useTheme()
  const { t } = useTranslation()

  const { cid, duration, startTimestamp, voteResults } = parseProposalFromContract(proposal)
  const {
    data,
    isLoading: isIpfsLoading,
    isLoadingError: isIpfsError,
    reload,
  } = useIpfsLoading<IVoteIpfs>(cid)
  const [attempts, setAttempts] = useState(0)

  const shouldStopRefetching = data || attempts >= MAX_FETCH_TRIES || isIpfsError

  const currentPollParticipants = Math.max(
    ...voteResults.map(results => results.reduce((sum, value) => sum + Number(value), 0)),
    0,
  )

  useInterval(
    () => {
      reload()
      setAttempts(prev => prev + 1)
    },
    shouldStopRefetching ? null : 5_000,
  )

  if (isIpfsLoading) return <PollCardSkeleton />
  if (isIpfsError) return <PollCardError onRetry={reload} />

  return (
    <Stack
      justifyContent='flex-end'
      position='relative'
      border='1px solid'
      borderColor={palette.action.active}
      borderRadius={5}
      overflow='hidden'
      height={390}
      onClick={() => navigate(generatePath(RoutePaths.Vote, { id: String(id) }))}
    >
      {/* TODO: use image from IPFS */}
      <LazyImage
        src='/public/image.png'
        alt={data?.title ?? 'poll image'}
        width='100%'
        height='60%'
        sx={{
          position: 'absolute',
          top: 0,
        }}
      />
      <Stack
        position='relative'
        spacing={5}
        p={5}
        borderRadius={4}
        bgcolor={palette.background.paper}
      >
        <Stack spacing={4}>
          <Typography variant='h4' sx={{ ...lineClamp(2) }}>
            {data?.title}
          </Typography>
          <Stack direction='row' alignItems='center' spacing={3} color={palette.text.secondary}>
            <UiIcon name={Icons.CalendarLine} size={5} />
            <Typography variant='body4'>
              {formatDateDM(startTimestamp)} - {formatDateDM(startTimestamp + duration)}
            </Typography>
          </Stack>
        </Stack>
        <Divider flexItem />
        <Stack spacing={2}>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='body4' color={palette.text.secondary}>
              {t('dashboard.poll-card.progress-lbl')}
            </Typography>
            <Typography variant='subtitle6'>
              {t('dashboard.poll-card.participants-lbl', {
                // TODO: fix progress count
                currentVotesCount: currentPollParticipants,
                totalVotes: 10,
              })}
            </Typography>
          </Stack>
          <Stack
            position='relative'
            width='100%'
            height={12}
            borderRadius={1000}
            bgcolor={palette.action.active}
            overflow='hidden'
          >
            <Stack
              position='absolute'
              top={0}
              left={0}
              height='100%'
              // TODO: fix progress count
              width={`${getCountProgress(5, currentPollParticipants)}%`}
              bgcolor={palette.primary.main}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export function PollCardSkeleton() {
  const { palette } = useTheme()

  return (
    <Stack
      justifyContent='flex-end'
      position='relative'
      border='1px solid'
      borderColor={palette.action.active}
      borderRadius={5}
      overflow='hidden'
      height={390}
    >
      <Skeleton
        height='60%'
        width='100%'
        sx={{
          position: 'absolute',
          top: 0,
        }}
      />
      <Stack
        position='relative'
        spacing={5}
        p={5}
        borderRadius={4}
        bgcolor={palette.background.paper}
      >
        <Stack spacing={4}>
          <UiTypographySkeleton variant='h4' width='70%' />
          <Stack direction='row' alignItems='center' spacing={3}>
            <Skeleton width={20} height={20} />
            <UiTypographySkeleton variant='body4' width={100} />
          </Stack>
        </Stack>
        <Divider flexItem />
        <Stack spacing={2}>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <UiTypographySkeleton variant='body4' width={60} />
            <UiTypographySkeleton variant='subtitle6' width={130} />
          </Stack>
          <Skeleton width='100%' />
        </Stack>
      </Stack>
    </Stack>
  )
}

export function PollCardError({ onRetry }: { onRetry: () => void }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack
      justifyContent='flex-end'
      position='relative'
      border='1px solid'
      borderColor={palette.action.active}
      borderRadius={5}
      overflow='hidden'
      height={390}
    >
      <Stack
        alignItems='center'
        justifyContent='center'
        bgcolor={palette.background.light}
        height='60%'
        width='100%'
        sx={{
          position: 'absolute',
          top: 0,
        }}
      >
        <Button
          size='small'
          color='error'
          onClick={onRetry}
          startIcon={<UiIcon name={Icons.Restart} size={4} />}
          sx={{
            width: 'fit-content',
          }}
        >
          {t('dashboard.poll-card.retry-btn')}
        </Button>
      </Stack>
      <Stack
        position='relative'
        spacing={5}
        p={5}
        borderRadius={4}
        bgcolor={palette.background.paper}
      >
        <Stack spacing={4}>
          <UiTypographySkeleton variant='h4' width='70%' />
          <Stack direction='row' alignItems='center' spacing={3}>
            <Skeleton width={20} height={20} />
            <UiTypographySkeleton variant='body4' width={100} />
          </Stack>
        </Stack>
        <Divider flexItem />
        <Stack spacing={2}>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <UiTypographySkeleton variant='body4' width={60} />
            <UiTypographySkeleton variant='subtitle6' width={130} />
          </Stack>
          <Skeleton width='100%' />
        </Stack>
      </Stack>
    </Stack>
  )
}
