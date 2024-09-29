import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Home from './components/Home'
import { AlertToastProvider } from './components/feedback/AlertToast'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }
  }
})

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AlertToastProvider>
          <Home />
        </AlertToastProvider>
      </ThemeProvider>
    </>
  )
}

export default App
