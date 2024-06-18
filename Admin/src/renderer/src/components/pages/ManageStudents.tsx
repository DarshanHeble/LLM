import { Box } from '@mui/material'

import SIdebar from '../layout/Sidebar'
import { fakeData } from '@renderer/store/data'
import MRTUser from '../layout/MRTUser'

const drawerWidth = 240
function ManPhoneNoStudents(): JSX.Element {
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
        <MRTUser data={fakeData} />
      </Box>
    </Box>
  )
}

export default ManPhoneNoStudents
