import { Other } from '@shared/types'

const generateBookId = async (): Promise<string | null> => {
  try {
    // Get the Data from Database
    const otherData: Other = await window.electron.ipcRenderer.invoke('getOtherData')
    // console.log('got this data ', otherData)

    const updatedBookCount = otherData.bookCount + 1
    const bookCount: string = updatedBookCount.toString().padStart(6, '0')
    const formattedBookCount: string = 'B' + bookCount

    const updatedOtherData: Other = { ...otherData, bookCount: updatedBookCount }
    // console.log('updated other data', updatedOtherData)

    await window.electron.ipcRenderer.invoke('updateBookCount', updatedOtherData)

    console.log(formattedBookCount)

    return formattedBookCount
  } catch (error) {
    console.error('Error while generating book id', error)
    return null
  }
}

export default generateBookId
