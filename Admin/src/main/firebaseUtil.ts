import db from './firebase'

type FirestoreDocument = {
  id: string
  password: string
  phoneNumber: number
  name: string
  email: string
}

export const getAllData = async (collectionName: string): Promise<FirestoreDocument[]> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.get()

    const dataArray: FirestoreDocument[] = []
    snapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() } as FirestoreDocument)
    })

    return dataArray
  } catch (error) {
    console.error('Error getting documents:', error)
    return []
  }
}
