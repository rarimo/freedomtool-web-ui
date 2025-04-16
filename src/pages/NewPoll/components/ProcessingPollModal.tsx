import { Button, Dialog, DialogProps, Stack, Typography, useTheme } from '@mui/material'
import { useInterval } from '@reactuses/core'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, Link } from 'react-router-dom'

import { Icons, RoutePaths } from '@/enums'
import { spinAnimation } from '@/theme/constants'
import { UiIcon } from '@/ui'

import { ProcessingPollStep } from '../constants'

interface Props extends DialogProps {
  step: ProcessingPollStep
  proposalId: string | null
}

const progressMilestones: {
  step: ProcessingPollStep
  estimatedTime: number
}[] = [
  { step: ProcessingPollStep.Image, estimatedTime: 1000 },
  { step: ProcessingPollStep.Metadata, estimatedTime: 500 },
  { step: ProcessingPollStep.Proposal, estimatedTime: 12_000 },
  { step: ProcessingPollStep.QrCode, estimatedTime: 500 },
  { step: ProcessingPollStep.Indexing, estimatedTime: 7_500 },
]

const UPDATE_PROGRESS_INTERVAL = 100

export default function ProcessingPollModal({ step, proposalId, ...rest }: Props) {
  const [progress, setProgress] = useState(0)
  const { breakpoints } = useTheme()

  const totalEstimatedTime = progressMilestones.reduce((acc, item) => acc + item.estimatedTime, 0)

  const calculateAggregatedProgress = useCallback(
    (stepIndex: number) => {
      const aggregatedTime = progressMilestones
        .slice(0, stepIndex)
        .reduce((acc, item) => acc + item.estimatedTime, 0)

      return (aggregatedTime / totalEstimatedTime) * 100
    },
    [totalEstimatedTime],
  )

  useInterval(
    () => {
      const currentIndex = progressMilestones.findIndex(item => item.step === step)
      if (currentIndex === -1) return

      const delta = (UPDATE_PROGRESS_INTERVAL / totalEstimatedTime) * 100
      const maxStepProgress = calculateAggregatedProgress(currentIndex + 1)
      setProgress(prev => Math.min(prev + delta, maxStepProgress))
    },
    step === ProcessingPollStep.Live ? null : UPDATE_PROGRESS_INTERVAL,
  )

  useEffect(() => {
    const currentIndex = progressMilestones.findIndex(item => item.step === step)
    if (currentIndex === -1) return

    setProgress(calculateAggregatedProgress(currentIndex))
  }, [step, calculateAggregatedProgress])

  return (
    <Dialog
      {...rest}
      PaperProps={{
        noValidate: true,
        position: 'relative',
        ...rest.PaperProps,
        sx: {
          width: 470,
          p: 12,
          ...rest.PaperProps?.sx,
          [breakpoints.down('md')]: {
            px: 4,
            py: 8,
          },
        },
      }}
    >
      {step === ProcessingPollStep.Live ? (
        <LiveStep proposalId={proposalId} />
      ) : (
        <ProgressStep progress={progress} />
      )}
    </Dialog>
  )
}

function ProgressStep({ progress }: { progress: number }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack alignItems='center' spacing={6} textAlign='center'>
      <Stack bgcolor={palette.action.active} p={5} borderRadius={100}>
        <UiIcon
          name={Icons.LoaderFill}
          size={8}
          color={palette.text.secondary}
          sx={{
            animation: `${spinAnimation} 1.2s infinite linear`,
          }}
        />
      </Stack>
      <Stack spacing={4}>
        <Typography variant='h3' color={palette.text.primary}>
          {t('create-poll.processing-modal.progress-title')}
        </Typography>
        <Typography variant='body3' color={palette.text.secondary}>
          {t('create-poll.processing-modal.progress-description')}
        </Typography>
      </Stack>
      <Stack spacing={2} px={4} width='100%'>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Typography variant='body4' color={palette.text.secondary}>
            {t('create-poll.processing-modal.progress-lbl')}
          </Typography>
          <Typography variant='subtitle6' color={palette.text.primary}>
            {t('formats.percent', { value: progress.toFixed(0) })}
          </Typography>
        </Stack>
        <Stack
          position='relative'
          width='100%'
          height={12}
          borderRadius={1000}
          bgcolor={palette.action.active}
          overflow='hidden'
        >
          <Stack
            position='absolute'
            top={0}
            left={0}
            height='100%'
            width={`${progress}%`}
            bgcolor={palette.primary.main}
            sx={{
              transition: 'width 250ms ease-in-out',
              willChange: 'width',
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}

function LiveStep({ proposalId }: { proposalId: string | null }) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack alignItems='center' spacing={6} textAlign='center'>
      <Stack bgcolor={palette.primary.main} p={5} borderRadius={100}>
        <UiIcon name={Icons.CheckFill} size={8} color={palette.common.black} />
      </Stack>

      <Stack spacing={4}>
        <Typography variant='h3' color={palette.text.primary}>
          {t('create-poll.processing-modal.live-title')}
        </Typography>
        <Typography variant='body3' color={palette.text.secondary} sx={{ maxWidth: 260 }}>
          {t('create-poll.processing-modal.live-description')}
        </Typography>
      </Stack>
      {!!proposalId && (
        <Button component={Link} to={generatePath(RoutePaths.Poll, { id: proposalId })} fullWidth>
          {t('create-poll.processing-modal.live-view-btn')}
        </Button>
      )}
    </Stack>
  )
}
