import { useMemo, useEffect, useState } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { Book, BookHistory, User, viewIssuedBookType } from '@shared/types/types'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import { useAlertToast } from '../Context/feedback/AlertToast'

const MRTReturn = (): JSX.Element => {
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
      // {
      //   accessorKey: 'noOfBooks',
      //   header: 'No Of Books'
      // },
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

        // set for storing book name and quantity
        const bookMap = new Map<string, { bookName: string; numberOfBooks: number }>()

        bookData.forEach((book: Book) => {
          bookMap.set(book._id, { bookName: book.bookName, numberOfBooks: book.quantity })
        })

        userData.forEach((user) => {
          user.issuedBooks.forEach((book) => {
            const issueDateStr = new Date(book.issueDate).toLocaleString()

            const dueDateStr = new Date(book.dueDate).toLocaleString()

            const bookDetails = bookMap.get(book._id)

            formattedData.push({
              id: user._id,
              name: user.name,
              bookId: book._id,
              bookName: bookDetails?.bookName || 'Unknown',
              // noOfBooks: bookDetails?.numberOfBooks || 0,
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
      returnedDate: new Date().toISOString(),
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
            {loading == row.original.id ? <CircularProgress /> : <AssignmentReturnOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    )
  })

  return <MaterialReactTable table={table} />
}

export default MRTReturn
