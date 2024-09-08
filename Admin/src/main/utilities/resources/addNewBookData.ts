import { Book } from '@shared/types'

const addNewBookData = async (newBookData: Book): Promise<string | null> => {
  try {
    console.log(newBookData)
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export default addNewBookData
