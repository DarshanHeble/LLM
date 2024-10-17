import { useEffect, useMemo, useState } from 'react'
import { Fab, IconButton, Tooltip } from '@mui/material'
import { Book, issuedBookType, User } from '@shared/types/types'
import {
  MaterialReactTable,
  MRT_Cell,
  MRT_ColumnDef,
  useMaterialReactTable
} from 'material-react-table'
import { useAlertToast } from '../Context/feedback/AlertToast'

import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import IssueBookDialog from '../dialog/issueBookDialog'
import { formatDate } from '@renderer/utils'

type RequestedBook = {
  userId: string
  userName: string
  bookId: string
  bookName: string
  // bookQuantity: number
  requestedDate: Date
}

type CellProps = {
  cell: MRT_Cell<RequestedBook>
}

function MRTRequestedBooks(): JSX.Element {
  // const { userData, bookData } = props
  const { showAlert } = useAlertToast()

  const [data, SetData] = useState<RequestedBook[]>([])
  const [openIssueDialog, setOpenIssueDialog] = useState(false)

  const columns = useMemo<MRT_ColumnDef<RequestedBook>[]>(
    () => [
      {
        accessorKey: 'userId',
        header: 'User Id'
      },
      {
        accessorKey: 'userName',
        header: 'User Name'
      },
      {
        accessorKey: 'bookId',
        header: 'Book Id'
      },
      {
        accessorKey: 'bookName',
        header: 'Book Name'
      },
      {
        accessorKey: 'requestedDate',
        header: ' Requested Date',
        Cell: ({ cell }: CellProps): JSX.Element => {
          const date = new Date(cell.getValue<Date>())
          return <div>{formatDate(date)}</div>
        }
      }
    ],
    []
  )

  function deleteRow(row: RequestedBook): void {
    SetData((prev) =>
      prev.filter((data) => data.userId !== row.userId && data.bookId !== row.bookId)
    )
  }

  async function handleIssue(row: RequestedBook): Promise<void> {
    console.log(row)

    const issuedBookData: issuedBookType = {
      _id: row.bookId,
      issueDate: new Date(),
      dueDate: new Date(),
      fine: 0
    }

    const removeResponse = await window.electron.ipcRenderer.invoke(
      'removeBookRequest',
      row.userId,
      row.bookId
    )

    if (!removeResponse) {
      showAlert('Error remove book request', 'error')
    }

    deleteRow(row)

    const addResponse = await window.electron.ipcRenderer.invoke(
      'addBookToTheUser',
      row.userId,
      issuedBookData
    )
    if (!addResponse) {
      showAlert('Error adding book to the user', 'error')
    }

    const decrementResponse = await window.electron.ipcRenderer.invoke(
      'decrementBookQuantity',
      row.bookId
    )

    if (!decrementResponse) {
      showAlert(
        'There is an error in updating the quantity of the book. So book will not be added for the user',
        'error'
      )
      return
    }

    showAlert(`Successfully Issued the book to ${row.userName}`, 'success')
  }

  useEffect(() => {
    // Fetch user data from the Electron API
    async function fetchData(): Promise<void> {
      const [userData, bookData]: [User[], Book[]] = await Promise.all([
        window.electron.ipcRenderer.invoke('getUserData'),
        window.electron.ipcRenderer.invoke('getBookData')
      ])

      // console.log('user', userData)

      // Create a lookup map for bookId to bookName
      const bookIdToNameMap = new Map(bookData.map((book) => [book._id, book.bookName]))

      // Map the requested books for each user and look up the book name
      const usersWithRequestedBooks: RequestedBook[] = userData.flatMap((user: User) =>
        user.requestedBooks.map((requestedBook) => ({
          userId: user._id,
          userName: user.name,
          bookId: requestedBook._id,
          bookName: bookIdToNameMap.get(requestedBook._id) || 'Unknown Book', // Lookup book name
          requestedDate: requestedBook.requestedDate
        }))
      )

      SetData(usersWithRequestedBooks)
    }
    fetchData()
  }, [])

  const table = useMaterialReactTable({
    columns,
    data: data,
    enableRowActions: true,
    enableRowNumbers: true,
    enableSorting: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    getRowId: (row) => row.userId,
    initialState: {
      // columnVisibility: { id: false },
      columnOrder: [
        'mrt-row-numbers',
        // 'mrt-row-select',
        'userId',
        'userName',
        'bookId',
        'bookName',
        'requestedDate',
        'mrt-row-actions'
      ],
      pagination: {
        pageSize: 50,
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
    renderTopToolbarCustomActions: () => (
      <Fab variant="extended" sx={{ mb: '1rem' }} onClick={() => setOpenIssueDialog(true)}>
        <BookmarkAddIcon sx={{ mr: '1rem' }} />
        Issue Book
      </Fab>
    ),
    renderRowActions: ({ row }) => (
      <Tooltip title="Issue Book" placement="right">
        <IconButton onClick={() => handleIssue(row.original)}>
          <BookmarkAddOutlinedIcon color="success" />
        </IconButton>
      </Tooltip>
    ),
    state: {
      // isLoading: isLoadingBooks,
      // showAlertBanner: isLoadingBooksError,
      // showProgressBars: isFetchingBooks
    },
    icons: {
      ViewColumnIcon: () => <ViewColumnOutlinedIcon />
    }
  })

  return (
    <>
      {openIssueDialog && (
        <IssueBookDialog open={openIssueDialog} onClose={() => setOpenIssueDialog(false)} />
      )}
      <MaterialReactTable table={table} />
    </>
  )
}

export default MRTRequestedBooks
