import db from '..'
import { PollDraftSchema } from '../schemas'

export function getAllPollDrafts(): Promise<PollDraftSchema[]> {
  return db.drafts.toArray()
}

export function getPollDraftsCount(): Promise<number> {
  return db.drafts.count()
}

export function getPollDraftById(id: number): Promise<PollDraftSchema | undefined> {
  return db.drafts.get(id)
}

export function createPollDraft(draft: PollDraftSchema): Promise<number> {
  return db.drafts.add(draft)
}

export function updatePollDraft(id: number, updateData: Partial<PollDraftSchema>): Promise<number> {
  return db.drafts.update(id, updateData)
}

export function deletePollDraft(id: number): Promise<void> {
  return db.drafts.delete(id)
}
