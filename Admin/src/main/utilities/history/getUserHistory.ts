import { BookHistory, UserHistory } from '@shared/types/types'
import { pdbUserHistory } from '../../pouchdb'
import { sanitizeUserHistory } from './sanitizeUserHistory'

const getBookHistory = async (userId: string, bookHistory: BookHistory): Promise<UserHistory[]> => {
  try {
    console.log(userId, bookHistory)
    const userHistoryDoc = await pdbUserHistory.allDocs({
      include_docs: true
    })

    const sanitizedUserHistory = userHistoryDoc.rows.map((row) =>
      sanitizeUserHistory(row.doc as UserHistory)
    )

    return sanitizedUserHistory
  } catch (error) {
    console.log(error)
    return []
  }
}

export default getBookHistory
