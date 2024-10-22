import * as bcrypt from 'bcrypt'

async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(plainPassword, salt)
    return hashedPassword
  } catch (error) {
    console.log(error)
    throw new Error('Error hashing password')
  }
}
export default hashPassword
