import { User } from '@shared/types/types'
import db from '../../firebase'

const editUserData = async (collectionName: string, updatedUserData: User): Promise<boolean> => {
  try {
    const { id, ...UserData } = updatedUserData
    const docRef = db.collection(collectionName).doc(id)

    const result = await docRef.update(UserData)
    console.log(result)

    return true
  } catch (error) {
    console.log('error getting books', error)
    return false
  }
}

export default editUserData
