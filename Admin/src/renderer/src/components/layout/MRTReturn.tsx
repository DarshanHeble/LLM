import { useMemo, useEffect, useState } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { Book, User, viewIssuedBookType } from '@shared/types/types'
import { formatDateTime } from '@renderer/utils'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'

const MRTReturn = (): JSX.Element => {
  const [loading, setLoading] = useState<string | null>()

  const returnBook = async (returnBookData: viewIssuedBookType): Promise<void> => {
    setLoading(returnBookData.id)
    console.log(returnBookData)
    await window.electron.ipcRenderer.invoke(
      'returnBookToLibrary',
      returnBookData.id,
      returnBookData.bookId
    )
    window.electron.ipcRenderer.invoke(
      'updateBookQuantity',
      returnBookData.bookId,
      returnBookData.noOfBooks + 1
    )

    // Update the tableData state to remove the returned book entry
    setTableData((prevData) =>
      prevData.filter(
        (data) => !(data.id === returnBookData.id && data.bookId === returnBookData.bookId)
      )
    )
    setLoading(null)
  }

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
        accessorKey: 'noOfBooks',
        header: 'No Of Books'
      },
      {
        accessorKey: 'issueDate',
        header: 'Issue Date'
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date'
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
            const issueDateStr = formatDateTime(new Date(book.issueDate)).toLocaleString()

            const dueDateStr = formatDateTime(new Date(book.dueDate)).toLocaleString()

            const bookDetails = bookMap.get(book._id)
            formattedData.push({
              id: user._id,
              name: user.name,
              bookId: book._id,
              bookName: bookDetails?.bookName || 'Unknown',
              noOfBooks: bookDetails?.numberOfBooks || 0,
              issueDate: issueDateStr,
              dueDate: dueDateStr
              // returnStatus: book.returnStatus ? 'Returned' : 'Pending'
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
    enableSorting: true,
    getRowId: (row) => row.id,
    enableRowActions: true,
    enableRowNumbers: true,
    initialState: {
      columnVisibility: { id: false, bookId: false },
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
    muiTableContainerProps: {
      sx: {
        minHeight: '500px'
      }
    },
    state: {
      // isLoading: tableData.length == 0 ? true : false
      //   isSaving: false,
      //   showAlertBanner: false,
      //   showProgressBars: false
    },
    // renderRowActions: ({ row, table }) => (
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Return Book">
          <IconButton color="success" onClick={() => returnBook(row.original)}>
            {loading == row.original.id ? <CircularProgress /> : <ShoppingCartCheckoutIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    )
  })

  return <MaterialReactTable table={table} />
}

export default MRTReturn
