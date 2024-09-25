import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { User, UserFormData } from '@shared/types/types'
import { useState } from 'react'

interface EditUser {
  open: boolean
  onClose: () => void
  onSubmit: (userFormData: UserFormData) => void
  prevData: User
}

const phoneRegex: RegExp = /^\d{10}$/
// const _idRegex: RegExp = /^U02KK\d{2}S\d{4}$/
const minimumPasswordLength: number = 6

const EditUserDialog = (props: EditUser): JSX.Element => {
  const { open, onClose, onSubmit, prevData } = props
  console.log(prevData)

  const [formData, setFormData] = useState<UserFormData>({
    _id: prevData._id,
    name: prevData.name,
    email: prevData.email,
    phoneNumber: prevData.phoneNumber,
    password: prevData.password
  })

  const [phoneNumError, setPhoneNumError] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordLengthError, setPasswordLengthError] = useState<string | null>(null)
  // const [idError, setIdError] = useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    // onSubmit(formData)
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(event.target.value)
  }

  function isPhoneNumberValid(phoneNumber: string): boolean {
    return phoneRegex.test(phoneNumber)
  }

  // function is_IdValid(_id: string): boolean {
  //   return _idRegex.test(_id)
  // }

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()

    if (!isPhoneNumberValid(formData.phoneNumber)) {
      console.log('not valid phone number')

      setPhoneNumError('Please enter a valid phone number')
      return
    }

    // if phone number is valid then clear the error
    setPhoneNumError(null)

    if (formData.password.length < minimumPasswordLength) {
      console.log('Password must be at least ' + minimumPasswordLength + ' digit long')
      setPasswordLengthError('Password must be at least ' + minimumPasswordLength + ' digit long')
      return
    }

    // Clear  error if password strength is good
    setPasswordLengthError(null)

    if (formData.password !== confirmPassword) {
      // Validate if passwords match
      setPasswordError('Passwords do not match')
      return
    }

    // Clear password error if everything is good
    setPasswordError(null)

    onSubmit(formData)
    // onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: '#121212', width: '24rem' }}>
        <DialogTitle>Edit User Account</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}
          >
            <TextField
              label="Id"
              type="text"
              variant="outlined"
              name="_id"
              value={formData._id}
              onChange={handleChange}
              // autoComplete="_id"
              // error={!!idError}
              // helperText={idError}
              disabled
              required
            />
            <TextField
              label="Name"
              type="text"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Phone Number"
              type="tel"
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!phoneNumError}
              helperText={phoneNumError}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!passwordLengthError}
              helperText={passwordLengthError}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              error={!!passwordError} // Show error if passwords don't match
              helperText={passwordError} // Display error message
            />
            <DialogActions>
              <Button color="error" onClick={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default EditUserDialog
