import { Avatar, Box, Button, Grid, Link, Paper, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'
import { adminAccountData } from '../../../../shared/constants'
import { useForm } from 'react-hook-form'

function ExtraLine(props): JSX.Element {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Built with ❤️ and passion '}
      {'(' + new Date().getFullYear() + ')'}
      {'.'}
    </Typography>
  )
}

function LoginSignIn(): JSX.Element {
  const [action, setAction] = useState('signIn')

  const { register, handleSubmit } = useForm()
  const handleFormSubmit = (formData: any) => {
    console.log(formData)
  }

  return (
    <Paper component="main" sx={{ marginTop: 'auto', paddingInline: 5, maxWidth: 450 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {action}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="User Name"
            // name="name"
            autoComplete="name"
            autoFocus
            {...register('name')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            // name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {action == 'signIn' && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                // name="email"
                label="Email"
                type="email"
                id="email"
                autoComplete="email"
                {...register('email')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                // name="phoneNumber"
                label="Phone Number"
                type="tel"
                inputMode="numeric"
                id="email"
                autoComplete="phoneNumber"
                {...register('phoneNumber')}
              />
            </>
          )}
          {action == 'signIn' ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              // onClick={() => login()}
            >
              Sign In
            </Button>
          ) : (
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
          )}

          {/* <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {action == 'signIn' ? `Sign Up` : `Sign In`}
          </Button> */}
          <Grid container>
            <Grid item xs>
              {action == 'signUp' && (
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              )}
            </Grid>
            <Grid item>
              <Link
                variant="body2"
                component="button"
                onClick={(event) => {
                  event.preventDefault()
                  if (action == 'signIn') {
                    setAction('signUp')
                  } else {
                    setAction('signIn')
                  }
                }}
              >
                {action == 'signIn'
                  ? `Don't have an account? Sign Up`
                  : `Already have an account? Sign In`}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ExtraLine sx={{ mt: 8, mb: 4 }} />
    </Paper>
  )
}

export default LoginSignIn
