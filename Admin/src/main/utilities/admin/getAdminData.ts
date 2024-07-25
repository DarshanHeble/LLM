import { Admin } from '@shared/types'
import { pdbAdmin } from '../../pouchdb'

const getAdminData = async (admin_Id: string): Promise<Admin | null> => {
  try {
    const adminDoc = (await pdbAdmin.get(admin_Id)) as Admin
    console.log(adminDoc)

    return adminDoc
  } catch (error) {
    console.error('Error fetching admin data', error)
    return null
  }
}

export default getAdminData
