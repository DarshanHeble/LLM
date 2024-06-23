import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import { Admin } from '@shared/types'
import { useNavigate } from 'react-router-dom'
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
  const [, setAdmin] = useState<Admin | null>(null)
  // const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAdminData', '')
      .then((adminAccountData: Admin | null) => {
        setAdmin(adminAccountData)
      })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const name = data.get('name') ? String(data.get('name')) : undefined
    const password = data.get('password') ? String(data.get('password')) : undefined
    const email = data.get('email') ? String(data.get('email')) : undefined
    const phoneNumber = data.get('phoneNumber') ? Number(data.get('phoneNumber')) : undefined

    const documentData: Admin = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber
    }

    window.electron.ipcRenderer.invoke('addAdminData', documentData).then((re: boolean) => {
      console.log(re)
      if (re == true) {
        setLogged(true)
        setTimeout(() => {
          navigate('/home')
        }, 1500)
      } else {
        alert('something went wrong')
      }
    })
    console.log('2')
  }

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar open={logged} autoHideDuration={3000} onClose={() => setLogged(false)}>
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
          Sign Up
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
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {'Already have an account? Login Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ExtraLine sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
