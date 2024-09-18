import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { Admin } from '@shared/types/types'

export default function ForgotPassword(): JSX.Element {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const [rightCredentials, setRightCredentials] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getAdminData', '').then((adminData: Admin | null) => {
      console.log(adminData)
      setAdmin(adminData)
      console.log(admin)
    })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name')
    const email = data.get('email')
    const phoneNumberString = data.get('phoneNumber')

    const isAuthenticated = (): boolean => {
      if (admin?.name != name) setErrorMessage('Wrong User Name')
      if (admin?.email != email) setErrorMessage('Wrong Password')

      const phoneNumber = phoneNumberString ? Number(phoneNumberString) : null
      if (admin?.phoneNumber != phoneNumber) setErrorMessage('Wrong Number')

      if (admin?.name == name && admin?.email == email) {
        return true
      }
      return false
    }

    if (isAuthenticated()) {
      setErrorMessage(null)
      setWrongCredentials(false)
      setRightCredentials(true)
      setTimeout(() => {
        navigate('/resetPassword')
      }, 1500)
    } else {
      // setErrorMessage('Wrong Credentials')
      setWrongCredentials(true)
      setRightCredentials(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        open={wrongCredentials}
        autoHideDuration={3000}
        onClose={() => setWrongCredentials(false)}
      >
        <Alert severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={rightCredentials}
        autoHideDuration={3000}
        onClose={() => setRightCredentials(false)}
      >
        <Alert variant="filled">Verified</Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            type="text"
            margin="normal"
            required
            fullWidth
            id="name"
            label="name"
            name="name"
            autoComplete="name"
            autoFocus
          />

          <TextField
            type="email"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            type="tel"
            required
            fullWidth
            name="PhoneNumber"
            label="Phone Number"
            id="PhoneNumber"
            autoComplete="PhoneNumber"
          />
          <Button
            component="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Verify
          </Button>
        </Box>
      </Box>
      <ExtraLine sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
function ExtraLine(props): JSX.Element {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Built with ❤️ and passion '}
      {'(' + new Date().getFullYear() + ')'}
      {'.'}
    </Typography>
  )
}
