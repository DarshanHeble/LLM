import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { FC } from 'react'

interface ConfirmationDialogProp {
  open: boolean
  message: string
  onConfirm?: () => void
  onCancel?: () => void
}

const ConfirmationDialog: FC<ConfirmationDialogProp> = ({
  open,
  message,
  onConfirm,
  onCancel
}): JSX.Element => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
