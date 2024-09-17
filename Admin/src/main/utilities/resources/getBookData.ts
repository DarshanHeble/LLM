import { Book } from '@shared/types'
import { pdbResources } from '../../pouchdb'
import { sanitizeBookDataToApp } from './sanitizeBookData'

const getBookData = async (): Promise<Book[]> => {
  try {
    const allBookData = await pdbResources.allDocs({ include_docs: true, attachments: true })

    const bookData: Book[] = allBookData.rows.map((row) => sanitizeBookDataToApp(row.doc as Book))
    console.log('sanitized book data', bookData)

    return bookData
  } catch (error) {
    console.log('error getting books', error)
    return []
  }
}

export default getBookData
