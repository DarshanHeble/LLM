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
import { Book } from '@shared/types/types'
import { courseList } from '@renderer/store/data'

interface EditUser {
  open: boolean
  onClose: () => void
  onSubmit: (userFormData: Book) => void
  prevData: Book
}

const EditBookDialog = (props: EditUser): JSX.Element => {
  const { open, onClose, onSubmit, prevData } = props
  console.log(prevData)

  const [formData, setFormData] = useState<Book>({
    _id: prevData._id,
    bookName: prevData.bookName,
    authorName: prevData.authorName,
    course: prevData.course,
    sem: prevData.sem,
    quantity: prevData.quantity,
    addedAt: prevData.addedAt
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

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    onSubmit(formData)
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
          <TextField
            label="Semester"
            type="number"
            variant="outlined"
            name="sem"
            value={formData.sem}
            onChange={handleChange}
            required
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
            <Button color="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EditBookDialog
