import {
  Box,
  Divider,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { topSidebarData } from '@renderer/store/mock'
import { useSidebar } from '../Context/SideBarContext'

import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

interface Props {
  text: string
}

export default function Sidebar(props: Props): JSX.Element {
  const { drawerWidth, isDrawerLarge, isListItemTextVisible, toggleDrawerSize } = useSidebar()

  const navigate = useNavigate()

  const drawer = (
    <Box
      className="drawer"
      sx={{ width: drawerWidth, height: '-webkit-fill-available', transition: 'width 0.3s ease' }}
    >
      <Fab
        size="medium"
        sx={{
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
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {topSidebarData.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            onClick={() => navigate(item.route)}
            sx={{
              bgcolor: props.text === item.name ? '#90caf9' : '',
              color: props.text === item.name ? 'black' : '',
              height: '3rem',
              transition: 'width height 1s ease'
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{
                  color: props.text === item.name ? 'black' : '',
                  minWidth: !isListItemTextVisible ? 0 : 56
                }}
              >
                {props.text === item.name ? item.filledIcon : item.outlinedIcon}
              </ListItemIcon>
              {isListItemTextVisible && <ListItemText primary={item.name} />}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <ListItem
          disablePadding
          sx={{
            height: '3rem',
            transition: 'width height 1s ease',
            mt: 'auto'
          }}
        >
          <ListItemButton onClick={() => navigate('/')}>
            <ListItemIcon
              sx={{
                minWidth: !isListItemTextVisible ? 0 : 56
              }}
            >
              <LogoutOutlinedIcon />
            </ListItemIcon>
            {isListItemTextVisible && <ListItemText primary="Log Out" />}
          </ListItemButton>
        </ListItem>
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
            // '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            // width: drawerWidth,
            // transition: 'width 0.3s ease'
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}
