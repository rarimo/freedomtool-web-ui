import { BN } from '@distributedlab/tools'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { formatEther, parseUnits } from 'ethers'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'

import { DotDivider, DotsLoader } from '@/common'
import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents } from '@/enums'
import { ProposalStatus } from '@/enums/proposals'
import { bus, ErrorHandler, formatDateTime } from '@/helpers'
import { useIpfsLoading, useLoading, useProposalState } from '@/hooks'
import { UiAmountField } from '@/ui'

import { getPredictedVotesCount, parseProposalFromContract } from '../CreateVote/helpers'
import { IVoteIpfs } from '../CreateVote/types'

export default function Vote() {
  const { id } = useParams()
  const {
    addFundsToProposal,
    getProposalInfo,
    isError: contractError,
  } = useProposalState({ shouldFetchProposals: false })
  const [amount, setAmount] = useState<string>('0')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useTranslation()
  const { palette } = useTheme()
  const { balance } = useWeb3Context()

  const { data: proposal, isLoading: isProposalLoading } = useLoading(null, async () => {
    if (!id) return null
    const proposalFromContract = await getProposalInfo(Number(id))
    if (proposalFromContract) {
      return parseProposalFromContract(proposalFromContract)
    }
    return null
  })

  const {
    data: proposalMetadata,
    isLoading: metadataLoading,
    isLoadingError: metadataError,
  } = useIpfsLoading<IVoteIpfs>(proposal?.cid as string)

  const {
    data: voteCount,
    reload: reloadVoteCount,
    isLoading: isVoteCountLoading,
  } = useLoading(
    null,
    async () => {
      if (!id) return
      const response = await getPredictedVotesCount(id)
      return response.data.vote_count || 0
    },
    { silentError: true },
  )

  setInterval(() => reloadVoteCount, 60_000)

  const topUpVoteContract = async () => {
    setIsSubmitting(true)
    try {
      if (!id) return
      await addFundsToProposal(BigInt(id), parseUnits(amount, 18))
      bus.emit(BusEvents.success, {
        message: t('vote.success-msg'),
      })
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      setIsSubmitting(false)
      setAmount('0')
    }
  }

  const isEnoughBalance = useMemo(() => {
    if (!amount || isNaN(Number(amount))) return false

    try {
      const amountBn = BN.fromRaw(amount)
      return amountBn.lte(BN.fromBigInt(balance || 0n))
    } catch {
      return false
    }
  }, [amount, balance])

  if (isProposalLoading || metadataLoading || !proposal || !proposalMetadata) {
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

  const { duration, startTimestamp, status, voteResults, cid } = proposal
  const { acceptedOptions, title, description } = proposalMetadata

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
                {t('vote.remaining-votes')}
              </Typography>
              {isVoteCountLoading ? (
                <DotsLoader />
              ) : (
                <Typography variant='body2'>{voteCount}</Typography>
              )}
            </Stack>
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
              {acceptedOptions?.map(({ title, variants }, oIndex) => (
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
                              count: Number(voteResults[oIndex][vIndex]),
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
        </Stack>
      </Paper>

      <Paper sx={{ height: 'fit-content' }}>
        <Stack sx={{ padding: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={2} sx={{ textAlign: 'center', alignItems: 'center', marginBottom: 3 }}>
              {cid ? (
                <Stack
                  sx={{
                    width: 160,
                    height: 160,
                    backgroundColor: palette.common.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    border: `1px solid ${palette.action.active}`,
                  }}
                >
                  <QRCode value={cid} size={130} />
                </Stack>
              ) : (
                <Skeleton />
              )}
              <Typography variant='body2' color='textSecondary' sx={{ marginTop: 1 }}>
                {t('vote.qr-code-subtitle')}
              </Typography>
            </Stack>
            <UiAmountField
              value={amount ?? 0}
              minRows={0}
              minValue='0'
              disabled={isSubmitting}
              maxValue={formatEther(balance)}
              snapPoints={[5, 15, 30]}
              onChange={value => setAmount(value)}
            />

            <Button
              variant='contained'
              color='primary'
              fullWidth
              disabled={!Number(amount) || !isEnoughBalance || isSubmitting}
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
