import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import AppNavBar from './components/AppNavBar'
import Versions from './components/Versions'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container className="main" component="main"></Container>
        <AppNavBar />
      </ThemeProvider>
    </>
  )
}

export default App
