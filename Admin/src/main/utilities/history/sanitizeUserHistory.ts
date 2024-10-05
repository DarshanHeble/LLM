import { UserHistory } from '@shared/types/types'

export const sanitizeUserHistory = (data: UserHistory): UserHistory => {
  const updatedData: UserHistory = {
    _id: data._id,
    _rev: data._rev,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    bookHistory: data.bookHistory
  }

  return updatedData
}
