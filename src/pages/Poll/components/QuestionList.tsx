import { Divider, LinearProgress, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getCountProgress, getTotalVotesPerQuestion } from '@/helpers'
import { ParsedContractProposal, QuestionIpfs } from '@/types'

export default function QuestionList({
  proposal,
  questions,
}: {
  questions: QuestionIpfs[]
  proposal: ParsedContractProposal | null
}) {
  if (!proposal) return null

  return (
    <Stack spacing={6}>
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
  voteResults: number[]
}) {
  const { palette } = useTheme()

  const maxIndex = useMemo(() => {
    if (!voteResults || voteResults.length === 0) return -1

    const _voteResults = voteResults.map(Number)

    const maxValue = Math.max(..._voteResults)
    const count = _voteResults.filter(option => option === maxValue).length

    return count === 1 ? _voteResults.indexOf(maxValue) : -1
  }, [voteResults])

  return (
    <Stack bgcolor={palette.action.active} borderRadius={5}>
      <Stack spacing={2} p={{ xs: 4, md: 6 }}>
        <Typography
          title={title}
          color={palette.text.primary}
          width={{ xs: 250, md: 500 }}
          noWrap
          textOverflow='ellipsis'
          variant='body3'
        >
          {title}
        </Typography>

        <Stack
          justifyContent='flex-start'
          mt={{ xs: 2, md: 3 }}
          divider={<Divider flexItem />}
          sx={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${palette.action.active}` }}
        >
          {variants.map((variant, oIndex) => {
            return (
              <LinearProgressWithLabel
                title={variant}
                isLeading={maxIndex === oIndex}
                count={voteResults[oIndex] || 0}
                progress={getCountProgress(voteResults[oIndex] || 0, totalCount)}
                key={oIndex}
              />
            )
          })}
        </Stack>
      </Stack>
    </Stack>
  )
}

function LinearProgressWithLabel({
  title,
  progress,
  isLeading,
  count,
}: {
  title: string
  progress: number
  isLeading: boolean
  count: number
}) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack sx={{ position: 'relative' }}>
      <Stack
        alignItems='flex-end'
        sx={{
          position: 'absolute',
          zIndex: 1,
          right: 15,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Typography variant='subtitle5' color={palette.text.primary}>
          {t('formats.percent', { value: progress.toFixed(2) })}
        </Typography>
        <Typography variant='body5' color={palette.text.primary}>
          {t('poll.participants', { count })}
        </Typography>
      </Stack>
      <Tooltip title={title}>
        <Typography
          maxWidth={{ xs: 150, md: 280 }}
          noWrap
          textOverflow='ellipsis'
          variant={isLeading ? 'subtitle5' : 'body4'}
          sx={{
            position: 'absolute',
            color: palette.text.primary,
            zIndex: 1,
            left: 15,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {title}
        </Typography>
      </Tooltip>
      <LinearProgress
        sx={{ borderRadius: 0, height: 56 }}
        variant='determinate'
        value={progress}
        color={isLeading ? 'primary' : 'secondary'}
      />
    </Stack>
  )
}
