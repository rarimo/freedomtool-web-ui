import { alpha, Box, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AppLoader, ErrorView, LazyImage } from '@/common'
import AuthBlock from '@/common/AuthBlock'
import { PollDraftSchema } from '@/db/schemas'
import { deletePollDraft, getAllPollDrafts } from '@/db/services'
import { Icons, RoutePaths } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { queryClient } from '@/query'
import { useAuthState } from '@/store'
import { lineClamp } from '@/theme/helpers'
import { UiIcon } from '@/ui'

import EmptyPollsView from './components/EmptyPollsView'

const queryKey = 'drafts'

export default function DraftPolls() {
  const { t } = useTranslation()
  const { isAuthorized } = useAuthState()

  const {
    data: drafts,
    isLoading: isDraftsLoading,
    isLoadingError: isDraftsLoadingError,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: getAllPollDrafts,
    initialData: [],
  })

  const deleteDraft = async (id: number) => {
    try {
      await deletePollDraft(id)
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  if (!isAuthorized) {
    return (
      <Stack minWidth={350} mx='auto' mt={8}>
        <AuthBlock />
      </Stack>
    )
  }

  if (isDraftsLoading) {
    return <AppLoader />
  }

  if (isDraftsLoadingError) {
    return <ErrorView />
  }

  if (drafts.length === 0)
    return (
      <Stack maxWidth={{ md: 500 }} mx='auto'>
        <EmptyPollsView
          title={t('polls.draft-polls-empty-view-title')}
          description={t('polls.draft-polls-empty-view-description')}
        />
      </Stack>
    )

  return (
    <AnimatePresence>
      <Box
        layout
        component={motion.div}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 4,
        }}
      >
        {drafts.map(draft => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PollDraftCard {...draft} onDelete={deleteDraft} />
          </motion.div>
        ))}
      </Box>
    </AnimatePresence>
  )
}

interface PollDraftCardProps extends PollDraftSchema {
  onDelete: (id: number) => void
}

// id isn't equal index!
function PollDraftCard({ title, image, id, onDelete }: PollDraftCardProps) {
  const { palette } = useTheme()
  const [imageUrl, setImageUrl] = useState<string>('')
  const { t } = useTranslation()

  const deleteDraft = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(id ?? 0)
  }

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setImageUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
    setImageUrl(`images/globe-${palette.mode}.png`)
  }, [image, palette.mode])

  return (
    <Link
      to={`${RoutePaths.NewPoll}?draftId=${id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        whileFocus={{ scale: 0.95 }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 0.95 }}
        style={{ cursor: 'pointer' }}
      >
        <Stack
          position='relative'
          height={300}
          border={`1px solid ${palette.action.active}`}
          borderRadius={5}
          overflow='hidden'
          justifyContent='flex-end'
        >
          <LazyImage
            src={imageUrl}
            alt={title || t('polls.draft-polls-default-title', { id })}
            width='100%'
            height='100%'
            sx={{ position: 'absolute', top: 0 }}
          />

          <Stack
            position='absolute'
            zIndex={2}
            width='100%'
            spacing={5}
            p={5}
            borderRadius={4}
            bgcolor={palette.background.paper}
          >
            <Typography variant='h4' width='100%' sx={{ ...lineClamp(2) }}>
              {title || t('polls.draft-polls-default-title', { id })}
            </Typography>
          </Stack>

          <IconButton
            color='secondary'
            onClick={deleteDraft}
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              background: alpha(palette.common.black, 0.5),
              color: palette.common.white,
              '&:hover': {
                background: alpha(palette.common.black, 0.7),
                color: palette.common.white,
              },
            }}
          >
            <UiIcon size={4} name={Icons.DeleteBin6Line} />
          </IconButton>
        </Stack>
      </motion.div>
    </Link>
  )
}
