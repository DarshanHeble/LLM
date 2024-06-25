import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable
} from 'material-react-table'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Book } from '@shared/types'

function MRTBook({ data }: { data: Book[] }): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'bookId',
        header: 'Book Id',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bookId,
          helperText: validationErrors?.bookId,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              bookId: undefined
            })
        }
      },
      {
        accessorKey: 'authorName',
        header: 'Author Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.authorName,
          helperText: validationErrors?.authorName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              authorName: undefined
            })
        }
      },
      {
        accessorKey: 'bookName',
        header: 'Book Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bookName,
          helperText: validationErrors?.bookName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              bookName: undefined
            })
        }
      }
    ],
    [validationErrors]
  )

  // call CREATE hook
  const { mutateAsync: createBook, isPending: isCreatingBook } = useCreateBook()

  // call READ hook
  const {
    data: fetchedBooks = [],
    isError: isLoadingBooksError,
    isFetching: isFetchingBooks,
    isLoading: isLoadingBooks
  } = useGetBooks()

  // call UPDATE hook
  const { mutateAsync: updateBook, isPending: isUpdatingBook } = useUpdateBook()
  // call DELETE hook
  const { mutateAsync: deleteBook, isPending: isDeletingBook } = useDeleteBook()

  // CREATE action
  const handleCreateBook: MRT_TableOptions<Book>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidationErrors = validateBook(values)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
    await createBook(values)
    table.setCreatingRow(null) // exit creating mode
  }

  // UPDATE action
  const handleSaveBook: MRT_TableOptions<Book>['onEditingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateBook(values)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
    await updateBook(values)
    table.setEditingRow(null) // exit editing mode
  }

  // DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Book>): void => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(row.original.id)
    }
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedBooks,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    enableSorting: false,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingBooksError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px'
      }
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBook,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBook,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        Create New Book
      </Button>
    ),
    state: {
      isLoading: isLoadingBooks,
      isSaving: isCreatingBook || isUpdatingBook || isDeletingBook,
      showAlertBanner: isLoadingBooksError,
      showProgressBars: isFetchingBooks
    }
  })

  return <MaterialReactTable table={table} />
}

// READ hook (get books from api)
function useGetBooks(): UseQueryResult<Book[], Error> {
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const re = await window.electron.ipcRenderer.invoke('getBookData')
      return re
    },
    refetchOnWindowFocus: false
  })
}

// CREATE hook (post new book to api)
function useCreateBook(): UseMutationResult<void, Error, Book, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (book: Book) => {
      const newBookId = await window.electron.ipcRenderer.invoke('addNewBook', book)

      // Update the book data with the retrieved ID
      const updatedBook = {
        ...book,
        bookId: newBookId // Assuming newBookId is the ID retrieved from IPC
      }

      // Simulate async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Perform mutation (e.g., update API with updatedBook)
      // Replace the following line with your actual mutation logic
      console.log('Updated Book Data:', updatedBook)

      return Promise.resolve()
    },
    onMutate: (newBookInfo: Book) => {
      // Optimistically update the local query data
      queryClient.setQueryData<Book[]>(['books'], (prevBooks: any) => [
        ...prevBooks,
        {
          ...newBookInfo,
          id: (Math.random() + 1).toString(36).substring(7) // Generate a temporary ID
        }
      ])

      // Return a rollback function in case of mutation failure
      // return () => {
      //   queryClient.setQueryData<Book[]>('books', prevBooks) // Rollback to previous state
      // }
    }
  })
}

// UPDATE hook (put book in api)
function useUpdateBook(): UseMutationResult<void, Error, Book, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (book: Book) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (newBookInfo: Book) => {
      queryClient.setQueryData(['books'], (prevBooks: any) =>
        prevBooks?.map((prevBook: Book) =>
          prevBook.id === newBookInfo.id ? newBookInfo : prevBook
        )
      )
    }
  })
}

// DELETE hook (delete book in api)
function useDeleteBook(): UseMutationResult<void, Error, string, void> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bookId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return Promise.resolve()
    },
    onMutate: (bookId: string) => {
      queryClient.setQueryData(['books'], (prevBooks: any) =>
        prevBooks?.filter((book: Book) => book.id !== bookId)
      )
    }
  })
}

export default MRTBook

const validateRequired = (value: string): boolean => !!value.length

function validateBook(book: Book): {
  bookId: string
  authorName: string
  bookName: string
} {
  return {
    bookId: !validateRequired(book.bookId) ? 'Book ID is Required' : '',
    authorName: !validateRequired(book.authorName) ? 'Author Name is Required' : '',
    bookName: !validateRequired(book.bookName) ? 'Book Name is Required' : ''
  }
}
