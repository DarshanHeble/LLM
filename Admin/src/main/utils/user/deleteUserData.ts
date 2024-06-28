import db from '../../firebase'

const deleteUserData = async (collectionName: string, userId: string): Promise<boolean> => {
  try {
    await db.collection(collectionName).doc(userId).delete()
    console.log('delete User Data')
    return true
  } catch (error) {
    console.log('error getting books', error)
    return false
  }
}

export default deleteUserData
