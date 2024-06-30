import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MRTBook from '../layout/MRTBook'
const drawerWidth = 240

const queryClient = new QueryClient()

function ManageBooks(): JSX.Element {
  const [, setData] = useState([])
  useEffect(() => {
    window.electron.ipcRenderer.invoke('getBookData').then((re) => {
      setData(re)
    })
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Box
          sx={{
            display: 'flex'
          }}
        >
          <SIdebar text="ManageBook" />
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 7 }}
          >
            <MRTBook />
          </Box>
        </Box>
      </QueryClientProvider>
    </>
  )
}

export default ManageBooks
