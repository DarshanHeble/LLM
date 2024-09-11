// ConfirmationDialog.tsx
import React, { createContext, useCallback, useContext, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'

interface ConfirmationDialogContextProps {
  showConfirmation: (options: ConfirmationOptions) => void
  closeConfirmation: () => void
}

interface ConfirmationOptions {
  title: string
  content: string
  onConfirm: () => void
  onCancel?: () => void
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextProps | undefined>(
  undefined
)

export const ConfirmationDialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    content: '',
    onConfirm: () => {},
    onCancel: () => {}
  })

  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    setOptions(options)
    setOpen(true)
  }, [])

  const closeConfirmation = useCallback(() => {
    setOpen(false)
    if (options.onCancel) {
      options.onCancel()
    }
  }, [options])

  const handleConfirm = useCallback(() => {
    options.onConfirm()
    setOpen(false)
  }, [options])

  return (
    <ConfirmationDialogContext.Provider value={{ showConfirmation, closeConfirmation }}>
      <Dialog open={open} onClose={closeConfirmation}>
        <DialogTitle>{options.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{options.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </ConfirmationDialogContext.Provider>
  )
}

// Custom Hook to use the ConfirmationDialog
export const useConfirmationDialog = (): ConfirmationDialogContextProps => {
  const context = useContext(ConfirmationDialogContext)
  if (!context) {
    throw new Error('useConfirmationDialog must be used within a ConfirmationDialogProvider')
  }
  return context
}
