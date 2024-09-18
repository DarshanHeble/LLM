import { Book } from '@shared/types/types'
import { pdbResources } from '../../pouchdb'

const addNewBookData = async (newBookData: Book): Promise<boolean> => {
  try {
    await pdbResources.put(newBookData)
    return true
  } catch (error) {
    console.error('Error Adding Book', error)
    return false
  }
}

export default addNewBookData
