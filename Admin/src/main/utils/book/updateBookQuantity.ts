import db from '../../firebase'

// TODO:
const updateBookQuantity = async (
  collectionName: string,
  bookId: string,
  updatedBookQuantity: number
): Promise<boolean> => {
  try {
    const docRef = db.collection(collectionName).doc(bookId)
    await docRef.update({
      noOfBooks: updatedBookQuantity
    })

    return true
  } catch (error) {
    console.log('Error updating user data:', error)
    return false
  }
}

export default updateBookQuantity
