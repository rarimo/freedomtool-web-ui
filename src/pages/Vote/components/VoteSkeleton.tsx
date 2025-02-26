import { Box, Divider, Paper, Skeleton, Stack, useTheme } from '@mui/material'

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
      <Stack
        component={Paper}
        sx={{ padding: 10, height: 'fit-content' }}
        spacing={5}
        divider={<Divider />}
      >
        <Stack spacing={3}>
          <UiTypographySkeleton variant='h3' typography={{ xs: 'h5', md: 'h3' }} width='60%' />
          <UiTypographySkeleton variant='body2' width='80%' />
        </Stack>
        <VoteDetailsSkeleton />
        <Stack spacing={6}>
          <UiTypographySkeleton variant='subtitle3' width={160} />
          <QuestionItemSkeleton />
        </Stack>
      </Stack>

      <Stack
        component={Paper}
        spacing={2}
        sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3, height: 'fit-content' }}
      >
        <Stack
          sx={{
            borderRadius: 4,
            boxShadow:
              '0px 16px 16px 0px rgba(58, 58, 58, 0.05), 0px 4px 4px 0px rgba(58, 58, 58, 0.05),0px 2px 2px 0px rgba(58, 58, 58, 0.05),0px 1px 1px 0px rgba(58, 58, 58, 0.05),0px 0px 0px 0.33px rgba(58, 58, 58, 0.05)',
          }}
        >
          <Skeleton
            sx={{
              width: 160,
              height: 160,
              borderRadius: 4,
            }}
          />
        </Stack>
        <UiTypographySkeleton variant='body3' width='50%' mb={{ xs: 8 }} mt={1} />

        <TopUpFormSkeleton />
      </Stack>
    </Box>
  )
}

function QuestionItemSkeleton() {
  const { palette } = useTheme()

  return (
    <Stack
      component={Paper}
      padding={0}
      border={`1px solid ${palette.action.active}`}
      boxShadow='0px 16px 16px 0px rgba(58, 58, 58, 0.05), 0px 4px 4px 0px rgba(58, 58, 58, 0.05),0px 2px 2px 0px rgba(58, 58, 58, 0.05),0px 1px 1px 0px rgba(58, 58, 58, 0.05),0px 0px 0px 0.33px rgba(58, 58, 58, 0.05)'
    >
      <Stack spacing={2} p={{ xs: 1, md: 6 }}>
        <UiTypographySkeleton variant='caption3' width={80} />
        <UiTypographySkeleton variant='h5' width={150} />
        <Stack spacing={2} mt={3}>
          <Skeleton width='100%' sx={{ borderRadius: 100, height: 32 }} />
          <Skeleton width='100%' sx={{ borderRadius: 100, height: 32 }} />
        </Stack>
      </Stack>
      <Divider sx={{ my: { xs: 4, md: 0 } }} />
      <Stack p={{ xs: 1, md: 6 }}>
        <UiTypographySkeleton width={50} variant='buttonSmall' />
      </Stack>
    </Stack>
  )
}

function VoteDetailsRowSkeleton() {
  return (
    <Stack direction='row' justifyContent='space-between'>
      <UiTypographySkeleton variant='body3' typography={{ xs: 'body4', md: 'body3' }} width='40%' />
      <UiTypographySkeleton variant='body3' typography={{ xs: 'body4', md: 'body3' }} width='20%' />
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
    <Stack spacing={4} width={300} alignItems='center'>
      <Skeleton variant='rectangular' width='100%' height={48} sx={{ borderRadius: 2 }} />
      <Skeleton variant='rectangular' width='100%' height={48} sx={{ borderRadius: 12 }} />
    </Stack>
  )
}
