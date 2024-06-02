import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import AppNavBar from './components/AppNavBar'
import Home from './components/Home'

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
        <AppNavBar />
        <Home />
      </ThemeProvider>
    </>
  )
}

export default App
