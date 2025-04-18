import { useOnceEffect } from '@reactuses/core'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { createPollDraft, getPollDraftById } from '@/db/services'
import { ErrorHandler } from '@/helpers'

import { createPollDefaultValues, CreatePollSchema } from '../createPollSchema'
import { fromPollDraft, toPollDraft } from '../helpers/pollDraftAdapters'
import useDebouncedPollDraftUpdate from './debounced-poll-draft-update'

export function useCreatePollDraft(form: UseFormReturn<CreatePollSchema>) {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentDraftId = useMemo(() => {
    const param = searchParams.get('draftId')
    return param ? Number(param) : null
  }, [searchParams])

  useOnceEffect(() => {
    async function initDraft() {
      try {
        if (!currentDraftId) {
          const newDraftId = await createPollDraft(toPollDraft(createPollDefaultValues))
          setSearchParams({ draftId: newDraftId.toString() })
          return
        }
        const existingDraft = await getPollDraftById(currentDraftId)
        if (existingDraft) {
          form.reset(fromPollDraft(existingDraft))
        }
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    }
    initDraft()
  }, [])

  useDebouncedPollDraftUpdate('details', form, currentDraftId)
  useDebouncedPollDraftUpdate('criteria', form, currentDraftId)
  useDebouncedPollDraftUpdate('questions', form, currentDraftId)

  return currentDraftId
}
