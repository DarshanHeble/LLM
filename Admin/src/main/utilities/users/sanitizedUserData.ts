import { User } from '@shared/types'
import { Dayjs } from 'dayjs'

// Function to ensure that string or number fields are coerced to numbers
const sanitizeUserData = (user: User): User => {
  return {
    ...user,
    noOfIssuedBooks: Number(user.noOfIssuedBooks), // Ensure noOfIssuedBooks is a number
    phoneNumber: Number(user.phoneNumber), // Ensure phoneNumber is a number
    issuedBook: Array.isArray(user.issuedBook)
      ? user.issuedBook.map((book) => ({
          ...book,
          issueDate: new Dayjs(book.issueDate),
          dueDate: new Dayjs(book.dueDate)
        }))
      : []
  }
}

export default sanitizeUserData
