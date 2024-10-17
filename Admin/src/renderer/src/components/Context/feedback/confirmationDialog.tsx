import React, { createContext, useCallback, useContext, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'

// Interface defining the structure of the context (methods to show/close confirmation dialog)
interface ConfirmationDialogContextProps {
  showConfirmation: (options: ConfirmationOptions) => void // Method to display the dialog with options
  closeConfirmation: () => void // Method to close the dialog
}

// Interface for customizable options for each confirmation dialog instance
interface ConfirmationOptions {
  title: string // Title of the confirmation dialog
  content: string | JSX.Element // Content/message in the dialog body
  onConfirm: () => void // Function that gets called when "Confirm" button is clicked
  onCancel?: () => void // Optional function that gets called when "Cancel" button is clicked
  confirmButtonText?: string // Optional: Custom text for the confirmation button (e.g., "Delete", "Return")
  confirmButtonColor?: 'success' | 'info' | 'warning' | 'error' | 'primary' | 'secondary' // Optional: Color of the confirmation button based on severity of the action
}

// Create a Context to provide dialog control functions (like show/hide) across the app
const ConfirmationDialogContext = createContext<ConfirmationDialogContextProps | undefined>(
  undefined
)

// Provider component to wrap around parts of the app that need access to confirmation dialogs
export const ConfirmationDialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // State to manage whether the dialog is open or closed
  const [open, setOpen] = useState(false)

  // State to store the options for the currently displayed dialog (title, content, button actions, etc.)
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '', // Default title
    content: '', // Default content
    onConfirm: () => {}, // Default confirm action (empty function)
    onCancel: () => {}, // Default cancel action (empty function)
    confirmButtonText: 'Delete', // Default button text ("Delete" in this case)
    confirmButtonColor: 'error' // Default button color (set to 'error' for delete actions)
  })

  // Function to show the dialog with customized options
  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    setOptions(options) // Update dialog options with provided values (title, content, actions)
    setOpen(true) // Open the dialog
  }, [])

  // Function to close the dialog and call the cancel action if provided
  const closeConfirmation = useCallback(() => {
    setOpen(false) // Close the dialog
    if (options.onCancel) {
      options.onCancel() // If a cancel action was provided, call it
    }
  }, [options])

  // Function to handle the confirm button click
  const handleConfirm = useCallback(() => {
    options.onConfirm() // Call the confirm action provided in the dialog options
    setOpen(false) // Close the dialog after confirming
  }, [options])

  // JSX structure to render the confirmation dialog, and provide dialog control methods (show/close) via context
  return (
    <ConfirmationDialogContext.Provider value={{ showConfirmation, closeConfirmation }}>
      <Dialog open={open} onClose={closeConfirmation}>
        {/* Dialog Title */}
        <DialogTitle>{options.title}</DialogTitle>

        {/* Dialog Content */}
        <DialogContent>
          <DialogContentText>{options.content}</DialogContentText>{' '}
          {/* Display the message/content */}
        </DialogContent>

        {/* Dialog Action Buttons */}
        <DialogActions>
          {/* Cancel Button */}
          <Button onClick={closeConfirmation} color="primary">
            Cancel
          </Button>

          {/* Confirm Button with dynamic text and color based on options */}
          <Button
            onClick={handleConfirm} // Call handleConfirm when this button is clicked
            color={options.confirmButtonColor || 'error'} // Use custom color if provided, otherwise default to 'error'
            autoFocus // Set focus on this button when the dialog opens
          >
            {/* Use custom text if provided, otherwise default to "Delete" */}
            {options.confirmButtonText || 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Render children elements within the provider */}
      {children}
    </ConfirmationDialogContext.Provider>
  )
}

// Custom hook to allow components to use the confirmation dialog functionality
export const useConfirmationDialog = (): ConfirmationDialogContextProps => {
  // Get the context, which provides the showConfirmation and closeConfirmation methods
  const context = useContext(ConfirmationDialogContext)

  // If no context is found (not within a provider), throw an error
  if (!context) {
    throw new Error('useConfirmationDialog must be used within a ConfirmationDialogProvider')
  }

  return context // Return the context, which gives access to the dialog control methods
}
