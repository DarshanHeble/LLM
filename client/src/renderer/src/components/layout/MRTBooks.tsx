import { Book, User } from '@shared/types/types'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useEffect, useMemo, useState } from 'react'
import { Fab, IconButton, Tooltip } from '@mui/material'
import { ForwardToInbox, ManageAccounts, PersonAddAlt1 } from '@mui/icons-material'

import useGetBooks from './useGetBooks'
import CreateUserDialog from '../dialog/createUserDialog'
import IssueBookDialog from '../dialog/IssueBookDialog'
import LoginUserDialog from '../dialog/loginUserDialog'

function MRTBooks(): JSX.Element {
  useEffect(() => {
    window.electron.ipcRenderer.on('userData', (_, users: User[]) => {
      // get updated user data and update the state
      setUser(users)
    })

    window.electron.ipcRenderer.on('bookData', (_, bookData: Book[]) => {
      // get updated book data and update the state
      console.log('book data', bookData)
      refetchBooks()
    })
  }, [])

  async function processRequestBookCount(userData: User[]): Promise<void> {
    console.log(userData)
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUserData').then((userData: User[]) => {
      console.log(userData)
      setUser(userData)
      processRequestBookCount(userData)
    })
  }, [])

  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User[]>([])
  const [issueDialogOpen, setIssueDialogOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
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
    // enableColumnPinning: true,

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
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Fab
          variant="extended"
          onClick={() => setOpen(true)}
          sx={{
            textTransform: 'none',
            mb: '1rem'
          }}
        >
          <PersonAddAlt1 sx={{ mr: '1rem' }} />
          Create account
        </Fab>
        <Fab
          variant="extended"
          onClick={() => setLoginDialogOpen(true)}
          sx={{
            textTransform: 'none',
            mb: '1rem'
          }}
        >
          <ManageAccounts sx={{ mr: '1rem' }} />
          Manage account
        </Fab>
      </div>
    ),
    renderRowActions: ({ row }) => (
      <Tooltip title={'Request Book'} placement="left">
        <span>
          <IconButton
            disabled={row.original.quantity <= 0}
            onClick={() => {
              setCurrentIssueBook(row.original)
              setIssueDialogOpen(true)
            }}
          >
            <ForwardToInbox color={row.original.quantity <= 0 ? 'disabled' : 'success'} />
          </IconButton>
        </span>
      </Tooltip>
    )
  })

  function handleDialogClose(): void {
    setOpen(false)
  }

  return (
    <>
      {open && <CreateUserDialog open={open} userData={user} onClose={handleDialogClose} />}
      {issueDialogOpen && (
        <IssueBookDialog
          open={issueDialogOpen}
          book={currentIssueBook}
          userData={user}
          onClose={() => setIssueDialogOpen(false)}
        />
      )}
      {loginDialogOpen && (
        <LoginUserDialog
          open={loginDialogOpen}
          userData={user}
          onClose={() => setLoginDialogOpen(false)}
        />
      )}
      <MaterialReactTable table={table} />
    </>
  )
}

export default MRTBooks
