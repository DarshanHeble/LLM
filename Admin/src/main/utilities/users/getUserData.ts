import { User } from '@shared/types'
import { pdbUsers } from '../../pouchdb'

// Function to ensure that string or number fields are coerced to numbers
const sanitizeUserData = (user: User): User => {
  return {
    ...user,
    noOfIssuedBooks: Number(user.noOfIssuedBooks), // Ensure noOfIssuedBooks is a number
    phoneNumber: Number(user.phoneNumber), // Ensure phoneNumber is a number
    issuedBook: Array.isArray(user.issuedBook)
      ? user.issuedBook.map((book) => ({
          ...book,
          issueDate: new Date(book.issueDate),
          dueDate: new Date(book.dueDate)
        }))
      : []
  }
}

const getUserData = async (): Promise<User[]> => {
  try {
    const allUserData = await pdbUsers.allDocs({ include_docs: true, attachments: true })
    const users: User[] = allUserData.rows.map((row) => sanitizeUserData(row.doc as User))

    console.log('sanitized user data', users)
    return users
  } catch (error) {
    console.log('error getting users', error)
    return []
  }
}

export default getUserData
