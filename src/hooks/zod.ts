import { useTranslation } from 'react-i18next'
import { z as zod } from 'zod'

export const useLocalizedZodSchema = () => {
  const { t } = useTranslation()

  const customErrorMap: zod.ZodErrorMap = (issue, ctx) => {
    const issueField = issue.path[issue.path.length - 1]

    switch (issue.code) {
      case zod.ZodIssueCode.too_big: {
        switch (issue.type) {
          case 'array':
          case 'string':
            return {
              message: t('validations.field-error-max-length', {
                field: issueField,
                max: issue.maximum,
              }),
            }
          case 'number':
          case 'bigint':
            return {
              message: t('validations.field-error-max-value', {
                field: issueField,
                max: issue.maximum,
              }),
            }
          case 'date':
            return {
              message: t('validations.field-error-max-length', {
                field: issueField,
                max: new Date(Number(issue.maximum)).toLocaleString(),
              }),
            }
        }
        break
      }

      case zod.ZodIssueCode.too_small: {
        switch (issue.type) {
          case 'array':
            return {
              message: t('validations.field-error-min-array-length', {
                field: issueField,
                min: issue.minimum,
              }),
            }
          case 'string':
            return String(ctx.data).length === 0
              ? { message: t('validations.field-error-required', { field: issueField }) }
              : {
                  message: t('validations.field-error-min-length', {
                    field: issueField,
                    min: issue.minimum,
                  }),
                }
          case 'number':
          case 'bigint':
            return {
              message: t('validations.field-error-more-than', {
                field: issueField,
                more: issue.minimum,
              }),
            }
          case 'date':
            return {
              message: t('validations.field-error-min-length', {
                field: issueField,
                min: new Date(Number(issue.minimum)).toLocaleString(),
              }),
            }
        }
        break
      }

      case zod.ZodIssueCode.invalid_string:
        if (issue.validation === 'email') {
          return {
            message: t('validations.field-error-type-mismatch', {
              field: issueField,
              type: 'email',
            }),
          }
        }
        break

      case zod.ZodIssueCode.invalid_enum_value:
        return {
          message: t('validations.field-error-type-mismatch', {
            field: issueField,
            type: issue.options.join(', '),
          }),
        }

      case zod.ZodIssueCode.invalid_type:
        if (issue.expected === 'integer') {
          return {
            message: t('validations.field-error-integer', {
              field: issueField,
            }),
          }
        }
        break
    }

    return { message: ctx.defaultError }
  }

  zod.setErrorMap(customErrorMap)
}
