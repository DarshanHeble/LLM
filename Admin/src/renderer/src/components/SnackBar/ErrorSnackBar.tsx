import { Snackbar, Alert, AlertProps } from '@mui/material'
import { FC } from 'react'

interface ErrorSnackbarProps {
  open: boolean
  errorMessage: string
  onClose: () => void
  severity?: AlertProps['severity']
}

const ErrorSnackbar: FC<ErrorSnackbarProps> = ({
  open,
  errorMessage,
  onClose,
  severity = 'error'
}): JSX.Element => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackbar
