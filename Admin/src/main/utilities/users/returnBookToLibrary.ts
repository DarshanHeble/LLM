import getOneUserData from './getOneUserData'
import { getOneBookData } from '../resources'
import { issuedBookType, User } from '@shared/types/types'
import { pdbUsers } from '../../pouchdb'

const returnBookToLibrary = async (userId: string, bookId: string): Promise<boolean> => {
  try {
    const [user, book] = await Promise.all([getOneUserData(userId), getOneBookData(bookId)])

    if (!user || !book) {
      return false
    }

    const updatedIssuedBook: issuedBookType[] = user.issuedBooks.filter(
      (issuedBook) => issuedBook._id !== book._id
    )

    const updatedUser: User = {
      ...user,
      noOfIssuedBooks: user.noOfIssuedBooks - 1,
      issuedBooks: updatedIssuedBook
    }
    await pdbUsers.put(updatedUser)

    console.log(`Book with ID ${bookId} returned successfully from user ${userId}`)
    return true
  } catch (error) {
    console.error('Error returning book:', error)
    return false
  }
}

export default returnBookToLibrary
