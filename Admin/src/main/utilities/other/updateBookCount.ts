import { Other } from '@shared/types/types'
import { pdbOthers } from '../../pouchdb'

const updateBookCount = async (updatedOtherData: Other): Promise<boolean> => {
  try {
    const existingDoc = await pdbOthers.get<Other>(updatedOtherData._id)

    const OtherData: Other = {
      ...existingDoc,
      bookCount: updatedOtherData.bookCount
    }
    await pdbOthers.put(OtherData)
    console.log('updated other data')

    return true
  } catch (error) {
    console.error('error updating the book id count', error)
    return false
  }
}

export default updateBookCount
