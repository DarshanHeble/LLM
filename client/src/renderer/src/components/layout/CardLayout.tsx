import { Avatar, Card, CardContent, Typography } from '@mui/material'

function CardLayout({ value }): JSX.Element {
  return (
    // <Card
    //   sx={{
    //     width: 250,
    //     height: 200
    //   }}
    // >
    //   <CardContent
    //     sx={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignContent: 'center'
    //     }}
    //   >
    //     <Typography component="h1" fontSize={40} sx={{ textAlign: 'center', display: 'block' }}>
    //       {value.name}
    //     </Typography>
    //   </CardContent>
    // </Card>
    <Avatar variant="square" sx={{ width: 100, height: 100 }}>
      {value.name}
    </Avatar>
  )
}

export default CardLayout
