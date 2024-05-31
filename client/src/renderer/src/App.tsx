// import { Container, CssBaseline, createTheme } from '@mui/material'
// import { ThemeProvider } from 'styled-components'
import AppNavBar from './components/AppNavBar'
import Versions from './components/Versions'

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark'
//   }
// })

function App(): JSX.Element {
  return (
    <>
      {/* <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container className="main" component="main">
          hello
        </Container>
      </ThemeProvider> */}
      app
      <AppNavBar />
      <Versions />
    </>
  )
}

export default App
