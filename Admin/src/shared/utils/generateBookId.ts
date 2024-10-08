import { Other } from '@shared/types/types'

const generateBookId = async (): Promise<[string, Other] | null> => {
  try {
    // Get the Data from Database
    const otherData: Other = await window.electron.ipcRenderer.invoke('getOtherData')

    // check if there is any deleted Book Id in database if yes then return the deleted Book Id
    if (otherData.deletedBookIds) {
      const extractedBookIds = otherData.deletedBookIds.shift()

      if (extractedBookIds !== undefined) {
        return [extractedBookIds, otherData]
      }
    }

    const updatedBookCount = otherData.bookCount + 1
    const bookCount: string = updatedBookCount.toString().padStart(6, '0')
    const formattedBookCount: string = 'B' + bookCount

    const updatedOtherData: Other = { ...otherData, bookCount: updatedBookCount }

    return [formattedBookCount, updatedOtherData]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    try {
      if (error.status === 404) {
        console.error(
          'Unable to fetch latest book Id from database, so cant able to generate book Id'
        )
        return null
      } else {
        return null
      }
    } catch (error) {
      console.error('Error while generating book id', error)
      return null
    }
  }
}

export default generateBookId
