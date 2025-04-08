import { BN } from '@distributedlab/tools'
import { useDebounceFn } from '@reactuses/core'
import { formatUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { FieldPath, FieldValues, PathValue, useFormContext } from 'react-hook-form'

import { ErrorHandler, getPredictedVotesAmount, getPredictedVotesCount } from '@/helpers'

export const useProposalBalanceForm = <
  TFieldValues extends FieldValues,
  TAmountField extends FieldPath<TFieldValues>,
  TVotesField extends FieldPath<TFieldValues>,
>(
  form: Pick<
    ReturnType<typeof useFormContext<TFieldValues>>,
    'getValues' | 'getFieldState' | 'setValue' | 'clearErrors'
  >,
  amountField: TAmountField,
  votesField: TVotesField,
) => {
  const { getValues, getFieldState, setValue, clearErrors } = form

  const [isCalculating, setIsCalculating] = useState(false)

  const { run: debouncedCountUpdate } = useDebounceFn(async () => {
    const isValid = !getFieldState(amountField).invalid

    if (isValid) {
      try {
        setIsCalculating(true)
        const { count_tx_predict } = await getPredictedVotesCount(
          BN.fromRaw(getValues(amountField)).value,
        )
        clearErrors(votesField)
        setValue(votesField, Number(count_tx_predict) as PathValue<TFieldValues, TVotesField>)
      } catch (error) {
        ErrorHandler.process(error)
      } finally {
        setIsCalculating(false)
      }
    }
  }, 500)

  const { run: debouncedAmountUpdate } = useDebounceFn(async () => {
    const isValid = !getFieldState(votesField).invalid

    if (isValid) {
      try {
        setIsCalculating(true)
        const { amount_predict } = await getPredictedVotesAmount(String(getValues(votesField)))
        clearErrors(amountField)

        setValue(
          amountField,
          formatUnits(amount_predict, 18) as PathValue<TFieldValues, TAmountField>,
        )
      } catch (error) {
        ErrorHandler.process(error)
      } finally {
        setIsCalculating(false)
      }
    }
  }, 500)

  useEffect(() => {
    setTimeout(() => {
      clearErrors(amountField)
      clearErrors(votesField)
    }, 0)
  }, [clearErrors, amountField, votesField])

  return {
    isCalculating,
    updateFromAmount: debouncedCountUpdate,
    updateFromVotes: debouncedAmountUpdate,
  }
}
