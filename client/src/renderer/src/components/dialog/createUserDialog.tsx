import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { useState } from 'react'

interface CreateUser {
  open: boolean
  onClose: () => void
}

interface UserFormData {
  name: string
  email: string
  phoneNumber: string
  password: string
}

const CreateUserDialog = (props: CreateUser): JSX.Element => {
  const { open, onClose } = props

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  })

  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

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

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()

    // Validate if passwords match
    if (formData.password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    // Clear error if passwords match
    setPasswordError(null)

    console.log(formData)
    // Handle the form data (e.g., send it to a server)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: '#202020', width: '24rem' }}>
        <DialogTitle>Create New Account</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}
          >
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
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
