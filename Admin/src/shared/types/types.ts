export type viewIssuedBookType = {
  id: string
  name: string
  bookId: string
  bookName: string
  // noOfBooks: number
  issueDate: string
  dueDate: string
}
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
  addedAt: Date
}

export type Admin = {
  _id: string
  name: string
  password: string
  email: string
  phoneNumber: number
}

export type AdminWith_rev = Admin & { _rev: string }
export type AdminWithout_Id_Rev = Omit<Admin, '_id' | '_rev'>
export type UserFormData = Omit<User, 'issuedBooks' | 'noOfIssuedBooks'>

export type bookFormData = {
  _id: string
  _rev?: string
  // bookId: string
  bookName: string
  authorName: string
  course: string
  sem: string
  quantity: number
  addedAt: Date
}

export type Other = {
  _id: string
  _rev?: string
  bookCount: number
  UserCount: number
  isDrawerLarge: boolean
  activeDrawerItem: string
  deletedBookIds: string[]
}

export type OperationResult = {
  isSuccess: boolean
  resultMessage: string[]
}

export type UserHistory = {
  _id: string
  _rev?: string
  name: string
  email: string
  addedAt: string
  phoneNumber: string
  bookHistory: BookHistory[]
}

export type BookHistory = {
  id: string
  bookName: string
  authorName: string
  course: string
  sem: number
  issueDate: string
  dueDate: string
  returnedDate: string
  fine: number
}
