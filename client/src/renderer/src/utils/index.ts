export function textCapitalize(value: string): string {
  const firstLetter = value.charAt(0).toUpperCase()
  const otherLetters = value.substring(1)

  return firstLetter + otherLetters
}

export function formatDate(date: Date): string {
  return date.toLocaleString('en-GB', { hour12: true })
  // return date
}
