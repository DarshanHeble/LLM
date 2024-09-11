import { Book } from '@shared/types'
import { pdbResources } from '../../pouchdb'

const updateBookData = async (bookData: Book): Promise<boolean> => {
  try {
    await pdbResources.get(bookData._id).then((doc) => {
      return pdbResources.put({
        ...bookData,
        _rev: doc._rev
      })
    })
    console.log('Successfully updated book')

    return true
  } catch (error) {
    console.error('Error updating the book:', error)
    return false
  }
}

export default updateBookData
