import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AlertToastProvider } from './components/feedback/AlertToast'
import { ThemeProvider } from '@emotion/react'
import { createTheme, CssBaseline } from '@mui/material'
import { ConfirmationDialogProvider } from './components/feedback/confirmationDialog'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AlertToastProvider>
        <ConfirmationDialogProvider>
          <App />
        </ConfirmationDialogProvider>
      </AlertToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)
