import { debounce, isEqual } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'

import { updatePollDraft } from '@/db/services'

import { CreatePollSchema } from '../createPollSchema'
import { toPartialPollDraft } from '../helpers/pollDraftAdapters'

export default function useDebouncedPollDraftUpdate<T extends keyof CreatePollSchema>(
  fieldName: T,
  form: UseFormReturn<CreatePollSchema>,
  currentDraftId: number | null,
  debounceTime: number = 1_000,
) {
  const fieldData = useWatch({ control: form.control, name: fieldName })
  const prevRef = useRef(fieldData)

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (draftId: number, field: Partial<CreatePollSchema>) =>
          updatePollDraft(draftId, toPartialPollDraft(field)),
        debounceTime,
      ),
    [debounceTime],
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
