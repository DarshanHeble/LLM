import { useMemo, useEffect, useState } from 'react'
import {
  MaterialReactTable,
  MRT_Cell,
  type MRT_ColumnDef,
  useMaterialReactTable
} from 'material-react-table'
import { Book, User, viewIssuedBookType } from '@shared/types/types'
import { ViewColumnOutlined } from '@mui/icons-material'
import { formatDate } from '@renderer/utils'

type CellProps = {
  cell: MRT_Cell<viewIssuedBookType>
}

const MRTViewIssuedBooks = (): JSX.Element => {
  const [tableData, setTableData] = useState<viewIssuedBookType[]>([])

  const columns = useMemo<MRT_ColumnDef<viewIssuedBookType>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'User ID',
        size: 80
      },
      {
        accessorKey: 'name',
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
        accessorKey: 'issueDate',
        header: 'Issue Date',
        Cell: ({ cell }: CellProps): JSX.Element => {
          const date = new Date(cell.getValue<Date>())
          return <div>{formatDate(date)}</div>
        }
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        Cell: ({ cell }: CellProps): JSX.Element => {
          const date = new Date(cell.getValue<Date>())
          return <div>{formatDate(date)}</div>
        }
      }
    ],
    []
  )

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // Fetch user data and book data concurrently
        const [userData, bookData]: [User[], Book[]] = await Promise.all([
          window.electron.ipcRenderer.invoke('getUserData'),
          window.electron.ipcRenderer.invoke('getBookData')
        ])
        const formattedData: viewIssuedBookType[] = []

        const bookMap = new Map<string, { bookName: string; numberOfBooks: number }>()
        bookData.forEach((book: Book) => {
          bookMap.set(book._id, { bookName: book.bookName, numberOfBooks: book.quantity })
        })

        userData.forEach((user) => {
          user.issuedBooks.forEach((book) => {
            const bookDetails = bookMap.get(book._id)
            formattedData.push({
              id: user._id,
              name: user.name,
              bookId: book._id,
              bookName: bookDetails?.bookName || 'Unknown',
              issueDate: new Date(book.issueDate),
              dueDate: new Date(book.dueDate),
              fine: book.fine
            })
          })
        })

        setTableData(formattedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableSorting: false,
    getRowId: (row) => row.id,
    enableRowNumbers: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    // initialState: {
    //   columnVisibility: { id: false, bookId: false }
    // },
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
      // isLoading: tableData.length == 0 ? true : false
      //   isSaving: false,
      //   showAlertBanner: false,
      //   showProgressBars: false
    },
    icons: {
      ViewColumnIcon: () => <ViewColumnOutlined />
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRTViewIssuedBooks
