import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Admin } from '@shared/types/types'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { Avatar, Box, Button, Container, Grid2, Link, TextField, Typography } from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import ExtraLine from './ExtraLine'

export default function Login(): JSX.Element {
  const navigate = useNavigate()
  const { showAlert } = useAlertToast()
  const [isDev, setIsDev] = useState(false)

  // navigate('/dashBoard')
  const [admin, setAdmin] = useState<Admin | null>(null)

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAdminData', '')
      .then((adminAccountData: Admin | null) => {
        setAdmin(adminAccountData)
      })

    window.electron.ipcRenderer.invoke('isDev').then((isDev) => {
      if (isDev) setIsDev(isDev)
    })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name')
    const password = data.get('password')

    const isAuthenticated = (): boolean => {
      if (admin?.name != name && admin?.password != password) {
        showAlert('Wrong Credentials', 'error')
        return false
      }

      if (admin?.name != name) {
        showAlert('Wrong User Name', 'error')
        return false
      }
      if (admin?.password != password) {
        showAlert('Wrong Password', 'error')
        return false
      }

      if (admin?.name == name && admin?.password == password) {
        showAlert('Successfully logged In', 'success')
        return true
      }
      showAlert('Error Occurred', 'error')
      return false
    }

    if (isAuthenticated()) {
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    }
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {isDev && (
        <Button
          sx={{ position: 'absolute', bottom: 0, right: 0 }}
          onClick={() => navigate('/dashBoard')}
        >
          Go to Dashboard
        </Button>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid2 container>
            <Grid2>
              {admin && (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/forgetPassword')}
                  // TODO: need to fix initial render
                  sx={{ visibility: !admin ? 'hidden' : null }}
                >
                  Forgot password?
                </Link>
              )}
            </Grid2>
            <Grid2>
              {!admin && (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signUp')}
                  // TODO: need to fix initial render
                  sx={{ visibility: admin ? 'hidden' : 'visible' }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              )}
            </Grid2>
          </Grid2>
        </Box>
      </Box>
      <ExtraLine sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
