import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable
  // MRT_ActionMenuItem
} from 'material-react-table'
import { Box, Button, Fab, IconButton, Tooltip } from '@mui/material'
import { Book } from '@shared/types/types'
import { useCreateBook, useDeleteBook, useGetBooks, useUpdateBook } from '@renderer/hooks'
import { validateBook } from '@renderer/utils/validation'
import { courseList, semList } from '@renderer/store/data'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { useConfirmationDialog } from '../Context/feedback/confirmationDialog'

function MRTBook(): JSX.Element {
  const { showAlert } = useAlertToast()
  const { showConfirmation } = useConfirmationDialog()

  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState<MRT_Row<Book>[]>([])

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'Id',
        enableEditing: false,
        enableClickToCopy: true
        // visibleInShowHideMenu: false
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
        accessorKey: 'quantity',
        header: 'Quantity',
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
          error: !!validationErrors?.quantity,
          helperText: validationErrors?.quantity,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              quantity: undefined
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
    const result = await createBook(values)
    // handle response in the UI
    if (result.isSuccess) {
      table.setCreatingRow(null) // exit creating mode
      showAlert(result.resultMessage[0], 'success')
    } else {
      console.log('error')
      showAlert(result.resultMessage[0], 'error')
    }
  }

  // UPDATE action
  const handleSaveBook: MRT_TableOptions<Book>['onEditingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateBook(values)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
    const result = await updateBook(values)
    // handle response in the UI
    if (result.isSuccess) {
      table.setCreatingRow(null) // exit creating mode
      showAlert(result.resultMessage[0], 'success')
    } else {
      console.log('error')
      showAlert(result.resultMessage[0], 'error')
    }
  }

  // DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Book>): void => {
    showConfirmation({
      title: 'Delete Book',
      content: 'Are you sure you want to delete this book',
      onConfirm() {
        deleteBook(row.original._id)
        table.setEditingRow(null)
        showAlert('Successfully deleted this book')
      }
    })
    // if (window.confirm('Are you sure you want to delete this book?')) {
    //   deleteBook(row.original._id)
    // }
    // table.setEditingRow(null)
  }

  // DELETE action
  const openDeleteConfirmModalForMultiple = (): void => {
    if (window.confirm('Are you sure you want to delete the selected books?')) {
      selectedRows.forEach((row) => deleteBook(row.original._id))
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

    getRowId: (row) => row._id,
    initialState: {
      // columnVisibility: { id: false },
      columnOrder: [
        'mrt-row-numbers',
        // 'mrt-row-select',
        '_id',
        'authorName',
        'bookName',
        'course',
        'sem',
        'quantity',
        'mrt-row-actions'
      ],
      pagination: {
        pageSize: 50,
        pageIndex: 0
      }
    },
    muiToolbarAlertBannerProps: isLoadingBooksError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    muiTablePaperProps: {
      sx: {
        display: 'flex',
        flexDirection: 'column',
        height: '-webkit-fill-available'
      }
    },
    muiTableContainerProps: {
      sx: {
        height: '-webkit-fill-available'
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
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    // renderRowActionMenuItems: ({ row }) => [
    //   <MRT_ActionMenuItem
    //     icon={<DeleteOutlinedIcon />}
    //     key="delete"
    //     label="Delete"
    //     onClick={() => openDeleteConfirmModal(row)}
    //     table={table}
    //   />
    // ],
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <Fab
          variant="extended"
          onClick={() => {
            table.setCreatingRow(true)
          }}
          sx={{
            textTransform: 'none',
            mb: '1rem'
          }}
        >
          <LibraryAddIcon sx={{ mr: '1rem' }} /> Create New Book
        </Fab>
        {selectedRows.length > 0 && (
          <Button variant="contained" color="error" onClick={openDeleteConfirmModalForMultiple}>
            Delete Selected Books
          </Button>
        )}
      </Box>
    ),
    icons: {
      ViewColumnIcon: () => <ViewColumnOutlinedIcon />
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRTBook
