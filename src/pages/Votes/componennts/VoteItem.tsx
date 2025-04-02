import {
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useInterval } from '@reactuses/core'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'

import { Icons, RoutePaths } from '@/enums'
import { formatDateTime, formatTimeFromNow, parseProposalFromContract } from '@/helpers'
import { useIpfsLoading } from '@/hooks'
import { IVoteIpfs } from '@/types'
import { ProposalsState } from '@/types/contracts/ProposalState'
import { UiIcon, UiTypographySkeleton } from '@/ui'

const MAX_FETCH_TRIES = 3

export default function VoteItem({
  proposal,
  id,
}: {
  id: number
  proposal: ProposalsState.ProposalInfoStructOutput
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  const { cid, duration, startTimestamp } = parseProposalFromContract(proposal)
  const { data, isLoading, isLoadingError: isError, reload } = useIpfsLoading<IVoteIpfs>(cid)
  const [attempts, setAttempts] = useState(0)
  const navigate = useNavigate()

  const shouldStopRefetching = data || attempts >= MAX_FETCH_TRIES || isError

  useInterval(
    () => {
      reload()
      setAttempts(prev => prev + 1)
    },
    shouldStopRefetching ? null : 5_000,
  )

  const dateStyles = {
    expired: { bgcolor: palette.grey[100], color: palette.grey[900] },
    almost: { bgcolor: palette.error.lighter, color: palette.error.main },
    soon: { bgcolor: palette.warning.lighter, color: palette.warning.dark },
    enough: { bgcolor: palette.success.lighter, color: palette.success.main },
  }

  const now = Math.floor(Date.now() / 1_000)
  const endTimestamp = startTimestamp + duration
  const remainingTime = endTimestamp - now

  let currentStyle = dateStyles.enough

  // Already expired
  if (remainingTime <= 0) {
    currentStyle = dateStyles.expired
  }

  // Less than 3h
  if (remainingTime > 0 && remainingTime < 3 * 3_600) {
    currentStyle = dateStyles.almost
  }

  // Less than 24h
  if (remainingTime >= 3 * 3_600 && remainingTime < 24 * 3_600) {
    currentStyle = dateStyles.soon
  }

  if (isLoading) return <VoteItemSkeleton />
  if (isError) return <VoteItemErrorView onRetry={reload} />

  return (
    <motion.div
      whileFocus={{ scale: 0.95 }}
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.88 }}
    >
      <Stack
        justifyContent='center'
        component={Paper}
        spacing={4}
        sx={{ p: 4, mb: 2, cursor: 'pointer' }}
        divider={<Divider orientation='horizontal' flexItem />}
        onClick={() => navigate(generatePath(RoutePaths.Vote, { id: String(id) }))}
      >
        <Stack spacing={1}>
          <Typography maxWidth={200} noWrap textOverflow='ellipsis' variant='h4'>
            {data?.title || t('vote-item.no-title')}
          </Typography>
          <Typography
            maxWidth={200}
            noWrap
            textOverflow='ellipsis'
            variant='body4'
            color={palette.text.secondary}
          >
            {data?.description || t('vote-item.no-description')}
          </Typography>
        </Stack>

        <Stack
          color={palette.text.secondary}
          justifyContent='space-between'
          alignItems='center'
          direction='row'
        >
          <Tooltip
            slotProps={{
              popper: {
                sx: { maxWidth: 260 },
              },
            }}
            title={
              <Stack spacing={1}>
                <Typography variant='caption2'>
                  {t('vote-item.start-date', {
                    date: formatDateTime(startTimestamp),
                  })}
                </Typography>
                <Typography variant='caption2'>
                  {t('vote-item.end-date', {
                    date: formatDateTime(startTimestamp + duration),
                  })}
                </Typography>
              </Stack>
            }
          >
            <Stack
              direction='row'
              spacing={2}
              px={3}
              py={1}
              borderRadius={10}
              alignItems='center'
              {...currentStyle}
            >
              <UiIcon name={Icons.CalendarEventFill} size={4} color='inherit' />
              <Typography variant='caption3'>
                {formatTimeFromNow(endTimestamp, { suffix: true })}
              </Typography>
            </Stack>
          </Tooltip>
          <UiIcon name={Icons.ArrowRight} size={5} color={palette.text.secondary} />
        </Stack>
      </Stack>
    </motion.div>
  )
}

export function VoteItemSkeleton() {
  return (
    <Stack
      justifyContent='center'
      component={Paper}
      spacing={4}
      sx={{ p: 4, mb: 2 }}
      divider={<Divider orientation='horizontal' flexItem />}
    >
      <Stack spacing={1}>
        <UiTypographySkeleton width={200} textOverflow='ellipsis' variant='subtitle3' />

        <UiTypographySkeleton maxWidth={200} variant='body4' />
      </Stack>

      <Stack justifyContent='space-between' alignItems='center' direction='row'>
        <Skeleton height={24} width={88} sx={{ borderRadius: 10 }} />
      </Stack>
    </Stack>
  )
}

export function VoteItemErrorView({ onRetry }: { onRetry: () => void }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack
      component={Paper}
      height={141}
      spacing={4}
      sx={{ p: 4, mb: 2 }}
      justifyContent='center'
      divider={<Divider orientation='horizontal' flexItem />}
    >
      <Stack spacing={1}>
        <Typography variant='subtitle3'>{t('vote-item.error-title')}</Typography>
        <Typography variant='body4' color={palette.text.secondary}>
          {t('vote-item.error-description')}
        </Typography>
      </Stack>
      <IconButton color='error' sx={{ ml: 'auto' }} onClick={onRetry}>
        <UiIcon color={palette.text.secondary} name={Icons.Restart} size={5} />
      </IconButton>
    </Stack>
  )
}
