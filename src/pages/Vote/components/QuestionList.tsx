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

  return (
    <Stack spacing={6}>
      <Typography variant='subtitle3'>{t('vote.accepted-options-title')}</Typography>
      <Stack spacing={3}>
        {questions?.map(({ title, variants }, oIndex) => (
          <Accordion key={oIndex}>
            <AccordionSummary>
              <Typography variant='h6'>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mb: 4 }} />
              <Stack spacing={1}>
                {variants.map((variant, vIndex) => (
                  <Stack alignItems='center' spacing={3} direction='row' key={vIndex}>
                    <DotDivider />

                    <Typography>{variant}</Typography>
                    <Typography variant='body4' color={palette.text.secondary}>
                      {t('vote.votes-count', {
                        count: Number(proposal?.voteResults[oIndex][vIndex]),
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
