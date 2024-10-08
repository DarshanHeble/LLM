import { User } from '@shared/types/types'
import db from '../../firebase'

const getUserData = async (collectionName: string): Promise<User[]> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.get()

    const dataArray: User[] = []
    snapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() } as User)
    })

    return dataArray
  } catch (error) {
    console.log('error getting books', error)
    return []
  }
}

export default getUserData
