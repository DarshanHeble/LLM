import { Book } from '@shared/types'
import { getOneBookData } from '.'
import { pdbResources } from 'src/main/pouchdb'

// Function to update the quantity of books in the Firestore collection
const updateBookQuantity = async (_id: string, updatedBookQuantity: number): Promise<boolean> => {
  try {
    const bookData: Book | null = await getOneBookData(_id)

    // if book data is not null then update book quantity
    if (bookData) {
      const updatedBookData: Book = { ...bookData, quantity: updatedBookQuantity }
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

export default updateBookQuantity
