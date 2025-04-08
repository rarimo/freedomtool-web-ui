import { time } from '@distributedlab/tools'
import { Stack, Typography, useTheme } from '@mui/material'
import { formatUnits, hexlify, parseUnits, randomBytes } from 'ethers'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DotsLoader } from '@/common'
import { NATIVE_CURRENCY } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { prepareAcceptedOptionsToContract, prepareVotingWhitelistData } from '@/helpers'
import { useLoading, useProposalState } from '@/hooks'
import { CreatePollSchema } from '@/pages/CreatePoll/createPollSchema'

export default function VoteParamsResult() {
  const { watch, getValues } = useFormContext<CreatePollSchema>()
  const { calculateCreateProposalGasLimit } = useProposalState()
  const { palette } = useTheme()
  const { t } = useTranslation()
  const { rawProviderSigner } = useWeb3Context()
  const amount = watch('settings.amount')

  const {
    data: estimatedGas,
    isLoading: isEstimating,
    isLoadingError: isEstimatingError,
  } = useLoading(
    null,
    async () => {
      const gasPrice = await rawProviderSigner?.provider.getFeeData()
      const startTimestamp = time(getValues('details.startDate')).timestamp
      const endTimestamp = time(getValues('details.endDate')).timestamp
      const duration = endTimestamp - startTimestamp
      const { maxAge, minAge, sex, nationalities } = getValues('criteria')

      const votingWhitelistData = prepareVotingWhitelistData({
        maxAge: Number(maxAge),
        minAge: Number(minAge),
        sex,
        nationalities,
        startTimestamp,
      })

      const acceptedOptions = prepareAcceptedOptionsToContract(getValues('questions'))

      const gasLimit = await calculateCreateProposalGasLimit({
        votingWhitelistData,
        acceptedOptions,
        description: hexlify(randomBytes(46)),
        amount: parseUnits(amount || '0', 18).toString(),
        startTimestamp,
        duration,
      })
      return formatUnits((gasLimit || 0n) * (gasPrice?.gasPrice || 0n), 18)
    },

    {
      loadOnMount: Boolean(amount),
      loadArgs: [amount],
    },
  )

  const renderGasEstimation = () => {
    if (!isEstimatingError && !isEstimating && !estimatedGas) return null

    return (
      <Stack spacing={1} color={palette.text.secondary} direction='row' alignItems='center'>
        <Typography variant='body4'>{t('create-poll.result.fee-lbl')}</Typography>
        {isEstimatingError ? (
          <Typography color={palette.error.dark}>
            {t('create-poll.result.estimate-error')}
          </Typography>
        ) : isEstimating ? (
          <DotsLoader />
        ) : (
          <Typography variant='subtitle6'>
            {estimatedGas} {NATIVE_CURRENCY}
          </Typography>
        )}
      </Stack>
    )
  }

  const total = (parseUnits(amount || '0', 18) + parseUnits(estimatedGas || '0', 18)).toString()

  return (
    <Stack minWidth={250} alignItems='flex-end'>
      {renderGasEstimation()}
      <Stack spacing={1} direction='row' justifyContent='center' alignItems='center'>
        <Typography variant='body2'>{t('create-poll.result.total')}</Typography>
        <Typography variant='subtitle4'>
          {formatUnits(total, 18)}
          {NATIVE_CURRENCY}
        </Typography>
      </Stack>
    </Stack>
  )
}
