import { useEffect, useState } from 'react'
import DashBoard from './components/pages/DashBoard'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ManageBooks from './components/pages/ManageBooks'
import ManageUsers from './components/pages/ManageUsers'
import ViewIssuedBooks from './components/pages/ViewIssuedBooks'
import ReturnBooks from './components/pages/ReturnBooks'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/SignUp'
import ForgotPassword from './components/Auth/ForgotPassword'
import { ResetPassword } from './components/Auth/ResetPassword'
import { Admin } from '@shared/types/types'
import { Box } from '@mui/material'
import UserHistory from './components/pages/UserHistory'
import IssueBooks from './components/pages/IssueBook'
import TitleBar from './components/layout/TitleBar'
import About from './components/pages/About'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [, setAdmin] = useState<Admin | null>()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getAdminData', '').then((re) => {
      setAdmin(re)
    })
  }, [])

  return (
    <Box sx={{ height: '-webkit-fill-available' }}>
      <TitleBar />
      <div style={{ paddingBottom: '2rem', height: '-webkit-fill-available' }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgetPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/dashBoard" element={<DashBoard />} />
            <Route path="/manageBooks" element={<ManageBooks />} />
            <Route path="/manageUsers" element={<ManageUsers />} />
            <Route path="/issueBooks" element={<IssueBooks />} />
            <Route path="/viewIssuedBooks" element={<ViewIssuedBooks />} />
            <Route path="/returnBooks" element={<ReturnBooks />} />
            <Route path="/userHistory" element={<UserHistory />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </HashRouter>
      </div>
    </Box>
  )
}

export default App
