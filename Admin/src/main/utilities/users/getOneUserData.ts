import { User } from '@shared/types/types'
import { pdbUsers } from '../../pouchdb'
import { sanitizeUserDataToApp } from './sanitizedUserData'

const getOneUserData = async (docId: string): Promise<User | null> => {
  try {
    const user = await pdbUsers.get<User>(docId)
    const sanitizedUserData = sanitizeUserDataToApp(user)
    // console.log('Successfully retrieved sanitized user data', sanitizedUserData)

    return sanitizedUserData
  } catch (error) {
    console.log('error getting User', error)
    return null
  }
}

export default getOneUserData
