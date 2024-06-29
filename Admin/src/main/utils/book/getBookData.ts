import { Book } from '@shared/types'
import db from 'src/main/firebase'

const getBookData = async (collectionName: string): Promise<Book[]> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.get()

    const dataArray: Book[] = []
    snapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() } as Book)
    })

    return dataArray
  } catch (error) {
    console.log('error getting books', error)
    return []
  }
}

export default getBookData
