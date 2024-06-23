import db from './firebase'
import { Admin } from '../shared/types'

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
    console.log(dataArray)

    return dataArray
  } catch (error) {
    console.error('Error getting documents:', error)
    return []
  }
}
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
    console.log(adminData)

    return adminData
  } catch (error) {
    console.error('Error getting documents:', error)
    return null
  }
}

export const addAdminData = async (documentData: Admin): Promise<boolean> => {
  try {
    const docRef = await db.collection('Admin').add(documentData)
    console.log('Successfully Added Admin Data', docRef)
    return true
  } catch (error) {
    console.error('Error Adding Documents', error)
    return false
  }
}
