import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import {
  Control,
  DefaultValues,
  FieldErrorsImpl,
  FieldPath,
  FieldValues,
  useForm as useFormHook,
  UseFormHandleSubmit,
  type UseFormProps,
  UseFormRegister,
  UseFormReset,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'
import * as Yup from 'yup'

export type Form<T extends FieldValues> = {
  isFormDisabled: boolean
  getErrorMessage: (fieldName: FieldPath<T>) => string
  enableForm: () => void
  disableForm: () => void
  formState: T
  formErrors: FieldErrorsImpl<T>
  register: UseFormRegister<T>
  handleSubmit: UseFormHandleSubmit<T>
  setError: UseFormSetError<T>
  control: Control<T>
  setValue: UseFormSetValue<T>
  reset: UseFormReset<T>
}

export const useForm = <T extends Yup.AnyObjectSchema, R extends FieldValues>(
  defaultValues: R,
  schemaBuilder: (yup: typeof Yup) => T,
  useFormProps?: UseFormProps<R>,
): Form<R> => {
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const targetUseFormProps: UseFormProps<R> = {
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldUseNativeValidation: false,
    ...useFormProps,
  }

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
    setValue,
    reset,
  } = useFormHook<R>({
    defaultValues: defaultValues as DefaultValues<R>,
    resolver: yupResolver(schemaBuilder(Yup)),
    ...targetUseFormProps,
  })

  const getErrorMessage = (fieldName: FieldPath<R>): string => {
    return errors[fieldName]?.message?.toString() ?? ''
  }

  const disableForm = () => {
    setIsFormDisabled(true)
  }

  const enableForm = () => {
    setIsFormDisabled(false)
  }

  return {
    isFormDisabled,
    getErrorMessage,
    enableForm,
    disableForm,
    formState: watch(),
    formErrors: errors,
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    reset,
  }
}
