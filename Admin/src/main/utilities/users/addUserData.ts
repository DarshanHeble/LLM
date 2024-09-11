import { User } from '@shared/types'
import { pdbUsers } from '../../pouchdb'

const addUserData = async (newUserData: User): Promise<string | null> => {
  try {
    console.log(newUserData)
    await pdbUsers.put(newUserData)
    console.log('new user added successfully')

    return null
  } catch (error) {
    console.log('error getting books', error)
    return null
  }
}

export default addUserData
