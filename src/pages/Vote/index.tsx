import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { DotDivider } from '@/common'
import { ProposalStatus } from '@/enums/proposals'
import { formatDateTime } from '@/helpers'
import { useIpfsLoading, useProposalState } from '@/hooks'
import { UiAmountField } from '@/ui'

import { parseProposalFromContract } from '../CreateVote/helpers'
import { IParsedProposal, IVoteIpfs } from '../CreateVote/types'

export default function Vote() {
  const { id } = useParams()
  const {
    addFundsToProposal,
    getProposalInfo,
    isError: contractError,
    isLoading: contractLoading,
  } = useProposalState({ shouldFetchProposals: false })
  const [proposal, setProposal] = useState<IParsedProposal | null>(null)
  const [cid, setCid] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>('0')
  const { t } = useTranslation()
  const { palette } = useTheme()

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return

      const proposalFromContract = await getProposalInfo(Number(id))
      if (proposalFromContract) {
        const proposal = parseProposalFromContract(proposalFromContract)
        setProposal(proposal)
        setCid(proposal.cid)
      }
    }

    fetchProposal()
  }, [getProposalInfo, id])

  const {
    data: proposalMetadata,
    isLoading: metadataLoading,
    isError: metadataError,
  } = useIpfsLoading<IVoteIpfs>(cid)

  const topUpVoteContract = async () => {
    if (!id) return
    await addFundsToProposal(BigInt(id), amount)
  }

  if (contractLoading || metadataLoading || !proposal || !proposalMetadata) {
    return (
      <Stack direction='row' justifyContent='center' alignItems='center' sx={{ height: '100vh' }}>
        <CircularProgress />
      </Stack>
    )
  }

  // TODO: Add error block
  if (contractError || metadataError) {
    return (
      <Stack direction='row' justifyContent='center' alignItems='center' sx={{ height: '100vh' }}>
        <Typography variant='h6' color='error'>
          Error loading proposal data.
        </Typography>
      </Stack>
    )
  }

  const { duration, startTimestamp, status } = proposal
  const { acceptedOptions, title, description } = proposalMetadata

  console.log(!!Number(amount))

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3,
      }}
    >
      <Paper>
        <Stack sx={{ padding: 2 }} spacing={5} divider={<Divider />}>
          <Stack spacing={2}>
            <Typography variant='h3'>{title}</Typography>
            <Typography variant='body2' color={palette.text.secondary}>
              {description}
            </Typography>
          </Stack>

          <Stack spacing={3}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant='body2' color={palette.text.secondary}>
                {t('vote.status')}
              </Typography>
              <Typography variant='body2'>{ProposalStatus[status]}</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant='body2' color={palette.text.secondary}>
                {t('vote.start-date')}
              </Typography>
              <Typography variant='body2'>{formatDateTime(startTimestamp)}</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant='body2' color={palette.text.secondary}>
                {t('vote.end-date')}
              </Typography>
              <Typography variant='body2'>{formatDateTime(startTimestamp + duration)}</Typography>
            </Stack>
          </Stack>

          <Stack spacing={6}>
            <Typography variant='subtitle3'>{t('vote.accepted-options-title')}</Typography>
            <Stack spacing={3}>
              {acceptedOptions?.map(({ title, variants }, key) => (
                <Accordion key={key}>
                  <AccordionSummary>
                    <Typography variant='h6'>{title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Divider sx={{ mb: 4 }} />
                    <Stack spacing={1}>
                      {variants.map((variant, index) => (
                        <Stack alignItems='center' spacing={3} direction='row' key={index}>
                          <DotDivider />
                          <Typography>{variant}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ height: 'fit-content' }}>
        <Stack sx={{ padding: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={2} sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3 }}>
              <Box sx={{ width: 160, height: 160, backgroundColor: 'gray' }}></Box>
              <Typography variant='body2' color='textSecondary' sx={{ marginTop: 1 }}>
                {t('vote.qr-code-subtitle')}
              </Typography>
            </Stack>
            <UiAmountField
              value={amount}
              snapPoints={[5, 15, 30]}
              onChange={value => setAmount(value)}
            />

            <Button
              variant='contained'
              color='primary'
              fullWidth
              disabled={!Number(amount)}
              sx={{ padding: '12px', fontSize: '16px' }}
              onClick={topUpVoteContract}
            >
              {t('vote.amount-btn')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
