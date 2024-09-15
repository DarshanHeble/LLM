export type issuedBookType = {
  _id: string
  issueDate: Date
  dueDate: Date
  returnStatus: boolean
  fine: number
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
  _id: string
  _rev?: string
  name: string
  email: string
  phoneNumber: number
  issuedBook: issuedBookType[]
  // password: string
  noOfIssuedBooks: number
  // totalFine: number
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
  bookAddedInLibrary: Date
}

export type Admin = {
  _id: string
  name: string
  password: string
  email: string
  phoneNumber: number
}

export type AdminWith_rev = Admin & { _rev: string }
export type AdminWithout_Id_Rev = Omit<Admin, '_id'>

export type Other = {
  _id: string
  _rev?: string
  bookCount: number
  UserCount: number
  deletedBookIds: string[]
}

export type OperationResult = {
  isSuccess: boolean
  resultMessage: string[]
}
