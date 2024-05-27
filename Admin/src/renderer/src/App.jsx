import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import SignIn from './components/loginFolder/SignIn'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/loginFolder/SignUp'
import ForgotPassword from './components/loginFolder/ForgotPassword'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="main">
        {/* <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes> */}
      </main>
    </ThemeProvider>
  )
}

export default App
