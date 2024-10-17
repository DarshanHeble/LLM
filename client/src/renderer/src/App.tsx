import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Home from './pages/Home'
import { AlertToastProvider } from './components/feedback/AlertToast'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ManageUser from './pages/manageUser'

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
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="manageUser" element={<ManageUser />} />
            </Routes>
          </HashRouter>
        </AlertToastProvider>
      </ThemeProvider>
    </>
  )
}

export default App
