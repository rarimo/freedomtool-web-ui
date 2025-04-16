import { useOnceEffect } from '@reactuses/core'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { CreatePollSchema } from '../createPollSchema'
import { db } from '../db'
import useUpdateCreatePollFields from './update-createpoll-field'

const DRAFT_ID_KEY = 'draftId'

export function useCreatePollDraft(form: UseFormReturn<CreatePollSchema>) {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentDraftId = useMemo(() => {
    const param = searchParams.get(DRAFT_ID_KEY)
    return param ? Number(param) : null
  }, [searchParams])

  useOnceEffect(() => {
    async function initDraft() {
      if (!currentDraftId) {
        const newDraftId = await db.drafts.add(form.getValues())
        setSearchParams({ draftId: newDraftId.toString() })
        return
      }
      const existingData = await db.drafts.get(currentDraftId)
      if (existingData) {
        form.reset(existingData)
      }
    }
    initDraft()
  }, [])

  useUpdateCreatePollFields('details', form, currentDraftId)
  useUpdateCreatePollFields('criteria', form, currentDraftId)
  useUpdateCreatePollFields('questions', form, currentDraftId)
}
