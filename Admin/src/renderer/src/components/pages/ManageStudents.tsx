import { Box } from '@mui/material'

import SIdebar from '../layout/Sidebar'
// import { fakeData } from '@renderer/store/data'
import MRTUser from '../layout/MRTUser'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const drawerWidth = 240
function ManPhoneNoStudents(): JSX.Element {
  const [data, setData] = useState([])
  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUserData', '').then((re) => {
      setData(re)
    })
  }, [])
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        sx={{
          display: 'flex'
        }}
      >
        <SIdebar text="Manage Students" />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 7 }}
        >
          <MRTUser />
        </Box>
      </Box>
    </QueryClientProvider>
  )
}

export default ManPhoneNoStudents
