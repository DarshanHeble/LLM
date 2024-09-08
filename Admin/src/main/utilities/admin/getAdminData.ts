import { Admin } from '@shared/types'
import { pdbAdmin } from '../../pouchdb'
import { ADMIN_ID } from '@shared/constants'

const getAdminData = async (): Promise<Admin | null> => {
  try {
    const adminDoc = (await pdbAdmin.get(ADMIN_ID)) as Admin
    console.log(adminDoc)

    return adminDoc
  } catch (error) {
    console.error('Error fetching admin data', error)
    return null
  }
}

export default getAdminData
