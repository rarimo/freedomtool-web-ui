import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'

import db from '..'
import { PollDratSchema } from '../schemas'

export function usePollDrafts() {
  const _db = db.drafts

  // Computed
  const drafts = useLiveQuery(() => _db.toArray(), [])
  const count = useLiveQuery(() => _db.count(), [])

  // Actions
  const addDraft = useCallback((draft: PollDratSchema) => _db.add(draft), [_db])
  const updateDraft = useCallback(
    (id: number, draft: Partial<PollDratSchema>) => _db.update(id, draft),
    [_db],
  )
  const deleteDraft = useCallback((id: number) => _db.delete(id), [_db])
  const getDraft = useCallback((id: number) => _db.get(id), [_db])

  return {
    drafts,
    count,

    getDraft,
    addDraft,
    updateDraft,
    deleteDraft,

    _db,
  }
}
