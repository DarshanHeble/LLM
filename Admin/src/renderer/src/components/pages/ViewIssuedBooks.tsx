import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import MRTViewIssuedBooks from '../layout/MRTViewIssuedBooks'

function ViewIssuedBooks(): JSX.Element {
  return (
    <Box sx={{ display: 'flex', height: '-webkit-fill-available' }}>
      <SIdebar text="View Issued Books" />
      <Box sx={{ flexGrow: 1, p: 3, height: '-webkit-fill-available' }}>
        <MRTViewIssuedBooks />
      </Box>
    </Box>
  )
}

export default ViewIssuedBooks
