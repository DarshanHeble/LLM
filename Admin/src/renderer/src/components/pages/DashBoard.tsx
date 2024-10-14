import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid2, Typography } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import { Book, User } from '@shared/types/types'
import { useAlertToast } from '../Context/feedback/AlertToast'

import {
  AssignmentLate,
  AssignmentTurnedIn,
  CheckCircleOutline,
  ForwardToInbox,
  LibraryBooks,
  People
} from '@mui/icons-material'

function DashBoard(): JSX.Element {
  const { showAlert } = useAlertToast()
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalIssuedBooks, setTotalIssuedBooks] = useState(0)
  const [totalAvailableBooks, setTotalAvailableBooks] = useState(0)
  const [totalDueBooks, setTotalDueBooks] = useState(0)
  const [totalRequestedBooks, setTotalRequestedBooks] = useState(0)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // fetch user and book data at once
        const [userData, bookData]: [User[], Book[]] = await Promise.all([
          window.electron.ipcRenderer.invoke('getUserData'),
          window.electron.ipcRenderer.invoke('getBookData')
        ])

        setTotalUsers(userData.length)
        setTotalBooks(bookData.length)

        const currentDate = new Date()

        let issuedBooksCount = 0 // variable to hold number of issued books
        let dueBooksCount = 0 // variable to hold number of due books
        let requestedBooksCount = 0 // variable to hold number of requested books

        userData.forEach((user) => {
          issuedBooksCount += user.issuedBooks.length
          requestedBooksCount += user.requestedBooks.length
          const dueBooks = user.issuedBooks.filter((issuedBook) => issuedBook.dueDate < currentDate)

          dueBooksCount = dueBooks.length
        })
        setTotalIssuedBooks(issuedBooksCount)
        setTotalRequestedBooks(requestedBooksCount)
        setTotalDueBooks(dueBooksCount)

        let availableBooksCount = 0 // variable to hold number of available books
        bookData.forEach((book) => {
          availableBooksCount += book.quantity
        })
        setTotalAvailableBooks(availableBooksCount)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
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

  const cardData = [
    {
      title: 'Users',
      value: totalUsers,
      icon: <People sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Unique Books',
      value: totalBooks,
      icon: <LibraryBooks sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Issued Books',
      value: totalIssuedBooks,
      icon: <AssignmentTurnedIn sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Available Books',
      value: totalAvailableBooks,
      icon: <CheckCircleOutline sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Due Books',
      value: totalDueBooks,
      icon: <AssignmentLate sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Book Requests',
      value: totalRequestedBooks,
      icon: <ForwardToInbox sx={{ fontSize: '5rem' }} />
    }
  ]
  return (
    <>
      <Box sx={{ display: 'flex', height: '-webkit-fill-available' }}>
        <SIdebar text="Dashboard" />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid2 container spacing={2}>
            {cardData.map((card, index) => (
              <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card>
                  <CardContent
                    sx={{
                      display: 'flex',
                      pb: 0,
                      alignItems: 'center',
                      justifyContent: 'start',
                      height: '10rem',
                      gap: 2
                    }}
                  >
                    {card.icon}
                    <Box>
                      <Typography variant="h6" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {card.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Box>
    </>
  )
}

export default DashBoard
