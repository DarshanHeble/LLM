function calculateFine(dueDate: Date): number {
  const currentDate = new Date()

  const timeDifference = currentDate.getTime() - dueDate.getTime()

  const daysLate = Math.ceil(timeDifference / (1000 * 3600 * 24))

  if (Math.sign(daysLate) === -1) {
    return 0
  }

  return daysLate
}

export default calculateFine
