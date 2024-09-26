import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MRTBook from '../layout/MRTBook'
import { User } from '@shared/types/types'
import { useAlertToast } from '../Context/feedback/AlertToast'

const drawerWidth = 240

const queryClient = new QueryClient()

function ManageBooks(): JSX.Element {
  // const [, setData] = useState([])
  // useEffect(() => {
  //   window.electron.ipcRenderer.invoke('getBookData').then((re) => {
  //     setData(re)
  //   })
  // }, [])
  const { showAlert } = useAlertToast()

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'isUserAdded',
      (_event, userData: User, isUserAdded: boolean) => {
        console.log(isUserAdded, userData)
        if (isUserAdded) {
          showAlert('User Added Successfully')
        }
      }
    )
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Box
          sx={{
            display: 'flex',
            height: '-webkit-fill-available'
          }}
        >
          <SIdebar text="Manage Books" />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              height: '-webkit-fill-available'
            }}
          >
            <MRTBook />
          </Box>
        </Box>
      </QueryClientProvider>
    </>
  )
}

export default ManageBooks
