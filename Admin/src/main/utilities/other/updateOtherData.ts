import { Other } from '@shared/types/types'
import { pdbOthers } from '../../pouchdb'

const updateOtherData = async (updatedOtherData: Other): Promise<boolean> => {
  try {
    const existingDoc = await pdbOthers.get<Other>(updatedOtherData._id)
    await pdbOthers.put<Other>({
      ...existingDoc,
      ...updatedOtherData,
      _rev: existingDoc._rev
    })

    return true
  } catch (error) {
    console.error('error updating the book id count', error)
    return false
  }
}

export default updateOtherData
