import { Other } from '@shared/types/types'
import { pdbOthers } from '../../pouchdb'
import getOtherData from './getOtherData'

async function setActiveSidebarItem(sidebarItemValue: string): Promise<void> {
  try {
    const existingDoc = await getOtherData()
    if (!existingDoc) return
    const updatedOtherData: Other = {
      ...existingDoc,
      activeDrawerItem: sidebarItemValue
    }

    await pdbOthers.put(updatedOtherData)
  } catch (error) {
    console.log(error)
    return
  }
}

export default setActiveSidebarItem
