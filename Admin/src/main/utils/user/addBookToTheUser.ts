import { issuedBookType } from '@shared/types'
import admin from 'firebase-admin'
import db from '../../firebase' // Ensure this is correctly pointing to your initialized admin instance

const addBookToTheUser = async (
  collectionName: string,
  userId: string,
  noOfBooks: number,
  issuedBookData: issuedBookType
): Promise<boolean> => {
  try {
    const docRef = db.collection(collectionName).doc(userId)

    await docRef.update({
      noOfBooks: noOfBooks,
      issuedBook: admin.firestore.FieldValue.arrayUnion(issuedBookData)
    })

    console.log(`Book with ID ${issuedBookData.bookId} issued to user ${userId}`)

    return true
  } catch (error) {
    console.log('Error updating user data:', error)
    return false
  }
}

export default addBookToTheUser
