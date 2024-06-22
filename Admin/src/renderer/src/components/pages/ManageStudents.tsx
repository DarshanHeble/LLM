import { Box } from '@mui/material'

import SIdebar from '../layout/Sidebar'
// import { fakeData } from '@renderer/store/data'
import MRTUser from '../layout/MRTUser'
import { useEffect, useState } from 'react'

const drawerWidth = 240
function ManPhoneNoStudents(): JSX.Element {
  const [data, setData] = useState([])
  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUserData', '').then((re) => {
      setData(re)
    })
  }, [])

  return (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      <SIdebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 7 }}
      >
        Manage Students
        <MRTUser data={data} />
      </Box>
    </Box>
  )
}

export default ManPhoneNoStudents
