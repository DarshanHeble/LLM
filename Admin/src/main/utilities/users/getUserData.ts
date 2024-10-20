import { User } from '@shared/types/types'
import { pdbUsers } from '../../pouchdb'
import { sanitizeUserDataToApp } from './sanitizedUserData'

const getUserData = async (): Promise<User[]> => {
  try {
    const allUserData = await pdbUsers.allDocs({ include_docs: true, attachments: true })
    const users: User[] = allUserData.rows
      .filter((row) => !row.id.startsWith('_design/'))
      .map((row) => sanitizeUserDataToApp(row.doc as User))

    // console.log('sanitized user data', users)
    return users
  } catch (error) {
    console.log('error getting users', error)
    return []
  }
}

export default getUserData
