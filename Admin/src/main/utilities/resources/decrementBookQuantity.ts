import { Book } from '@shared/types/types'
import { getOneBookData } from '.'
import { pdbResources } from '../../pouchdb'

// Function to update the quantity of books in the Firestore collection
const decrementBookQuantity = async (_id: string): Promise<boolean> => {
  try {
    const bookData: Book | null = await getOneBookData(_id)

    // if book data is not null then update book quantity
    if (bookData) {
      const updatedBookData: Book = { ...bookData, quantity: bookData.quantity - 1 }
      await pdbResources.put(updatedBookData)
      console.log('Updated book quantity')

      return true
    }
    return false
  } catch (error) {
    console.log('Error updating user data:', error)
    return false
  }
}

export default decrementBookQuantity
