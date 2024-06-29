import db from '../../firebase'

const deleteOneBook = async (bookId: string): Promise<boolean> => {
  try {
    const docRef = db.collection('BookData').doc(bookId)
    docRef
      .delete()
      .then(() => {
        // console.log('Document Successfully Deleted', docRef)
      })
      .catch((error) => {
        console.log(error)
      })
    return true
  } catch (error) {
    console.error('Error Adding Book', error)
    return false
  }
}
export default deleteOneBook
