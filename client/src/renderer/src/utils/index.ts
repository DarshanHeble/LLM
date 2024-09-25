export function textCapitalize(value: string): string {
  const firstLetter = value.charAt(0).toUpperCase()
  const otherLetters = value.substring(1)

  return firstLetter + otherLetters
}
