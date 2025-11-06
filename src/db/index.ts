import DexieDB, { Table } from 'dexie'

import { DocumentType } from '@/types'

import { PollDraftSchema } from './schemas'

const db = new DexieDB('App') as DexieDB & {
  drafts: Table<PollDraftSchema, number>
}

db.version(2)
  .stores({
    drafts: '++id',
  })
  .upgrade(tx => {
    // add documentType field to existing drafts
    return tx
      .table('drafts')
      .toCollection()
      .modify(draft => {
        if (!('documentType' in draft)) {
          draft.documentType = DocumentType.Passport
        }
      })
  })

export default db
