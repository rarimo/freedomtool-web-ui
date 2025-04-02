/*
 * TODO: Remove and replace with context when main form
 * is ready AND TopUpForm is being implementing.
 *
 * This logic is in VoteParamsContext now
 */
import { BN } from '@distributedlab/tools'
import { BigNumberish, formatEther } from 'ethers'
import { t } from 'i18next'
import { useState } from 'react'

import { NATIVE_CURRENCY } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents } from '@/enums'
import { bus, ErrorHandler, getPredictedVotesAmount, getPredictedVotesCount } from '@/helpers'
import { VoteAmountOverload, VoteCountOverload } from '@/types'

type VoteParamsResult = { isEnoughBalance: boolean; votesCount: string; votesAmount: string }

type GetVoteParamsOverloads = {
  (params: VoteAmountOverload): Promise<VoteParamsResult>
  (params: VoteCountOverload): Promise<VoteParamsResult>
}

export const useCheckVoteAmount = () => {
  const [isCalculating, setIsCalculating] = useState(false)
  const [helperText, setHelperText] = useState<string>('')
  const { balance } = useWeb3Context()

  const updateVoteParams: GetVoteParamsOverloads = async params => {
    setIsCalculating(true)
    try {
      if (params.type === 'vote_predict_amount' && 'votesCount' in params) {
        const { votesCount, proposalId } = params
        const votesAmount = (await getVoteAmount(votesCount, proposalId)) as string
        const isEnoughBalance = checkBalanceSufficiency(votesAmount)

        // TODO: Remove
        updateHelperText(Number(votesCount), votesAmount)

        return { isEnoughBalance, votesCount, votesAmount }
      }

      if (params.type === 'vote_predict_count_tx' && 'amount' in params) {
        const { amount: votesAmount, proposalId } = params
        const votesCount = (await getTokenAmount(votesAmount, proposalId)) as string
        const isEnoughBalance = checkBalanceSufficiency(votesAmount)

        // TODO: Remove
        updateHelperText(Number(votesAmount), votesCount)

        return { isEnoughBalance, votesCount, votesAmount }
      }

      throw new Error('Wrong inputs')
    } catch (error) {
      ErrorHandler.process(error)
      return { isEnoughBalance: false, votesAmount: '0', votesCount: '0' }
    } finally {
      setIsCalculating(false)
    }
  }

  const getVoteAmount = async (votesCount: string, proposalId?: string): Promise<BigNumberish> => {
    if (Number(votesCount) <= 0) {
      bus.emit(BusEvents.error, {
        message: t('errors.invalid-vote-count'),
      })
      throw new Error(t('errors.invalid-vote-count'))
    }

    const { amount_predict } = await getPredictedVotesAmount(votesCount, proposalId)

    return amount_predict
  }

  const getTokenAmount = async (amount: string, proposalId?: string): Promise<BigNumberish> => {
    if (Number(amount) <= 0) {
      bus.emit(BusEvents.error, {
        message: t('errors.invalid-vote-count'),
      })
      throw new Error(t('errors.invalid-vote-count'))
    }

    const { count_tx_predict } = await getPredictedVotesCount(amount, proposalId)

    return count_tx_predict
  }

  const checkBalanceSufficiency = (amount: BigNumberish) => {
    try {
      const isEnoughBalance = BN.fromBigInt(amount).lte(BN.fromBigInt(balance))

      if (!isEnoughBalance) {
        throw new Error(t('errors.not-enough-for-proposal'))
      }
      return true
    } catch (error) {
      ErrorHandler.process(error, t('errors.not-enough-for-proposal'))
      return false
    }
  }

  const updateHelperText = (count: number, amount: BigNumberish) => {
    setHelperText(
      t('check-vote.helper-text', {
        currency: NATIVE_CURRENCY,
        currencyAmount: formatEther(amount),
        count,
      }),
    )
  }

  const resetHelperText = () => setHelperText('')

  return {
    isCalculating,
    updateVoteParams,

    helperText,
    updateHelperText,
    resetHelperText,

    getVoteAmount,
    getTokenAmount,
    checkBalanceSufficiency,
  }
}
