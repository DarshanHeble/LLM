import { Book } from '@shared/types'
import db from 'src/main/firebase'

const addNewBookData = async (newBookData: Book): Promise<string | null> => {
  try {
    const docRef = await db.collection('BookData').add({
      bookId: newBookData.bookId,
      authorName: newBookData.authorName,
      bookName: newBookData.bookName,
      noOfBooks: newBookData.noOfBooks
    })
    // console.log('Successfully Added Book Data', docRef)
    return docRef.id
  } catch (error) {
    console.error('Error Adding Book', error)
    return null
  }
}

export default addNewBookData
