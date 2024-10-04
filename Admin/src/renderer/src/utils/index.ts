// Function to format dates as dd-mm-yyyy hh:mm:ss AM/PM
export const formatDateTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0')

  return `${day}/${month}/${year} ${strHours}:${minutes}:${seconds} ${ampm}`
}

export function textCapitalize(value: string): string {
  const firstLetter = value.charAt(0).toUpperCase()
  const otherLetters = value.substring(1)

  return firstLetter + otherLetters
}

export function sendBookDataToClient(): void {
  try {
    window.electron.ipcRenderer.send('sendBookDataToClient')
  } catch (error) {
    console.log(error)
  }
}

export function sendUserDataToClient(): void {
  try {
    window.electron.ipcRenderer.send('sendUserDataToClient')
  } catch (error) {
    console.log(error)
  }
}
