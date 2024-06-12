import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import db from '../../../../shared/firebase'
import { useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
const drawerWidth = 240

function ManageStudents(): JSX.Element {
  useEffect(() => {
    onSnapshot(collection(db, 'StudentAccountData'), (snapshot) => {
      console.log(snapshot)
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
      </Box>
    </Box>
  )
}

export default ManageStudents
