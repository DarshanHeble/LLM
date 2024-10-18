export type issuedBookType = {
  _id: string
  issueDate: Date
  dueDate: Date
  returnedDate?: Date
  fine: number
}

export type RequestedBookType = {
  _id: string
  requestedDate: Date
}

export type User = {
  _id: string
  _rev?: string
  name: string
  email: string
  phoneNumber: string
  password: string
  addedAt: Date
  noOfIssuedBooks: number
  issuedBooks: issuedBookType[]
  requestedBooks: RequestedBookType[]
}

export type Book = {
  _id: string
  _rev?: string
  // bookId: string
  bookName: string
  authorName: string
  course: string
  sem: number
  quantity: number
  addedAt: Date
}

export type UserFormData = Omit<User, 'issuedBooks' | 'noOfIssuedBooks'>

export type OperationResult = {
  isSuccess: boolean
  resultMessage: string[]
}
