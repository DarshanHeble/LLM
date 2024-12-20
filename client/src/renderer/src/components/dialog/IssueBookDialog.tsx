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
import { Book, OperationResult } from '@shared/types/types'
import { useEffect, useState } from 'react'
import { useAlertToast } from '../context/feedback/AlertToast'
import { ISSUE_BOOK_LIMIT, REQUEST_BOOK_LIMIT } from '@shared/constants'
import { getOneUserData } from '@renderer/utils'

interface IssueBookDialogInterface {
  open: boolean
  book: Book
  userIds: string[]
  onClose: () => void
}

let bookRequestCount: number = 0

const IssueBookDialog = (props: IssueBookDialogInterface): JSX.Element => {
  const { open, book, userIds, onClose } = props
  const { showAlert } = useAlertToast()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getBookRequestCount', book._id).then((count: number) => {
      bookRequestCount = count
    })
  }, [])

  // function handleSubmit(): void {
  //   fetchUser()
  // }

  const handleIssue = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    // Check if a user is selected
    if (!selectedUserId) {
      showAlert('Please select a user', 'error')
      return
    }

    // Check if the password is provided
    if (!password) {
      showAlert('Please enter the password', 'error')
      return
    }

    // Find the user by selected ID
    const user = await getOneUserData(selectedUserId)

    // If the user is not found
    if (!user) {
      showAlert('User not found', 'error')
      return
    }

    // Check if the password is correct
    if (user.password !== password) {
      showAlert('Incorrect password', 'error')
      return
    }

    // Check if the book is already issued by the user
    const issuedBook = user.issuedBooks.find((issuedBook) => issuedBook._id === book._id)
    if (issuedBook) {
      showAlert('This book is already issued by the user', 'warning')
      return
    }

    // Check if the book is already requested by the user
    const requestedBook = user.requestedBooks.find(
      (requestedBook) => requestedBook._id === book._id
    )
    if (requestedBook) {
      showAlert('This book is already requested by the user', 'warning')
      return
    }

    // check if user has below 2 issued book
    if (user.issuedBooks.length >= ISSUE_BOOK_LIMIT) {
      showAlert(
        'You have already taken 2 books already. Return a book and request a new one',
        'warning'
      )
      return
    }

    // check if user has below 2 requested book
    if (user.requestedBooks.length >= REQUEST_BOOK_LIMIT) {
      showAlert('You have already requested 2 books already.', 'warning')
      return
    }

    //check if the has reached the max requests
    const bookRequestLimit = book.quantity - bookRequestCount
    if (bookRequestLimit <= 0) {
      showAlert('This book has reached its max requests.', 'warning')
      return
    }

    setIsSubmitting(true)

    try {
      // Attempt to request the book via IPC API
      const isRequested: OperationResult = await window.electron.ipcRenderer.invoke(
        'RequestBook',
        selectedUserId,
        book._id
      )

      if (isRequested) {
        showAlert('Successfully requested the book', 'success')
        onClose() // Close the form or modal
      } else {
        showAlert('Failed to request the book', 'error')
      }
    } catch (error) {
      showAlert('An error occurred while requesting the book', 'error')
    } finally {
      setIsSubmitting(false) // Ensure to stop submitting state after the process
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle> Request Book</DialogTitle>
      <Box component={'form'} onSubmit={handleIssue}>
        <DialogContent>
          <TextField value={book._id} label="Book Id" margin="dense" fullWidth disabled />

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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Close
          </Button>

          <Button type="submit" color="primary">
            {isSubmitting ? <CircularProgress /> : 'Issue'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default IssueBookDialog
