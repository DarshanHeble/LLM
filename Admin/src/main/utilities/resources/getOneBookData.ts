import { Book } from '@shared/types/types'
import { pdbResources } from '../../pouchdb'
import { sanitizeBookDataToApp } from './sanitizeBookData'

const getBookData = async (_id: string): Promise<Book | null> => {
  try {
    const bookData = await pdbResources.get<Book>(_id)
    const sanitizedBookData = sanitizeBookDataToApp(bookData)
    // console.log('Successfully retrieved the sanitized book data', sanitizedBookData)

    return sanitizedBookData
  } catch (error) {
    console.log('error getting books', error)
    return null
  }
}

export default getBookData
