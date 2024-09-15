import { Other } from '@shared/types'

const generateBookId = async (): Promise<[string, Other] | null> => {
  try {
    // Get the Data from Database
    const otherData: Other = await window.electron.ipcRenderer.invoke('getOtherData')
    // console.log('got this data ', otherData)

    const updatedBookCount = otherData.bookCount + 1
    const bookCount: string = updatedBookCount.toString().padStart(6, '0')
    const formattedBookCount: string = 'B' + bookCount

    const updatedOtherData: Other = { ...otherData, bookCount: updatedBookCount }
    // console.log('updated other data', updatedOtherData)

    // await window.electron.ipcRenderer.invoke('updateBookCount', updatedOtherData)

    console.log(formattedBookCount)

    return [formattedBookCount, updatedOtherData]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    try {
      if (error.status === 404) {
        const errorMessage =
          'Unable to fetch latest book Id from database, so cant able to generate book Id'
        console.error(errorMessage)
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
