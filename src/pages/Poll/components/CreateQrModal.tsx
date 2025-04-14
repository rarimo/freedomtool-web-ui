import { time } from '@distributedlab/tools'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogProps,
  Divider,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { createQRCode } from '@/api/modules/qr-code'
import { BusEvents } from '@/enums'
import { bus, ErrorHandler, formatUtcDateTime } from '@/helpers'
import { UiDatePicker, UiDialogContent, UiDialogTitle, UiNumberField } from '@/ui'

import {
  createQrCodeDefaultValues,
  CreateQrCodeSchema,
  createQrCodeSchema,
} from '../createQrCodeSchema'

interface CreateQrModalProps extends Omit<DialogProps, 'open' | 'onClose'> {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const minDate = time().utc().add(1, 'd')

export default function CreateQrModal({ isOpen, onClose, onSuccess, ...rest }: CreateQrModalProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateQrCodeSchema>({
    defaultValues: createQrCodeDefaultValues,
    mode: 'onChange',
    resolver: zodResolver(createQrCodeSchema),
  })
  const { breakpoints } = useTheme()
  const isMdDown = useMediaQuery(breakpoints.down('md'))
  const { id } = useParams()
  const { t } = useTranslation()

  const submit = async (form: CreateQrCodeSchema) => {
    const { endDate, name, scanLimit } = form
    try {
      if (!id) return

      await createQRCode({
        type: 'links',
        attributes: {
          resource_id: id,
          ...(scanLimit ? { scan_limit: scanLimit } : {}),
          ...(endDate ? { expires_at: time(formatUtcDateTime(endDate)).timestamp } : {}),
          metadata: {
            proposal_id: Number(id),
            ...(name ? { name } : {}),
          },
        },
      })

      bus.emit(BusEvents.success, { message: t('poll.create-qr-modal.success-msg') })

      onSuccess()
      onClose()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  return (
    <Dialog
      component='form'
      fullWidth={isMdDown}
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
      {...rest}
    >
      <UiDialogTitle onClose={onClose}>{t('poll.create-qr-modal.title')}</UiDialogTitle>
      <UiDialogContent>
        <Stack width='100%' spacing={5} minWidth={{ md: 400 }}>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                disabled={isSubmitting}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                placeholder={t('poll.create-qr-modal.name-plh')}
                label={t('poll.create-qr-modal-name-lbl')}
              />
            )}
          />

          <Controller
            name='endDate'
            control={control}
            render={({ field, fieldState }) => (
              <UiDatePicker
                {...field}
                hasTime
                minDate={minDate}
                disabled={isSubmitting}
                errorMessage={fieldState.error?.message}
                label={t('poll.create-qr-modal.time-lbl')}
                slotProps={{
                  textField: {
                    placeholder: t('poll.create-qr-modal.time-plh'),
                  },
                }}
              />
            )}
          />

          <Controller
            name='scanLimit'
            control={control}
            render={({ field, fieldState }) => (
              <UiNumberField
                {...field}
                label={t('poll.create-qr-modal.limit-lbl')}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Stack>

        <Divider sx={{ my: 5 }} />

        <Button fullWidth type='submit' disabled={isSubmitting}>
          {t('poll.create-qr-modal.submit-btn')}
        </Button>
      </UiDialogContent>
    </Dialog>
  )
}
