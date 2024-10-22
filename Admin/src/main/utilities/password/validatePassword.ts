import * as bcrypt from 'bcrypt'

const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
    return isMatch
  } catch (error) {
    console.log(error)
    throw new Error('Error while validating password')
  }
}

export default validatePassword
