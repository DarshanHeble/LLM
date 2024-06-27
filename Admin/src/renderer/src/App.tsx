import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './components/pages/Home'
import { Route, Routes } from 'react-router-dom'
import ManageBooks from './components/pages/ManageBooks'
import ManageStudents from './components/pages/ManageStudents'
import ViewIssuedBooks from './components/pages/ViewIssuedBooks'
import ReturnBooks from './components/pages/ReturnBooks'
// import Login from './components/Auth/Login'
// import SignUp from './components/Auth/SignUp'
// import ForgotPassword from './components/Auth/ForgotPassword'
// import { ResetPassword } from './components/Auth/ResetPassword'
import { Admin } from '@shared/types'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  const [admin, setAdmin] = useState<Admin | null>()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getAdminData', '').then((re) => {
      setAdmin(re)
    })
  }, [])

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Routes>
          {/* <Route path="/" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/signUp" element={<SignUp />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/manageBooks" element={<ManageBooks />} />
          <Route path="/manageStudents" element={<ManageStudents />} />
          <Route path="/viewIssuedBooks" element={<ViewIssuedBooks />} />
          <Route path="/returnBooks" element={<ReturnBooks />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
