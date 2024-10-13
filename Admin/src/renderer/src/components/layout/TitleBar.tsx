import { Box, Typography } from '@mui/material'
import logo from '../../assets/icon.png'

function TitleBar(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        minWidth: '100%',
        height: '30px',
        // bgcolor: 'White',
        // color: 'black',
        WebkitAppRegion: 'drag'
      }}
    >
      <img src={logo} style={{ width: '2rem' }} alt="logo" />
      <Typography>Admin</Typography>
    </Box>
  )
}

export default TitleBar
