import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import SignIn from './components/loginFolder/SignIn'

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
        <SignIn />
      </main>
    </ThemeProvider>
  )
}

export default App
