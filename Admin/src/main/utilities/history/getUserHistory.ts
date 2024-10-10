import { UserHistory } from '@shared/types/types'
import { pdbUserHistory } from '../../pouchdb'
import { sanitizeUserHistory } from './sanitizeUserHistory'

const getBookHistory = async (): Promise<UserHistory[]> => {
  try {
    const userHistoryDoc = await pdbUserHistory.allDocs({
      include_docs: true
    })

    const sanitizedUserHistory = userHistoryDoc.rows.map((row) =>
      sanitizeUserHistory(row.doc as UserHistory)
    )
    console.log(sanitizedUserHistory)

    return sanitizedUserHistory
  } catch (error) {
    console.log(error)
    return []
  }
}

export default getBookHistory
