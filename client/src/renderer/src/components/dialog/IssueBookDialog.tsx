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
import { Book, User } from '@shared/types/types'
import { useState } from 'react'

interface IssueBookDialogInterface {
  open: boolean
  book: Book
  userData: User[]
  onClose: () => void
}
const IssueBookDialog = (props: IssueBookDialogInterface): JSX.Element => {
  const { open, book, userData, onClose } = props
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [password, setPassword] = useState<string>('')

  const handleIssue = (): void => {
    if (!selectedUserId) {
      alert('Please select a user')
      return
    }
    if (!password) {
      alert('Please enter the password')
      return
    }
    const user = userData.find((user) => user._id === selectedUserId)
    if (user && user.password === password) {
      //   onIssue(selectedUserId, password)
    } else {
      alert('Invalid user or password')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: '#202020' }}>
        <DialogTitle> Issue Book</DialogTitle>
        <DialogContent>
          <TextField value={book._id} label="Book Id" margin="dense" fullWidth disabled />

          <Autocomplete
            options={userData.map((user) => user._id)}
            onChange={(_event, value) => setSelectedUserId(value)}
            renderInput={(params) => (
              <TextField {...params} label="User Id" margin="dense" fullWidth required />
            )}
            autoFocus
          />

          <TextField
            onChange={(e) => setPassword(e.target.value)}
            label="User Password"
            margin="dense"
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Close
          </Button>

          <Button onClick={handleIssue} color="primary">
            Issue
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default IssueBookDialog
