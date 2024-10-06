import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  useMaterialReactTable
} from 'material-react-table'
import { Box, Button, Fab, IconButton, Tooltip } from '@mui/material'
import { Book } from '@shared/types/types'
import { useCreateBook, useDeleteBook, useGetBooks, useUpdateBook } from '@renderer/hooks'
import { courseList, semList } from '@renderer/store/data'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { useConfirmationDialog } from '../Context/feedback/confirmationDialog'
import CreateBookDialog from '../dialog/createBookDialog'
import EditBookDialog from '../dialog/editBookDialog'
import { utils, WorkBook, WorkSheet, write } from 'xlsx'

const initialData: Book = {
  _id: '',
  bookName: '',
  authorName: '',
  course: '',
  sem: 0,
  quantity: 0,
  addedAt: new Date()
}

function MRTBook(): JSX.Element {
  const { showAlert } = useAlertToast()
  const { showConfirmation } = useConfirmationDialog()

  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState<MRT_Row<Book>[]>([])

  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  // const [newUserData, setNewUserData] = useState<Book>(initialData)`
  const [editPrevData, setEditPrevData] = useState<Book>(initialData)

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

  // Function to export user book history to an Excel file
  const exportToExcel = (): void => {
    // Prepare data
    const flatData = fetchedUsers.flatMap((user) =>
      user.bookHistory.map((book) => {
        return {
          userId: user._id,
          userName: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          addedAt: user.addedAt,
          bookId: book.id,
          bookName: book.bookName,
          authorName: book.authorName,
          course: book.course,
          sem: book.sem,
          issueDate: book.issueDate.toLocaleString(),
          dueDate: book.dueDate.toLocaleString(),
          returnedDate: book.returnedDate ? book.returnedDate.toLocaleDateString() : 'Not returned',
          fine: book.fine,
          barcode: `*${user._id}*` // Wrap _id with asterisks for barcode
        }
      })
    )

    // Create a new workbook and a worksheet from the flat data
    const workbook: WorkBook = utils.book_new()
    const worksheet: WorkSheet = utils.json_to_sheet(flatData)

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'User Book History')

    // Write the Excel file to a binary
    const excelBinary = write(workbook, { type: 'array' })

    // Create a blob and trigger download
    const blob = new Blob([excelBinary], { type: 'application/octet-stream' })
    saveAs(blob, 'user_book_history_with_barcodes.xlsx')

    // Show a message to the user
    alert(
      "Please open the Excel file and select the 'barcode' column, then change the font to 'Libre Barcode 39' to see the barcodes."
    )
  }

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

  const handleCreateFormSubmit = async (newBookFormData: Book): Promise<void> => {
    const result = await createBook(newBookFormData)
    // handle response in the UI
    if (result.isSuccess) {
      showAlert(result.resultMessage[0], 'success')
    } else {
      console.log('error')
      showAlert(result.resultMessage[0], 'error')
    }
  }

  const handleEditFormSubmit = async (updatedBookFormData: Book): Promise<void> => {
    console.log(updatedBookFormData)

    const result = await updateBook(updatedBookFormData)
    // handle response in the UI
    if (result.isSuccess) {
      table.setEditingRow(null)
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
    createDisplayMode: 'custom',
    editDisplayMode: 'custom',
    enableEditing: true,
    enableSorting: false,
    enableRowNumbers: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableRowActions: true,
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
    onRowSelectionChange: setRowSelection,
    state: {
      isLoading: isLoadingBooks,
      isSaving: isCreatingBook || isUpdatingBook || isDeletingBook,
      showAlertBanner: isLoadingBooksError,
      showProgressBars: isFetchingBooks,
      rowSelection
    },
    renderRowActions: ({ row /*table*/ }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              setEditPrevData(row.original)
              setOpenEditDialog(true)
            }}
          >
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
    renderTopToolbarCustomActions: () => (
      <Box>
        <Fab
          variant="extended"
          onClick={() => {
            setOpenCreateDialog(true)
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

  return (
    <>
      {openCreateDialog && (
        <CreateBookDialog
          open={openCreateDialog}
          onSubmit={handleCreateFormSubmit}
          onClose={() => setOpenCreateDialog(false)}
        />
      )}
      {openEditDialog && (
        <EditBookDialog
          open={openEditDialog}
          onSubmit={handleEditFormSubmit}
          onClose={() => setOpenEditDialog(false)}
          prevData={editPrevData}
        />
      )}
      <MaterialReactTable table={table} />
    </>
  )
}

export default MRTBook
