import { useTranslation } from 'react-i18next'
import { z as zod } from 'zod'

export const useLocalizedZodSchema = () => {
  const { t } = useTranslation()

  const customErrorMap: zod.ZodErrorMap = (issue, ctx) => {
    const issueField = issue.path[issue.path.length - 1]

    if (issue.code === zod.ZodIssueCode.too_big) {
      if (issue.type === 'array') {
        return {
          message: t('validations.field-error-max-length', {
            field: issueField,
            max: issue.maximum,
          }),
        }
      }

      if (issue.type === 'string') {
        return {
          message: t('validations.field-error-max-length', {
            field: issueField,
            max: issue.maximum,
          }),
        }
      }

      if (issue.type === 'number' || issue.type === 'bigint') {
        return {
          message: t('validations.field-error-max-value', {
            field: issueField,
            max: issue.maximum,
          }),
        }
      }

      if (issue.type === 'date') {
        return {
          message: t('validations.field-error-max-length', {
            field: issueField,
            max: new Date(Number(issue.maximum)).toLocaleString(),
          }),
        }
      }
    }

    if (issue.code === zod.ZodIssueCode.too_small) {
      if (issue.type === 'array') {
        return {
          message: t('validations.field-error-min-array-length', {
            field: issueField,
            min: issue.minimum,
          }),
        }
      }

      if (issue.type === 'string') {
        if (String(ctx.data).length === 0) {
          return {
            message: t('validations.field-error-required', { field: issueField }),
          }
        } else {
          return {
            message: t('validations.field-error-min-length', {
              field: issueField,
              min: issue.minimum,
            }),
          }
        }
      }

      if (issue.type === 'number' || issue.type === 'bigint') {
        return {
          message: t('validations.field-error-more-than', {
            field: issueField,
            more: issue.minimum,
          }),
        }
      }

      if (issue.type === 'date') {
        return {
          message: t('validations.field-error-min-length', {
            field: issueField,
            min: new Date(Number(issue.minimum)).toLocaleString(),
          }),
        }
      }
    }

    if (issue.code === zod.ZodIssueCode.invalid_string && issue.validation === 'email') {
      return {
        message: t('validations.field-error-type-mismatch', {
          field: issueField,
          type: 'email',
        }),
      }
    }

    if (issue.code === zod.ZodIssueCode.invalid_enum_value) {
      return {
        message: t('validations.field-error-type-mismatch', {
          field: issueField,
          type: issue.options.join(', '),
        }),
      }
    }

    return { message: ctx.defaultError }
  }

  zod.setErrorMap(customErrorMap)
}
