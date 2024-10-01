import { RequestedBookType, User } from '@shared/types/types'
import getOneUserData from './getOneUserData'
import { pdbUsers } from '../../pouchdb'

async function removeBookRequest(userId: string, bookId: string): Promise<boolean> {
  try {
    const user = await getOneUserData(userId)
    if (!user) {
      return false
    }
    const updatedRequestedBookData: RequestedBookType[] = user.requestedBooks.filter(
      (book) => book._id !== bookId
    )
    console.log(updatedRequestedBookData)

    const updatedUser: User = {
      ...user,
      requestedBooks: updatedRequestedBookData
    }

    await pdbUsers.put(updatedUser)

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
export default removeBookRequest
