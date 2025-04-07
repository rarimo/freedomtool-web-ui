import { Box, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material'

import { DotDivider } from '@/common'
import { qrCodeModalGridTemplateColumns } from '@/pages/Poll/components/QrCodePanel'
import { UiTypographySkeleton } from '@/ui'

export function QrCodePanelSkeleton() {
  return (
    <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
      <Stack direction='row' alignItems='center' spacing={2} width='100%'>
        <Skeleton width={112} height={112} sx={{ minWidth: 112 }} />
        <Stack alignItems='flex-start' width='100%' spacing={2}>
          <UiTypographySkeleton variant='subtitle5' width='50%' />
          <UiTypographySkeleton variant='body4' width='30%' />
        </Stack>
      </Stack>
      <Skeleton variant='circular' width={40} height={40} />
    </Stack>
  )
}

export function QrCodeModalListItemSkeleton() {
  const { breakpoints } = useTheme()

  const isMdUp = useMediaQuery(breakpoints.up('md'))

  return isMdUp ? (
    <Box display='grid' gridTemplateColumns={qrCodeModalGridTemplateColumns} alignItems='center'>
      <Stack direction='row' alignItems='center' spacing={3} width='100%'>
        <Skeleton width={48} height={48} sx={{ minWidth: 48 }} />
        <Stack alignItems='flex-start' width='100%'>
          <UiTypographySkeleton variant='subtitle6' width='80%' />
          <UiTypographySkeleton variant='body4' width='40%' />
        </Stack>
      </Stack>
      <UiTypographySkeleton variant='subtitle6' width='80%' />
      <Stack direction='row' alignItems='center' spacing={3}>
        <Skeleton variant='circular' width={40} height={40} />
        <Skeleton variant='circular' width={40} height={40} />
        <Skeleton variant='circular' width={40} height={40} />
      </Stack>
    </Box>
  ) : (
    <Stack spacing={2}>
      <Stack direction='row' justifyContent='space-between'>
        <Skeleton width={48} height={48} sx={{ minWidth: 48 }} />
        <Stack direction='row' alignItems='center' spacing={3}>
          <Skeleton variant='circular' width={40} height={40} />
          <Skeleton variant='circular' width={40} height={40} />
          <Skeleton variant='circular' width={40} height={40} />
        </Stack>
      </Stack>
      <Stack>
        <UiTypographySkeleton variant='subtitle6' width='70%' />
        <Stack direction='row' alignItems='center' spacing={1}>
          <UiTypographySkeleton variant='body4' width='100%' />
          <DotDivider />
          <UiTypographySkeleton variant='body4' width='100%' />
        </Stack>
      </Stack>
    </Stack>
  )
}
