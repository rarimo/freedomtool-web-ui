import { BN } from '@distributedlab/tools'
import { BigNumberish, formatEther } from 'ethers'
import { t } from 'i18next'
import { useState } from 'react'

import { NATIVE_CURRENCY } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents } from '@/enums'
import { bus, ErrorHandler } from '@/helpers'
import { predictVoteAmount } from '@/pages/CreateVote/helpers'

interface CheckVoteAmountConfig {
  shouldUpdateHelperText?: boolean
}

export const useCheckVoteAmount = () => {
  const [isCalculating, setIsCalculating] = useState(false)
  const [helperText, setHelperText] = useState<string>('')
  const { balance } = useWeb3Context()

  const getVoteAmountDetails = async (
    votesCount: string | number,
    config: CheckVoteAmountConfig = { shouldUpdateHelperText: true },
  ) => {
    setIsCalculating(true)
    try {
      const votesAmount = await getVoteAmount(Number(votesCount))
      const isEnoughBalance = checkBalanceSufficiency(votesAmount)

      if (config.shouldUpdateHelperText) {
        updateHelperText(Number(votesCount), votesAmount)
      }

      return { isEnoughBalance, votesAmount }
    } catch (error) {
      ErrorHandler.process(error)
      return { isEnoughBalance: false, votesAmount: 0 }
    } finally {
      setIsCalculating(false)
    }
  }

  const getVoteAmount = async (votesCount: number): Promise<BigNumberish> => {
    if (votesCount <= 0) {
      bus.emit(BusEvents.error, {
        message: t('errors.invalid-vote-count'),
      })
      throw new Error(t('errors.invalid-vote-count'))
    }

    const {
      data: { amount },
    } = await predictVoteAmount(votesCount)

    return amount
  }

  const checkBalanceSufficiency = (amount: BigNumberish) => {
    try {
      const isEnoughBalance = BN.fromBigInt(amount).lte(BN.fromBigInt(balance))

      if (!isEnoughBalance) {
        bus.emit(BusEvents.error, {
          message: t('errors.not-enough-for-proposal'),
        })
        throw new Error(t('errors.not-enough-for-proposal'))
      }
      return true
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
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
    getVoteAmountDetails,

    helperText,
    updateHelperText,
    resetHelperText,

    getVoteAmount,
    checkBalanceSufficiency,
  }
}
