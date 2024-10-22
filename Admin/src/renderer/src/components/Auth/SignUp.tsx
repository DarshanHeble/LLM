import { useEffect, useState } from 'react'
import { Admin, AdminWithout_Id_Rev } from '@shared/types/types'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  TextField,
  Typography
} from '@mui/material'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { LockOutlined } from '@mui/icons-material'
import ExtraLine from './ExtraLine'

export default function SignUp(): JSX.Element {
  const navigate = useNavigate()
  const { showAlert } = useAlertToast()
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)

  // const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAdminData', '')
      .then((adminAccountData: Admin | null) => {
        setAdmin(adminAccountData)
      })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setLoading(true)
    const data = new FormData(event.currentTarget)

    const name = data.get('name') ? String(data.get('name')) : undefined
    const password = data.get('password') ? String(data.get('password')) : undefined
    const email = data.get('email') ? String(data.get('email')) : undefined
    const phoneNumber = data.get('phoneNumber') ? Number(data.get('phoneNumber')) : undefined

    const documentData: AdminWithout_Id_Rev = {
      name: name ? name : '',
      email: email ? email : '',
      password: password ? password : '',
      phoneNumber: phoneNumber ? phoneNumber : 0
    }

    window.electron.ipcRenderer.invoke('addAdminData', documentData).then((re: boolean) => {
      if (re == true) {
        showAlert('Successfully Logged', 'success')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        showAlert('something went wrong', 'error')
        // alert('something went wrong')
      }
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            type="text"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            type="email"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            type="tel"
            required
            fullWidth
            name="phoneNumber"
            label="PhoneNumber"
            id="PhoneNumber"
            autoComplete="PhoneNumber"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress sx={{ color: 'black' }} /> : 'Sign Up'}
          </Button>
          {admin && (
            <Link component="button" variant="body2" onClick={() => navigate('/')}>
              {'Already have an account? Login Up'}
            </Link>
          )}
        </Box>
      </Box>
      <ExtraLine sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
