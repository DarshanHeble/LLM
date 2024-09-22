import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'

interface CreateUser {
  open: boolean
  onClose: () => void
}

const CreateUserDialog = (props: CreateUser): JSX.Element => {
  const { open, onClose } = props
  const [isLoading] = useState(false)

  function handleSubmit(): void {}

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Account</DialogTitle>
      <DialogContent>
        {/* <Snackbar open={logged} autoHideDuration={3000} onClose={() => setLogged(false)}>
          <Alert variant="filled">Successfully Logged</Alert>
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
              {isLoading ? <CircularProgress /> : 'Sign Up'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateUserDialog
