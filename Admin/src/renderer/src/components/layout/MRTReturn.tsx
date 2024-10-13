import { useMemo, useEffect, useState } from 'react'
import {
  MaterialReactTable,
  MRT_Cell,
  type MRT_ColumnDef,
  useMaterialReactTable
} from 'material-react-table'
import { Book, BookHistory, User, viewIssuedBookType } from '@shared/types/types'
import { Box, CircularProgress, IconButton, Tooltip, Chip, Badge } from '@mui/material'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { ViewColumnOutlined } from '@mui/icons-material'

// Define the prop type for the Cell renderer
type CellProps = {
  cell: MRT_Cell<viewIssuedBookType>
}

const MRTReturn = (): JSX.Element => {
  const { showAlert } = useAlertToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [tableData, setTableData] = useState<viewIssuedBookType[]>([])
  const [showOverdue, setShowOverdue] = useState<boolean>(false) // State to toggle overdue filter
  const [overdueBooks, setOverdueBooks] = useState(0)

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
          return <div>{date.toLocaleString()}</div>
        }
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        Cell: ({ cell }: CellProps): JSX.Element => {
          const date = new Date(cell.getValue<Date>())
          return <div>{date.toLocaleString()}</div>
        }
      }
    ],
    []
  )

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [userData, bookData]: [User[], Book[]] = await Promise.all([
          window.electron.ipcRenderer.invoke('getUserData'),
          window.electron.ipcRenderer.invoke('getBookData')
        ])
        console.log(userData)

        const formattedData: viewIssuedBookType[] = []

        const bookMap = new Map<string, { bookName: string; numberOfBooks: number }>()
        bookData.forEach((book: Book) => {
          bookMap.set(book._id, { bookName: book.bookName, numberOfBooks: book.quantity })
        })

        const currentDate = new Date()

        userData.forEach((user) => {
          user.issuedBooks.forEach((book) => {
            const bookDetails = bookMap.get(book._id)

            if (new Date(book.dueDate) < currentDate) {
              setOverdueBooks((prev) => prev + 1)
            }

            formattedData.push({
              id: user._id,
              name: user.name,
              bookId: book._id,
              bookName: bookDetails?.bookName || 'Unknown',
              issueDate: new Date(book.issueDate),
              dueDate: new Date(book.dueDate)
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

  const returnBook = async (returnBookData: viewIssuedBookType): Promise<void> => {
    setLoading(returnBookData.id)
    console.log(returnBookData)

    const [user, book]: [User, Book] = await Promise.all([
      window.electron.ipcRenderer.invoke('getOneUserData', returnBookData.id),
      window.electron.ipcRenderer.invoke('getOneBookData', returnBookData.bookId)
    ])

    const updateResponse = await window.electron.ipcRenderer.invoke(
      'updateBookQuantity',
      returnBookData.bookId,
      book.quantity + 1
    )

    if (!updateResponse) {
      showAlert('There is an error in updating the quantity of the book.', 'error')
      return
    }

    const returnResponse = await window.electron.ipcRenderer.invoke(
      'returnBookToLibrary',
      returnBookData.id,
      returnBookData.bookId
    )

    if (!returnResponse) {
      showAlert('Error returning book to the library', 'error')
      window.electron.ipcRenderer.invoke(
        'updateBookQuantity',
        returnBookData.bookId,
        user.noOfIssuedBooks + 1
      )
    }

    setTableData((prevData) =>
      prevData.filter(
        (data) => !(data.id === returnBookData.id && data.bookId === returnBookData.bookId)
      )
    )

    const bookHistoryData: BookHistory = {
      id: book._id,
      authorName: book.authorName,
      bookName: book.bookName,
      course: book.course,
      sem: book.sem,
      issueDate: returnBookData.issueDate,
      dueDate: returnBookData.dueDate,
      returnedDate: new Date(),
      fine: 0
    }

    const addHistoryResponse = await window.electron.ipcRenderer.invoke(
      'addBookHistory',
      returnBookData.id,
      bookHistoryData
    )

    if (!addHistoryResponse) {
      showAlert('Error while storing book history')
    }

    setLoading(null)
    showAlert(`Successfully returned book to library by ${user.name}`, 'success')
  }

  // Filter data for overdue books
  const filteredData = useMemo(() => {
    if (showOverdue) {
      const now = new Date()
      return tableData.filter((row) => new Date(row.dueDate) < now)
    }
    return tableData
  }, [showOverdue, tableData])

  const table = useMaterialReactTable({
    columns,
    data: filteredData, // Use the filtered data here
    enableSorting: true,
    getRowId: (row) => row.id,
    enableRowActions: true,
    enableRowNumbers: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    initialState: {
      // columnVisibility: { id: false, bookId: false },
      columnOrder: [
        'mrt-row-numbers',
        'id',
        'name',
        'bookId',
        'bookName',
        'issueDate',
        'dueDate',
        'mrt-row-actions'
      ]
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
      <Badge color="warning" variant="dot" invisible={overdueBooks === 0}>
        <Chip
          label="Show Overdue Books"
          variant={'outlined'}
          color={showOverdue ? 'warning' : 'default'}
          // icon={<AssignmentReturnOutlinedIcon />}
          onClick={() => setShowOverdue((prev) => !prev)}
        />
      </Badge>
    ),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Return Book">
          <IconButton color="success" onClick={() => returnBook(row.original)}>
            {loading === row.original.id ? <CircularProgress /> : <AssignmentReturnOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    ),
    icons: {
      ViewColumnIcon: () => <ViewColumnOutlined />
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRTReturn
