import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import { useNavigate } from 'react-router-dom'

import { sidebarData } from '@renderer/store/mock'
import { IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'

const drawerWidth = 240

interface Props {
  window?: () => Window
}

export default function SIdebar(props: Props): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const navigate = useNavigate()

  const handleDrawerClose = (): void => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = (): void => {
    setIsClosing(false)
  }

  const handleDrawerToggle = (): void => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const drawer = (
    <Box>
      {/* <Toolbar /> */}
      <Divider />
      <List>
        {sidebarData.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            onClick={() => {
              navigate(item.route)
            }}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon} </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  )

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
          <IconButton sx={{ ml: 'auto' }} onClick={handleClick}>
            {/* TODO: theme */}
            {/* {themeMode == 'light' ? <DarkModeIcon /> : <LightModeIcon />} */}
            <LightModeIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleClose} sx={{ gap: 1.5 }}>
              <LightModeIcon /> <Typography> Light Mode</Typography>
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ gap: 1.5 }}>
              <DarkModeIcon /> <Typography> Dark Mode</Typography>
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ gap: 1.5 }}>
              <LightModeIcon />
              <Typography> System Default</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            backgroundColor: 'black'
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}
