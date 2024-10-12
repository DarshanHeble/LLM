import { useEffect, useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  Dialog,
  DialogContent
} from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { Book, issuedBookType, User } from '@shared/types/types'
import { useAlertToast } from '../Context/feedback/AlertToast'
import 'dayjs/locale/en-gb'

type Props = {
  open: boolean
  onClose: () => void
}

function IssueBookDialog(props: Props): JSX.Element {
  const { open, onClose } = props
  const { showAlert } = useAlertToast()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUserData').then((users) => setUsers(users))
    window.electron.ipcRenderer.invoke('getBookData').then((books) => setBooks(books))
  }, [])

  // Lists for autocomplete
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])

  // States for form textfield
  const [userId, setUserId] = useState('')
  const [bookId, setBookId] = useState('')
  const [issueDate, setIssueDate] = useState<Dayjs>(dayjs())
  const [dueDate, setDueDate] = useState<Dayjs>(dayjs().add(7, 'day'))

  // States for book textfield
  const [bookName, setBookName] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [course, setCourse] = useState('')
  const [numberOfBooks, setNumberOfBooks] = useState<number | null>()

  // States for User textfield
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [noOfIssuedBooks, setNoOfIssuedBooks] = useState<number | null>(null)

  function setUserInputEmpty(): void {
    setUserName('')
    setEmail('')
    setPhoneNumber('')
    setNoOfIssuedBooks(null)
  }
  function setBookInputEmpty(): void {
    setBookName('')
    setAuthorName('')
    setCourse('')
    setNumberOfBooks(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    // const data = new FormData(event.currentTarget)
    console.log('User', userId, userName, email, phoneNumber, noOfIssuedBooks)
    console.log('Book', bookId, bookName, authorName, course, numberOfBooks)
    console.log('time', userId, bookId, dueDate, issueDate)

    if (noOfIssuedBooks === null || numberOfBooks === null) {
      return
    }

    if (numberOfBooks === 0 || numberOfBooks === undefined || numberOfBooks === null) {
      console.error('Book is not available')
      showAlert('Book is not available or something went wrong', 'warning')
      return
    }

    const issuedBookData: issuedBookType = {
      _id: bookId,
      issueDate: issueDate.toDate(),
      dueDate: dueDate.toDate(),
      fine: 0
    }
    const updateResponse = await window.electron.ipcRenderer.invoke(
      'updateBookQuantity',
      bookId,
      numberOfBooks - 1
    )
    if (!updateResponse) {
      showAlert(
        'There is an error in updating the quantity of the book. So book will not be added for the user',
        'error'
      )
      return
    }

    const addResponse = await window.electron.ipcRenderer.invoke(
      'addBookToTheUser',
      userId,
      issuedBookData
    )

    if (!addResponse) {
      showAlert('Error adding book to the user', 'error')
      await window.electron.ipcRenderer.invoke('updateBookQuantity', bookId, numberOfBooks - 1)
      return
    }
    setUserInputEmpty()
    setBookInputEmpty()

    setUserId('')
    setBookId('')

    showAlert(`Successfully Issued the book to ${userName}`, 'success')
  }

  const checkBookId = (bookId: string): void => {
    window.electron.ipcRenderer
      .invoke('getOneBookData', bookId)
      .then((result: Book) => {
        setBookName(result.bookName)
        setAuthorName(result.authorName)
        setCourse(result.course)
        setNumberOfBooks(result.quantity)
      })
      .catch(() => {
        setBookInputEmpty()
      })
  }

  const checkUserId = (userId: string): void => {
    window.electron.ipcRenderer
      .invoke('getOneUserData', userId)
      .then((result: User) => {
        setUserName(result.name)
        setEmail(result.email)
        setPhoneNumber(result.phoneNumber)
        setNoOfIssuedBooks(result.noOfIssuedBooks)
      })
      .catch(() => {
        setUserInputEmpty()
      })
  }

  const minDate = dayjs() // Current day

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Paper
            elevation={3}
            style={{
              padding: '16px',
              backgroundImage: 'none',
              backgroundColor: '#202020'
              //   minWidth: '25rem',
              //   maxWidth: '30rem'
            }}
          >
            <Typography variant="h6">User Information</Typography>
            <TextField
              fullWidth
              label="User Name"
              value={userName || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Email"
              value={email || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber?.toString() || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="No Of Issued Books"
              value={noOfIssuedBooks?.toString() || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
          </Paper>
          <Paper
            elevation={3}
            style={{
              padding: '16px',
              backgroundImage: 'none',
              backgroundColor: '#202020'
              //   minWidth: '25rem',
              //   maxWidth: '30rem'
            }}
          >
            <Typography variant="h6">Book Information</Typography>
            <TextField
              fullWidth
              label="Book Name"
              value={bookName || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Author Name"
              value={authorName || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Course"
              value={course || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              type="number"
              label="Number of Books"
              value={numberOfBooks?.toString() || ''}
              variant="outlined"
              margin="normal"
              disabled
            />
          </Paper>

          <Paper
            elevation={3}
            style={{
              padding: '16px',
              backgroundImage: 'none',
              backgroundColor: '#202020'
              //   minWidth: '26rem',
              //   maxWidth: '30rem'
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                paddingBlockStart: '1rem'
              }}
            >
              <Autocomplete
                options={users}
                getOptionLabel={(option) => `${option._id}`}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setUserId(newValue._id)
                    checkUserId(newValue._id)
                  }
                }}
                onInputChange={(_, _value, reason) => {
                  if (reason == 'clear') {
                    setUserId('')
                    checkUserId('')
                  }
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option._id}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    name="userId"
                    label="User ID"
                    variant="outlined"
                  />
                )}
              />
              <Autocomplete
                options={books}
                getOptionLabel={(option) => `${option._id}`}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setBookId(newValue._id)
                    checkBookId(newValue._id)
                  }
                }}
                onInputChange={(_, __, reason) => {
                  if (reason === 'clear') {
                    setBookId('')
                    checkBookId('')
                  }
                }}
                renderOption={(props, options) => (
                  <li {...props} key={options._id}>
                    {options._id}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="Book Id"
                    label="Book ID"
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />
              {/* <Grid sx={{ xs: 12, md: 6 }}> */}
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                  <DateTimePicker
                    label="Issue Date"
                    value={issueDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        setIssueDate(newValue)
                        setDueDate(newValue.add(7, 'day'))
                      }
                    }}
                    minDate={minDate}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Box>
              {/* </Grid> */}
              {/* <Grid sx={{ xs: 12, md: 6 }}> */}
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                  <DateTimePicker
                    label="Due Date"
                    value={dueDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        setDueDate(newValue)
                      }
                    }}
                    minDate={minDate}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Box>
              {/* </Grid> */}
              {/* <Grid sx={{ xs: 12 }}> */}
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
              {/* </Grid> */}
              {/* </Grid> */}
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default IssueBookDialog
