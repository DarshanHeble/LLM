import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './components/pages/Home'
import { Route, Routes } from 'react-router-dom'
import ManageBooks from './components/pages/ManageBooks'
import ManageStudents from './components/pages/ManageStudents'
import ViewIssuedBooks from './components/pages/ViewIssuedBooks'
import ReturnBooks from './components/pages/ReturnBooks'
import LoginSignIn from './components/pages/LoginSignIn'

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
            <Route path="/" element={<LoginSignIn />} />
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
