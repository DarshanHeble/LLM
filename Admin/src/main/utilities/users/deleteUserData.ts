import { pdbUsers } from '../../pouchdb'

const deleteUserData = async (_id: string): Promise<boolean> => {
  try {
    const userData = await pdbUsers.get(_id)
    await pdbUsers.remove(userData)
    console.log('delete User Data')
    return true
  } catch (error) {
    console.log('error getting books', error)
    return false
  }
}

export default deleteUserData
