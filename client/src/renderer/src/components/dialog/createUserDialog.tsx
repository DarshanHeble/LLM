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
import { User } from '@shared/types/types'
import { useEffect, useRef, useState } from 'react'

interface CreateUser {
  open: boolean
  onClose: () => void
}

interface UserFormData {
  _id: string
  name: string
  email: string
  phoneNumber: string
  password: string
}
const phoneRegex: RegExp = /^\d{10}$/
const _idRegex: RegExp = /^[uU]02[kK]{2}\d{2}[a-zA-Z]\d{4}$/
const minimumPasswordLength: number = 6

const CreateUserDialog = (props: CreateUser): JSX.Element => {
  const { open, onClose } = props
  const textFieldRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<UserFormData>({
    _id: '',
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  })

  const [phoneNumError, setPhoneNumError] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordLengthError, setPasswordLengthError] = useState<string | null>(null)
  const [idError, setIdError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      // Delay focusing to ensure that the dialog is fully rendered
      setTimeout(() => {
        if (textFieldRef.current) {
          textFieldRef.current.focus()
        }
      }, 200)
    }
  }, [open])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(event.target.value)
  }

  function isPhoneNumberValid(phoneNumber: string): boolean {
    return phoneRegex.test(phoneNumber)
  }

  function is_IdValid(_id: string): boolean {
    return _idRegex.test(_id)
  }

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()

    if (!is_IdValid(formData._id)) {
      console.log('Please enter a valid UUCMS Number')

      setIdError('Please enter a valid UUCMS Number')
      return
    }
    // if _id is valid then clear the error
    setIdError(null)

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

    const newUserData: User = {
      _id: formData._id.toUpperCase(),
      name: textCapitalize(formData.name),
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      noOfIssuedBooks: 0,
      issuedBooks: [],
      addedAt: new Date(),
      requestedBooks: []

      // issuedBooks:0,
    }
    // send to backend
    const isUserAdded = await window.electron.ipcRenderer.invoke(
      'sendUserDataToAdminApp',
      newUserData
    )
    console.log('user added: ', isUserAdded)

    onClose()
  }
  // const fakeFormData: UserFormData = {
  //   _id: 'U02KK21S0000',
  //   name: 'XYZ',
  //   email: 'mitun@gmail.com',
  //   phoneNumber: '1234567890',
  //   password: 'password'
  // }
  // window.electron.ipcRenderer.invoke('sendUserDataToAdminApp', fakeFormData).then((re: boolean) => {
  //   console.log('user added', re)
  // })

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: '#121212', width: '24rem' }}>
        <DialogTitle>Create New Account</DialogTitle>
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
              inputRef={textFieldRef}
              autoComplete="_id"
              error={!!idError}
              helperText={idError}
              autoFocus
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

export default CreateUserDialog
