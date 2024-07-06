import { issuedBookType } from '@shared/types'
import admin from 'firebase-admin'
import db from '../../firebase'

// TODO:
const updateBookQuantity = async (
  collectionName: string,
  userId: string,
  issuedBookData: issuedBookType
): Promise<boolean> => {
  try {
    const docRef = db.collection(collectionName).doc(userId)

    await docRef.update({
      issuedBook: admin.firestore.FieldValue.arrayUnion(issuedBookData)
    })

    console.log(`Book with ID ${issuedBookData.bookId} issued to user ${userId}`)

    return true
  } catch (error) {
    console.log('Error updating user data:', error)
    return false
  }
}

export default updateBookQuantity
