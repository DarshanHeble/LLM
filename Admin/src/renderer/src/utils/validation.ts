import { Book } from '@shared/types'

export const validateRequired = (value: string): boolean => !!value.length

export function validateBook(book: Book): {
  // bookId: string
  authorName: string
  bookName: string
  course: string
  sem: string
  quantity: string
} {
  return {
    // bookId: !validateRequired(book.bookId) ? 'Book ID is Required' : '',
    authorName: !validateRequired(book.authorName) ? 'Author Name is Required' : '',
    bookName: !validateRequired(book.bookName) ? 'Book Name is Required' : '',
    course: !validateRequired(book.course) ? 'Course is Required' : '',
    sem:
      isNaN(book.sem) || Number(book.sem) <= 0 || Number(book.sem) >= 7
        ? 'Semester must be in between 1 - 6'
        : '',
    quantity:
      isNaN(book.quantity) || Number(book.quantity) <= 0 ? 'At least 1 Book is Required' : ''
  }
}
