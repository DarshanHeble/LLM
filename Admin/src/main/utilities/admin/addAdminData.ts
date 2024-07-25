import { Admin } from '@shared/types'
import { pdbAdmin } from 'src/main/pouchdb'

const addAdminData = async (adminData: Admin): Promise<boolean> => {
  try {
    await pdbAdmin.post(adminData)
    return true
  } catch (error) {
    console.error('Error in adding admin data', error)
    return false
  }
}

export default addAdminData
