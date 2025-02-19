import { Button, Divider, Paper, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, Link } from 'react-router-dom'

import { RoutePaths } from '@/enums'
import { ProposalStatus } from '@/enums/proposals'
import { formatDateTime } from '@/helpers'
import { useIpfsLoading } from '@/hooks'
import { parseProposalFromContract } from '@/pages/CreateVote/helpers'
import { IVoteIpfs } from '@/pages/CreateVote/types'
import { ProposalsState } from '@/types/contracts/ProposalState'
import { UiTypographySkeleton } from '@/ui'

export default function VoteItem({
  proposal,
  id,
}: {
  id: number
  proposal: ProposalsState.ProposalInfoStructOutput
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  const { cid, duration, startTimestamp, status } = parseProposalFromContract(proposal)

  const { data, isLoading, isError } = useIpfsLoading<IVoteIpfs>(cid)

  const items = useMemo(
    () => [
      { label: t('vote-item.status-lbl'), value: ProposalStatus[status] },
      { label: t('vote-item.start-lbl'), value: formatDateTime(startTimestamp) },
      { label: t('vote-item.end-lbl'), value: formatDateTime(startTimestamp + duration) },
    ],
    [status, startTimestamp, duration, t],
  )

  if (isLoading) return <VoteItemSkeleton />
  if (isError) return null

  return (
    <Paper sx={{ p: 4, mb: 2 }}>
      <Stack spacing={1.5}>
        <Stack spacing={1}>
          <Typography maxWidth={200} noWrap textOverflow='ellipsis' variant='subtitle3'>
            {data?.title || t('vote-item.no-title')}
          </Typography>
          <Typography
            maxWidth={200}
            noWrap
            textOverflow='ellipsis'
            variant='body3'
            color={palette.text.secondary}
          >
            {data?.description || t('vote-item.no-description')}
          </Typography>
        </Stack>

        <Divider />

        <Stack mt={2} spacing={1.5}>
          {items.map((item, index) => (
            <Stack direction='row' justifyContent='space-between' key={index}>
              <Typography variant='body4'>{item.label}</Typography>
              <Typography variant='body4'>{item.value}</Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          component={Link}
          to={generatePath(RoutePaths.Vote, { id: String(id) })}
          size='small'
          variant='outlined'
          sx={{ mt: 3 }}
        >
          {t('vote-item.view-more-btn')}
        </Button>
      </Stack>
    </Paper>
  )
}

export function VoteItemSkeleton() {
  return (
    <Paper sx={{ p: 4, mb: 2 }}>
      <Stack spacing={1.5}>
        <Stack spacing={1}>
          <UiTypographySkeleton variant='h6' width='60%' />
          <UiTypographySkeleton variant='body2' width='80%' />
        </Stack>

        <Divider />

        <Stack mt={2} spacing={1.5}>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </Stack>

        <Skeleton width='100%' height={32} sx={{ mt: 3 }} />
      </Stack>
    </Paper>
  )
}

function SkeletonRow() {
  return (
    <Stack direction='row' justifyContent='space-between'>
      <UiTypographySkeleton variant='body4' width='20%' />
      <UiTypographySkeleton variant='body4' width='40%' />
    </Stack>
  )
}
