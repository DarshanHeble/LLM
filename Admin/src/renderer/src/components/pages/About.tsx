import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Tooltip
} from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import logo from '../../assets/icon.png'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Other } from '@shared/types/types'

type SocialData = {
  name: string
  link: string
  icon: JSX.Element
}

const socialData: SocialData[] = [
  { name: 'Linkedin', link: 'https://www.linkedin.com/in/darshanheble/', icon: <LinkedInIcon /> }
]

function About(): JSX.Element {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [appVersion, setAppVersion] = useState('')
  const [activeTabItem, setActiveTabItem] = useState('/dashboard')

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  useEffect(() => {
    fetchVersion()
    getActiveTabItem()
  }, [])

  async function fetchVersion(): Promise<void> {
    const appVersion = await window.electron.ipcRenderer.invoke('getAppVersion')
    setAppVersion(appVersion)
  }

  async function getActiveTabItem(): Promise<void> {
    const otherData: Other = await window.electron.ipcRenderer.invoke('getOtherData')
    console.log(otherData)
    setActiveTabItem(otherData.activeDrawerItem)

    console.log(activeTabItem)
  }

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${logo})`,
          //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          backgroundSize: 'cover',
          position: 'absolute',
          width: '100%',
          height: '100vh',
          zIndex: 1
        }}
      ></Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 20,
          bgcolor: '#000000e8'
        }}
      >
        <Toolbar>
          <Tooltip title={'Go back'}>
            <IconButton size="large" onClick={() => navigate(`${activeTabItem}`)}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            minHeight: '100vh'
          }}
        >
          {/* App Logo */}
          <img src={logo} alt="App Logo" style={{ width: '10rem', marginBottom: '1rem' }} />

          {/* App Name and Version */}
          <Typography variant="h4" gutterBottom>
            LMS Client
          </Typography>
          <Typography variant="body1" gutterBottom>
            Version: {appVersion}
          </Typography>

          {/* Short Description */}
          <Typography variant="body1" textAlign="center" maxWidth="600px" marginBottom="2rem">
            LMS Client is an open-source library management system built with Electron and React. It
            helps users efficiently manage book records, issue statuses, and requests. Available
            under the MIT License.
          </Typography>

          {/* Contact Info Button */}
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Contact Info
          </Button>

          {/* Dialog for Contact Information */}
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <Typography variant="h6">Developer Contact</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {socialData.map((data, index) => (
                  <Tooltip key={index} title={data.name}>
                    <IconButton
                      aria-label="LinkedIn"
                      // color="primary"
                      onClick={() => window.open(data.link, '_blank')}
                    >
                      <LinkedInIcon fontSize="large" color="primary" />
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  )
}

export default About
