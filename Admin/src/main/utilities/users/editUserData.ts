import { User } from '@shared/types'
import { pdbUsers } from '../../pouchdb'

const editUserData = async (updatedUserData: User): Promise<boolean> => {
  try {
    console.log(updatedUserData)
    const existingUser = await pdbUsers.get(updatedUserData._id)
    await pdbUsers.put({
      ...updatedUserData,
      _rev: existingUser._rev
    })
    console.log('successfully updated user')
    return true
  } catch (error) {
    console.log('error getting books', error)
    return false
  }
}

export default editUserData
