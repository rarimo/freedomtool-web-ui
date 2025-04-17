import { debounce, isEqual } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'

import { usePollDrafts } from '@/db/hooks'

import { CreatePollSchema } from '../createPollSchema'
import { toPartialPollDraft } from '../helpers/pollDraftAdapters'

export default function useUpdateCreatePollFields<T extends keyof CreatePollSchema>(
  fieldName: T,
  form: UseFormReturn<CreatePollSchema>,
  currentDraftId: number | null,
  debounceTime: number = 1_000,
) {
  const { updateDraft } = usePollDrafts()
  const fieldData = useWatch({ control: form.control, name: fieldName })
  const prevRef = useRef(fieldData)

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (draftId: number, field: Partial<CreatePollSchema>) =>
          updateDraft(draftId, toPartialPollDraft(field)),
        debounceTime,
      ),
    [debounceTime, updateDraft],
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
