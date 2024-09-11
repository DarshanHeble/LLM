import { User } from '@shared/types'

const editUserData = async (updatedUserData: User): Promise<boolean> => {
  console.log(updatedUserData)

  try {
    return true
  } catch (error) {
    console.log('error getting books', error)
    return false
  }
}

export default editUserData
