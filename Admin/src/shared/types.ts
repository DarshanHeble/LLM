export type issuedBookType = {
  id: string
  issueDate: Date
  dueDate: Date
  returnStatus: boolean
}

export type viewIssuedBookType = {
  id: string // Assuming id is a string based on your previous examples
  issueDate: Date
  dueDate: Date
  returnStatus: boolean
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
  bookId: string
  bookName: string
  authorName: string
  course: string
  sem: number
  noOfBooks: number
}

export type Admin = {
  id?: string
  name?: string
  password?: string
  email?: string
  phoneNumber?: number
}
