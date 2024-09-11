import { User } from '@shared/types'
import { pdbUsers } from '../../pouchdb'

const getUserData = async (): Promise<User[]> => {
  try {
    const allUserData = await pdbUsers.allDocs({ include_docs: true, attachments: true })
    const user: User[] = allUserData.rows.map((row) => row.doc as User)
    console.log('all user data', user)

    return user
  } catch (error) {
    console.log('error getting books', error)
    return []
  }
}

export default getUserData
