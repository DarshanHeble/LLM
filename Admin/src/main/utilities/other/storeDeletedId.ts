import { Other } from '@shared/types/types'
import { pdbOthers } from '../../pouchdb'
import getOtherData from './getOtherData'

const storeDeletedId = async (bookId: string): Promise<boolean> => {
  try {
    const otherData: Other | null = await getOtherData()

    if (!otherData) {
      return false
    }

    otherData.deletedBookIds.push(bookId)

    await pdbOthers.put(otherData)
    console.log('Successfully updated Other data', otherData)

    return true
  } catch (error) {
    console.error('Error in storing deleted Book id', error)
    return false
  }
}

export default storeDeletedId
