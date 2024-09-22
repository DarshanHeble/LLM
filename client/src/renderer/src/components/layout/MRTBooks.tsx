import { Book } from '@shared/types/types'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import useGetBooks from './useGetBooks'
import { Fab } from '@mui/material'

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'

function MRTBooks(): JSX.Element {
  // const [books, setBooks] = useState<Book[]>([])
  // useEffect(() => {
  //   getBookData()
  // }, [])
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
    getRowId: (row) => row._id,
    initialState: {
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
    state: {
      isLoading: isLoadingBooks,
      showProgressBars: isFetchingBooks,
      showAlertBanner: isLoadingBooksError
    },
    renderTopToolbarCustomActions: () => (
      <Fab
        variant="extended"
        sx={{
          textTransform: 'none',
          mb: '1rem'
        }}
      >
        <PersonAddAlt1Icon sx={{ mr: '1rem' }} />
        Create an account
      </Fab>
    )
  })

  // const getBookData = (): void => {
  //   window.electron.ipcRenderer.invoke('getBookData').then((re) => {
  //     console.log('book Data', re)
  //   })
  // }

  return <MaterialReactTable table={table} />
}

export default MRTBooks
