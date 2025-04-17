import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppLoader, LazyImage } from '@/common'
import AuthBlock from '@/common/AuthBlock'
import { Icons, RoutePaths } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useAuthState } from '@/store'
import { lineClamp } from '@/theme/helpers'
import { UiIcon } from '@/ui'

import { db, PollDraft } from '../NewPoll/db'
import EmptyPollsView from './components/EmptyPollsView'

export default function DraftPolls() {
  const drafts = useLiveQuery(() => db.drafts.toArray(), [])
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
        {drafts.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <PollDraftCard {...item} />
          </motion.div>
        ))}
      </Box>
    </AnimatePresence>
  )
}

interface PollDraftCardProps extends PollDraft {}

function PollDraftCard({ details, id }: PollDraftCardProps) {
  const navigate = useNavigate()
  const { palette } = useTheme()
  const [imageUrl, setImageUrl] = useState<string>('')

  const { image, title } = details

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
      await db.drafts.delete(id)
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
          alt={title ?? `Draft #${id}`}
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
          <Typography variant='h4' sx={{ ...lineClamp(2) }}>
            {details.title || `Draft #${id}`}
          </Typography>
        </Stack>

        <IconButton
          color='secondary'
          sx={{ position: 'absolute', top: 20, right: 20 }}
          onClick={deleteDraft}
        >
          <UiIcon size={5} name={Icons.DeleteBin6Line} />
        </IconButton>
      </Stack>
    </motion.div>
  )
}
