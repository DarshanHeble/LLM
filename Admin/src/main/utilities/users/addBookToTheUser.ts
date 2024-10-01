import { issuedBookType, User } from '@shared/types/types'
import { pdbUsers } from '../../pouchdb'
import { sanitizeUserDataToPouchDb } from './sanitizedUserData'
import getOneUserData from './getOneUserData'

const addBookToTheUser = async (
  userId: string,
  issuedBookData: issuedBookType
): Promise<boolean> => {
  try {
    // Fetch the user from the database
    const user = await getOneUserData(userId)

    if (!user) {
      return false
    }
    console.log('user', user)

    // Update the issuedBooks array with the new issued book data
    const updatedIssuedBookData: issuedBookType[] = [...user.issuedBooks, issuedBookData]

    // Update the user data with the new number of issued books and updated issued books
    const updatedUserData: User = {
      ...user,
      noOfIssuedBooks: user.noOfIssuedBooks + 1,
      issuedBooks: updatedIssuedBookData
    }

    // Optional: sanitize user data before saving
    const sanitizedData = sanitizeUserDataToPouchDb(updatedUserData)

    // Save the updated user data back to PouchDB
    await pdbUsers.put(sanitizedData)

    return true
  } catch (error) {
    console.error('Error issuing book to the user:', error)
    return false
  }
}

export default addBookToTheUser
