/* eslint-disable react/prop-types */
import {
  AppBar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Slide,
  Toolbar,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

function CardLayout({ value }): JSX.Element {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  // const click = (): void => {
  //   console.log('hello')
  // }

  return (
    <>
      <Card
        sx={{
          minWidth: 200,
          minHeight: 200
        }}
      >
        <CardActionArea sx={{ height: '100%' }} onClick={handleClickOpen}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              height: '100%'
            }}
          >
            <Typography component="h1" fontSize={40} sx={{ display: 'grid', placeItems: 'center' }}>
              {value.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItemButton>
        </List>
      </Dialog>
    </>
  )
}

export default CardLayout
