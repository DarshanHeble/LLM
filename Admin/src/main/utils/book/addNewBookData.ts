import { Book } from '@shared/types'
import db from '../../firebase'

const addNewBookData = async (newBookData: Book): Promise<string | null> => {
  try {
    // Generate the new book ID
    // const currentYear = new Date().getFullYear().toString()
    // const doc1Ref = db.collection('other').doc('data')
    // const uniqueNum = await doc1Ref.get()
    // console.log('hello', currentYear, uniqueNum.data())

    // const newBookId = generateBookId(newBookData.course, currentYear, uniqueNum)

    const docRef = await db.collection('BookData').add({
      // bookId: newBookData.bookId,
      authorName: newBookData.authorName,
      bookName: newBookData.bookName,
      noOfBooks: newBookData.noOfBooks,
      course: newBookData.course,
      sem: newBookData.sem
    })
    // console.log('Successfully Added Book Data', docRef)
    return docRef.id
  } catch (error) {
    console.error('Error Adding Book', error)
    return null
  }
}

export default addNewBookData
