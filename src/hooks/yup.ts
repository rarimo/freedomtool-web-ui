import { useTranslation } from 'react-i18next'
import { setLocale } from 'yup'

type ValidationMessageParams<T = Record<string, unknown>> = T & { field?: string }

export const useLocalisedYupScheme = () => {
  const { t } = useTranslation()

  setLocale({
    mixed: {
      required: t('validations.field-error-required'),
      notType: ({ type }) => {
        if (type === 'number') return t('validations.field-error-number-type-mismatch')
        return t('validations.field-error-type-mismatch', { type })
      },
    },
    string: {
      min: ({ min, field = 'This field' }: ValidationMessageParams<{ min: number }>) =>
        t('validations.field-error-min-length', { min, field }),
      max: ({ max, field = 'This field' }: ValidationMessageParams<{ max: number }>) =>
        t('validations.field-error-max-length', { max, field }),
    },
    number: {
      moreThan: ({ more }) => t('validations.field-error-more-than', { more }),
    },
  })
}
