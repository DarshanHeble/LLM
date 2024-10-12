import { useState } from 'react'
import {
  Box,
  Divider,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { topSidebarData } from '@renderer/store/mock'
import { useSidebar } from '../Context/SideBarContext'

import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { useConfirmationDialog } from '../Context/feedback/confirmationDialog'

interface Props {
  text: string
}

export default function Sidebar(props: Props): JSX.Element {
  const { drawerWidth, isDrawerLarge, isListItemTextVisible, toggleDrawerSize } = useSidebar()
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null)
  const settingsOpen = Boolean(settingsAnchorEl)

  const navigate = useNavigate()
  const { showAlert } = useAlertToast()
  const { showConfirmation } = useConfirmationDialog()

  function handleSettingsMenuClose(): void {
    setSettingsAnchorEl(null)
  }

  function handleSettingsMenuOpen(event): void {
    setSettingsAnchorEl(event.currentTarget)
  }

  function deleteAdmin(): void {
    showConfirmation({
      title: 'Delete Admin Account',
      content:
        'Are you sure you want to delete the Admin Account. Deleting the Admin Account does not remove any user of book data.',
      onConfirm: async () => {
        const response: boolean = await window.electron.ipcRenderer.invoke('deleteAdminData')

        if (!response) {
          showAlert('Enable to delete admin account', 'error')
        }

        showAlert('Successfully deleted Admin Account', 'success')
        navigate('/')
      }
    })
  }

  const drawer = (
    <Box
      className="drawer"
      sx={{
        width: drawerWidth,
        height: '-webkit-fill-available',
        transition: 'width 0.3s ease',
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
      }}
    >
      <Fab
        size="medium"
        sx={{
          minWidth: '48px',
          minHeight: '48px',
          bgcolor: '#202020',
          color: 'white',
          ':hover': { bgcolor: '#383838' },
          m: '1rem 0 0 .3rem'
        }}
        onClick={toggleDrawerSize}
      >
        {isDrawerLarge ? <MenuOpenIcon /> : <MenuIcon />}
      </Fab>
      <List
        sx={{
          height: '-webkit-fill-available',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mt: '2rem'
        }}
      >
        {topSidebarData.map((item) => (
          <Tooltip
            key={item.name}
            title={item.name}
            disableHoverListener={isDrawerLarge}
            placement="right"
            arrow
          >
            <ListItem
              disablePadding
              onClick={() => navigate(item.route)}
              sx={{
                bgcolor: props.text === item.name ? '#90caf9' : '',
                color: props.text === item.name ? 'black' : '',
                height: '3rem',
                borderRadius: '0 3rem 3rem 0',
                transition: 'width height 1s ease'
              }}
            >
              <ListItemButton
                sx={{
                  height: '3rem',
                  borderRadius: '0 3rem 3rem 0'
                }}
              >
                <ListItemIcon
                  sx={{
                    color: props.text === item.name ? 'black' : '',
                    minWidth: isListItemTextVisible ? 56 : 0
                  }}
                >
                  {props.text === item.name ? item.filledIcon : item.outlinedIcon}
                </ListItemIcon>
                {isListItemTextVisible && <ListItemText primary={item.name} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
        <Divider />

        <Tooltip title="Settings" disableHoverListener={isDrawerLarge} placement="right" arrow>
          <ListItem
            disablePadding
            sx={{
              height: '3rem',
              transition: 'width height 1s ease',
              mt: 'auto',
              borderRadius: '0 3rem 3rem 0'
            }}
          >
            <ListItemButton onClick={handleSettingsMenuOpen} sx={{ borderRadius: '0 3rem 3rem 0' }}>
              <ListItemIcon
                sx={{
                  minWidth: !isListItemTextVisible ? 0 : 56
                }}
              >
                <SettingsOutlinedIcon />
              </ListItemIcon>
              {isListItemTextVisible && <ListItemText primary="Settings" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>

        {/* Setting Menu */}
        <Menu
          open={settingsOpen}
          anchorEl={settingsAnchorEl}
          onClose={handleSettingsMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            paddingBlock: 0,
            '& MuiPaper-root': {
              width: '240px'
            }
          }}
        >
          <Box>
            <ListItemButton onClick={() => navigate('/')}>
              <ListItemIcon sx={{ minWidth: '56px' }}>
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={deleteAdmin}>
              <ListItemIcon sx={{ minWidth: 56 }}>
                <DeleteOutlinedIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Delete Account" sx={{ color: '#f44336' }} />
            </ListItemButton>
          </Box>
        </Menu>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '-webkit-fill-available' }}>
      <Box
        component="nav"
        sx={{
          width: drawerWidth,
          height: '-webkit-fill-available',
          flexShrink: 0,
          transition: 'width 0.3s ease'
        }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant="persistent"
          sx={{
            height: '-webkit-fill-available'
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}
