import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './components/pages/Home'
import { Route, Routes } from 'react-router-dom'
import ManageBook from './components/pages/ManageBook'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manageBooks" element={<ManageBooks />} />
            <Route path="/manageStudents" element={<ForgotPassword />} />
          </Routes>

          {/* <LoginSignIn /> */}
          {/* <Home /> */}
        </main>
      </ThemeProvider>
    </>
  )
}

export default App
