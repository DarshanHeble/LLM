import { Box } from '@mui/material'
import Sidebar from '../layout/Sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MRTDueBooks from '../layout/MRTDueBooks'

const queryClient = new QueryClient()

function DueBooks(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '-webkit-fill-available'
      }}
    >
      <Sidebar text="Due Books" />
      <Box
        sx={{
          height: '-webkit-fill-available'
        }}
      >
        <QueryClientProvider client={queryClient}>
          <MRTDueBooks />
        </QueryClientProvider>
      </Box>
    </Box>
  )
}

export default DueBooks
