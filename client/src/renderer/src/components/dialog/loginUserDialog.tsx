import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { useAlertToast } from '../context/feedback/AlertToast'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOneUserData } from '@renderer/utils'

interface Props {
  open: boolean
  userIds: string[]
  onClose: () => void
}

function LoginUserDialog(props: Props): JSX.Element {
  const { open, userIds, onClose } = props

  const navigate = useNavigate()

  const { showAlert } = useAlertToast()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  //   const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')

  async function handleLoginSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    console.log(selectedUserId, password)

    if (!selectedUserId) return // check if it is null

    // find user from the list
    const user = await getOneUserData(selectedUserId)

    // check user exist
    if (!user) {
      showAlert('User not found', 'error')
      return
    }
    // check password is correct
    if (user.password !== password) {
      showAlert('Password is incorrect', 'error')
      return
    }

    // navigate to manage page with id as parameter
    navigate(`/manageUser/${selectedUserId}`)
    showAlert('user found', 'success')
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>LoginUserDialog</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={handleLoginSubmit}>
          <Autocomplete
            options={userIds}
            onChange={(_event, value) => setSelectedUserId(value)}
            renderInput={(params) => (
              <TextField {...params} label="User Id" margin="dense" fullWidth required />
            )}
            autoFocus
          />

          <TextField
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label="User Password"
            margin="dense"
            fullWidth
            required
          />

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Login</Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default LoginUserDialog
