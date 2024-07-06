import { Snackbar, Alert, AlertProps } from '@mui/material'
import { FC } from 'react'

interface SuccessSnackbarProps {
  open: boolean
  successMessage: string
  onClose: () => void
  severity?: AlertProps['severity']
}

const SuccessSnackbar: FC<SuccessSnackbarProps> = ({
  open,
  successMessage,
  onClose,
  severity = 'success'
}): JSX.Element => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {successMessage}
      </Alert>
    </Snackbar>
  )
}

export default SuccessSnackbar
