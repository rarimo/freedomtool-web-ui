import { useOnceEffect } from '@reactuses/core'
import { useCallback, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { usePollDrafts } from '@/db/hooks'

import { createPollDefaultValues, CreatePollSchema } from '../createPollSchema'
import { fromPollDraft, toPollDraft } from '../helpers/pollDraftAdapters'
import useDebouncedPollDraftUpdate from './debounced-poll-draft-update'

const DRAFT_ID_KEY = 'draftId'

export function useCreatePollDraft(form: UseFormReturn<CreatePollSchema>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addDraft, getDraft, deleteDraft } = usePollDrafts()

  const currentDraftId = useMemo(() => {
    const param = searchParams.get(DRAFT_ID_KEY)
    return param ? Number(param) : null
  }, [searchParams])

  useOnceEffect(() => {
    async function initDraft() {
      if (!currentDraftId) {
        const newDraftId = await addDraft(toPollDraft(createPollDefaultValues))
        setSearchParams({ draftId: newDraftId.toString() })
        return
      }
      const existingDraft = await getDraft(currentDraftId)
      if (existingDraft) {
        form.reset(fromPollDraft(existingDraft))
      }
    }
    initDraft()
  }, [])

  useDebouncedPollDraftUpdate('details', form, currentDraftId)
  useDebouncedPollDraftUpdate('criteria', form, currentDraftId)
  useDebouncedPollDraftUpdate('questions', form, currentDraftId)

  const deleteCurrentDraft = useCallback(async () => {
    if (currentDraftId) {
      await deleteDraft(currentDraftId)
    }
  }, [currentDraftId, deleteDraft])

  return deleteCurrentDraft
}
