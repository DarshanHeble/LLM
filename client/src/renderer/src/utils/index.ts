import { User } from '@shared/types/types'

export function textCapitalize(value: string): string {
  const firstLetter = value.charAt(0).toUpperCase()
  const otherLetters = value.substring(1)

  return firstLetter + otherLetters
}

export function formatDate(date: Date): string {
  return date.toLocaleString('en-GB', { hour12: true })
}

export async function getOneUserData(id: string): Promise<User> {
  const user: User = await window.electron.ipcRenderer.invoke('getOneUserData', id)
  return user
}
