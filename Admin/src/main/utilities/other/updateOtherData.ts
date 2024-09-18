import { Other } from '@shared/types'
import { pdbOthers } from '../../pouchdb'

const updateOtherCount = async (updatedOtherData: Other): Promise<boolean> => {
  try {
    const existingDoc = pdbOthers.get<Other>(updatedOtherData._id)
    await pdbOthers.put<Other>({ ...updatedOtherData, ...existingDoc })

    return true
  } catch (error) {
    console.error('error updating the book id count', error)
    return false
  }
}

export default updateOtherCount
