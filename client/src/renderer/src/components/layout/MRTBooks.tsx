import { Book, User } from '@shared/types/types'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useEffect, useMemo, useState } from 'react'
import useGetBooks from './useGetBooks'
import { Fab, IconButton, Tooltip } from '@mui/material'

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import CreateUserDialog from '../dialog/createUserDialog'
import IssueBookDialog from '../dialog/IssueBookDialog'

function MRTBooks(): JSX.Element {
  // const [books, setBooks] = useState<Book[]>([])
  // useEffect(() => {
  //   getBookData()
  // }, [])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUserData').then((users) => {
      console.log(users)

      setUser(users)
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
        <PersonAddAlt1Icon sx={{ mr: '1rem' }} />
        Create an account
      </Fab>
    ),
    renderRowActions: ({ row }) => (
      <Tooltip title={'Issue Book'}>
        <IconButton
          onClick={() => {
            setCurrentIssueBook(row.original)
            setIssueDialogOpen(true)
          }}
        >
          <BookmarkAddOutlinedIcon color="success" />
        </IconButton>
      </Tooltip>
    )
  })

  // const getBookData = (): void => {
  //   window.electron.ipcRenderer.invoke('getBookData').then((re) => {
  //     console.log('book Data', re)
  //   })
  // }
  function handleDialogClose(): void {
    setOpen(false)
  }

  return (
    <>
      <CreateUserDialog open={open} onClose={handleDialogClose} />
      <IssueBookDialog
        open={issueDialogOpen}
        book={currentIssueBook}
        userData={user}
        onClose={() => setIssueDialogOpen(false)}
      />
      <MaterialReactTable table={table} />
    </>
  )
}

export default MRTBooks
