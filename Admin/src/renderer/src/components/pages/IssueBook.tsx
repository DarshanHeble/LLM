import Sidebar from '../layout/Sidebar'
import { useEffect } from 'react'
import { User } from '@shared/types/types'
import { useAlertToast } from '../Context/feedback/AlertToast'
import MRTRequestedBooks from '../layout/MRTRequestedBooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Box } from '@mui/material'

const drawerWidth = 240

function IssueBook(): JSX.Element {
  const { showAlert } = useAlertToast()

  const queryClient = new QueryClient()

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

  useEffect(() => {
    window.electron.ipcRenderer.on('RequestedBook', () => {
      window.location.reload()
    })
  }, [])

  return (
    <>
      <Box sx={{ display: 'flex', height: '-webkit-fill-available' }}>
        <Sidebar text="Issue Book" />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: '-webkit-fill-available'
          }}
        >
          <Box sx={{ mt: '1rem', height: '-webkit-fill-available' }}>
            <QueryClientProvider client={queryClient}>
              <MRTRequestedBooks />
            </QueryClientProvider>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default IssueBook
