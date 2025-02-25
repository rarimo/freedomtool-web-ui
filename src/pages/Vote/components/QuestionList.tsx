import {
  Button,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getCountProgress, getTotalVotesPerQuestion } from '@/helpers'
import { IParsedProposal, IQuestionIpfs } from '@/types'

export default function QuestionList({
  proposal,
  questions,
}: {
  questions: IQuestionIpfs[]
  proposal: IParsedProposal | null
}) {
  const { t } = useTranslation()

  if (!proposal) return null

  return (
    <Stack spacing={6}>
      <Typography variant='subtitle3'>{t('vote.accepted-options-title')}</Typography>
      <Stack spacing={4}>
        {questions?.map(({ title, variants }, qIndex) => (
          <QuestionItem
            key={qIndex}
            title={title}
            variants={variants}
            voteResults={proposal?.voteResults[qIndex]}
            totalCount={Number(getTotalVotesPerQuestion(proposal, qIndex))}
          />
        ))}
      </Stack>
    </Stack>
  )
}

import { motion } from 'framer-motion'

import { hiddenScrollbar } from '@/theme/constants'

function QuestionItem({
  title,
  variants,
  totalCount,
  voteResults,
}: {
  title: string
  variants: string[]
  totalCount: number
  voteResults: bigint[]
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Stack
      component={Paper}
      padding={0}
      border={`1px solid ${palette.action.active}`}
      boxShadow='0px 16px 16px 0px rgba(58, 58, 58, 0.05), 0px 4px 4px 0px rgba(58, 58, 58, 0.05),0px 2px 2px 0px rgba(58, 58, 58, 0.05),0px 1px 1px 0px rgba(58, 58, 58, 0.05),0px 0px 0px 0.33px rgba(58, 58, 58, 0.05)'
    >
      <Stack spacing={2} p={{ xs: 1, md: 6 }}>
        <Typography color={palette.text.secondary} variant='caption3'>
          {t('vote.question-name')}
        </Typography>
        <Typography
          title={title}
          width={{ xs: 250, md: 500 }}
          noWrap
          textOverflow='ellipsis'
          variant='h5'
        >
          {title}
        </Typography>

        <Stack
          component={motion.div}
          initial={false}
          justifyContent='flex-start'
          animate={{ height: isExpanded ? 'auto' : 75 }}
          transition={{ duration: 0.3 }}
          sx={{ overflow: 'auto', ...hiddenScrollbar }}
          spacing={2}
          mt={3}
        >
          {variants.map((variant, oIndex) => (
            <LinearProgressWithLabel
              title={variant}
              progress={getCountProgress(totalCount, Number(voteResults[oIndex] || 0))}
              key={oIndex}
            />
          ))}
        </Stack>
      </Stack>
      <Divider sx={{ my: { xs: 4, md: 0 } }} />
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography p={{ xs: 1, md: 6 }} variant='buttonSmall'>
          {t('vote.votes-count', {
            count: totalCount,
          })}
        </Typography>
        {variants.length > 2 && (
          <Button
            size='small'
            variant='text'
            sx={{ mr: { xs: 0, md: 3 } }}
            onClick={() => setIsExpanded(prev => !prev)}
          >
            {isExpanded ? t('vote.hide-options-btn') : t('vote.show-all-options-btn')}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

function LinearProgressWithLabel({ title, progress }: { title: string; progress: number }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack>
      <Stack sx={{ position: 'relative' }}>
        <Typography
          variant='caption1'
          sx={{
            position: 'absolute',
            color: palette.primary.darker,
            zIndex: 1,
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {t('formats.percent', { value: progress })}
        </Typography>
        <Tooltip title={title}>
          <Typography
            maxWidth={{ xs: 150, md: 280 }}
            noWrap
            textOverflow='ellipsis'
            variant='buttonSmall'
            sx={{
              position: 'absolute',
              color: palette.primary.darker,
              zIndex: 1,
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {title}
          </Typography>
        </Tooltip>
        <LinearProgress variant='determinate' value={progress} color='secondary' />
      </Stack>
    </Stack>
  )
}
