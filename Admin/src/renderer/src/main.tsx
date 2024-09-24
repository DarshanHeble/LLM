import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AlertToastProvider } from './components/Context/feedback/AlertToast'
import { ThemeProvider } from '@emotion/react'
import { createTheme, CssBaseline } from '@mui/material'
import { ConfirmationDialogProvider } from './components/Context/feedback/confirmationDialog'
import { SidebarProvider } from './components/Context/SideBarContext'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      }
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AlertToastProvider>
        <ConfirmationDialogProvider>
          <SidebarProvider>
            {/* main app */}
            <App />
            {/* main app */}
          </SidebarProvider>
        </ConfirmationDialogProvider>
      </AlertToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)
