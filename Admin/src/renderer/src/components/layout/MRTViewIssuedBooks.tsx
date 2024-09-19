import { useMemo, useEffect, useState } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { Book, User, viewIssuedBookType } from '@shared/types/types'
import { formatDateTime } from '@renderer/utils'

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
    enableRowNumbers: true,
    initialState: {
      columnVisibility: { id: false, bookId: false }
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
      // isLoading: tableData.length == 0 ? true : false
      //   isSaving: false,
      //   showAlertBanner: false,
      //   showProgressBars: false
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRTViewIssuedBooks
