import { useEvent } from '@reactuses/core'
import { debounce, isEqual } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'

import { ErrorHandler } from '@/helpers'

import { CreatePollSchema } from '../createPollSchema'
import { db } from '../db'

export default function useUpdateCreatePollFields<T extends keyof CreatePollSchema>(
  fieldName: T,
  form: UseFormReturn<CreatePollSchema>,
  currentDraftId: number | null,
  debounceTime: number = 1_000,
) {
  const fieldData = useWatch({ control: form.control, name: fieldName })
  const prevRef = useRef(fieldData)

  const updateDraftField = useEvent(async (draftId: number, field: Partial<CreatePollSchema>) => {
    try {
      await db.drafts.update(draftId, field)
    } catch (error) {
      ErrorHandler.process(error)
    }
  })

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (draftId: number, field: Partial<CreatePollSchema>) => updateDraftField(draftId, field),
        debounceTime,
      ),
    [updateDraftField, debounceTime],
  )

  useEffect(() => {
    if (currentDraftId && !isEqual(prevRef.current, fieldData)) {
      debouncedUpdate(currentDraftId, { [fieldName]: fieldData } as Partial<CreatePollSchema>)
      prevRef.current = fieldData
    }
    return () => {
      debouncedUpdate.cancel()
    }
  }, [currentDraftId, fieldData, fieldName, debouncedUpdate])
}
