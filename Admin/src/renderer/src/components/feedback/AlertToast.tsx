// AlertToast.tsx
import React, { createContext, useCallback, useContext, useState } from 'react'
import { Snackbar, Alert, AlertProps } from '@mui/material'

interface AlertToastContextProps {
  showAlert: (message: string, severity?: AlertProps['severity']) => void
  closeAlert: () => void
}

const AlertToastContext = createContext<AlertToastContextProps | undefined>(undefined)

export const AlertToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [severity, setSeverity] = useState<AlertProps['severity']>('success')

  const showAlert = useCallback((msg: string, severity: AlertProps['severity'] = 'success') => {
    setMessage(msg)
    setSeverity(severity)
    setOpen(true)
  }, [])

  const closeAlert = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <AlertToastContext.Provider value={{ showAlert, closeAlert }}>
      <Snackbar open={open} autoHideDuration={3000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </AlertToastContext.Provider>
  )
}

// Custom Hook to use the AlertToast
export const useAlertToast = (): AlertToastContextProps => {
  const context = useContext(AlertToastContext)
  if (!context) {
    throw new Error('useAlertToast must be used within an AlertToastProvider')
  }
  return context
}
