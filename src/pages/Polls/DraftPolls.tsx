import { Stack, Typography, useTheme } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppLoader, LazyImage } from '@/common'
import { RoutePaths } from '@/enums'
import { lineClamp } from '@/theme/helpers'

import { db, PollDraft } from '../NewPoll/db'
import EmptyPollsView from './components/EmptyPollsView'

export default function DraftPolls() {
  const drafts = useLiveQuery(() => db.drafts.toArray(), [])
  const { t } = useTranslation()

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
    <Stack>
      {drafts.map((item, index) => (
        <PollDraftCard {...item} key={index} />
      ))}
    </Stack>
  )
}

function PollDraftCard({ details, id }: PollDraft) {
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

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setImageUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setImageUrl(`/images/'globe-${palette.mode}.png`)
    }
  }, [image, palette.mode])

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
      onClick={goToDraft}
      onKeyDown={e => {
        if (e.key === 'Enter') goToDraft()
      }}
    >
      <LazyImage
        src={imageUrl}
        alt={title ?? `Draft #${id}`}
        width='100%'
        height='60%'
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
        <Stack spacing={4}>
          <Typography variant='h4' sx={{ ...lineClamp(2) }}>
            {details.title || `Draft #${id}`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
