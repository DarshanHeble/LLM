import { Book } from '@shared/types'
import { pdbResources } from '../../pouchdb'

const getBookData = async (): Promise<Book[]> => {
  try {
    const allBookData = await pdbResources.allDocs({ include_docs: true, attachments: true })

    const bookData: Book[] = allBookData.rows.map((row) => row.doc as Book)

    return bookData
  } catch (error) {
    console.log('error getting books', error)
    return []
  }
}

export default getBookData
