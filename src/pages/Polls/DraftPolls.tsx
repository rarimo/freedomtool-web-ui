import { alpha, Box, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppLoader, LazyImage } from '@/common'
import AuthBlock from '@/common/AuthBlock'
import { usePollDrafts } from '@/db/hooks'
import { PollDratSchema } from '@/db/schemas'
import { Icons, RoutePaths } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useAuthState } from '@/store'
import { lineClamp } from '@/theme/helpers'
import { UiIcon } from '@/ui'

import EmptyPollsView from './components/EmptyPollsView'

export default function DraftPolls() {
  const { drafts, deleteDraft } = usePollDrafts()
  const { t } = useTranslation()
  const { isAuthorized } = useAuthState()

  if (!isAuthorized) {
    return (
      <Stack minWidth={350} mx='auto' mt={8}>
        <AuthBlock />
      </Stack>
    )
  }

  /*
   * useLiveQuery returns undefined while loading,
   * and an empty array if no items are found.
   */
  if (drafts === undefined) {
    return <AppLoader />
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
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <PollDraftCard {...draft} onDelete={() => deleteDraft(draft.id ?? 0)} />
          </motion.div>
        ))}
      </Box>
    </AnimatePresence>
  )
}

interface PollDraftCardProps extends PollDratSchema {
  onDelete: () => Promise<void>
}

// id isn't equal index!
function PollDraftCard({ title, image, id, onDelete }: PollDraftCardProps) {
  const navigate = useNavigate()
  const { palette } = useTheme()
  const [imageUrl, setImageUrl] = useState<string>('')
  const { t } = useTranslation()

  const goToDraft = () => {
    navigate({
      pathname: RoutePaths.NewPoll,
      search: `?draftId=${String(id)}`,
    })
  }

  const deleteDraft = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!id) return
    try {
      await onDelete()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setImageUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setImageUrl(`images/globe-${palette.mode}.png`)
    }
  }, [image, palette.mode])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.4 }}
      style={{ cursor: 'pointer' }}
      onClick={goToDraft}
      onKeyDown={e => {
        if (e.key === 'Enter') goToDraft()
      }}
    >
      <Stack
        justifyContent='flex-end'
        position='relative'
        border='1px solid'
        borderColor={palette.action.active}
        borderRadius={5}
        overflow='hidden'
        height={300}
      >
        <LazyImage
          src={imageUrl}
          alt={title ?? t('polls.draft-polls-default-title', { id })}
          width='100%'
          height='100%'
          sx={{
            position: 'absolute',
            top: 0,
          }}
        />

        <Stack
          sx={{ position: 'absolute', zIndex: 2, width: 1 }}
          spacing={5}
          p={5}
          borderRadius={4}
          bgcolor={palette.background.paper}
        >
          <Typography width='100%' variant='h4' sx={{ ...lineClamp(2), display: 'block' }}>
            {title || t('polls.draft-polls-default-title', { id })}
          </Typography>
        </Stack>

        <IconButton
          color='secondary'
          sx={{
            position: 'absolute',
            background: alpha(palette.common.black, 0.5),
            color: palette.common.white,
            top: 15,
            right: 15,
            '&:hover': {
              background: alpha(palette.common.black, 0.7),
              color: palette.common.white,
            },
          }}
          onClick={deleteDraft}
        >
          <UiIcon size={4} name={Icons.DeleteBin6Line} />
        </IconButton>
      </Stack>
    </motion.div>
  )
}
