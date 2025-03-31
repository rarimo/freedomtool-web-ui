import { BN } from '@distributedlab/tools'
import { BigNumberish } from 'ethers'
import { t } from 'i18next'
import { createContext, ReactNode, useContext, useState } from 'react'

import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents } from '@/enums'
import { bus, ErrorHandler, parseBigIntToInteger, predictVoteParams } from '@/helpers'
import { VoteAmountOverload, VoteCountOverload } from '@/types'

type VoteParamsContextType = {
  isCalculating: boolean
  votesAmount: BigNumberish
  votesCount: BigNumberish
  isEnoughBalance: boolean
  updateVoteParams: (params: VoteAmountOverload | VoteCountOverload) => Promise<void>
  resetParamsState: () => void
}

const VoteParamsContext = createContext<VoteParamsContextType>({
  isCalculating: false,
  votesAmount: '',
  votesCount: '',
  isEnoughBalance: false,
  updateVoteParams: async () => {},
  resetParamsState: () => {},
})

export const useVoteParamsContext = () => useContext(VoteParamsContext)

export const VoteParamsProvider = ({ children }: { children: ReactNode }) => {
  const [isCalculating, setIsCalculating] = useState(false)

  const [votesAmount, setVotesAmount] = useState<BigNumberish>('0')
  const [votesCount, setVotesCount] = useState<BigNumberish>('0')
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true)

  const { balance } = useWeb3Context()

  const updateVoteParams = async (params: VoteAmountOverload | VoteCountOverload) => {
    setIsCalculating(true)
    try {
      if (params.type === 'vote_predict_amount' && 'votesCount' in params) {
        const { votesCount, proposalId } = params
        const votesAmount = (await getVoteAmount(votesCount, proposalId)) as string
        const isEnoughBalance = checkBalanceSufficiency(votesAmount)

        setVotesAmount(votesAmount || '0')
        setVotesCount(votesCount)
        setIsEnoughBalance(isEnoughBalance)
        return
      }

      if (params.type === 'vote_predict_count_tx' && 'amount' in params) {
        const { amount, proposalId } = params
        const votesAmount = BN.fromRaw(amount).value
        const votesCount = (await getTokenAmount(votesAmount, proposalId)) as string
        const isEnoughBalance = checkBalanceSufficiency(votesAmount)

        setVotesAmount(votesAmount)
        setVotesCount(parseBigIntToInteger(votesCount) || '0')
        setIsEnoughBalance(isEnoughBalance)
        return
      }

      throw new Error(t('create-poll.vote-params-error'))
    } catch (error) {
      ErrorHandler.process(error)
      resetParamsState()
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

    const { amount_predict } = await predictVoteParams({
      type: 'vote_predict_amount',
      votesCount,
      proposalId,
    })

    return amount_predict
  }

  const getTokenAmount = async (amount: string, proposalId?: string): Promise<BigNumberish> => {
    if (Number(amount) <= 0) {
      bus.emit(BusEvents.error, {
        message: t('errors.invalid-vote-count'),
      })
      throw new Error(t('errors.invalid-vote-count'))
    }

    const { count_tx_predict } = await predictVoteParams({
      type: 'vote_predict_count_tx',
      amount: BN.fromRaw(amount).value,
      proposalId,
    })

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

  const resetParamsState = () => {
    setVotesAmount('0')
    setVotesCount('0')
    setIsEnoughBalance(true)
  }

  return (
    <VoteParamsContext.Provider
      value={{
        isCalculating,
        votesAmount,
        votesCount,
        isEnoughBalance,
        resetParamsState,
        updateVoteParams,
      }}
    >
      {children}
    </VoteParamsContext.Provider>
  )
}
