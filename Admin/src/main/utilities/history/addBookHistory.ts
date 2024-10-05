import { BookHistory, UserHistory } from '@shared/types/types'
import { pdbUserHistory } from '../../pouchdb'

const addBookHistory = async (userId: string, bookHistory: BookHistory): Promise<boolean> => {
  try {
    console.log(userId, bookHistory)
    const userHistory = await pdbUserHistory.get<UserHistory>(userId)
    const updatedBookHistory = [...userHistory.bookHistory, bookHistory]
    console.log(updatedBookHistory)

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export default addBookHistory
