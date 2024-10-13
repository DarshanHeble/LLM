import { Box } from '@mui/material'

import SIdebar from '../layout/Sidebar'
import MRTUser from '../layout/MRTUser'

const drawerWidth = 240
function ManageUsers(): JSX.Element {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          height: '-webkit-fill-available'
        }}
      >
        <SIdebar text="Manage Users" />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: '-webkit-fill-available'
          }}
        >
          <MRTUser />
        </Box>
      </Box>
    </>
  )
}

export default ManageUsers
