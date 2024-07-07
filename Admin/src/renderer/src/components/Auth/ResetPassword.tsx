import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Alert, CircularProgress, Snackbar } from '@mui/material'
import { Admin } from '@shared/types'

export function ResetPassword(): JSX.Element {
  const navigate = useNavigate()
  const [, setAdmin] = useState<Admin | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const [rightCredentials, setRightCredentials] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getAdminData', '').then((adminData: Admin | null) => {
      setAdmin(adminData)
    })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    setLoading(true)
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const newPassword = data.get('newPassword')
    const confirmNewPassword = data.get('confirmNewPassword')

    const isPasswordsMatched = (): boolean => {
      if (newPassword == confirmNewPassword) {
        setErrorMessage(null)
        return true
      } else {
        setErrorMessage('Passwords Do Not Match')
      }
      return false
    }

    function resetPassword(): void {
      window.electron.ipcRenderer.invoke('resetAdminPassword', newPassword).then((re: boolean) => {
        console.log(re)
        if (re == true) {
          setLoading(false)
          setTimeout(() => {
            navigate('/dashboard')
          }, 1500)
        }
      })
    }

    if (isPasswordsMatched()) {
      resetPassword()
      setErrorMessage(null)
      setWrongCredentials(false)
    } else {
      // setErrorMessage('Wrong Credentials')
      setWrongCredentials(true)
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
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="current-password"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            autoComplete="current-password"
          />
          <Button
            component="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress /> : 'Verify'}
          </Button>
          {/* <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            Forgot password?h
          </Link>
        </Grid>
        <Grid item>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              navigate('/home')
            }}
          >
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid> */}
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
