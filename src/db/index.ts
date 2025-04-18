import DexieDB, { Table } from 'dexie'

import { PollDraftSchema } from './schemas'

const db = new DexieDB('App') as DexieDB & {
  drafts: Table<PollDraftSchema, number>
}

db.version(1).stores({
  drafts: '++id',
})

export default db
