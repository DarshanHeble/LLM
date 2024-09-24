import { User } from '@shared/types/types'

type SanitizeUserDataToPouchDb = {
  noOfIssuedBooks: number
  phoneNumber: string
  issuedBooks: {
    issueDate: string
    dueDate: string
    _id: string
    returnedDate?: Date
    fine: number
  }[]
  _id: string
  _rev?: string
  name: string
}

// Function to ensure that string or number fields are coerced to numbers
export const sanitizeUserDataToApp = (user: User): User => {
  return {
    ...user,
    noOfIssuedBooks: Number(user.noOfIssuedBooks), // Ensure noOfIssuedBooks is a number
    phoneNumber: user.phoneNumber.toString(), // Ensure phoneNumber is a number
    issuedBooks: Array.isArray(user.issuedBooks)
      ? user.issuedBooks.map((book) => ({
          ...book,
          issueDate: new Date(book.issueDate),
          dueDate: new Date(book.dueDate)
        }))
      : []
  }
}
export const sanitizeUserDataToPouchDb = (user: User): SanitizeUserDataToPouchDb => {
  return {
    ...user,
    noOfIssuedBooks: Number(user.noOfIssuedBooks), // Ensure noOfIssuedBooks is a number
    phoneNumber: user.phoneNumber.toString(), // Ensure phoneNumber is a number
    issuedBooks: Array.isArray(user.issuedBooks)
      ? user.issuedBooks.map((book) => ({
          ...book,
          issueDate: book.issueDate.toISOString(), //convert date to ISO String
          dueDate: book.dueDate.toISOString()
        }))
      : []
  }
}
