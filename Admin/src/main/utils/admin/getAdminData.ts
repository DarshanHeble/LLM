import { Admin } from '@shared/types'
import db from 'src/main/firebase'

export const getAdminData = async (collectionName: string): Promise<Admin | null> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.limit(1).get()

    if (snapshot.size === 0) {
      console.log('No admin document found in collection:', collectionName)
      return null // Return null if no admin document exists
    }
    const doc = snapshot.docs[0]

    const adminData: Admin = { id: doc.id, ...doc.data() } as Admin
    // console.log(adminData)

    return adminData
  } catch (error) {
    console.error('Error getting documents:', error)
    return null
  }
}

export default getAdminData
