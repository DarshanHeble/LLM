import { Card, CardActionArea, CardContent, Slide, Typography } from '@mui/material'
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

  const click = (): void => {
    console.log('hello')
  }

  return (
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
  )
}

export default CardLayout
