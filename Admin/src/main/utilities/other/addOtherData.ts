import { Other } from '@shared/types/types'
import { pdbOthers } from '../../pouchdb'

const addOtherData = async (): Promise<void> => {
  try {
    await pdbOthers.get('other')
    console.log('Other Data is Already Available')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.status === 404) {
      try {
        const otherData: Other = {
          _id: 'other',
          bookCount: 0,
          UserCount: 0,
          activeDrawerItem: '',
          isDrawerLarge: true,
          deletedBookIds: []
        }
        pdbOthers.put(otherData)
        console.log('Successfully added other data db')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
export default addOtherData
