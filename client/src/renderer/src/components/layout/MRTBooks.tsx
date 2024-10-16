import { Book, User } from '@shared/types/types'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useEffect, useMemo, useState } from 'react'
import useGetBooks from './useGetBooks'
import { Fab, IconButton, Tooltip } from '@mui/material'

import CreateUserDialog from '../dialog/createUserDialog'
import IssueBookDialog from '../dialog/IssueBookDialog'
import { ForwardToInbox, PersonAddAlt1 } from '@mui/icons-material'

function MRTBooks(): JSX.Element {
  useEffect(() => {
    window.electron.ipcRenderer.on('userData', (_, users: User[]) => {
      console.log('user Data', users)
      setUser(users)
    })

    window.electron.ipcRenderer.on('bookData', (_, bookData: Book[]) => {
      console.log('book data', bookData)
      refetchBooks()
    })
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUserData').then((userData: User[]) => {
      console.log(userData)
      setUser(userData)
    })
  }, [])

  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User[]>([])
  const [issueDialogOpen, setIssueDialogOpen] = useState(false)
  const [currentIssueBook, setCurrentIssueBook] = useState<Book>({
    _id: '',
    addedAt: new Date(),
    authorName: '',
    bookName: '',
    course: '',
    quantity: 0,
    sem: 0
  })

  const {
    data: fetchedBooks = [],
    refetch: refetchBooks,
    isError: isLoadingBooksError,
    isFetching: isFetchingBooks,
    isLoading: isLoadingBooks
  } = useGetBooks()

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: '_id',
        header: ' ID',
        enableHiding: false
      },
      {
        accessorKey: 'bookName',
        header: 'Book Name'
      },
      {
        accessorKey: 'authorName',
        header: 'Author Name'
      },
      {
        accessorKey: 'course',
        header: 'Course'
      },
      {
        accessorKey: 'sem',
        header: 'Semester'
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity'
      }
    ],
    []
  )

  const table = useMaterialReactTable({
    columns,
    data: fetchedBooks,
    enableSorting: false,
    enableRowNumbers: true,
    enableRowActions: true,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableDensityToggle: false,

    getRowId: (row) => row._id,
    initialState: {
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
        pageSize: 100,
        pageIndex: 0
      }
    },

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
    state: {
      isLoading: isLoadingBooks,
      showProgressBars: isFetchingBooks,
      showAlertBanner: isLoadingBooksError
    },
    renderTopToolbarCustomActions: () => (
      <Fab
        variant="extended"
        onClick={() => setOpen(true)}
        sx={{
          textTransform: 'none',
          mb: '1rem'
        }}
      >
        <PersonAddAlt1 sx={{ mr: '1rem' }} />
        Create an account
      </Fab>
    ),
    renderRowActions: ({ row }) => (
      <Tooltip title={'Request Book'} placement="left">
        <IconButton
          onClick={() => {
            setCurrentIssueBook(row.original)
            setIssueDialogOpen(true)
          }}
        >
          <ForwardToInbox color="success" />
        </IconButton>
      </Tooltip>
    )
  })

  function handleDialogClose(): void {
    setOpen(false)
  }

  return (
    <>
      {open && <CreateUserDialog open={open} onClose={handleDialogClose} />}
      {issueDialogOpen && (
        <IssueBookDialog
          open={issueDialogOpen}
          book={currentIssueBook}
          userData={user}
          onClose={() => setIssueDialogOpen(false)}
        />
      )}
      <MaterialReactTable table={table} />
    </>
  )
}

export default MRTBooks
