import { Box, Divider, Paper, Skeleton, Stack } from '@mui/material'

import UiTypographySkeleton from '@/ui/UiTypographySkeleton'

export default function SkeletonPage() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3,
      }}
    >
      <Paper>
        <Stack sx={{ padding: 2 }} spacing={5} divider={<Divider />}>
          <Stack spacing={2}>
            <UiTypographySkeleton variant='h3' width='60%' />
            <UiTypographySkeleton variant='body2' width='80%' />
          </Stack>
          <VoteDetailsSkeleton />
          <Stack spacing={6}>
            <UiTypographySkeleton variant='subtitle3' width={160} />
            <Skeleton variant='rectangular' width='100%' height={50} />
          </Stack>
        </Stack>
      </Paper>

      <Stack
        component={Paper}
        spacing={2}
        sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3, height: 'fit-content' }}
      >
        <Skeleton
          sx={{
            width: 160,
            height: 160,
            borderRadius: 4,
          }}
        />
        <UiTypographySkeleton variant='body2' width='50%' mb={{ xs: 8 }} mt={1} />

        <TopUpFormSkeleton />
      </Stack>
    </Box>
  )
}

function VoteDetailsRowSkeleton() {
  return (
    <Stack direction='row' justifyContent='space-between'>
      <UiTypographySkeleton variant='body3' width='40%' />
      <UiTypographySkeleton variant='body3' width='20%' />
    </Stack>
  )
}

function VoteDetailsSkeleton() {
  return (
    <Stack spacing={2}>
      {Array.from({ length: 4 }).map((_, index) => (
        <VoteDetailsRowSkeleton key={index} />
      ))}
    </Stack>
  )
}

function TopUpFormSkeleton() {
  return (
    <Stack spacing={4} width={262} alignItems='center'>
      <Skeleton variant='rectangular' width='100%' height={48} sx={{ borderRadius: 2 }} />
      <Skeleton variant='rectangular' width='100%' height={48} sx={{ borderRadius: 12 }} />
    </Stack>
  )
}
