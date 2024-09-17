import { Book } from '@shared/types'
import { pdbResources } from '../../pouchdb'

// Function to ensure that string or number fields are coerced to numbers
const sanitizeBookData = (book: Book): Book => {
  return {
    ...book,
    sem: Number(book.sem),
    quantity: Number(book.quantity),
    addedAt: new Date(book.addedAt)
  }
}

const getBookData = async (): Promise<Book[]> => {
  try {
    const allBookData = await pdbResources.allDocs({ include_docs: true, attachments: true })

    const bookData: Book[] = allBookData.rows.map((row) => sanitizeBookData(row.doc as Book))
    console.log('sanitized book data', bookData)

    return bookData
  } catch (error) {
    console.log('error getting books', error)
    return []
  }
}

export default getBookData
