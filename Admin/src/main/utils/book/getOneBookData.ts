import { Book } from '@shared/types/types'
import db from '../../firebase'

const getBookData = async (collectionName: string, docId: string): Promise<Book | null> => {
  try {
    const collectionRef = db.collection(collectionName)
    const bookItems = await collectionRef.doc(docId).get()
    const bookData: Book = { id: docId, ...bookItems.data() } as Book
    console.log(bookData)
    return bookData
  } catch (error) {
    console.log('error getting books', error)
    return null
  }
}

export default getBookData
