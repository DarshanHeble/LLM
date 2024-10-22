import { Admin, AdminWithout_Id_Rev } from '@shared/types/types'
import { pdbAdmin } from '../../pouchdb'
import { ADMIN_ID } from '@shared/constants'
import { hashPassword } from '../password'

const addAdminData = async (adminDataWithout_id: AdminWithout_Id_Rev): Promise<boolean> => {
  try {
    const adminData: Admin = {
      ...adminDataWithout_id,
      _id: ADMIN_ID,
      password: await hashPassword(adminDataWithout_id.password)
    }
    const response = await pdbAdmin.put(adminData)
    console.log(response)

    return true
  } catch (error) {
    console.error('Error in adding admin data', error)
    return false
  }
}

export default addAdminData
