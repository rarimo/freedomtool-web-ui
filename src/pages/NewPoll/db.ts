// eslint-disable-next-line import/no-named-as-default
import Dexie, { type Table } from 'dexie'

import { CreatePollSchema } from './createPollSchema'

export interface PollDraft extends CreatePollSchema {
  id?: number
}

const db = new Dexie('PollDraftDB') as Dexie & {
  drafts: Table<PollDraft, number>
}

db.version(1).stores({
  drafts: '++id',
})

export { db }
