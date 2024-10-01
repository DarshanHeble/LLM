import { useMemo } from 'react'
import { IconButton, Tooltip, Typography } from '@mui/material'
import { Book, issuedBookType, User } from '@shared/types/types'
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAlertToast } from '../Context/feedback/AlertToast'

type RequestedBook = {
  userId: string
  userName: string
  bookId: string
  bookName: string
  // bookQuantity: number
  requestedDate: string
}

interface Props {
  userData: User[]
  bookData: Book[]
}

function MRTRequestedBooks(props: Props): JSX.Element {
  console.log(props)

  // const { userData, bookData } = props
  const { showAlert } = useAlertToast()

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
        header: ' Requested Date'
      }
    ],
    []
  )

  // call READ hook
  const {
    data: fetchedBooks = [],
    isError: isLoadingBooksError,
    isFetching: isFetchingBooks,
    isLoading: isLoadingBooks
  } = useGetUsers()

  async function handleIssue(row: RequestedBook): Promise<void> {
    console.log(row)

    const issuedBookData: issuedBookType = {
      _id: row.bookId,
      issueDate: new Date(),
      dueDate: new Date(),
      fine: 0
    }

    const addResponse = await window.electron.ipcRenderer.invoke(
      'addBookToTheUser',
      row.userId,
      issuedBookData
    )
    if (!addResponse) {
      showAlert('Error adding book to the user', 'error')
    }

    // const updateResponse = await window.electron.ipcRenderer.invoke(
    //   'updateBookQuantity',
    //   row.bookId,
    //   numberOfBooks - 1
    // )
    // if (!updateResponse) {
    //   showAlert(
    //     'There is an error in updating the quantity of the book. So book will not be added for the user',
    //     'error'
    //   )
    //   return
    // }

    showAlert(`Successfully Issued the book to ${row.userName}`, 'success')
  }

  function useGetUsers(): UseQueryResult<RequestedBook[], Error> {
    return useQuery<RequestedBook[]>({
      queryKey: ['requestedBooks'],
      queryFn: async () => {
        try {
          // Fetch user data from the Electron API
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
              requestedDate: requestedBook.requestedDate.toISOString()
            }))
          )

          return Promise.resolve(usersWithRequestedBooks)
        } catch (error) {
          console.error(error)
          throw new Error('Failed to fetch user data')
        }
      },
      refetchOnWindowFocus: true
    })
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedBooks,
    enableRowActions: true,
    enableRowNumbers: true,
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
    renderTopToolbar: () => (
      <Typography variant="h5" sx={{ m: '1rem' }}>
        Requested Books
      </Typography>
    ),
    renderRowActions: ({ row }) => (
      <Tooltip title="Issue Book" placement="right">
        <IconButton onClick={() => handleIssue(row.original)}>
          <BookmarkAddOutlinedIcon color="success" />
        </IconButton>
      </Tooltip>
    ),
    state: {
      isLoading: isLoadingBooks,
      showAlertBanner: isLoadingBooksError,
      showProgressBars: isFetchingBooks
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRTRequestedBooks
