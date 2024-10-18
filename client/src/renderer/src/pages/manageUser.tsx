import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material'
import { formatDate } from '@renderer/utils'
import { Book, User } from '@shared/types/types'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type RequestedBook = {
  userId: string
  userName: string
  bookId: string
  bookName: string
  // bookQuantity: number
  requestedDate: Date
}

function ManageUser(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setData] = useState<User>({
    _id: '',
    name: '',
    email: '',
    phoneNumber: '',
    addedAt: new Date(),
    issuedBooks: [],
    noOfIssuedBooks: 0,
    password: '',
    requestedBooks: []
  })

  const [requestedBooks, setRequestedBooks] = useState<RequestedBook[]>([])
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData(): Promise<void> {
    // fetch data at once
    const [user, books]: [User, Book[]] = await Promise.all([
      window.electron.ipcRenderer.invoke('getOneUserData', id),
      await window.electron.ipcRenderer.invoke('getBookData')
    ])

    // set the data into state
    setData(user)

    const bookIdAndNameMap = new Map<string, string>(books.map((book) => [book._id, book.bookName]))

    const requestedBooksData: RequestedBook[] = user.requestedBooks.flatMap((requestBook) => ({
      bookId: requestBook._id,
      bookName: bookIdAndNameMap.get(requestBook._id) || '',
      userId: user._id,
      userName: user.name,
      requestedDate: new Date(requestBook.requestedDate)
    }))
    setRequestedBooks(requestedBooksData)
  }

  function UserInfo(): JSX.Element {
    return (
      <div>
        <Typography variant="h4" gutterBottom>
          {user._id}
        </Typography>
        <Typography variant="h6">Name: {user.name}</Typography>
        <Typography variant="h6">Email: {user.email}</Typography>
        <Typography variant="h6">Phone Number: {user.phoneNumber}</Typography>
        <Typography variant="h6">Number of Issued Books: {user.noOfIssuedBooks}</Typography>
        <Typography variant="h6">Added At: {formatDate(user.addedAt)}</Typography>
      </div>
    )
  }

  function IssuedBookInfo(): JSX.Element {
    return (
      <div>
        <Typography variant="h5" style={{ marginTop: '20px' }}>
          Issued Books
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book ID</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Returned Date</TableCell>
                <TableCell>Fine</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.issuedBooks.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book._id}</TableCell>
                  <TableCell>{formatDate(book.issueDate)}</TableCell>
                  <TableCell>{formatDate(book.dueDate)}</TableCell>
                  <TableCell>
                    {book.returnedDate ? formatDate(book.returnedDate) : 'Not Returned'}
                  </TableCell>
                  <TableCell>{book.fine} $</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  function RequestedBookInfo(): JSX.Element {
    return (
      <div>
        <Typography variant="h5" style={{ marginTop: '20px' }}>
          Requested Books
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book ID</TableCell>
                <TableCell>Requested Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestedBooks.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{book.bookId}</TableCell>
                  <TableCell>{book.bookName}</TableCell>
                  <TableCell>{formatDate(book.requestedDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <UserInfo />
      <IssuedBookInfo />
      <RequestedBookInfo />

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/')}
      >
        Logout
      </Button>
    </div>
  )
}

export default ManageUser
