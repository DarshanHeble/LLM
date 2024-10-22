import { ADMIN_ID } from '@shared/constants'
import { pdbAdmin } from '../../pouchdb'
import { AdminWith_rev } from '@shared/types/types'
import { hashPassword } from '../password'

const resetAdminPassword = async (newPassword: string): Promise<boolean> => {
  try {
    const adminDoc = (await pdbAdmin.get(ADMIN_ID)) as AdminWith_rev

    const updatedAdminData: AdminWith_rev = {
      ...adminDoc,
      password: await hashPassword(newPassword)
    }

    await pdbAdmin.put(updatedAdminData)

    // TODO: proper handling of return stmt
    return true
  } catch (error) {
    console.error('Error in Resetting Password', error)
    return false
  }
}

export default resetAdminPassword
