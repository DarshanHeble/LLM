import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import { useEffect, useState } from 'react'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const drawerWidth = 240

function DashBoard(): JSX.Element {
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalIssuedBooks, setTotalIssuedBooks] = useState(0)
  const [totalAvailableBooks, setTotalAvailableBooks] = useState(0)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [userData, bookData] = await Promise.all([
          window.electron.ipcRenderer.invoke('getUserData'),
          window.electron.ipcRenderer.invoke('getBookData')
        ])

        setTotalUsers(userData.length)
        setTotalBooks(bookData.length)

        let issuedBooksCount = 0
        userData.forEach((user) => {
          issuedBooksCount += user.issuedBook.length
        })
        setTotalIssuedBooks(issuedBooksCount)

        let availableBooksCount = 0
        bookData.forEach((book) => {
          availableBooksCount += book.noOfBooks
        })
        setTotalAvailableBooks(availableBooksCount)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const cardData = [
    {
      title: 'Total Books',
      value: totalBooks,
      icon: <LibraryBooksIcon sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <PeopleIcon sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Total Issued Books',
      value: totalIssuedBooks,
      icon: <AssignmentTurnedInIcon sx={{ fontSize: '5rem' }} />
    },
    {
      title: 'Total Available Books',
      value: totalAvailableBooks,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: '5rem' }} />
    }
  ]
  return (
    <>
      <Box
        sx={{
          display: 'flex'
        }}
      >
        <SIdebar text="DashBoard" />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 7 }}
        >
          <Grid container spacing={2}>
            {cardData.map((card, index) => (
              <Grid item key={index} xs={12} md={6} lg={3}>
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
              </Grid>
            ))}

            {/* <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Total Issued Books
                  </Typography>
                  <Typography variant="h4" component="div">
                    {totalIssuedBooks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Total Available Books
                  </Typography>
                  <Typography variant="h4" component="div">
                    {totalAvailableBooks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
        </Box>
        {/* </Box> */}
        {/* </Box> */}
      </Box>
    </>
  )
}

export default DashBoard
