export type User = {
  _id: string
  _rev?: string
  name: string
  email: string
  phoneNumber: string
  password: string
  addedAt: string
  bookHistory: BookHistory[]
}

export type BookHistory = {
  id: string
  bookName: string
  authorName: string
  course: string
  sem: number
  issueDate: Date
  dueDate: Date
  returnedDate: Date
  fine: number
}

export const fakeData: User[] = [
  {
    _id: '1',
    email: 'user@example.com',
    name: 'user',
    password: 'password',
    phoneNumber: '1234567890',
    _rev: '1',
    addedAt: 'January',
    bookHistory: [
      {
        id: 'b1',
        authorName: 'John',
        bookName: 'java',
        course: 'BCA',
        sem: 1,
        dueDate: new Date(),
        issueDate: new Date(),
        returnedDate: new Date(),
        fine: 0
      },
      {
        id: 'b2',
        authorName: 'John',
        bookName: 'java',
        course: 'BCA',
        sem: 1,
        dueDate: new Date(),
        issueDate: new Date(),
        returnedDate: new Date(),
        fine: 0
      }
    ]
  },
  {
    _id: '2',
    email: 'user@example.com',
    name: 'user',
    password: 'password',
    phoneNumber: '1234567890',
    _rev: '1',
    addedAt: 'January',
    bookHistory: [
      {
        id: 'b1',
        authorName: 'John',
        bookName: 'java',
        course: 'BCA',
        sem: 1,
        dueDate: new Date(),
        issueDate: new Date(),
        returnedDate: new Date(),
        fine: 0
      },
      {
        id: 'b2',
        authorName: 'John',
        bookName: 'java',
        course: 'BCA',
        sem: 1,
        dueDate: new Date(),
        issueDate: new Date(),
        returnedDate: new Date(),
        fine: 0
      }
    ]
  },
  {
    _id: '3',
    email: 'user@example.com',
    name: 'user',
    password: 'password',
    phoneNumber: '1234567890',
    _rev: '1',
    addedAt: 'January',
    bookHistory: [
      {
        id: 'b1',
        authorName: 'John',
        bookName: 'java',
        course: 'BCA',
        sem: 1,
        dueDate: new Date(),
        issueDate: new Date(),
        returnedDate: new Date(),
        fine: 0
      },
      {
        id: 'b2',
        authorName: 'John',
        bookName: 'java',
        course: 'BCA',
        sem: 1,
        dueDate: new Date(),
        issueDate: new Date(),
        returnedDate: new Date(),
        fine: 0
      }
    ]
  }
]
