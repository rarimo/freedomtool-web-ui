import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Dialog,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { formatUnits, parseUnits } from 'ethers'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { DotsLoader } from '@/common'
import { NATIVE_CURRENCY } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents, Icons } from '@/enums'
import { bus, ErrorHandler } from '@/helpers'
import { useLoading, useProposalState } from '@/hooks'
import { useProposalBalanceForm } from '@/hooks/proposal-balance-form'
import { UiCheckVoteInput, UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'
import UiCheckAmountInput from '@/ui/UiCheckAmountInput'

import { topUpDefaultValues, TopUpSchema, topUpSchema } from '../topUpFormSchema'

export default function TopUpForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { breakpoints } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const { balance, rawProviderSigner } = useWeb3Context()
  const isMdDown = useMediaQuery(breakpoints.down('md'))

  const { addFundsToProposal } = useProposalState()

  const {
    control,
    handleSubmit,
    getValues,
    getFieldState,
    setValue,
    clearErrors,
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm<TopUpSchema>({
    defaultValues: topUpDefaultValues,
    mode: 'onChange',
    resolver: zodResolver(topUpSchema),
  })
  const { calculateAddFundsToProposalGasLimit } = useProposalState()
  const { palette, typography } = useTheme()

  const amount = watch('amount')

  const {
    data: estimatedGas,
    isLoading: isEstimating,
    isLoadingError: isEstimatingError,
  } = useLoading(
    null,
    async () => {
      if (!id) return
      const gasPrice = await rawProviderSigner?.provider.getFeeData()
      const gasLimit = await calculateAddFundsToProposalGasLimit(
        BigInt(id),
        parseUnits(amount || '0', 18).toString(),
      )

      return formatUnits((gasLimit || 0n) * (gasPrice?.gasPrice || 0n), 18)
    },

    {
      loadOnMount: Boolean(amount),
      loadArgs: [amount],
    },
  )

  const { isCalculating, updateFromAmount, updateFromVotes } = useProposalBalanceForm<
    TopUpSchema,
    'amount',
    'votesCount'
  >(
    {
      getValues,
      getFieldState,
      setValue,
      clearErrors,
    },
    'amount',
    'votesCount',
  )

  const submit = async (formData: TopUpSchema) => {
    if (!id) return
    try {
      const { amount } = formData
      await addFundsToProposal(id, parseUnits(amount, 18).toString())
      bus.emit(BusEvents.success, { message: t('vote.form.success-msg') })
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      reset()
    }
  }

  const isDisabled = isSubmitting || isCalculating

  const total = (parseUnits(amount || '0', 18) + parseUnits(estimatedGas || '0', 18)).toString()

  const renderGasEstimation = () => {
    if (!isEstimatingError && !isEstimating && !estimatedGas) return null

    return (
      <Stack
        width='100%'
        justifyContent='space-between'
        spacing={1}
        color={palette.text.secondary}
        direction='row'
        alignItems='center'
      >
        <Typography variant='body4'>{t('poll.top-up-form.total')}</Typography>
        {isEstimatingError ? (
          <Typography color={palette.error.dark}>{t('poll.top-up-form.estimate-error')}</Typography>
        ) : isEstimating ? (
          <DotsLoader />
        ) : (
          <Typography color={palette.text.primary} variant='subtitle6'>
            {formatUnits(total, 18)} {NATIVE_CURRENCY}
          </Typography>
        )}
      </Stack>
    )
  }

  return (
    <>
      <Button
        fullWidth
        sx={{
          color: palette.text.primary,
          background: palette.action.active,
          '&:hover, &:focus': {
            background: palette.action.hover,
          },
        }}
        startIcon={<UiIcon name={Icons.Plus} size={4} />}
        onClick={() => {
          reset()
          setIsOpen(true)
        }}
      >
        {t('poll.top-up-form.add-funds')}
      </Button>
      <Dialog fullWidth={isMdDown} open={isOpen} onClose={() => setIsOpen(false)}>
        <UiDialogTitle onClose={() => setIsOpen(false)}>Add Funds</UiDialogTitle>
        <UiDialogContent sx={{ width: { xs: '100%', md: 465 } }}>
          <Stack spacing={6} component='form' onSubmit={handleSubmit(submit)}>
            <Box
              sx={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gridAutoFlow: 'row',
              }}
              bgcolor={palette.action.active}
              p={4}
              borderRadius={5}
            >
              <Controller
                name='amount'
                control={control}
                render={({ field, fieldState }) => (
                  <UiCheckAmountInput
                    {...field}
                    disabled={isDisabled}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    maxValue={balance}
                    sx={{
                      height: 112,
                      input: {
                        position: 'absolute',
                        width: { md: '90%' },
                        py: 0,
                        pl: 1,
                        top: 50,
                      },
                    }}
                    endAdornmentSx={{ right: 20, bottom: 0 }}
                    onChange={e => {
                      field.onChange(e)
                      updateFromAmount()
                    }}
                  />
                )}
              />

              <Stack
                alignItems='center'
                justifyContent='center'
                sx={{
                  position: 'absolute',
                  color: palette.text.secondary,
                  background: palette.background.paper,
                  p: 4,
                  borderRadius: '100%',
                  width: 42,
                  height: 42,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: `2px solid ${palette.action.active}`,
                }}
              >
                {isCalculating ? (
                  <DotsLoader size={1} />
                ) : (
                  <UiIcon size={5} name={Icons.EqualLine} />
                )}
              </Stack>

              <Controller
                name='votesCount'
                control={control}
                render={({ field, fieldState }) => (
                  <UiCheckVoteInput
                    {...field}
                    disabled={isDisabled}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    sx={{
                      height: 108,
                      '.MuiTextField-root': {
                        border: 'none',
                      },
                      '.MuiFormHelperText-root': {
                        position: 'absolute',
                        right: 0,
                        maxWidth: 100,
                        top: 10,
                      },
                      '.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl':
                        {
                          minHeight: 'unset',
                          height: '100%',
                          typography: typography.subtitle3,
                          color: fieldState.error ? palette.error.dark : palette.text.primary,
                          overflow: 'hidden',
                          borderRadius: 4,
                        },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      input: {
                        position: 'absolute',
                        width: '80%',
                        mr: 'auto',
                        overflow: 'hidden',
                        bottom: 25,
                        py: 0,
                        pl: 1,
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography
                          sx={{ position: 'absolute', top: 20, left: 20 }}
                          variant='overline2'
                        >
                          {t('create-poll.votes-count-lbl')}
                        </Typography>
                      ),
                    }}
                    onChange={e => {
                      field.onChange(e)
                      updateFromVotes()
                    }}
                  />
                )}
              />
            </Box>
            <Stack justifyContent='space-between' direction='row'>
              {renderGasEstimation()}
            </Stack>
            <Divider />
            <Button disabled={isSubmitting} type='submit'>
              {t('poll.top-up-btn')}
            </Button>
          </Stack>
        </UiDialogContent>
      </Dialog>
    </>
  )
}
