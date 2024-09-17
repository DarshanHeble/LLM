import { User } from '@shared/types'
import { pdbUsers } from '../../pouchdb'
import sanitizeUserData from './sanitizedUserData'

const getOneUserData = async (docId: string): Promise<User | null> => {
  try {
    const user = await pdbUsers.get<User>(docId)
    const sanitizedUserData = sanitizeUserData(user)
    console.log('Successfully retrieved user data')

    return sanitizedUserData
  } catch (error) {
    console.log('error getting User', error)
    return null
  }
}

export default getOneUserData
