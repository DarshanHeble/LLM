import db from '../firebase'
import { Admin, Book } from '../../shared/types'

type FirestoreDocument = {
  id: string
  password: string
  phoneNumber: number
  name: string
  email: string
}

export const getAllData = async (collectionName: string): Promise<FirestoreDocument[]> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.get()

    const dataArray: FirestoreDocument[] = []
    snapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() } as FirestoreDocument)
    })

    return dataArray
  } catch (error) {
    console.error('Error getting documents:', error)
    return []
  }
}

export const getBookData = async (collectionName: string): Promise<Book[]> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.get()

    const dataArray: Book[] = []
    snapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() } as Book)
    })

    return dataArray
  } catch (error) {
    console.log('error getting books', error)
    return []
  }
}

export const addNewBookData = async (newBookData: Book): Promise<string | null> => {
  try {
    const docRef = await db.collection('BookData').add({
      bookId: newBookData.bookId,
      authorName: newBookData.authorName,
      bookName: newBookData.bookName,
      noOfBooks: newBookData.noOfBooks
    })
    // console.log('Successfully Added Book Data', docRef)
    return docRef.id
  } catch (error) {
    console.error('Error Adding Book', error)
    return null
  }
}

export const updateBookData = async (collectionName: string, bookData: Book): Promise<boolean> => {
  try {
    console.log(bookData.id)

    console.log('Step 1: Starting updateBookData function')
    const { id, ...bookItems } = bookData

    console.log('Step 2: Extracted id:', id)
    console.log('Step 3: Remaining book items:', bookItems)

    if (!id) {
      console.error('No ID provided in book data')
      return false
    }

    const docRef = db.collection(collectionName).doc(id)
    console.log('Step 4: Document reference created:', docRef.id)

    const result = await docRef.update(bookItems)

    console.log('Step 5: Firestore update result:', result)
    console.log('Step 6: Update successful')

    return true
  } catch (error) {
    console.error('Error updating the book:', error)
    return false
  }
}
export const deleteOneBook = async (bookId: string): Promise<boolean> => {
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

export const getAdminData = async (collectionName: string): Promise<Admin | null> => {
  try {
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef.limit(1).get()

    if (snapshot.size === 0) {
      console.log('No admin document found in collection:', collectionName)
      return null // Return null if no admin document exists
    }
    const doc = snapshot.docs[0]

    const adminData: Admin = { id: doc.id, ...doc.data() } as Admin
    // console.log(adminData)

    return adminData
  } catch (error) {
    console.error('Error getting documents:', error)
    return null
  }
}

export const addAdminData = async (newAdminData: Admin): Promise<boolean> => {
  try {
    const docRef = await db.collection('Admin').add(newAdminData)
    console.log('Successfully Added Admin Data', docRef)
    return true
  } catch (error) {
    console.error('Error Adding Documents', error)
    return false
  }
}

export const resetPassword = async (
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