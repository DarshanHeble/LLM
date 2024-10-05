import React, { useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { Book, bookFormData } from '@shared/types/types'
import { courseList, semList } from '@renderer/store/data'

interface CreateBookDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (bookData: Book) => void
}

const CreateBookDialog = ({ open, onClose, onSubmit }: CreateBookDialogProps): JSX.Element => {
  const [formData, setFormData] = useState<bookFormData>({
    _id: '',
    bookName: '',
    authorName: '',
    course: '',
    sem: '',
    quantity: 0,
    addedAt: new Date()
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    if (Number(value) >= 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleCourseChange = (_event, value: string | null): void => {
    setFormData((prevData) => ({
      ...prevData,
      course: value || ''
    }))
  }
  const handleSemChange = (_event, value: string | null): void => {
    setFormData((prevData) => ({
      ...prevData,
      sem: value || ''
    }))
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const formattedFormData: Book = {
      ...formData,
      sem: Number(formData.sem)
    }
    onSubmit(formattedFormData)
    onClose() // Close the dialog after submission
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: '#121212' }}>Create New Book</DialogTitle>
      <DialogContent sx={{ bgcolor: '#121212', width: '24rem' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, width: '100%' }}
        >
          <TextField
            label="Book Name"
            type="text"
            variant="outlined"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Author Name"
            type="text"
            variant="outlined"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            required
          />
          <Autocomplete
            options={courseList}
            value={formData.course}
            onChange={handleCourseChange}
            renderInput={(params) => (
              <TextField {...params} label="Course" variant="outlined" required />
            )}
          />
          <Autocomplete
            options={semList}
            value={formData.sem}
            onChange={handleSemChange}
            renderInput={(params) => (
              <TextField {...params} label="Semester" variant="outlined" required />
            )}
          />
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            name="quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            required
          />
          <DialogActions>
            <Button color="error" onClick={onClose}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CreateBookDialog
