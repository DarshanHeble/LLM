import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import { useAlertToast } from '../Context/feedback/AlertToast'

export function ResetPassword(): JSX.Element {
  const navigate = useNavigate()

  const { showAlert } = useAlertToast()
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   window.electron.ipcRenderer.invoke('getAdminData', '').then((adminData: Admin | null) => {
  //     setAdmin(adminData)
  //   })
  // }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    setLoading(true)
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const newPassword = data.get('newPassword')
    const confirmNewPassword = data.get('confirmNewPassword')

    const isPasswordsMatched = (): boolean => {
      if (newPassword == confirmNewPassword) {
        return true
      } else {
        return false
      }
    }

    function resetPassword(): void {
      window.electron.ipcRenderer.invoke('resetAdminPassword', newPassword).then((re: boolean) => {
        console.log(re)
        if (re == true) {
          setTimeout(() => {
            showAlert('Successfully resetted the password')
            setLoading(false)
            navigate('/dashboard')
          }, 1500)
        }
      })
    }

    if (isPasswordsMatched()) {
      resetPassword()
    } else {
      setLoading(false)
      showAlert('Passwords Do Not Match', 'error')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      {/* <Snackbar
        open={wrongCredentials}
        autoHideDuration={3000}
        onClose={() => setWrongCredentials(false)}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Snackbar
        open={rightCredentials}
        autoHideDuration={3000}
        onClose={() => setRightCredentials(false)}
      >
        <Alert>Verified</Alert>
      </Snackbar> */}
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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="current-password"
            required
          />

          <TextField
            margin="normal"
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            autoComplete="current-password"
            required
          />
          <Button
            component="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress sx={{ color: 'black' }} /> : 'Verify'}
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
