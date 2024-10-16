import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { Book, User } from '@shared/types/types'
import { useState } from 'react'
import { useAlertToast } from '../feedback/AlertToast'
import { ISSUE_BOOK_LIMIT, REQUEST_BOOK_LIMIT } from '@shared/constants'

interface IssueBookDialogInterface {
  open: boolean
  book: Book
  userData: User[]
  onClose: () => void
}
const IssueBookDialog = (props: IssueBookDialogInterface): JSX.Element => {
  const { open, book, userData, onClose } = props
  const { showAlert } = useAlertToast()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')

  const handleIssue = async (): Promise<void> => {
    if (!selectedUserId) {
      showAlert('Please select a user', 'error')
      return
    }
    if (!password) {
      showAlert('Please enter the password', 'error')
      return
    }

    const user = userData.find((user) => user._id === selectedUserId)

    if (!user) {
      showAlert('User not found', 'error')
      return
    }

    if (user.password !== password) {
      showAlert('Incorrect password', 'error')
    }

    if (user.issuedBooks.length >= ISSUE_BOOK_LIMIT) {
      showAlert(
        'You have already taken 2 books already. Return a book and request a new one',
        'warning'
      )
    }

    if (user.requestedBooks.length >= REQUEST_BOOK_LIMIT) {
      showAlert('You have already requested 2 books already.', 'warning')
    }

    if (user && user.password === password) {
      setIsSubmitting(true)

      const isRequested = await window.electron.ipcRenderer.invoke(
        'RequestBook',
        selectedUserId,
        book._id
      )
      if (isRequested) {
        showAlert('Successfully requested the book', 'success')
        setIsSubmitting(false)
        onClose()
      } else {
        showAlert('Failed to request the book...!', 'error')
      }
    } else {
      showAlert('Invalid user or password', 'error')
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
            type="password"
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
            {isSubmitting ? <CircularProgress /> : 'Issue'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default IssueBookDialog
