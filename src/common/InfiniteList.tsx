import { Button, Stack, useTheme } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { AppLoader, ErrorView, NoDataView } from '@/common'
import { Icons, LoadingStates } from '@/enums'
import { UiIcon, UiLineSpinner } from '@/ui'

import IntersectionAnchor from './IntersectionAnchor'

interface Props<D> extends PropsWithChildren {
  items: D[]
  loadingState: LoadingStates
  slots?: {
    noData?: ReactNode
    error?: ReactNode
    loading?: ReactNode
    nextLoading?: ReactNode
  }
  onRetry: () => void
  onLoadNext: () => void
}

export default function InfiniteList<D>({
  items,
  loadingState,
  children,
  slots,
  onRetry,
  onLoadNext,
}: Props<D>) {
  const { spacing, palette } = useTheme()
  const { t } = useTranslation()

  if (items.length > 0) {
    return (
      <Stack position='relative' spacing={4}>
        {children}
        {loadingState === LoadingStates.NextLoading ? (
          (slots?.nextLoading ?? (
            <Stack alignItems='center'>
              <AppLoader />
            </Stack>
          ))
        ) : loadingState === LoadingStates.Error ? (
          <Stack alignItems='center'>
            <Button variant='text' size='medium' onClick={onLoadNext}>
              {t('infinite-list.load-more-btn')}
            </Button>
          </Stack>
        ) : (
          <IntersectionAnchor bottom={spacing(50)} onIntersect={onLoadNext} />
        )}
      </Stack>
    )
  }

  if ([LoadingStates.Loading, LoadingStates.Initial].includes(loadingState)) {
    return (
      slots?.loading ?? (
        <Stack alignItems='center' p={{ xs: 20, md: 40 }}>
          <UiLineSpinner size={15} stroke={4} color={palette.text.secondary} />
        </Stack>
      )
    )
  }

  if (loadingState === LoadingStates.Error) {
    return (
      slots?.error ?? (
        <ErrorView
          sx={{ maxWidth: 320, mx: 'auto', mt: 8 }}
          title={t('infinite-list.error-title')}
          description={t('infinite-list.error-description')}
          action={
            <Button
              variant='outlined'
              size='medium'
              startIcon={<UiIcon name={Icons.ArrowCounterClockwise} size={4} />}
              onClick={onRetry}
            >
              {t('infinite-list.retry-btn')}
            </Button>
          }
        />
      )
    )
  }

  return slots?.noData ?? <NoDataView title={t('infinite-list.no-data-title')} />
}
