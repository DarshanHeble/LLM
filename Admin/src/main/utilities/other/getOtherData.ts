import { Other } from '@shared/types/types'
import { pdbOthers } from '../../pouchdb'

const getOtherData = async (): Promise<Other | null> => {
  try {
    const other: Other = await pdbOthers.get('other')
    return other
  } catch (error) {
    console.error('Error in getting other data', error)
    return null
  }
}
export default getOtherData
