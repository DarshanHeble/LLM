import { useMemo } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Book, User } from '@shared/types/types'
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

type RequestedBook = {
  userId: string
  userName: string
  bookId: string
  bookName: string
  requestedDate: string
}

function MRTRequestedBooks(): JSX.Element {
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
    renderRowActions: () => (
      <Tooltip title="Issue Book" placement="right">
        <IconButton>
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
