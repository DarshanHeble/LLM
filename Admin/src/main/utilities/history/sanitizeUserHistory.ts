import { UserHistory } from '@shared/types/types'

export const sanitizeUserHistory = (data: UserHistory): UserHistory => {
  const updatedData: UserHistory = {
    _id: data._id,
    _rev: data._rev,
    name: data.name,
    email: data.email,
    addedAt: new Date(data.addedAt),
    phoneNumber: data.phoneNumber,
    bookHistory: Array.isArray(data.bookHistory)
      ? data.bookHistory.map((book) => ({
          ...book,
          issueDate: new Date(book.issueDate),
          dueDate: new Date(book.dueDate),
          returnedDate: new Date(book.returnedDate)
        }))
      : []
  }

  return updatedData
}
