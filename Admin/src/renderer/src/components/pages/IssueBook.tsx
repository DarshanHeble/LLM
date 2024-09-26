import { Paper, TextField, Button, Grid, Typography, Box, Autocomplete } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/en-gb'
import Sidebar from '../layout/Sidebar'
import { useEffect, useState } from 'react'
import { Book, User, issuedBookType } from '@shared/types/types'
import { useAlertToast } from '../Context/feedback/AlertToast'

const drawerWidth = 240

function IssueBook(): JSX.Element {
  const { showAlert } = useAlertToast()
  // Lists for autocomplete
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUserData').then((users) => setUsers(users))
    window.electron.ipcRenderer.invoke('getBookData').then((books) => setBooks(books))
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'isUserAdded',
      (_event, userData: User, isUserAdded: boolean) => {
        console.log(isUserAdded, userData)
        if (isUserAdded) {
          showAlert('User Added Successfully')
        } else {
          showAlert('Unable to Add User Successfully', 'error')
        }
      }
    )
  }, [])

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
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [noOfIssuedBooks, setNoOfIssuedBooks] = useState<number | null>()

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

    if (numberOfBooks === 0 || numberOfBooks === undefined || numberOfBooks === null) {
      console.error('Book is not available')
      showAlert('Book is not available or something went wrong', 'warning')
      return
    }
    // return
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
      noOfIssuedBooks,
      issuedBookData
    )
    if (!addResponse) {
      showAlert('Error adding book to the user', 'error')
      window.electron.ipcRenderer.invoke('updateBookQuantity', bookId, numberOfBooks - 1)
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
    <>
      <Box sx={{ display: 'flex' }}>
        <Sidebar text="Issue Book" />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                style={{ padding: '16px', backgroundImage: 'none', backgroundColor: '#202020' }}
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
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                style={{ padding: '16px', backgroundImage: 'none', backgroundColor: '#202020' }}
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
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={3}
                style={{ padding: '16px', backgroundImage: 'none', backgroundColor: '#202020' }}
              >
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        options={users}
                        getOptionLabel={(option) => `${option._id}`} // Combine id and name for the label
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
                            margin="normal"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                            fullWidth
                            label="Book ID"
                            variant="outlined"
                            margin="normal"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default IssueBook
