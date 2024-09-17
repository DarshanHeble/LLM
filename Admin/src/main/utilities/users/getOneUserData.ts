import { User } from '@shared/types'
import { pdbUsers } from '../../pouchdb'

const getOneUserData = async (docId: string): Promise<User | null> => {
  try {
    const user = await pdbUsers.get<User>(docId)
    console.log('Successfully retrieved user data')

    return user
  } catch (error) {
    console.log('error getting User', error)
    return null
  }
}

export default getOneUserData
