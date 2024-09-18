import { issuedBookType, User } from '@shared/types/types'
import { pdbUsers } from '../../pouchdb'
import { sanitizeUserDataToPouchDb } from './sanitizedUserData'
import getOneUserData from './getOneUserData'

const addBookToTheUser = async (
  userId: string,
  noOfBooks: number,
  issuedBookData: issuedBookType
): Promise<boolean> => {
  try {
    console.log('parameter data', issuedBookData)

    // Fetch the user from the database
    const user = await getOneUserData(userId)

    if (!user) {
      return false
    }
    console.log('user', user)

    // Update the issuedBooks array with the new issued book data
    const updatedIssuedBookData: issuedBookType[] = [...user.issuedBooks, issuedBookData]
    console.log('updatedIssuedBookData', updatedIssuedBookData)

    // Update the user data with the new number of issued books and updated issued books
    const updatedUserData: User = {
      ...user,
      noOfIssuedBooks: noOfBooks,
      issuedBooks: updatedIssuedBookData
    }

    // Optional: sanitize user data before saving
    const sanitizedData = sanitizeUserDataToPouchDb(updatedUserData)
    console.log('sanitizedData', sanitizedData)

    // Save the updated user data back to PouchDB
    // const response = await pdbUsers.put(sanitizedData)
    // console.log('Database update response', response)

    return true
  } catch (error) {
    console.error('Error issuing book to the user:', error)
    return false
  }
}

export default addBookToTheUser
