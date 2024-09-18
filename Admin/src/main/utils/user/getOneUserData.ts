import { User } from '@shared/types/types'
import db from '../../firebase'

const getOneUserData = async (collectionName: string, docId: string): Promise<User | null> => {
  try {
    const collectionRef = db.collection(collectionName)
    const userItems = await collectionRef.doc(docId).get()
    const userData: User = { id: docId, ...userItems.data() } as User
    console.log(userData)
    return userData
  } catch (error) {
    console.log('error getting User', error)
    return null
  }
}

export default getOneUserData
