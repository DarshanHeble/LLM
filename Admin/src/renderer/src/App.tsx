import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './components/pages/Home'
import { Route, Routes } from 'react-router-dom'
import ManageBooks from './components/pages/ManageBooks'
import ManageStudents from './components/pages/ManageStudents'
import ViewIssuedBooks from './components/pages/ViewIssuedBooks'
import ReturnBooks from './components/pages/ReturnBooks'
import Login from './components/login/Login'
import SignUp from './components/login/SignUp'
import ForgotPassword from './components/login/ForgotPassword'

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
            <Route path="/" element={<Login />} />
            <Route path="/forgetPassword" element={<ForgotPassword />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/manageBooks" element={<ManageBooks />} />
            <Route path="/manageStudents" element={<ManageStudents />} />
            <Route path="/viewissuedbooks" element={<ViewIssuedBooks />} />
            <Route path="/returnbooks" element={<ReturnBooks />} />
          </Routes>
        </main>
      </ThemeProvider>
    </>
  )
}

export default App
