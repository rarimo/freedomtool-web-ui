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

  return (
    <Stack
      elevation={8}
      component={Paper}
      padding={0}
      border={`1px solid ${palette.action.active}`}
      boxShadow='0px 16px 16px 0px rgba(58, 58, 58, 0.05), 0px 4px 4px 0px rgba(58, 58, 58, 0.05),0px 2px 2px 0px rgba(58, 58, 58, 0.05),0px 1px 1px 0px rgba(58, 58, 58, 0.05),0px 0px 0px 0.33px rgba(58, 58, 58, 0.05)'
    >
      <Stack spacing={2} p={6}>
        <Typography color={palette.text.secondary} variant='caption3'>
          {t('vote.question-name')}
        </Typography>
        <Typography variant='h5'>{title}</Typography>
        <Stack spacing={2} mt={3}>
          {variants.map((variant, oIndex) => {
            return (
              <LinearProgressWithLabel
                title={variant}
                progress={getCountProgress(totalCount, Number(voteResults[oIndex] || 0))}
                key={oIndex}
              />
            )
          })}
        </Stack>
      </Stack>
      <Divider />
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography padding={6} variant='buttonSmall'>
          {t('vote.votes-count', {
            count: totalCount,
          })}
        </Typography>
        <Button size='small' variant='text' sx={{ mr: 3 }}>
          {t('vote.show-all-options-btn')}
        </Button>
      </Stack>
    </Stack>
  )
}

function LinearProgressWithLabel({ title, progress }: { title: string; progress: number }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Tooltip title={title}>
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
          <Typography
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
          <LinearProgress variant='determinate' value={progress} color='secondary' />
        </Stack>
      </Stack>
    </Tooltip>
  )
}
