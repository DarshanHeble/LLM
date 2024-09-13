import { Book } from '@shared/types'
import { pdbResources } from '../../pouchdb'

const addNewBookData = async (newBookData: Book): Promise<boolean> => {
  try {
    console.log(newBookData)
    // check if there is already a book with specified id
    await pdbResources.get(newBookData._id)
    return false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    try {
      if (error.status === 404) {
        await pdbResources.put(newBookData)
        console.log('successfully added newBookData')

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
