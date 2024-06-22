import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import { BookData, loadUserData } from '@renderer/store/data'
import MRTBook from '../layout/MRTBook'
import { useEffect, useState } from 'react'
const drawerWidth = 240

function ManageBooks(): JSX.Element {
  const [data, setData] = useState([])
  useEffect(() => {
    window.electron.ipcRenderer.invoke('getBookData', '').then((re) => {
      // console.log(re)
      setData(re)
    })
  }, [])

  return (
    <>
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
          ManageBook
          <MRTBook data={data} />
        </Box>
      </Box>
    </>
  )
}

export default ManageBooks
