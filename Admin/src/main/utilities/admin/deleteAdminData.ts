import { pdbAdmin } from '../../pouchdb'
import { ADMIN_ID } from '@shared/constants'

const deleteAdminData = async (): Promise<boolean> => {
  try {
    await pdbAdmin.get(ADMIN_ID).then((doc) => {
      pdbAdmin.remove(doc)
    })

    return true
  } catch (error) {
    console.error('Error in deleting admin data', error)
    return false
  }
}

export default deleteAdminData
