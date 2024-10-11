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
import IssueBook from './components/pages/IssueBook'
import { Box } from '@mui/material'
import UserHistory from './components/pages/UserHistory'
import DueBooks from './components/pages/DueBooks'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [, setAdmin] = useState<Admin | null>()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getAdminData', '').then((re) => {
      setAdmin(re)
    })
  }, [])

  return (
    <Box sx={{ height: '100vh' }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/dashBoard" element={<DashBoard />} />
          <Route path="/manageBooks" element={<ManageBooks />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/issueBook" element={<IssueBook />} />
          <Route path="/viewIssuedBooks" element={<ViewIssuedBooks />} />
          <Route path="/returnBooks" element={<ReturnBooks />} />
          <Route path="/userHistory" element={<UserHistory />} />
          <Route path="/dueBooks" element={<DueBooks />} />
        </Routes>
      </HashRouter>
    </Box>
  )
}

export default App
