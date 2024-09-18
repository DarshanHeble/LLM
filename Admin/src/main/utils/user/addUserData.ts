import { User } from '@shared/types/types'
import db from '../../firebase'

const addUserData = async (collectionName: string, newUserData: User): Promise<string | null> => {
  try {
    const docRef = await db.collection(collectionName).add({
      email: newUserData.email,
      name: newUserData.name,
      //   Todo no of issued books
      noOfIssuedBooks: 0,
      phoneNumber: newUserData.phoneNumber,
      issuedBooks: []
    })

    return docRef.id
  } catch (error) {
    console.log('error getting books', error)
    return null
  }
}

export default addUserData
