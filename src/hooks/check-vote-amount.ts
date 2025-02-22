import { BN } from '@distributedlab/tools'
import { BigNumberish, parseUnits } from 'ethers'
import { t } from 'i18next'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'

import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents } from '@/enums'
import { bus, ErrorHandler } from '@/helpers'
import { predictVoteAmount } from '@/pages/CreateVote/helpers'

export interface UseCheckVoteAmount {
  isCalculating: boolean
  amount: bigint
  setAmount: Dispatch<SetStateAction<bigint>>
  checkVoteAmount: (votesCount: number) => Promise<boolean>
}

export const useCheckVoteAmount = () => {
  const [isCalculating, setIsCalculating] = useState(false)
  const { balance } = useWeb3Context()
  // `amountRef` stores the latest vote amount to avoid using outdated values in async operations.
  const amountRef = useRef<BigNumberish>(BN.fromBigInt(0).value)

  const checkVoteAmount = useCallback(
    async (votesCount: number) => {
      setIsCalculating(true)

      try {
        if (votesCount <= 0) {
          bus.emit(BusEvents.error, {
            message: t('errors.invalid-vote-count'),
          })
          throw new Error(t('errors.invalid-vote-count'))
        }

        const {
          data: { amount },
        } = await predictVoteAmount(votesCount)

        const isEnoughBalance = BN.fromBigInt(amount).lte(BN.fromBigInt(balance))

        if (!isEnoughBalance) {
          bus.emit(BusEvents.error, {
            message: t('errors.not-enough-for-proposal'),
          })
          throw new Error(t('errors.not-enough-for-proposal'))
        }

        amountRef.current = parseUnits(String(amount), 18)
        return true
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        amountRef.current = 0
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
    amountRef,
  }
}
