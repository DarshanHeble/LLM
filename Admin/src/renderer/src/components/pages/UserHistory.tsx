import { Box } from '@mui/material'
import Sidebar from '../layout/Sidebar'
import MRTUserHistory from '../layout/MRTUserHistory'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function UserHistory(): JSX.Element {
  return (
    <Box sx={{ display: 'flex', height: '-webkit-fill-available' }}>
      <Sidebar text="History" />
      <Box sx={{ flexGrow: 1, p: 3, height: '-webkit-fill-available' }}>
        <QueryClientProvider client={queryClient}>
          <MRTUserHistory />
        </QueryClientProvider>
      </Box>
    </Box>
  )
}

export default UserHistory
