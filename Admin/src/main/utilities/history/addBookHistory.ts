import { BookHistory, UserHistory } from '@shared/types/types'
import { pdbUserHistory } from '../../pouchdb'

const addBookHistory = async (userId: string, bookHistory: BookHistory): Promise<boolean> => {
  try {
    console.log(userId, bookHistory)
    const userHistory = await pdbUserHistory.get<UserHistory>(userId) // get the specific user
    const updatedBookHistory = [...userHistory.bookHistory, bookHistory] // add new book history data to to book history array
    console.log(updatedBookHistory)
    const updatedUserHistory: UserHistory = {
      ...userHistory,
      bookHistory: updatedBookHistory
    } // add updated book history data to user history

    await pdbUserHistory.put(updatedUserHistory) // updated the user history database

    return true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    try {
      if (error.status === 404) {
        console.log('user not found')
      }
    } catch (error) {
      console.log(error)
    }
    return false
  }
}

export default addBookHistory
