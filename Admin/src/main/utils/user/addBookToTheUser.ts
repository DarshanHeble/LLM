import { Book } from '@shared/types'
import db from '../../firebase'

const addBookToTheUser = async (collectionName: string, issuedBookData: Book): Promise<boolean> => {
  try {
    const { id, ...UserData } = issuedBookData
    const docRef = db.collection(collectionName).doc(id)

    const result = await docRef.update(UserData)
    console.log(result)

    return true
  } catch (error) {
    console.log('error getting books', error)
    return false
  }
}

export default addBookToTheUser
