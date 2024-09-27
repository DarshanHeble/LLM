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
      <AlertToastProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Home />
        </ThemeProvider>
      </AlertToastProvider>
    </>
  )
}

export default App
