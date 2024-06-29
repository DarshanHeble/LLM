import db from '../../firebase'

const resetAdminPassword = async (
  collectionName: string,
  newPassword: number
): Promise<boolean> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.limit(1).get()

    if (snapshot.empty) {
      console.log('No matching found')
    }
    snapshot.forEach(async (doc) => {
      const docRef = collectionRef.doc(doc.id)
      await docRef
        .update({
          password: newPassword
        })
        .then(() => {
          // return true
        })
        .catch((error) => {
          console.log(error)
          // return false
        })
    })
    // TODO: proper handling of return stmt
    return true
  } catch (error) {
    console.error('Error in Resetting Password', error)
    return false
  }
}

export default resetAdminPassword
