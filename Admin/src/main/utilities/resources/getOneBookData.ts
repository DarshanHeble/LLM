import { Book } from '@shared/types'
import { pdbResources } from '../../pouchdb'

const getBookData = async (_id: string): Promise<Book | null> => {
  try {
    const bookData = await pdbResources.get<Book>(_id)
    console.log('Successfully retrieved the book data')

    return bookData
  } catch (error) {
    console.log('error getting books', error)
    return null
  }
}

export default getBookData
