import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Admin } from '@renderer/store/types'
import { Alert, Snackbar } from '@mui/material'
// import { adminAccountData } from '../../store/mock'

function ExtraLine(props): JSX.Element {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Built with ❤️ and passion '}
      {'(' + new Date().getFullYear() + ')'}
      {'.'}
    </Typography>
  )
}

export default function Login(): JSX.Element {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const [rightCredentials, setRightCredentials] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAdminData', '')
      .then((adminAccountData: Admin | null) => {
        setAdmin(adminAccountData)
      })
  }, [])

  // useEffect(() => {
  //   console.log('Updated admin:', admin)
  // }, [admin])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name')
    const password = data.get('password')

    const isAuthenticated = (): boolean => {
      if (admin?.name != name) setErrorMessage('Wrong User Name')
      if (admin?.password != password) setErrorMessage('Wrong Password')
      if (admin?.name != name && admin?.password != password) setErrorMessage('Wrong Credentials')

      if (admin?.name == name && admin?.password == password) {
        return true
      }
      return false
    }

    if (isAuthenticated()) {
      setErrorMessage(null)
      setWrongCredentials(false)
      setRightCredentials(true)
      setTimeout(() => {
        navigate('/home')
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
        <Alert variant="filled">Successfully Logged</Alert>
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          <Grid container>
            <Grid item xs>
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
            </Grid>
            <Grid item>
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
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ExtraLine sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
