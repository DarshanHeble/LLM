export type issuedBookType = {
  bookId: string
  issueDate: Date
  dueDate: Date
  returnStatus: boolean
}

export type User = {
  id: string
  userId: string
  name: string
  // password: string
  email: string
  phoneNumber: number
  noOfIssuedBooks: number
  issuedBook: issuedBookType[]
}

export type Admin = {
  id?: string
  name?: string
  password?: string
  email?: string
  phoneNumber?: number
}
export type Book = {
  id: string
  bookId: string
  bookName: string
  authorName: string
  noOfBooks: number
}
