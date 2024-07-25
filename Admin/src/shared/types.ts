export type issuedBookType = {
  bookId: string
  bookName: string
  issueDate: Date
  dueDate: Date
  returnStatus: boolean
}

export type viewIssuedBookType = {
  id: string
  name: string
  bookId: string
  bookName: string
  noOfBooks: number
  issueDate: string
  dueDate: string
  returnStatus: string
}

export type User = {
  id: string
  name: string
  // password: string
  email: string
  phoneNumber: number
  noOfIssuedBooks: number
  issuedBook: issuedBookType[]
}

export type Book = {
  id: string
  // bookId: string
  bookName: string
  authorName: string
  course: string
  sem: number
  noOfBooks: number
}

export type Admin = {
  _id: string
  name: string
  password: string
  email: string
  phoneNumber: number
}

export type AdminWith_rev = Admin & { _rev: string }
