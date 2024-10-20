import { User } from '@shared/types/types'
import { calculateFine } from '@shared/utils'

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

export const sanitizeUserDataToApp = (user: User): User => {
  return {
    ...user,
    noOfIssuedBooks: Array.isArray(user.issuedBooks) ? Number(user.issuedBooks.length) : 0, // Check if issuedBooks is an array
    phoneNumber: user.phoneNumber ? user.phoneNumber.toString() : '', // Ensure phoneNumber exists and is string
    addedAt: user.addedAt ? new Date(user.addedAt) : new Date(), // Handle case where addedAt is missing
    issuedBooks: Array.isArray(user.issuedBooks)
      ? user.issuedBooks.map((book) => ({
          ...book,
          issueDate: new Date(book.issueDate),
          dueDate: new Date(book.dueDate),
          fine: calculateFine(new Date(book.dueDate))
        }))
      : [], // Fallback to empty array if issuedBooks is undefined or not an array
    requestedBooks: Array.isArray(user.requestedBooks)
      ? user.requestedBooks.map((book) => ({
          ...book,
          requestedDate: new Date(book.requestedDate)
        }))
      : [] // Fallback to empty array if requestedBooks is undefined or not an array
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
