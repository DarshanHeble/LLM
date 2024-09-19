import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import MRTViewIssuedBooks from '../layout/MRTViewIssuedBooks'

const drawerWidth = 240

function ViewIssuedBooks(): JSX.Element {
  return (
    <Box sx={{ display: 'flex', height: '-webkit-fill-available' }}>
      <SIdebar text="View Issued Books" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '-webkit-fill-available'
        }}
      >
        <MRTViewIssuedBooks />
      </Box>
    </Box>
  )
}

export default ViewIssuedBooks
