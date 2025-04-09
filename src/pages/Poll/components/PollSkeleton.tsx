import { Box, Divider, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material'
import { motion } from 'framer-motion'

import { RoundedBackground } from '@/common'
import { DESKTOP_HEADER_HEIGHT } from '@/constants'
import UiTypographySkeleton from '@/ui/UiTypographySkeleton'

import { QrCodePanelSkeleton } from './QrCodePanelSkeleton'

export default function PollSkeleton() {
  const { breakpoints } = useTheme()
  const isMdDown = useMediaQuery(breakpoints.down('md'))

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gap: 0.5,
        gridTemplateColumns: { xs: '1fr', lg: '0.63fr 0.37fr' },
        height: `calc(100vh - ${DESKTOP_HEADER_HEIGHT}px - 2px)`,
      }}
    >
      <RoundedBackground
        sx={{
          alignItems: { lg: 'flex-end' },
          pr: { lg: 24.5 },
          [breakpoints.down('md')]: {
            p: 0,
            borderRadius: 0,
            m: 0,
            pb: 10,
          },
        }}
      >
        <Stack
          component={motion.div}
          maxWidth={{ lg: 656, xl: 720 }}
          width='100%'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Stack sx={{ height: 'fit-content' }} spacing={5}>
            <Stack spacing={5}>
              <Skeleton
                sx={{
                  aspectRatio: '2.6',
                  height: 'auto',
                  borderRadius: 5,
                  overflow: 'hidden',
                  position: 'relative',
                  [breakpoints.down('md')]: {
                    aspectRatio: '1.5',
                    borderRadius: 0,
                  },
                }}
              />

              <Stack mx={{ xs: 4, md: 0 }} spacing={{ xs: 6, md: 5 }}>
                <Skeleton width='100%' height={44} sx={{ borderRadius: 5 }} />
                {isMdDown && <QrCodePanelSkeleton />}
                <Skeleton width='100%' height={40} sx={{ borderRadius: 5 }} />

                {isMdDown ? (
                  <>
                    <VotesLeftProgressSkeleton />
                  </>
                ) : (
                  <>
                    <QuestionItemSkeleton progress={[60, 40]} />
                    <QuestionItemSkeleton progress={[20, 50, 30]} />
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </RoundedBackground>

      {!isMdDown && (
        <RoundedBackground sx={{ pl: 13, alignItems: 'flex-start' }}>
          <Stack
            component={motion.div}
            sx={{
              maxWidth: 368,
              height: 'fit-content',
              position: 'sticky',
              top: 50,
              width: '100%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <Stack
              width='100%'
              spacing={6}
              divider={<Divider orientation='horizontal' flexItem />}
              sx={{
                textAlign: 'center',
                alignItems: 'center',
                marginBottom: 3,
              }}
            >
              <QrCodePanelSkeleton />
              <Stack spacing={6} width='100%'>
                <VotesLeftProgressSkeleton />
                <Skeleton height={48} sx={{ borderRadius: 10 }} />
              </Stack>
              <PollDetailsSkeleton />
            </Stack>
          </Stack>
        </RoundedBackground>
      )}
    </Box>
  )
}

function VotesLeftProgressSkeleton() {
  const { palette } = useTheme()
  return (
    <Stack width='100%' spacing={2}>
      <Stack direction='row' justifyContent='space-between'>
        <UiTypographySkeleton width={60} variant='body4' />
        <UiTypographySkeleton width={100} variant='subtitle6' />
      </Stack>
      <Stack
        bgcolor={palette.action.active}
        width='100%'
        sx={{ borderRadius: 100, overflow: 'hidden' }}
      >
        <Skeleton width='80%' height={12} />
      </Stack>
    </Stack>
  )
}

function PollDetailsSkeleton() {
  return (
    <Stack width='100%' spacing={4}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Stack key={index} direction='row' justifyContent='space-between'>
          <UiTypographySkeleton variant='body4' width={80} />
          <UiTypographySkeleton variant='subtitle6' width={115} />
        </Stack>
      ))}
    </Stack>
  )
}

function QuestionItemSkeleton({ progress }: { progress: number[] }) {
  const { palette } = useTheme()

  return (
    <Stack bgcolor={palette.action.active} borderRadius={5}>
      <Stack spacing={2} p={{ xs: 3, md: 6 }}>
        <UiTypographySkeleton width={{ xs: 250, md: 500 }} variant='body3' />

        <Stack justifyContent='flex-start' mt={3}>
          <PollResultSkeleton progress={progress} />
        </Stack>
      </Stack>
    </Stack>
  )
}

function PollResultSkeleton({ progress }: { progress: number[] }) {
  const { palette } = useTheme()
  return (
    <Stack
      divider={<Divider flexItem orientation='horizontal' />}
      sx={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${palette.action.active}` }}
    >
      {progress.map((item, index) => (
        <Skeleton key={index} height={56} width={`${item}%`} />
      ))}
    </Stack>
  )
}
