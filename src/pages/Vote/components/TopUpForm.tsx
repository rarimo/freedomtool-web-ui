import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Dialog, Divider, Stack, Typography, useTheme } from '@mui/material'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { NATIVE_CURRENCY } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { BusEvents, Icons } from '@/enums'
import { bus, ErrorHandler } from '@/helpers'
import { useProposalState } from '@/hooks'
import { useProposalBalanceForm } from '@/hooks/proposal-balance-form'
import { UiCheckVoteInput, UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'
import UiCheckAmountInput from '@/ui/UiCheckAmountInput'

import { topUpDefaultValues, TopUpSchema, topUpSchema } from './topUpFormSchema'

export default function TopUpForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const { balance } = useWeb3Context()

  const { addFundsToProposal } = useProposalState()

  const {
    control,
    handleSubmit,
    getValues,
    getFieldState,
    setValue,
    clearErrors,
    formState: { isSubmitting },
    reset,
  } = useForm<TopUpSchema>({
    defaultValues: topUpDefaultValues,
    mode: 'onChange',
    resolver: zodResolver(topUpSchema),
  })
  const { palette, typography } = useTheme()

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

  return (
    <>
      <Button
        fullWidth
        sx={{
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
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <UiDialogTitle onClose={() => setIsOpen(false)}>Title</UiDialogTitle>
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
                    onChange={e => {
                      field.onChange(e)
                      updateFromAmount()
                    }}
                  />
                )}
              />

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
                      height: 118,
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
              <Typography color={palette.text.secondary}>Total fee:</Typography>
              {/* TODO: Add gas estimate */}
              <Typography color={palette.text.secondary}>0.0007 {NATIVE_CURRENCY}</Typography>
            </Stack>
            <Divider />
            <Button disabled={isSubmitting} type='submit'>
              {t('vote.form.top-up-button')}
            </Button>
          </Stack>
        </UiDialogContent>
      </Dialog>
    </>
  )
}
