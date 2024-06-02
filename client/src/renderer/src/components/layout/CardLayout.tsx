import { Card, CardContent, Typography } from '@mui/material'

function CardLayout({ value }): JSX.Element {
  return (
    <Card>
      <CardContent sx={{ width: 280 }}>
        <Typography component="h1">{value.name}</Typography>
      </CardContent>
    </Card>
  )
}

export default CardLayout
