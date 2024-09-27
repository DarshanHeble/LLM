import { Box, Button, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import './../assets/main.css'
import { Book, User } from '@shared/types/types'
import MRTBooks from './layout/MRTBooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAlertToast } from './feedback/AlertToast'

function Home(): JSX.Element {
  const queryClient = new QueryClient()
  const { showAlert } = useAlertToast()
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [state, setState] = useState(false)

  // Receive messages from the main process
  window.electron.ipcRenderer.on('connection', (_, args: boolean) => {
    console.log('connection status', args)
    setState(args)
  })

  window.electron.ipcRenderer.on('bookData', (_, bookData: Book[]) => {
    console.log('book data', bookData)
  })

  const checkServerStatus = (): void => {
    window.electron.ipcRenderer.invoke('checkServerStatus').then((re) => {
      console.log('server status', re)
      setState(re)
    })
  }
  useEffect(() => {
    window.electron.ipcRenderer.on(
      'isUserAdded',
      (_event, userData: User, isUserAdded: boolean) => {
        console.log(isUserAdded, userData)
        if (isUserAdded) {
          showAlert('User Added Successfully')
        } else {
          showAlert('Unable to add user', 'error')
        }
      }
    )
  }, [])

  useEffect(() => {
    checkServerStatus()
  }, [])

  if (state === false) {
    return (
      <>
        <Box
          sx={{
            height: '-webkit-fill-available',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress sx={{ minWidth: '7rem', minHeight: '7rem' }} />
          <Button onClick={checkServerStatus} sx={{}}>
            Server is not created
          </Button>
        </Box>
      </>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MRTBooks />
    </QueryClientProvider>
  )
}

export default Home
{
  /* <Container maxWidth="lg" sx={{ py: 4, height: '-webkit-fill-available' }}></Container> */
}
