import * as nodemailer from 'nodemailer'

const sendEmailOTP = async (OTP: string): Promise<void> => {
  nodemailer.createTransport({
    service: 'gmail'
  })
}

export default sendEmailOTP
