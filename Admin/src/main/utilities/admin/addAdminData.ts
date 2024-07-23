import { Admin } from '@shared/types'
import { pdbAdmin } from 'src/main/pouchdb'

const addAdminData = async (adminData: Admin): Promise<void> => {
  try {
    const responce = await pdbAdmin.post(adminData)
  } catch (error) {
    console.error('Error in adding admin data', error)
  }
}

export default addAdminData
