import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { textCapitalize } from '@renderer/utils'
import { User, UserFormData } from '@shared/types/types'
import { useState } from 'react'

interface EditUser {
  open: boolean
  onClose: () => void
  onSubmit: (userFormData: User) => void
  prevData: User
}

const phoneRegex: RegExp = /^\d{10}$/
// const _idRegex: RegExp = /^U02KK\d{2}S\d{4}$/

const EditUserDialog = (props: EditUser): JSX.Element => {
  const { open, onClose, onSubmit, prevData } = props
  console.log(prevData)

  // use formData variable for UI
  const [formData, setFormData] = useState<UserFormData>({
    _id: prevData._id,
    name: prevData.name,
    email: prevData.email,
    phoneNumber: prevData.phoneNumber,
    password: prevData.password,
    addedAt: prevData.addedAt,
    requestedBooks: prevData.requestedBooks
  })

  const [phoneNumError, setPhoneNumError] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

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

    const isPasswordMatched = await window.electron.ipcRenderer.invoke(
      'validatePassword',
      confirmPassword,
      prevData.password
    )

    if (!isPasswordMatched) {
      // Validate if passwords match
      setPasswordError('Passwords do not match')
      return
    }

    // Clear password error if everything is good
    setPasswordError(null)

    const updatedUserFormData: User = {
      _id: formData._id.toUpperCase(),
      name: textCapitalize(formData.name),
      email: formData.email,
      password: prevData.password, // add correct password(password in the input field might be changed)
      phoneNumber: formData.phoneNumber,
      noOfIssuedBooks: prevData.issuedBooks.length,
      issuedBooks: prevData.issuedBooks,
      addedAt: prevData.addedAt,
      requestedBooks: prevData.requestedBooks
    }

    onSubmit(updatedUserFormData)
    onClose()
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
              // onChange={handleChange}
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
              // error={!!passwordLengthError}
              // helperText={passwordLengthError}
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
