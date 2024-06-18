import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import { BookData } from '@renderer/store/data'
import MRTBook from '../layout/MRTBook'
const drawerWidth = 240

function ManageBooks(): JSX.Element {
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
          <MRTBook data={BookData} />
        </Box>
      </Box>
    </>
  )
}

export default ManageBooks
