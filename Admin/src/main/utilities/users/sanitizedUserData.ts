import { User } from '@shared/types/types'

type SanitizeUserDataToPouchDb = {
  _id: string
  _rev?: string
  name: string
  noOfIssuedBooks: number
  phoneNumber: string
  addedAt: string

  issuedBooks: {
    _id: string
    issueDate: string
    dueDate: string
    fine: number
  }[]
  requestedBooks: {
    _id: string
    requestedDate: string
  }[]
}

function calculateFine(dueDate: Date): number {
  const currentDate = new Date()

  const timeDifference = currentDate.getTime() - dueDate.getTime()

  const daysLate = Math.ceil(timeDifference / (1000 * 3600 * 24))

  return daysLate
}

// Function to ensure that string or number fields are coerced to numbers
export const sanitizeUserDataToApp = (user: User): User => {
  return {
    ...user,
    noOfIssuedBooks: Number(user.issuedBooks.length),
    phoneNumber: user.phoneNumber.toString(),
    addedAt: new Date(user.addedAt), // convert ISO string to Date object
    issuedBooks: Array.isArray(user.issuedBooks)
      ? user.issuedBooks.map((book) => ({
          ...book,
          issueDate: new Date(book.issueDate),
          dueDate: new Date(book.dueDate),
          fine: calculateFine(new Date(book.dueDate))
        }))
      : [],
    requestedBooks: Array.isArray(user.requestedBooks)
      ? user.requestedBooks.map((book) => ({
          ...book,
          requestedDate: new Date(book.requestedDate)
        }))
      : []
  }
}
export const sanitizeUserDataToPouchDb = (user: User): SanitizeUserDataToPouchDb => {
  return {
    ...user,
    addedAt: user.addedAt.toISOString(),
    phoneNumber: user.phoneNumber.toString(),
    noOfIssuedBooks: Number(user.issuedBooks.length),
    issuedBooks: Array.isArray(user.issuedBooks)
      ? user.issuedBooks.map((book) => ({
          ...book,
          issueDate: book.issueDate.toISOString(), //convert date to ISO String
          dueDate: book.dueDate.toISOString()
        }))
      : [],
    requestedBooks: Array.isArray(user.requestedBooks)
      ? user.requestedBooks.map((book) => ({
          ...book,
          requestedDate: book.requestedDate.toISOString()
        }))
      : []
  }
}
