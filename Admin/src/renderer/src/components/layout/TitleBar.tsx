import { Box, Typography } from '@mui/material'
import logo from '../../assets/icon.png'

function TitleBar(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        minWidth: '100%',
        height: '30px',
        p: '5px',
        WebkitAppRegion: 'drag'
      }}
    >
      <img
        src={logo}
        style={{ width: '23px', height: '23px', marginInlineEnd: '10px' }}
        alt="logo"
      />
      <Typography variant="body2" color="textSecondary">
        Admin
      </Typography>
    </Box>
  )
}

export default TitleBar
