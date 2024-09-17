import { Book } from '@shared/types'
type SanitizeBookDataToPouchDb = {
  sem: number
  quantity: number
  addedAt: string
  _id: string
  _rev?: string
  bookName: string
  authorName: string
  course: string
}

// Function to ensure that string or number fields are coerced to numbers
export const sanitizeBookDataToApp = (book: Book): Book => {
  return {
    ...book,
    sem: Number(book.sem),
    quantity: Number(book.quantity),
    addedAt: new Date(book.addedAt)
  }
}

export const sanitizeBookDataToPouchDb = (book: Book): SanitizeBookDataToPouchDb => {
  return {
    ...book,
    sem: Number(book.sem),
    quantity: Number(book.quantity),
    addedAt: book.addedAt.toISOString()
  }
}
