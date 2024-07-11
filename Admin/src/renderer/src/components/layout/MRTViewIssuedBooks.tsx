import { useMemo, useEffect, useState } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { Book, viewIssuedBookType } from '@shared/types'
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

        const bookMap = new Map<string, { bookName: string; numberOfBooks: number }>()
        bookData.forEach((book: Book) => {
          bookMap.set(book.id, { bookName: book.bookName, numberOfBooks: book.noOfBooks })
        })

        userData.forEach((user) => {
          user.issuedBook.forEach((book) => {
            const issueDateStr = formatDateTime(
              new Date(book.issueDate._seconds * 1000 + book.issueDate._nanoseconds / 1000000)
            ).toLocaleString()

            const dueDateStr = formatDateTime(
              new Date(book.dueDate._seconds * 1000 + book.dueDate._nanoseconds / 1000000)
            ).toLocaleString()

            const bookDetails = bookMap.get(book.bookId)
            formattedData.push({
              id: user.id,
              name: user.name,
              bookId: book.bookId,
              bookName: bookDetails?.bookName || 'Unknown',
              noOfBooks: bookDetails?.numberOfBooks || 0,
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
    enableRowNumbers: true,
    initialState: {
      columnVisibility: { id: false, bookId: false }
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
    }
  })

  return <MaterialReactTable table={table} />
}

export default MRTViewIssuedBooks
