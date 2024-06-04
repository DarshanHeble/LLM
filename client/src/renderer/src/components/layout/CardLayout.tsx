import { Avatar, Card, CardContent, Typography } from '@mui/material'

function CardLayout({ value }): JSX.Element {
  return (
    <Card
      sx={{
        minWidth: 200,
        minHeight: 200
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center'
        }}
      >
        <Typography
          component="h1"
          fontSize={40}
          sx={{ display: 'grid', placeItems: 'center', height: '100%' }}
        >
          {value.name}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardLayout
