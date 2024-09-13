import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import MRTReturn from '../layout/MRTReturn'
import { sidebarData } from '@renderer/store/mock'

const drawerWidth = 240

function ReturnBooks(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      <SIdebar text="Return Books" />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <MRTReturn />
      </Box>
    </Box>
  )
}

export default ReturnBooks
