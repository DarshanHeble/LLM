import { User } from '@shared/types/types'
import { pdbUsers } from '../../pouchdb'

const addUserData = async (newUserData: User): Promise<boolean> => {
  try {
    // check if the specified user already exists with the id
    await pdbUsers.get(newUserData._id)

    return false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    try {
      if (error.status === 404) {
        // if user does not exits then add the new user to the db
        const formattedUserData: User = {
          ...newUserData,
          noOfIssuedBooks: Number(newUserData.noOfIssuedBooks)
        }
        await pdbUsers.put(formattedUserData)
        console.log('new user added successfully')
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log('error in adding new User', error)

      return false
    }
  }
}

export default addUserData
