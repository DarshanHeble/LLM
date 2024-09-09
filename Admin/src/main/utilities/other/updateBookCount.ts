import { Other } from '@shared/types'
import { pdbOthers } from '../../pouchdb'

const updateBookCount = async (updatedOtherData: Other): Promise<boolean> => {
  try {
    await pdbOthers.put(updatedOtherData)

    return true
  } catch (error) {
    console.error('error updating the book id count', error)
    return false
  }
}

export default updateBookCount
