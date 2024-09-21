import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
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
        <Home />
      </ThemeProvider>
    </>
  )
}

export default App
