export type User = {
  id: string
  name: string
  password: string
  email: string
  phoneNumber: number
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
