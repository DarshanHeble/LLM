import { Paper, TextField, Button, Grid, Typography, Box } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/en-gb'
import Sidebar from '../layout/Sidebar'
import { useState } from 'react'
import { Book, User } from '@shared/types'

const drawerWidth = 240

function IssueBook(): JSX.Element {
  const [userId, setUserId] = useState('')
  const [bookId, setBookId] = useState('')
  const [issueDate, setIssueDate] = useState<Dayjs | null>(dayjs())
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs())

  // New states for book and user information
  const [bookName, setBookName] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [course, setCourse] = useState('')
  const [numberOfBooks, setNumberOfBooks] = useState<number | null>()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<number | null>()
  const [noOfIssuedBooks, setNoOfIssuedBooks] = useState<number | null>()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const userId = data.get('userId')
    console.log(userId)

    // const bookData = window.electron.ipcRenderer.invoke('getOneBookData', userId)
    // console.log(bookData)

    window.electron.ipcRenderer.invoke('getOneUserData', userId).then((result: User) => {
      setUserName(result.name)
      setEmail(result.email)
      setPhoneNumber(result.phoneNumber)
      setNoOfIssuedBooks(result.noOfIssuedBooks)
    })
  }
  const checkBookId = (bookId: string): void => {
    window.electron.ipcRenderer
      .invoke('getOneBookData', bookId)
      .then((result: Book) => {
        setBookName(result.bookName)
        setAuthorName(result.authorName)
        setCourse(result.course)
        setNumberOfBooks(result.noOfBooks)
      })
      .catch(() => {
        setBookName('')
        setAuthorName('')
        setCourse('')
        setNumberOfBooks(null)
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
        setUserName('')
        setEmail('')
        setPhoneNumber(null)
        setNoOfIssuedBooks(null)
      })
  }
  const minDate = dayjs() // Current day

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar text="Issue Book" />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 7 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
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
            <Paper elevation={3} style={{ padding: '16px' }}>
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
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      name="userId"
                      label="User ID"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value)
                        checkUserId(e.target.value)
                      }}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Book ID"
                      value={bookId}
                      onChange={(e) => {
                        setBookId(e.target.value)
                        checkBookId(e.target.value)
                      }}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                      <DatePicker
                        label="Issue Date"
                        value={issueDate}
                        onChange={(newValue) => setIssueDate(newValue)}
                        minDate={minDate}
                        sx={{ width: '100%', margin: 'auto' }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                      <DatePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
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
  )
}

export default IssueBook
