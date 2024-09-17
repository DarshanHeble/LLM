import { Book } from '@shared/types'
import { Dayjs } from 'dayjs'

// Function to ensure that string or number fields are coerced to numbers
const sanitizeBookData = (book: Book): Book => {
  return {
    ...book,
    sem: Number(book.sem),
    quantity: Number(book.quantity),
    addedAt: new Dayjs(book.addedAt)
  }
}
export default sanitizeBookData
