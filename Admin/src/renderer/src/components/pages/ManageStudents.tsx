import { Box } from '@mui/material'
// import Button from '@mui/material/Button'
// import AddIcon from '@mui/icons-material/Add'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteIcon from '@mui/icons-material/DeleteOutlined'
// import SaveIcon from '@mui/icons-material/Save'
// import CancelIcon from '@mui/icons-material/Close'
import SIdebar from '../layout/Sidebar'
// import db from '../../store/firebase'
// import { useEffect } from 'react'
// import { collection, onSnapshot } from 'firebase/firestore'

const drawerWidth = 240
function ManPhoneNoStudents(): JSX.Element {
  // useEffect(() => {
  //   onSnapshot(collection(db, 'StudentAccountData'), (snapshot) => {
  //     console.log(snapshot)
  //   })
  // }, [])
  // ====================================

  // ====================================
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
        {/* <MaterialReactTable table={table} /> */}
      </Box>
    </Box>
  )
}

export default ManPhoneNoStudents
