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

          <Stack spacing={3}>
            <Stack direction='row' justifyContent='space-between'>
              <UiTypographySkeleton variant='body2' width='40%' />
              <UiTypographySkeleton variant='body2' width='20%' />
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <UiTypographySkeleton variant='body2' width='40%' />
              <UiTypographySkeleton variant='body2' width='20%' />
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <UiTypographySkeleton variant='body2' width='40%' />
              <UiTypographySkeleton variant='body2' width='20%' />
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <UiTypographySkeleton variant='body2' width='40%' />
              <UiTypographySkeleton variant='body2' width='20%' />
            </Stack>
          </Stack>

          <Stack spacing={3}>
            <UiTypographySkeleton variant='subtitle1' width='60%' />
            <Skeleton variant='rectangular' width='100%' height={50} />
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ height: 'fit-content' }}>
        <Stack sx={{ padding: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={2} sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3 }}>
              <Skeleton variant='rectangular' width={160} height={160} sx={{ borderRadius: 4 }} />
              <UiTypographySkeleton variant='body2' width='40%' />
            </Stack>
            <Skeleton variant='rectangular' width='100%' height={48} sx={{ borderRadius: 12 }} />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
