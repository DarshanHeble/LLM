import { Typography } from '@mui/material'
import { APP_CREATION_DATE } from '@renderer/utils/constants'

function ExtraLine(props): JSX.Element {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Built with ❤️ by Darshan Heble '}
      {'(' + APP_CREATION_DATE.getFullYear() + ')'}
      {'.'}
    </Typography>
  )
}

export default ExtraLine
