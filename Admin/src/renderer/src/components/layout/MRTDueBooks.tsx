import { useMemo, useEffect, useState } from 'react'
import {
  MaterialReactTable,
  MRT_Cell,
  type MRT_ColumnDef,
  useMaterialReactTable
} from 'material-react-table'
import { Book, BookHistory, User, viewIssuedBookType } from '@shared/types/types'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useAlertToast } from '../Context/feedback/AlertToast'
import { AssignmentReturnOutlined, ViewColumnOutlined } from '@mui/icons-material'

// Define the prop type for the Cell renderer
type CellProps = {
  cell: MRT_Cell<viewIssuedBookType>
}

const MRTDueBooks = (): JSX.Element => {
  const { showAlert } = useAlertToast()
  const [loading, setLoading] = useState<string | null>(null)
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
        // Fetch user data and book data concurrently
        const [userData, bookData]: [User[], Book[]] = await Promise.all([
          window.electron.ipcRenderer.invoke('getUserData'),
          window.electron.ipcRenderer.invoke('getBookData')
        ])
        console.log(userData)

        const formattedData: viewIssuedBookType[] = []

        // set for storing book name and quantity
        const bookMap = new Map<string, { bookName: string; numberOfBooks: number }>()

        bookData.forEach((book: Book) => {
          bookMap.set(book._id, { bookName: book.bookName, numberOfBooks: book.quantity })
        })

        const currentDate = new Date()

        userData.forEach((user) => {
          user.issuedBooks.forEach((book) => {
            const bookDetails = bookMap.get(book._id)

            if (new Date(book.dueDate) < currentDate)
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

  const returnBook = async (returnBookData: viewIssuedBookType): Promise<void> => {
    setLoading(returnBookData.id) // start the loading for updating the state
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
      showAlert(
        'There is an error in updating the quantity of the book. So book will not be added for the user',
        'error'
      )
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

    // Update the tableData state to remove the returned book entry
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
    console.log('success')

    setLoading(null)
    showAlert(`Successfully returned book to library by ${user.name}`, 'success')
  }

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableSorting: true,
    getRowId: (row) => row.id,
    enableRowActions: true,
    enableRowNumbers: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    initialState: {
      columnVisibility: { id: false, bookId: false },
      columnOrder: [
        'mrt-row-numbers',
        'id',
        'name',
        'bookId',
        'bookName',
        // 'noOfBooks',
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
    // state: {
    //   isLoading: tableData.length == 0 ? true : false
    //     isSaving: false,
    //     showAlertBanner: false,
    //     showProgressBars: false
    // },
    // renderRowActions: ({ row, table }) => (
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Return Book">
          <IconButton color="success" onClick={() => returnBook(row.original)}>
            {loading == row.original.id ? <CircularProgress /> : <AssignmentReturnOutlined />}
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

export default MRTDueBooks
