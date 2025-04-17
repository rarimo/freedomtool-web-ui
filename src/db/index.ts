import DexieDB, { Table } from 'dexie'

import { PollDratSchema } from './schemas'

const db = new DexieDB('App') as DexieDB & {
  drafts: Table<PollDratSchema, number>
}

db.version(1).stores({
  drafts: '++id',
})

export default db
