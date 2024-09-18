import { issuedBookType } from '@shared/types/types'
import db from '../..//firebase'

const returnBookToLibrary = async (
  collectionName: string,
  userId: string,
  bookId: string
): Promise<boolean> => {
  try {
    // Get the document reference for the user
    const userRef = db.collection(collectionName).doc(userId)

    // Fetch the user document
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      console.error(`User with ID ${userId} not found`)
      return false
    }

    // Extract issued books from the user document
    const issuedBooks: issuedBookType[] = userDoc.data()?.issuedBook || []

    // Find the index of the book to remove
    const indexToRemove = issuedBooks.findIndex((book) => book.bookId === bookId)

    if (indexToRemove === -1) {
      console.error(`Book with ID ${bookId} not found in issued books of user ${userId}`)
      return false
    }

    // Remove the book from the array
    issuedBooks.splice(indexToRemove, 1)

    // Update the user document with the modified issued books array
    await userRef.update({
      issuedBook: issuedBooks
    })

    console.log(`Book with ID ${bookId} returned successfully for user ${userId}`)
    return true
  } catch (error) {
    console.error('Error returning book:', error)
    return false
  }
}

export default returnBookToLibrary
