import { Book } from '@shared/types/types'
import { pdbResources } from '../../pouchdb'
import { sanitizeBookDataToPouchDb } from './sanitizeBookData'

const addNewBookData = async (newBookData: Book): Promise<boolean> => {
  try {
    console.log(newBookData)
    // check if there is already a book with specified id
    await pdbResources.get(newBookData._id)
    console.log('found existing book with id ' + newBookData._id)

    return false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    try {
      if (error.status === 404) {
        console.log(
          'did not find existing book with the book id for creation so will create a new book'
        )

        const sanitizedBookData = sanitizeBookDataToPouchDb(newBookData)
        await pdbResources.put(sanitizedBookData)
        console.log('successfully sanitized added newBookData')

        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }
}

export default addNewBookData
