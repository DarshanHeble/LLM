import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FC } from 'react'

interface ErrorDialogProps {
  open: boolean
  errorMessage: string
  onClose: () => void
}

const ErrorDialog: FC<ErrorDialogProps> = ({ open, errorMessage, onClose }): JSX.Element => {
  return (
    <Dialog open={open}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <p>{errorMessage}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog
