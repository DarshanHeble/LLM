import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
  MRT_ActionMenuItem
} from 'material-react-table'
import { Box, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Book } from '@shared/types'
import { useCreateBook, useDeleteBook, useGetBooks, useUpdateBook } from '@renderer/hooks'
import { validateBook } from '@renderer/utils/validation'
import { courseList, semList } from '@renderer/store/data'

function MRTBook(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState<MRT_Row<Book>[]>([])
  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        enableClickToCopy: true
        // visibleInShowHideMenu: false
      },
      // {
      //   accessorKey: 'bookId',
      //   header: 'Book Id',
      //   muiEditTextFieldProps: {
      //     required: true,
      //     error: !!validationErrors?.bookId,
      //     helperText: validationErrors?.bookId,
      //     onFocus: () =>
      //       setValidationErrors({
      //         ...validationErrors,
      //         bookId: undefined
      //       })
      //   }
      // },
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
        accessorKey: 'course',
        header: 'Course',
        editVariant: 'select',
        editSelectOptions: courseList,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.course,
          helperText: validationErrors?.course,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              course: undefined
            })
        }
      },
      {
        accessorKey: 'sem',
        header: 'Semester',
        editVariant: 'select',
        editSelectOptions: semList,
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
          error: !!validationErrors?.sem,
          helperText: validationErrors?.sem,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              sem: undefined
            })
        }
      },
      {
        accessorKey: 'noOfBooks',
        header: 'No Of Book',
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
          error: !!validationErrors?.noOfBooks,
          helperText: validationErrors?.noOfBooks,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              noOfBooks: undefined
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
  console.log('book', fetchedBooks)

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
    console.log('err', newValidationErrors)
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
    table.setEditingRow(null)
  }

  // DELETE action
  const openDeleteConfirmModalForMultiple = (): void => {
    if (window.confirm('Are you sure you want to delete the selected books?')) {
      selectedRows.forEach((row) => deleteBook(row.original.id))
      setRowSelection({})
      setSelectedRows([])
    }
  }
  const table = useMaterialReactTable({
    columns,
    data: fetchedBooks,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    enableSorting: false,
    enableRowActions: true,
    enableRowNumbers: true,
    // enableColumnResizing: true,
    // columnResizeMode: 'onEnd',
    // enableRowSelection: true,

    getRowId: (row) => row.id,
    initialState: {
      // columnVisibility: { id: false },
      columnOrder: [
        'mrt-row-numbers',
        // 'mrt-row-select',
        'id',
        // 'bookId',
        'authorName',
        'bookName',
        'course',
        'sem',
        'noOfBooks',
        'mrt-row-actions'
      ]
    },
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
    onRowSelectionChange: setRowSelection,
    state: {
      isLoading: isLoadingBooks,
      isSaving: isCreatingBook || isUpdatingBook || isDeletingBook,
      showAlertBanner: isLoadingBooksError,
      showProgressBars: isFetchingBooks,
      rowSelection
    },
    // renderRowActions: ({ row, table }) => (
    //   <Box sx={{ display: 'flex', gap: '1rem' }}>
    //     <Tooltip title="Edit">
    //       <IconButton onClick={() => table.setEditingRow(row)}>
    //         <EditIcon />
    //       </IconButton>
    //     </Tooltip>
    //     <Tooltip title="Delete">
    //       <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
    //         <DeleteIcon />
    //       </IconButton>
    //     </Tooltip>
    //   </Box>
    // ),

    renderRowActionMenuItems: ({ row }) => [
      // <MRT_ActionMenuItem //or just use a normal MUI MenuItem component
      //   icon={<EditIcon />}
      //   key="edit"
      //   label="Edit"
      //   onClick={() => table.setEditingRow(row)}
      //   table={table}
      // />,
      <MRT_ActionMenuItem
        icon={<DeleteIcon />}
        key="delete"
        label="Delete"
        onClick={() => openDeleteConfirmModal(row)}
        table={table}
      />
    ],
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            table.setCreatingRow(true)
          }}
        >
          Create New Book
        </Button>
        {selectedRows.length > 0 && (
          <Button variant="contained" color="error" onClick={openDeleteConfirmModalForMultiple}>
            Delete Selected Books
          </Button>
        )}
      </Box>
    )
  })

  return <MaterialReactTable table={table} />
}

export default MRTBook
