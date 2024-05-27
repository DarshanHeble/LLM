import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Login from './components/Login'

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
      <main>
        <Login />
      </main>
    </ThemeProvider>
  )
}

export default App
