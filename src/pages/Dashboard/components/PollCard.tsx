import { Button, Divider, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'

import { LazyImage } from '@/common'
import AbstractBackground from '@/common/AbstractBackground'
import { Icons, RoutePaths } from '@/enums'
import { formatDateDM, getCountProgress, getIpfsImageSrc } from '@/helpers'
import { lineClamp } from '@/theme/helpers'
import { Proposal } from '@/types'
import { UiIcon, UiTypographySkeleton } from '@/ui'

export default function PollCard({ proposal }: { proposal: Proposal }) {
  const navigate = useNavigate()

  const { palette } = useTheme()
  const { t } = useTranslation()

  const {
    id,
    start_timestamp,
    end_timestamp,
    votes_count,
    remaining_votes_count,
    metadata: { title, imageCid },
  } = proposal

  return (
    <Stack
      component={motion.div}
      justifyContent='flex-end'
      position='relative'
      border='1px solid'
      borderColor={palette.action.active}
      borderRadius={5}
      overflow='hidden'
      height={390}
      sx={{ cursor: 'pointer' }}
      whileFocus={{ scale: 0.95 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 0.95 }}
      onClick={() => navigate(generatePath(RoutePaths.Poll, { id: String(id) }))}
    >
      {imageCid ? (
        <LazyImage
          src={getIpfsImageSrc(imageCid)}
          alt={title ?? 'Poll image'}
          width='100%'
          height='60%'
          sx={{
            position: 'absolute',
            top: 0,
          }}
        />
      ) : (
        <AbstractBackground
          backgrounds={[
            palette.additional.gradient2,
            palette.additional.gradient3,
            palette.additional.gradient4,
          ]}
          sx={{
            position: 'absolute',
            top: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
        />
      )}
      <Stack
        sx={{ position: 'absolute', zIndex: 2, width: 1 }}
        spacing={5}
        p={5}
        borderRadius={4}
        bgcolor={palette.background.paper}
      >
        <Stack spacing={4}>
          <Typography variant='h4' sx={{ ...lineClamp(2) }}>
            {title}
          </Typography>
          <Stack direction='row' alignItems='center' spacing={3} color={palette.text.secondary}>
            <UiIcon name={Icons.CalendarLine} size={5} />
            <Typography variant='body4'>
              {formatDateDM(start_timestamp)} – {formatDateDM(end_timestamp)}
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
                currentVotesCount: remaining_votes_count ?? 0,
                totalVotes: votes_count ?? 0,
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
              width={`${getCountProgress(remaining_votes_count, votes_count)}%`}
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
