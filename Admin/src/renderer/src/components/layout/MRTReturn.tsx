import { useMemo, useEffect, useState } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { Book, viewIssuedBookType } from '@shared/types'
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
        accessorKey: 'issueDate',
        header: 'Issue Date'
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date'
      },
      {
        accessorKey: 'returnStatus',
        header: 'Return Status'
      }
    ],
    []
  )

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // Fetch user data and book data concurrently
        const [userData, bookData] = await Promise.all([
          window.electron.ipcRenderer.invoke('getUserData'),
          window.electron.ipcRenderer.invoke('getBookData')
        ])
        const formattedData: viewIssuedBookType[] = []

        const bookMap = new Map<string, string>()
        bookData.forEach((book: Book) => {
          bookMap.set(book.id, book.bookName)
        })

        userData.forEach((user) => {
          user.issuedBook.forEach((book) => {
            const issueDateStr = formatDateTime(
              new Date(book.issueDate._seconds * 1000 + book.issueDate._nanoseconds / 1000000)
            ).toLocaleString()

            const dueDateStr = formatDateTime(
              new Date(book.dueDate._seconds * 1000 + book.dueDate._nanoseconds / 1000000)
            ).toLocaleString()

            formattedData.push({
              id: user.id,
              name: user.name,
              bookId: book.bookId,
              bookName: bookMap.get(book.bookId) || 'Unknown',
              issueDate: issueDateStr,
              dueDate: dueDateStr,
              returnStatus: book.returnStatus ? 'Returned' : 'Pending'
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
        'returnStatus',
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
