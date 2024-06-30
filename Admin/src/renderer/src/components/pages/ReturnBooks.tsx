import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'

const drawerWidth = 240

function ReturnBooks(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      <SIdebar text="Return Book" />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 7 }}
      ></Box>
    </Box>
  )
}

export default ReturnBooks
