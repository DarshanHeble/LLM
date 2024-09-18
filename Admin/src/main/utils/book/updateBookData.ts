import { Book } from '@shared/types/types'
import db from '../../firebase'

const updateBookData = async (collectionName: string, bookData: Book): Promise<boolean> => {
  try {
    console.log(bookData.id)

    console.log('Step 1: Starting updateBookData function')
    const { id, ...bookItems } = bookData

    console.log('Step 2: Extracted id:', id)
    console.log('Step 3: Remaining book items:', bookItems)

    if (!id) {
      console.error('No ID provided in book data')
      return false
    }

    const docRef = db.collection(collectionName).doc(id)
    console.log('Step 4: Document reference created:', docRef.id)

    const result = await docRef.update(bookItems)

    console.log('Step 5: Firestore update result:', result)
    console.log('Step 6: Update successful')

    return true
  } catch (error) {
    console.error('Error updating the book:', error)
    return false
  }
}

export default updateBookData
