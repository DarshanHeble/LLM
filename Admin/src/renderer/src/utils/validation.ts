import { Book } from '@shared/types'

export const validateRequired = (value: string): boolean => !!value.length

export function validateBook(book: Book): {
  bookId: string
  authorName: string
  bookName: string
  noOfBooks: string
} {
  return {
    bookId: !validateRequired(book.bookId) ? 'Book ID is Required' : '',
    authorName: !validateRequired(book.authorName) ? 'Author Name is Required' : '',
    bookName: !validateRequired(book.bookName) ? 'Book Name is Required' : '',
    noOfBooks:
      isNaN(book.noOfBooks) || Number(book.noOfBooks) <= 0 ? 'Atleast 1 Book is Required' : ''
  }
}
