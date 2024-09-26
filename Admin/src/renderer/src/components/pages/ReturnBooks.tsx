import { Box } from '@mui/material'
import SIdebar from '../layout/Sidebar'
import MRTReturn from '../layout/MRTReturn'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { useEffect } from 'react'
import { User } from '@shared/types/types'

const drawerWidth = 240

function ReturnBooks(): JSX.Element {
  const { showAlert } = useAlertToast()

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'isUserAdded',
      (_event, userData: User, isUserAdded: boolean) => {
        console.log(isUserAdded, userData)
        if (isUserAdded) {
          showAlert('User Added Successfully')
        } else {
          showAlert('Unable to Add User Successfully', 'error')
        }
      }
    )
  }, [])
  return (
    <Box
      sx={{
        display: 'flex',
        height: '-webkit-fill-available'
      }}
    >
      <SIdebar text="Return Books" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '-webkit-fill-available'
        }}
      >
        <MRTReturn />
      </Box>
    </Box>
  )
}

export default ReturnBooks
