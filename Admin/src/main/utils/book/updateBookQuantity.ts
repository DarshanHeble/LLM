import db from '../../firebase'

// Function to update the quantity of books in the Firestore collection
const updateBookQuantity = async (
  collectionName: string, // Name of the Firestore collection
  bookId: string, // ID of the book document to update
  updatedBookQuantity: number // New quantity of books to set
): Promise<boolean> => {
  try {
    // Reference to the specific book document in the Firestore collection
    const docRef = db.collection(collectionName).doc(bookId)

    // Update the 'noOfBooks' field in the document with the new quantity
    await docRef.update({
      noOfBooks: updatedBookQuantity
    })

    // Return true if the update is successful
    return true
  } catch (error) {
    console.log('Error updating user data:', error)
    return false
  }
}

export default updateBookQuantity
