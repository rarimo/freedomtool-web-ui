import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { DotDivider } from '@/common'
import { IParsedProposal, IQuestionIpfs } from '@/pages/CreateVote/types'

export default function QuestionList({
  proposal,
  questions,
}: {
  questions: IQuestionIpfs[]
  proposal: IParsedProposal | null
}) {
  const { t } = useTranslation()
  const { palette } = useTheme()

  if (!proposal) return null

  const getTotalVotesPerQuestion = (questionIndex: number) =>
    proposal.voteResults[questionIndex]?.reduce((acc, count) => acc + count, 0n) || 0n

  return (
    <Stack spacing={6}>
      <Typography variant='subtitle3'>{t('vote.accepted-options-title')}</Typography>
      <Stack spacing={3}>
        {questions?.map(({ title, variants }, qIndex) => (
          <Accordion key={qIndex}>
            <AccordionSummary>
              <Stack
                direction='row'
                width={1}
                alignItems='center'
                justifyContent='space-between'
                spacing={2}
              >
                <Typography variant='h6'>{title}</Typography>
                <Typography variant='body3' color={palette.text.secondary}>
                  {t('vote.votes-count', {
                    count: Number(getTotalVotesPerQuestion(qIndex)),
                  })}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mb: 4 }} />
              <Stack spacing={1}>
                {variants.map((variant, vIndex) => (
                  <Stack alignItems='center' spacing={3} direction='row' key={vIndex}>
                    <DotDivider />
                    <Typography>{variant}</Typography>

                    <Typography ml='auto' variant='body4' color={palette.text.secondary}>
                      {t('vote.votes-count', {
                        count: Number(proposal?.voteResults[qIndex][vIndex]),
                      })}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  )
}
