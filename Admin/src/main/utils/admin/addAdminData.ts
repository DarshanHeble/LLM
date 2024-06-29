import { Admin } from '@shared/types'
import db from '../../firebase'

const addAdminData = async (newAdminData: Admin): Promise<boolean> => {
  try {
    const docRef = await db.collection('Admin').add(newAdminData)
    console.log('Successfully Added Admin Data', docRef)
    return true
  } catch (error) {
    console.error('Error Adding Documents', error)
    return false
  }
}

export default addAdminData
