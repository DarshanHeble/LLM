import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from 'react-router-dom'
import { sidebarData } from '@renderer/store/mock'
import { Fab } from '@mui/material'
import { useState } from 'react'
import { resolve } from 'path'

interface Props {
  text: string
}

export default function Sidebar(props: Props): JSX.Element {
  const [drawerWidth, setDrawerWidth] = useState(240) // Initial width of sidebar
  const [isListItemTextVisible, setIsListItemTextVisible] = useState(true)
  const [isDrawerLarge, setIsDrawerLarge] = useState(true) // State to toggle between large and small sidebar

  const navigate = useNavigate()

  const handleDrawerSize = async (): Promise<void> => {
    // Toggle sidebar size
    setIsDrawerLarge((prev) => !prev)

    if (isDrawerLarge) {
      setIsListItemTextVisible(false)
    } else {
      // new Promise((resolve) => setTimeout(resolve, 1000))
      setTimeout(() => {
        setIsListItemTextVisible(true)
      }, 300)
    }
    setDrawerWidth(isDrawerLarge ? 60 : 240)
  }

  const drawer = (
    <Box className="drawer" sx={{ width: drawerWidth, transition: 'width 0.3s ease' }}>
      <Fab
        size="medium"
        sx={{
          bgcolor: '#202020',
          color: 'white',
          ':hover': { bgcolor: '#383838' },
          m: '1rem 0 0 .3rem'
        }}
        onClick={handleDrawerSize}
      >
        <MenuIcon />
      </Fab>
      <List>
        {sidebarData.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            onClick={() => navigate(item.route)}
            sx={{
              bgcolor: props.text === item.name ? '#90caf9' : '',
              color: props.text === item.name ? 'black' : ''
            }}
          >
            <ListItemButton
              sx={{
                height: '3rem',
                transition: 'width height 1s ease'
              }}
            >
              <ListItemIcon
                sx={{
                  color: props.text === item.name ? 'black' : '',
                  minWidth: !isListItemTextVisible ? 0 : 56
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isListItemTextVisible && <ListItemText primary={item.name} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.3s ease'
        }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant="persistent"
          sx={
            {
              // '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              // width: drawerWidth,
              // transition: 'width 0.3s ease'
            }
          }
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}
