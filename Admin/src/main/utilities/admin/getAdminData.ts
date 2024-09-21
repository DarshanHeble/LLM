import { Admin } from '@shared/types/types'
import { pdbAdmin } from '../../pouchdb'
import { ADMIN_ID } from '@shared/constants'

const getAdminData = async (): Promise<Admin | null> => {
  try {
    const adminDoc = await pdbAdmin.get<Admin>(ADMIN_ID)
    // console.log(adminDoc)

    return adminDoc
  } catch (error) {
    console.error('Error fetching admin data', error)
    return null
  }
}

export default getAdminData
