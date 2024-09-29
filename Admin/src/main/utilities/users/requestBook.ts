import { Book, RequestedBookType, User } from '@shared/types/types'
import { getOneBookData } from '../resources'
import getOneUserData from './getOneUserData'
import { pdbUsers } from '../../pouchdb'

const requestBook = async (userId: string, bookId: string): Promise<boolean> => {
  try {
    const [user, book]: [User | null, Book | null] = await Promise.all([
      getOneUserData(userId),
      getOneBookData(bookId)
    ])

    if (user === null || book === null) {
      return false
    }

    const newRequestedBook: RequestedBookType = {
      _id: bookId,
      requestedDate: new Date()
    }

    const requestedBook: RequestedBookType[] = [...user.requestedBooks, newRequestedBook]

    const updatedUser: User = {
      ...user,
      requestedBooks: requestedBook
    }

    await pdbUsers.put(updatedUser)
    console.log('added requested book to user', updatedUser)

    return true
  } catch (error) {
    console.log('Error in adding requested book to the user', error)
    return false
  }
}

export default requestBook
