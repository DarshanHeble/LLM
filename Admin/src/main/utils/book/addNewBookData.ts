import { Book } from '@shared/types'

const addNewBookData = async (newBookData: Book): Promise<boolean> => {
  try {
    return true
  } catch (error) {
    console.error('Error Adding Book', error)
    return false
  }
}

export default addNewBookData
