import { BN } from '@distributedlab/tools'
import { parseUnits } from 'ethers'
import { t } from 'i18next'
import { useCallback, useState } from 'react'

import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents } from '@/enums'
import { bus, ErrorHandler } from '@/helpers'
import { getVoteAmount } from '@/pages/CreateVote/helpers'

export const useCheckVoteAmount = () => {
  const [isCalculating, setIsCalculating] = useState(false)
  const [amount, setAmount] = useState<bigint>(0n)
  const { balance } = useWeb3Context()

  const checkVoteAmount = useCallback(
    async (votesCount: number) => {
      if (votesCount <= 0) {
        bus.emit(BusEvents.error, {
          message: t('errors.invalid-vote-count'),
        })
        throw new Error(t('errors.invalid-vote-count'))
      }

      setIsCalculating(true)
      try {
        const {
          data: { amount },
        } = await getVoteAmount(votesCount)
        const isEnoughBalance = BN.fromBigInt(amount).lte(BN.fromBigInt(balance))

        if (!isEnoughBalance) {
          bus.emit(BusEvents.error, {
            message: t('errors.not-enough-for-proposal'),
          })
          throw new Error(t('errors.not-enough-for-proposal'))
        }

        setAmount(parseUnits(String(1), 18))
        return true
      } catch (error) {
        ErrorHandler.process(error)
        return false
      } finally {
        setIsCalculating(false)
      }
    },
    [balance],
  )

  return {
    checkVoteAmount,
    isCalculating,
    amount,
  }
}
